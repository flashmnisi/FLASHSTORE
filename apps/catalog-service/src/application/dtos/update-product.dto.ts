// apps/catalog-service/src/application/dtos/update-product.dto.ts

import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.number().positive().optional(),
  currency: z.enum(['ZAR', 'USD', 'EUR', 'GBP']).optional(),
  brand: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;