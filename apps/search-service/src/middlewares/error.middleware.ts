import logger from '@org/shared-logger';
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('🔥 Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};