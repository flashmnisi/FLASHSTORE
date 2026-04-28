// apps/search-service/src/utils/validators.ts

import { z, ZodObject, ZodRawShape } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Extended Request with validated data
 */
export interface ValidatedRequest<T = any> extends Request {
  validated: T;
}

/**
 * Generic Zod validation middleware for Express
 * Supports query, body, and params validation
 */
export const validate = <T extends ZodRawShape>(schema: ZodObject<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Merge query, body, and params for validation
      const dataToValidate = {
        ...req.query,
        ...req.body,
        ...req.params,
      };

      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: result.error.flatten().fieldErrors,
        });
        return;
      }

      // Attach validated data to request
      (req as ValidatedRequest<z.infer<typeof schema>>).validated = result.data;

      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
        error: error.message,
      });
    }
  };
};