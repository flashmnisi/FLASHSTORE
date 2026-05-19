import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '@org/shared-logger';

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestId = req.headers['x-request-id'] as string;

  if (!requestId) {
    requestId = uuidv4();
  }

  req.id = requestId; // ✅ typed (from express.d.ts)
  res.setHeader('x-request-id', requestId);

  logger.info('Request started',{
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  next();
};