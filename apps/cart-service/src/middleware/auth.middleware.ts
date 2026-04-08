import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@org/shared-auth';
import logger from '@org/shared-logger';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('No token provided');
      res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    (req as any).user = decoded;
    next();
  } catch (error: any) {
    logger.warn({ error: error.message }, 'Authentication failed');
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    return;
  }
};