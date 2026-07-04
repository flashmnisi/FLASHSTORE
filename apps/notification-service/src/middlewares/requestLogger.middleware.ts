import { Request, Response, NextFunction } from 'express';
import logger from '@org/shared-logger';
import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Generate or reuse Correlation ID
  const correlationId =
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string) ||
    `req_${Date.now()}_${uuidv4().slice(0, 8)}`;

  // Attach correlationId to request for downstream use
  (req as any).correlationId = correlationId;

  // Set response header so client can see it
  res.setHeader('X-Correlation-ID', correlationId);

  const { method, url, ip } = req;
  const userAgent = req.headers['user-agent'];

  // Log Incoming Request
  logger.info(`${method} ${url}`, {
    correlationId,
    method,
    url,
    ip: ip || req.socket.remoteAddress,
    userAgent,
    contentLength: req.headers['content-length'],
  });

  // Log Response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    const logLevel =
      statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](`${method} ${url} ${statusCode} ${duration}ms`, {
      correlationId,
      method,
      url,
      statusCode,
      duration,
      ip: ip || req.socket.remoteAddress,
      userAgent,
    });
  });

  next();
};
