import { z } from 'zod';

export const searchValidators = {
  query: z.string().max(200).optional(),

  category: z.string().optional(),

  brand: z.string().optional(),

  priceRange: z.object({
    min: z.number().nonnegative().optional(),
    max: z.number().nonnegative().optional(),
  }).optional(),

  sort: z.enum([
    'relevance',
    'price_asc',
    'price_desc',
    'newest',
  ]).default('relevance'),

  page: z.number().int().min(1).default(1),

  limit: z.number().int().min(1).max(100).default(20),
};

/**
 * Full search request validator
 */
export const searchQueryValidator = z.object({
  query: searchValidators.query,
  category: searchValidators.category,
  brand: searchValidators.brand,
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: searchValidators.sort,
  page: searchValidators.page,
  limit: searchValidators.limit,
});

export type SearchQueryInput = z.infer<typeof searchQueryValidator>;