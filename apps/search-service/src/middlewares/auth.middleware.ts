// apps/search-service/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import logger from '@org/shared-logger';

/**
 * Extended Request with authenticated user
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
        message:
          'Missing or invalid authorization header. Use "Bearer <token>"',
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

    const decoded = jwt.verify(token, env.JWT_SECRET || '') as any;

    // Attach user to request
    (req as AuthenticatedRequest).user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      ...decoded,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expired', { path: req.originalUrl });
      res.status(401).json({
        success: false,
        message: 'Token has expired',
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
