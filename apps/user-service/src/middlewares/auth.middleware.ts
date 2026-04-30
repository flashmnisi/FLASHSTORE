// apps/user-service/src/presentation/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '@org/shared-logger';
import env from '../config/env';

/**
 * Extended Request with authenticated user data
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role?: string;
    [key: string]: any;
  };
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authorization header missing or invalid. Use "Bearer <token>"',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token not provided',
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    // Attach user info to request
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user',
      ...decoded,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expired', { path: req.originalUrl });
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid token', { path: req.originalUrl });
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
      return;
    }

    logger.error('Auth middleware error', {
      error: error.message,
      path: req.originalUrl,
    });

    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};

/**
 * Optional Auth Middleware - doesn't fail if no token
 * Useful for routes that work for both logged-in and guest users
 */
export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;

      (req as AuthenticatedRequest).user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'user',
        ...decoded,
      };
    }

    next();
  } catch (error: any) {
    // Don't fail on invalid/expired token for optional auth
    next();
  }
};