import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import notificationRoutes from './presentation/routes/notification.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/request-logger.middleware';

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/notifications', notificationRoutes);

// Global Error Handler (must be last)
app.use(errorMiddleware);

export default app;