import { Request, Response, NextFunction } from 'express';
import logger from '@org/shared-logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Simple service-to-service auth (gateway already verifies JWT)
 * Payment service trusts headers from gateway
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const email = req.headers['x-user-email'] as string;
    const role = req.headers['x-user-role'] as string;

    if (!userId) {
      logger.warn('Unauthorized request - missing user headers', {
        path: req.originalUrl,
        ip: req.ip,
        correlationId: (req as any).correlationId,
      });

      res.status(401).json({
        success: false,
        message: 'Unauthorized request',
      });
      return;
    }

    req.user = {
      userId,
      email,
      role: role || 'user',
    };

    next();
  } catch (error: any) {
    logger.error('Auth middleware error', {
      error: error.message,
    });

    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
}; 