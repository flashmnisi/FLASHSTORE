import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '@org/shared-auth';
import logger from '@org/shared-logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const decoded = verifyToken(token);

    // Attach user info to request
    (req as any).user = decoded;

    next();
  } catch (error: any) {
    logger.warn('Authentication failed', { error: error.message });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};