// apps/search-service/src/application/dtos/search-query.dto.ts

import { z } from 'zod';

/* ====================== REUSABLE SCHEMAS ====================== */

const querySchema = z.string()
  .trim()
  .min(1, 'Search query cannot be empty')
  .max(200, 'Search query is too long')
  .optional();

const categorySchema = z.string()
  .trim()
  .max(100)
  .optional();

const brandSchema = z.string()
  .trim()
  .max(100)
  .optional();

const priceSchema = z.number()
  .nonnegative('Price cannot be negative')
  .optional();

/** Sort options - keep this in sync with SearchQueryVO and repository */
const sortSchema = z.enum([
  'relevance',
  'price_asc',
  'price_desc',
  'newest',
  'rating_desc',        // ← Kept as requested
]).default('relevance');

/* ====================== FULL SEARCH QUERY VALIDATOR ====================== */

export const searchQueryValidator = z.object({
  query: querySchema,
  category: categorySchema,
  brand: brandSchema,
  minPrice: priceSchema,
  maxPrice: priceSchema,
  sort: sortSchema,
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  tags: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
}).refine((data) => {
  if (data.minPrice !== undefined && data.maxPrice !== undefined) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: "minPrice cannot be greater than maxPrice",
  path: ["minPrice"],
});

/* ====================== OTHER VALIDATORS ====================== */

export const suggestQueryValidator = z.object({
  q: z.string()
    .trim()
    .min(1, 'Query is required')
    .max(100, 'Query is too long'),
});

export const clickValidator = z.object({
  productId: z.string().min(1, 'productId is required'),
  query: z.string().optional(),
});

/* ====================== TYPES ====================== */

export type SearchQueryDto = z.infer<typeof searchQueryValidator>;
export type SuggestQueryDto = z.infer<typeof suggestQueryValidator>;
export type ClickDto = z.infer<typeof clickValidator>;