import { Request, Response, NextFunction } from 'express';
import logger from '@org/shared-logger';

/**
 * Global error handler (production safe)
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const correlationId = (req as any).correlationId;

  logger.error('Unhandled error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    correlationId,
  });

  // Stripe-specific errors
  if (err.type === 'StripeCardError') {
    res.status(402).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Mongo / DB errors
  if (err.name === 'MongoError' || err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Database validation error',
    });
    return;
  }

  // Default fallback
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    correlationId,
  });
};