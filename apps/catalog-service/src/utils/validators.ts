// apps/catalog-service/src/utils/validators.ts

import { z } from 'zod';

/**
 * =========================================
 * REUSABLE VALIDATORS
 * =========================================
 */

const positiveAmount = z
  .number()
  .positive('Amount must be greater than zero')
  .max(1_000_000, 'Amount is too large')
  .refine((val) => Number.isFinite(val), 'Invalid amount')
  .refine((val) => Math.round(val * 100) === val * 100, {
    message: 'Amount must have at most 2 decimal places',
  });

const currency = z
  .enum(['ZAR', 'USD', 'EUR', 'GBP'])
  .default('ZAR');

const slug = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(100, 'Slug is too long')
  .regex(
    /^[a-z0-9-]+$/,
    'Slug can only contain lowercase letters, numbers and hyphens'
  );

const mongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ID format');

/**
 * =========================================
 * PRODUCT SCHEMAS
 * =========================================
 */

const createProductSchema = z.object({
  name: z.string().min(3).max(255),

  slug: slug,

  description: z.string().min(10).max(3000),

  price: positiveAmount,

  currency,

  categoryId: mongoId,

  subCategory: z.string().min(2).max(100).optional(),

  brand: z.string().min(2).max(100).optional(),

  images: z.array(z.string()).default([]),

  tags: z.array(z.string()).default([]),

  // Marketing flags
  isFeatured: z.boolean().default(false),

  isHotDeal: z.boolean().default(false),

  isNewArrival: z.boolean().default(false),

  discountPercentage: z
    .number()
    .min(0)
    .max(100)
    .default(0),

  inStock: z.boolean().default(true),

  stockQuantity: z
    .number()
    .int()
    .nonnegative()
    .default(0),

  isActive: z.boolean().default(true),
});

const updateProductSchema = z.object({
  name: z.string().min(3).max(255).optional(),

  slug: slug.optional(),

  description: z.string().min(10).max(3000).optional(),

  price: positiveAmount.optional(),

  currency: currency.optional(),

  categoryId: mongoId.optional(),

  subCategory: z.string().min(2).max(100).optional(),

  brand: z.string().min(2).max(100).optional(),

  images: z.array(z.string()).optional(),

  tags: z.array(z.string()).optional(),

  isFeatured: z.boolean().optional(),

  isHotDeal: z.boolean().optional(),

  isNewArrival: z.boolean().optional(),

  discountPercentage: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  inStock: z.boolean().optional(),

  stockQuantity: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  isActive: z.boolean().optional(),
});

/**
 * =========================================
 * SEARCH PRODUCTS
 * =========================================
 */

const searchProductsSchema = z.object({
  query: z.string().optional(),

  categoryId: mongoId.optional(),

  subCategory: z.string().optional(),

  brand: z.string().optional(),

  minPrice: z.coerce.number().nonnegative().optional(),

  maxPrice: z.coerce.number().nonnegative().optional(),

  tags: z
    .union([
      z.array(z.string()),
      z.string().transform((val) => val.split(',')),
    ])
    .optional(),

  isFeatured: z.coerce.boolean().optional(),

  isHotDeal: z.coerce.boolean().optional(),

  isNewArrival: z.coerce.boolean().optional(),

  inStock: z.coerce.boolean().optional(),

  sort: z
    .enum([
      'relevance',
      'price_asc',
      'price_desc',
      'newest',
      'oldest',
      'hot_deals',
      'featured',
    ])
    .default('relevance'),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * =========================================
 * CATEGORY SCHEMA
 * =========================================
 */

const categorySchema = z.object({
  name: z.string().min(2).max(100),

  slug: slug,

  description: z.string().max(500).optional(),

  parentId: mongoId.optional(),

  imageUrl: z.string().url().optional(),

  isActive: z.boolean().default(true),
});

/**
 * =========================================
 * EXPORT VALIDATORS
 * =========================================
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
 * =========================================
 * EXPRESS VALIDATION MIDDLEWARE
 * =========================================
 */

export const validate = (
  schema: z.ZodSchema,
  source: 'body' | 'query' = 'body'
) => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }

    req[source] = result.data;

    next();
  };
};

/**
 * =========================================
 * TYPE EXPORTS
 * =========================================
 */

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;

export type SearchProductsInput =
  z.infer<typeof searchProductsSchema>;

export type CategoryInput =
  z.infer<typeof categorySchema>;