// apps/search-service/src/domain/entities/search-result.entity.ts

import { ProductIndexEntity } from './product-index.entity';

export class SearchResultEntity {
  public readonly hasNext: boolean;
  public readonly hasPrev: boolean;

  constructor(
    public readonly products: ProductIndexEntity[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly facets: Record<string, any> = {},
    public readonly query?: string,
    public readonly took?: number,
  ) {
    this.hasNext = page < Math.ceil(total / limit);
    this.hasPrev = page > 1;
  }

  /**
   * Total number of pages
   */
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  /**
   * 🔥 Convert to clean API response
   */
  toJSON() {
    return {
      success: true,
      data: {
        products: this.products.map(p => p.toSearchDocument ? p.toSearchDocument() : p),
        pagination: {
          total: this.total,
          page: this.page,
          limit: this.limit,
          totalPages: this.totalPages,
          hasNext: this.hasNext,
          hasPrev: this.hasPrev,
        },
        facets: this.facets,
        meta: {
          query: this.query,
          took: this.took,
          timestamp: new Date().toISOString(),
        },
      },
    };
  }
}