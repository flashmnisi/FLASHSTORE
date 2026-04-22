import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from '../routes/index';
import { errorMiddleware } from '../middlewares/error.middleware';
import { requestLogger } from '../middlewares/request-logger.middleware';
import { correlationIdMiddleware } from '../middlewares/correlation-id.middleware';

const createServer = () => {
  const app = express();

  // Security & basic middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Observability & tracing
  app.use(correlationIdMiddleware);
  app.use(requestLogger);

  // Main API routes (all under /api)
  app.use('/api', routes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'gateway',
      timestamp: new Date().toISOString(),
    });
  });

  // Global error handler - must be last
  app.use(errorMiddleware);

  return app;
};

export default createServer;