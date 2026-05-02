// apps/catalog-service/src/middlewares/validate.middleware.ts

import { z } from 'zod';

export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: result.error.flatten().fieldErrors,
        });
      }

      req.body = result.data;
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        error: error.message,
      });
    }
  };
};