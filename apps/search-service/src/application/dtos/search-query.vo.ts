// apps/search-service/src/application/dtos/search-query.vo.ts

export type SortOption = 
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'rating_desc';   

export interface SearchQueryVO {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;              
  page: number;
  limit: number;
  tags?: string[];
  inStock?: boolean;
}