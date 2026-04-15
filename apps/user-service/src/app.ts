import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import userRoutes from './presentation/routes/user.routes';
import { protect } from './middlewares/auth.middleware';
import { requestLogger } from './middlewares/request-logger.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Core middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging
app.use(requestLogger);

app.use((req, res, next) => {
  console.log('USER SERVICE PATH:', req.originalUrl);
  next();
});

// Health check (IMPORTANT)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'user-service',
  });
});

// Public routes
app.use('/', userRoutes);

// Protected example
app.get('/api/profile', protect, (req, res) => {
  res.json({
    success: true,
    user: (req as any).user,
  });
});

// Error handler (always last)
app.use(errorMiddleware);

export default app;