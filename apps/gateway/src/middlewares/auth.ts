import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken, type JwtPayload } from '@org/shared-auth';
// import logger from '@flashstore/shared-logger';  

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req.headers.authorization as string);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authorization token required',
      });
      return;                    // ← Important: early return
    }

    const decoded = verifyToken(token);

    // Attach user info to request object
    (req as any).user = decoded;

    next();                      // ← Only call next() on success
  } catch (error: any) {
    console.warn('Authentication failed:', error.message); // temporary until logger is ready

    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
    return;                      // ← Important: early return
  }
};

// Optional: Role guard middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as JwtPayload | undefined;

    if (!user || !allowedRoles.includes(user.role || '')) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};