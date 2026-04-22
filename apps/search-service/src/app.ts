// apps/search-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import searchRoutes from './presentation/routes/search.routes';
import suggestRoutes from './presentation/routes/suggest.routes';
import indexRoutes from './presentation/routes/index.routes';

import { errorMiddleware } from './middlewares/error.middleware';
import logger from './utils/logger';

const app = express();

// =============================
// GLOBAL MIDDLEWARES
// =============================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (dev-friendly)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// =============================
// ROUTES
// =============================
app.use('/api/search', searchRoutes);
app.use('/api/suggest', suggestRoutes);
app.use('/api/index', indexRoutes);

// =============================
// HEALTH CHECK (ROOT)
// =============================
app.get('/health', (_req, res) => {
  res.json({
    service: 'search-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// =============================
// ERROR HANDLER (LAST)
// =============================
app.use(errorMiddleware);

// =============================
// UNKNOWN ROUTES
// =============================
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

logger.info('✅ Express app initialized');

export default app;