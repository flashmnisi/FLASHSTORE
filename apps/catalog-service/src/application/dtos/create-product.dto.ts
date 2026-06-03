// apps/catalog-service/src/application/dtos/create-product.dto.ts

import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(200),

  slug: z.string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),

  description: z.string().min(10).max(1000),

  price: z.number().positive(),
  currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR'),

  categoryId: z.string().min(1),

  subCategory: z.string().optional(),

  brand: z.string().optional(),

  images: z.array(z.string().url()).optional().default([]),

  tags: z.array(z.string()).optional().default([]),

  // Marketing flags
  isFeatured: z.boolean().default(false),
  isHotDeal: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),

  discountPercentage: z.number().min(0).max(100).default(0),

  // Inventory
  stockQuantity: z.number().min(0).default(0),
  inStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;