// apps/cart-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import cartRoutes from './presentation/routes/cart.routes';
import logger from '@org/shared-logger';
import { errorMiddleware } from './middleware/error.middleware';

export const app = express();

// =============================
// 🔐 Core Middleware
// =============================
app.use(helmet());
app.use(cors());
app.use(express.json());

// =============================
// 📦 Routes
// =============================
app.use('/api/cart', cartRoutes);

// =============================
// ❤️ Health Check
// =============================
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'cart-service',
  });
});

// =============================
// ❌ Error Handler
// =============================
app.use(errorMiddleware);

// =============================
// 🚨 Unhandled Errors
// =============================
process.on('unhandledRejection', (err: any) => {
  logger.error('Unhandled Rejection', { error: err.message });
});

process.on('uncaughtException', (err: any) => {
  logger.error('Uncaught Exception', { error: err.message });
  process.exit(1);
});