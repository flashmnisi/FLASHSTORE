// apps/search-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import searchRoutes from './presentation/routes/search.routes';
import suggestRoutes from './presentation/routes/suggest.routes';
import indexRoutes from './presentation/routes/index.routes';

import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/search', searchRoutes);
app.use('/api/suggest', suggestRoutes);
app.use('/api/index', indexRoutes);

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    service: 'search-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler (must be last)
app.use(errorMiddleware);

// 404 Handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

export default app;