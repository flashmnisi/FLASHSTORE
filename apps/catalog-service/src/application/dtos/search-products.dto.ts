// apps/catalog-service/src/application/dtos/search-products.dto.ts

// apps/catalog-service/src/application/dtos/search-products.dto.ts

export interface SearchProductsDto {
  query?: string;

  categoryId?: string;
  subCategory?: string;

  brand?: string;

  tags?: string[];

  // Marketing filters
  isFeatured?: boolean;
  isHotDeal?: boolean;
  isNewArrival?: boolean;

  // Price filters
  minPrice?: number;
  maxPrice?: number;

  // Stock
  inStock?: boolean;

  // Sorting
  sort?:
    | 'relevance'
    | 'price_asc'
    | 'price_desc'
    | 'newest'
    | 'oldest'
    | 'hot_deals'
    | 'featured';
    

  // Pagination
  page?: number;
  limit?: number;
}