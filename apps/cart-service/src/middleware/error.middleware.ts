// apps/cart-service/src/middlewares/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};