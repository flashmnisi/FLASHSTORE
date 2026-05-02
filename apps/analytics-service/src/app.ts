// apps/analytics-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import analyticsRoutes from './presentation/routes/analytics.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// ====================== GLOBAL MIDDLEWARE ======================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ====================== HEALTH CHECK ======================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'analytics-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ====================== API ROUTES ======================
app.use('/api/analytics', analyticsRoutes);

// ====================== 404 HANDLER ======================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ====================== GLOBAL ERROR HANDLER ======================
app.use(errorMiddleware);

export default app;