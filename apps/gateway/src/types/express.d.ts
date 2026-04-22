import { JwtPayload } from '@org/shared-auth';

declare global {
  namespace Express {
    interface Request {
      /**
       * Attached by auth middleware
       */
      user?: JwtPayload;

      /**
       * Attached by correlation-id middleware
       */
      correlationId?: string;

      /**
       * Optional API key info (if using api-key middleware)
       */
      apiKey?: string;
    }
  }
}

export {};