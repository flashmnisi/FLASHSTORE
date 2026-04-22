import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import logger from '@org/shared-logger';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      logger.warn({
        message: 'Authentication required for role check',
        path: req.originalUrl,
        ip: req.ip,
        requestId: req.id,
      });

      res.status(401).json({
        success: false,
        message: 'Authentication required',
        requestId: req.id,
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      logger.warn({
        message: 'Insufficient role permission',
        userId: user.userId,
        role: user.role,
        requiredRoles: allowedRoles,
        path: req.originalUrl,
        requestId: req.id,
      });

      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requestId: req.id,
      });
      return;
    }

    next();
  };
};