import { Request, Response } from 'express';
import logger from '@org/shared-logger';

export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    service: 'gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
    },
    version: process.env.npm_package_version || '1.0.0',
  };

  logger.info('Health check performed', { status: 'healthy' });

  res.status(200).json(health);
};

export const readinessCheck = (req: Request, res: Response) => {
  // Add checks for dependencies (Redis, Kafka, etc.) here in the future
  res.status(200).json({
    status: 'ready',
    service: 'gateway',
  });
};