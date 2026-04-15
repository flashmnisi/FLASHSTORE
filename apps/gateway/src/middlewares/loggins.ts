// apps/gateway/src/middleware/logger.middleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '@org/shared-logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      responseTime: `${Date.now() - start}ms`,
      ip: req.ip,
    }, 'Request completed');
  });

  next();
};