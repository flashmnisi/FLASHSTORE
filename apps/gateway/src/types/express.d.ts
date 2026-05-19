// apps/gateway/src/types/express.d.ts

import { JwtPayload } from '@org/shared-auth';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      
      /** Correlation ID for distributed tracing */
      correlationId?: string;
      
      /** Alias for correlationId (used in your auth middleware) */
      id?: string;

      /** API Key info */
      apiKey?: {
        key: string;
        permissions?: string[];
        metadata?: Record<string, any>;
      };

      tenantId?: string;
      startTime?: number;
    }
  }
}

export {};