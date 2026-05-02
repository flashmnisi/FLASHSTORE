// apps/catalog-service/src/utils/validators.ts

import { z } from 'zod';

/**
 * Reusable primitive validators
 */
const positiveAmount = z
  .number()
  .positive('Amount must be greater than zero')
  .max(1_000_000, 'Amount is too large')
  .refine((val) => Number.isFinite(val), 'Invalid amount')
  .refine((val) => Math.round(val * 100) === val * 100, {
    message: 'Amount must have at most 2 decimal places',
  });

const currency = z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR');

const slug = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens');

const mongoId = z
  .string()
  .min(1)
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ID format');

/**
 * Composite Schemas
 */
const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(2000),
  price: positiveAmount,
  currency,
  categoryId: mongoId,
  brand: z.string().min(2).max(100).optional(),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string().min(2)).default([]),
  stockQuantity: z.number().int().nonnegative().default(0),
});

const updateProductSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: positiveAmount.optional(),
  currency: currency.optional(),
  brand: z.string().min(2).max(100).optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string().min(2)).optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

const searchProductsSchema = z.object({
  query: z.string().optional(),
  categoryId: mongoId.optional(),
  brand: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest']).default('relevance'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

const categorySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  parentId: mongoId.optional(),
  imageUrl: z.string().url().optional(),
});

/**
 * Export validators object
 */
export const validators = {
  positiveAmount,
  currency,
  slug,
  mongoId,
  createProduct: createProductSchema,
  updateProduct: updateProductSchema,
  searchProducts: searchProductsSchema,
  category: categorySchema,
} as const;

/**
 * Express validation middleware
 */
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
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
  };
};

/**
 * Type exports
 */
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type SearchProductsInput = z.infer<typeof searchProductsSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;