import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import logger from '../utils/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Missing authorization header',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    (req as any).user = decoded;

    next();
  } catch (error: any) {
    logger.warn('Auth failed', {
      error: error.message,
      path: req.originalUrl,
    });

    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};