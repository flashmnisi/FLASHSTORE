import { JwtPayload } from '@org/shared-auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      correlationId?: string;
    }
  }
}

export {};
