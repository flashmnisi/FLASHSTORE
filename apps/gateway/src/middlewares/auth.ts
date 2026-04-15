import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken, type JwtPayload } from '@org/shared-auth';
import logger from '@org/shared-logger';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = extractToken(req.headers.authorization || '');

    if (!token) {
      logger.warn('Authorization token required');
      res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
      return;
    }

    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    logger.info({ userId: decoded.userId }, 'Authenticated user');

    next();
  } catch (error: any) {
    logger.warn({ error: error.message }, 'Authentication failed');
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// 🔒 Role-based access
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user?.role || !allowedRoles.includes(user.role)) {
      logger.warn(
        { userRole: user?.role, requiredRoles: allowedRoles },
        'Insufficient permissions'
      );

      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};