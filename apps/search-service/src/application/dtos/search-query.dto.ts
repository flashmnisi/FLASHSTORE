import { z } from 'zod';

export const searchQuerySchema = z.object({
  query: z.string().optional(),

  category: z.string().optional(),
  brand: z.string().optional(),

  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),

  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest']).default('relevance'),

  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type SearchQueryDto = z.infer<typeof searchQuerySchema>;