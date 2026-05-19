// apps/gateway/src/presentation/middlewares/request-id.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Request ID / Correlation ID Middleware
 * Adds unique ID to every request for tracing across services
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Get existing ID from headers or generate new one
  const existingId = 
    req.headers['x-correlation-id'] as string ||
    req.headers['x-request-id'] as string;

  const correlationId = existingId || uuidv4();

  // Attach to request object
  req.correlationId = correlationId;
  req.id = correlationId; // for backward compatibility with your auth middleware

  // Add to response headers so client can see it
  res.setHeader('X-Correlation-ID', correlationId);
  res.setHeader('X-Request-ID', correlationId);

  next();
};