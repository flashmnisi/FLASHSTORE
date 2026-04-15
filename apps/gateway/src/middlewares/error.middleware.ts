import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Gateway Error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal Gateway Error',
    error: err.message,
  });
};