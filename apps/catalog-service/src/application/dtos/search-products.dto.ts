// apps/catalog-service/src/application/dtos/search-products.dto.ts

import { z } from 'zod';

export const searchProductsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest']).default('relevance'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type SearchProductsDto = z.infer<typeof searchProductsSchema>;