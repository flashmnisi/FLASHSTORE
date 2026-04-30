// apps/user-service/src/utils/validators.ts

import { z } from 'zod';

/**
 * 🔥 Reusable Zod Schemas for User Service
 */

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email is too long');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .max(128, 'Password is too long');

export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes');

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number format')
  .optional();

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
  .optional();

/**
 * Full DTO Schemas
 */
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  // Add more fields as needed (bio, avatar, etc.)
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

/**
 * Generic validation middleware (recommended to use instead of manual checks)
 */
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req.method === 'GET' ? req.query : req.body;

      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: result.error.flatten().fieldErrors,
        });
        return;
      }

      // Attach validated data
      if (req.method === 'GET') {
        req.query = result.data as any;
      } else {
        req.body = result.data as any;
      }

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

// Legacy