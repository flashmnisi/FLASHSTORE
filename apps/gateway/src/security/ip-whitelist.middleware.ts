import { Request, Response, NextFunction } from 'express';
import logger from '@org/shared-logger';
import env from '../config/env';

const ALLOWED_IPS = new Set(
  [
    '127.0.0.1',
    '::1',
    '::ffff:127.0.0.1',
    ...(env.ALLOWED_IPS
      ? env.ALLOWED_IPS.split(',').map((ip) => ip.trim())
      : []),
  ]
);

export const ipWhitelistMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const clientIp = req.ip;

  if (!ALLOWED_IPS.has(clientIp)) {
    logger.warn('IP not allowed',{
      ip: clientIp,
      path: req.originalUrl,
      requestId: req.id,
    });

    res.status(403).json({
      success: false,
      message: 'Access denied',
      requestId: req.id,
    });
    return;
  }

  next();
};