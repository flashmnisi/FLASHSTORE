import { Request, Response, NextFunction } from 'express';
import {
  verifyAccessToken,
  extractToken,
  type JwtPayload,
} from '@org/shared-auth';
import logger from '@org/shared-logger';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req.headers.authorization || '');

    if (!token) {
      logger.warn('Missing auth token', {
        path: req.originalUrl,
        ip: req.ip,
        correlationId: (req as any).correlationId,
      });

      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    logger.info('User authenticated', {
      userId: decoded.userId,
      role: decoded.role,
      correlationId: (req as any).correlationId,
    });

    next();
  } catch (error: any) {
    logger.warn('Auth failed', {
      error: error.message,
      correlationId: (req as any).correlationId,
    });

    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Role-based guard
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Access denied', {
        userId: req.user.userId,
        role: req.user.role,
        required: roles,
      });

      res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
      return;
    }

    next();
  };
};
