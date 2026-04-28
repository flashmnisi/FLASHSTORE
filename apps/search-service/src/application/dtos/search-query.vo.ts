// apps/search-service/src/application/dtos/search-query.vo.ts

export type SortOption = 
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'rating_desc';     // ← Added to match Zod schema

export interface SearchQueryVO {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;                    // ← Use the expanded type
  page: number;
  limit: number;
  tags?: string[];
  inStock?: boolean;
}