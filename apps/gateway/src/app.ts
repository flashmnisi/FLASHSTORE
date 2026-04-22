import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes/index';
import { errorMiddleware } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/request-logger.middleware';
import { correlationIdMiddleware } from './middlewares/correlation-id.middleware';
import { rateLimiter, authLimiter } from './middlewares/rate-limit.middleware';
import { protect } from './middlewares/auth.middleware';

const app = express();

// ====================== SECURITY & CORE MIDDLEWARE ======================
app.use(helmet());                                   // Security headers
app.use(cors());                                     // CORS
app.use(express.json({ limit: '50mb' }));            // JSON parsing
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ====================== OBSERVABILITY & TRACING ======================
app.use(correlationIdMiddleware);                    // Correlation ID (first)
app.use(requestLogger);                              // Structured request logging

// ====================== RATE LIMITING ======================
app.use(rateLimiter);                                // Global rate limit

// ====================== ROUTES ======================
// Public routes (with stricter auth rate limiting)
app.use('/api/auth', authLimiter, routes);           // Login & Register

// Protected routes (require JWT)
app.use('/api', protect, routes);                    // All other services

// ====================== HEALTH CHECK ======================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'gateway',
    timestamp: new Date().toISOString(),
  });
});

// ====================== GLOBAL ERROR HANDLER ======================
// Must be the last middleware
app.use(errorMiddleware);

export default app;

// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import routes from './routes/index';
// import { errorMiddleware } from './middlewares/error.middleware';
// import { globalLimiter } from './middlewares/rateLimiter';

// const app = express();

// app.use(helmet());
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(globalLimiter);

// // Log every incoming request
// app.use((req, res, next) => {
//   console.log(`GATEWAY PATH: ${req.method} ${req.originalUrl}`);
//   next();
// });

// app.use('/api', routes);     

// app.use(errorMiddleware);

// export default app;