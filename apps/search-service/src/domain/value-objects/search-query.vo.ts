// apps/search-service/src/application/dtos/search-query.vo.ts

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'rating_desc';

export interface SearchFilters {
  category?: string[];
  brand?: string[];
  tags?: string[];
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export class SearchQueryVO {
  constructor(
    public readonly query: string = '',
    public readonly filters: SearchFilters = {},
    public readonly sort: SortOption = 'relevance',
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly minPrice?: number,
    public readonly maxPrice?: number,
    public readonly categories?: string[]
  ) {}

  /**
   * 📦 Pagination offset
   */
  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * 🧠 Normalized query for Elasticsearch
   */
  get normalizedQuery(): string {
    return this.query.trim().toLowerCase();
  }

  /**
   * 🔥 Build Elasticsearch filter array
   */
  toElasticFilters(): any[] {
    const filters: any[] = [];

    // Category
    if (this.categories?.length || this.filters.category?.length) {
      filters.push({
        terms: { category: this.categories || this.filters.category },
      });
    }

    // Brand
    if (this.filters.brand?.length) {
      filters.push({ terms: { brand: this.filters.brand } });
    }

    // Tags
    if (this.filters.tags?.length) {
      filters.push({ terms: { tags: this.filters.tags } });
    }

    // In Stock
    if (typeof this.filters.inStock === 'boolean') {
      filters.push({ term: { inStock: this.filters.inStock } });
    }

    // Price Range
    if (
      this.minPrice !== undefined ||
      this.maxPrice !== undefined ||
      this.filters.minPrice !== undefined ||
      this.filters.maxPrice !== undefined
    ) {
      filters.push({
        range: {
          price: {
            gte: this.minPrice ?? this.filters.minPrice,
            lte: this.maxPrice ?? this.filters.maxPrice,
          },
        },
      });
    }

    return filters;
  }

  /**
   * Debug helper
   */
  debug() {
    return {
      query: this.query,
      normalizedQuery: this.normalizedQuery,
      sort: this.sort,
      page: this.page,
      limit: this.limit,
      offset: this.offset,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      categories: this.categories,
      filters: this.filters,
    };
  }
}
