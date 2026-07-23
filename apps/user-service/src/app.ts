// apps/user-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import userRoutes from './presentation/routes/user.routes';
import authRoutes from './presentation/routes/auth.routes';

import { errorMiddleware } from './middlewares/error.middleware';

import logger from '@org/shared-logger';

import {
  metricsMiddleware,
  metricsRouter,
} from '@org/shared-metrics';

const app = express();

// ====================== SECURITY ======================

app.use(helmet());
app.use(cors());

// ====================== BODY PARSERS ======================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ====================== LOGGING ======================

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ====================== PROMETHEUS ======================

app.use(metricsMiddleware('user-service'));

app.use('/metrics', metricsRouter);

// ====================== ROUTES ======================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ====================== HEALTH ======================

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ====================== 404 ======================

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ====================== ERROR HANDLER ======================

app.use(errorMiddleware);

logger.info('✅ User Service initialized');

export default app;
