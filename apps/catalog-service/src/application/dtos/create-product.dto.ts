// apps/catalog-service/src/application/dtos/create-product.dto.ts

import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP']).default('ZAR'),
  categoryId: z.string().min(1),
  brand: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  stockQuantity: z.number().int().nonnegative().default(0),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;