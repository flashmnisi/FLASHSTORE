// apps/gateway/src/presentation/middlewares/request-id.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Request ID / Correlation ID Middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  
  const existingId = 
    req.headers['x-correlation-id'] as string ||
    req.headers['x-request-id'] as string;

  const correlationId = existingId || uuidv4();

  // Attach to request object
  req.correlationId = correlationId;
  req.id = correlationId; 

  res.setHeader('X-Correlation-ID', correlationId);
  res.setHeader('X-Request-ID', correlationId);

  next();
};