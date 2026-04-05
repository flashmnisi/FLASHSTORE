import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
};