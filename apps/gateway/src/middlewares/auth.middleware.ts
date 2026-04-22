import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyAccessToken, type JwtPayload } from '@org/shared-auth';
import logger from '@org/shared-logger';

export interface AuthRequest extends Request {
  user?: JwtPayload;
  id: string; // 🔥 correlation ID
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader || '');

    if (!token) {
      logger.warn({
        message: 'No authorization token provided',
        path: req.originalUrl,
        ip: req.ip,
        requestId: req.id, // ✅ FIXED
      });

      res.status(401).json({
        success: false,
        message: 'Authorization token is required',
        requestId: req.id, // 🔥 return to client
      });
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;

    logger.info({
      message: 'User authenticated successfully',
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      requestId: req.id,
    });

    next();
  } catch (error: any) {
    logger.warn({
      message: 'Authentication failed',
      error: error.message,
      path: req.originalUrl,
      ip: req.ip,
      requestId: req.id,
    });

    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      requestId: req.id,
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        requestId: req.id,
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      logger.warn({
        message: 'Insufficient permissions',
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