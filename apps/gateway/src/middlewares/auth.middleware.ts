// apps/gateway/src/presentation/middlewares/auth.middleware.ts

// apps/gateway/src/presentation/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import {
  extractToken,
  verifyAccessToken,
  type JwtPayload,
} from '@org/shared-auth';

import logger from '@org/shared-logger';

export interface AuthRequest extends Request {
  user?: JwtPayload;
  id?: string;
  correlationId?: string;
}

/**
 * ============================
 * 🔐 AUTH MIDDLEWARE (GATEWAY)
 * ============================
 *
 */
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    const token = extractToken(authHeader || '');

    if (!token) {
      logger.warn('Missing auth token', {
        path: req.originalUrl,
        method: req.method,
        requestId: req.id || req.correlationId,
      });

      res.status(401).json({
        success: false,
        message: 'Authorization token is required',
        requestId: req.id || req.correlationId,
      });

      return;
    }

    /**
     * ============================
     * VERIFY JWT
     * ============================
     */
    const decoded = verifyAccessToken(token);

    /**
     * Attach user to request (gateway only use)
     */
    req.user = decoded;

    /**
     * ============================
     * 🔥 CRITICAL FIX
     * Forward identity to microservices
     * ============================
     */
    req.headers['x-user-id'] = decoded.userId;
    req.headers['x-user-role'] = decoded.role;

    if (decoded.email) {
      req.headers['x-user-email'] = decoded.email;
    }

    logger.info('User authenticated successfully', {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      requestId: req.id || req.correlationId,
    });

    next();
  } catch (error: any) {
    logger.warn('Authentication failed', {
      error: error.message,
      path: req.originalUrl,
      method: req.method,
      requestId: req.id || req.correlationId,
    });

    res.status(401).json({
      success: false,
      message:
        error.name === 'TokenExpiredError'
          ? 'Token has expired'
          : 'Invalid or expired token',
      requestId: req.id || req.correlationId,
    });
  }
};

/**
 * ============================
 * ROLE-BASED ACCESS CONTROL
 * ============================
 */
export const requireRole = (allowedRoles: string[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        requestId: req.id || req.correlationId,
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Access denied - insufficient role', {
        userId: req.user.userId,
        role: req.user.role,
        requiredRoles: allowedRoles,
        path: req.originalUrl,
        requestId: req.id || req.correlationId,
      });

      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        requestId: req.id || req.correlationId,
      });

      return;
    }

    next();
  };
};

/**
 * ============================
 * ADMIN ONLY SHORTCUT
 * ============================
 */
export const adminOnly = requireRole([
  'admin',
  'superadmin',
]);