// apps/search-service/src/application/interfaces/search.repository.ts

import { SearchQueryVO } from '../../domain/value-objects/search-query.vo';

export interface ISearchRepository {
  /**
   * Search products using SearchQueryVO
   */
  search(queryVO: SearchQueryVO): Promise<{
    products: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Index a single product
   */
  index(product: any): Promise<void>;

  /**
   * Bulk index products
   */
  bulkIndex(products: any[]): Promise<void>;

  /**
   * Delete a product from index
   */
  delete(productId: string): Promise<void>;

  /**
   * Ensure index exists with mappings
   */
  ensureIndex(): Promise<void>;
}