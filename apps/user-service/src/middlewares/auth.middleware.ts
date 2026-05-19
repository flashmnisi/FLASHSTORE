import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role?: string;
  };
}

export const extractUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: User context missing from gateway',
    });
    return;
  }

  req.user = {
    userId,
    email: req.headers['x-user-email'] as string,
    role: req.headers['x-user-role'] as string,
  };

  next();
};