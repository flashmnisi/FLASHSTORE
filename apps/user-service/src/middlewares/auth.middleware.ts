import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@org/shared-auth';
import logger from '@org/shared-logger';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
  correlationId?: string;
}

// ====================== AUTH MIDDLEWARE ======================
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error: any) {
    logger.warn(
      {
        error: error.message,
        correlationId: req.correlationId,
      },
      'Authentication failed'
    );

    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
    });
  }
};