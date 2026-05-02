// apps/payment-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import paymentRoutes from './presentation/routes/payment.routes';
import { errorMiddleware } from './middlewares/error.middleware';
//import logger from '@org/shared-logger';

const app = express();

// ====================== MIDDLEWARE ======================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// Body parsing
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
    service: 'payment-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ====================== API ROUTES ======================
app.use('/api/payments', paymentRoutes);

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