// apps/user-service/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import userRoutes from './presentation/routes/user.routes';
import authRoutes from './presentation/routes/auth.routes';

import { errorMiddleware } from './middlewares/error.middleware';
import logger from '@org/shared-logger';

const app = express();

// ====================== GLOBAL MIDDLEWARE ======================
app.use(helmet());                                   // Security
app.use(cors());                                     // CORS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ====================== ROUTES ======================
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ====================== ERROR HANDLING ======================
// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler (must be last)
app.use(errorMiddleware);

logger.info('✅ Express app initialized with all routes');

export default app;