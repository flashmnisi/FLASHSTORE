import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

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