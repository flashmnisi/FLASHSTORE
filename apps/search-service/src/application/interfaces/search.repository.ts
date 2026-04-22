import { SearchQueryVO } from '../../domain/value-objects/search-query.vo';
import { SearchResultEntity } from '../../domain/entities/search-result.entity';

export interface ISearchRepository {
  /**
   * 🔍 Full-text search
   */
  search(query: SearchQueryVO): Promise<SearchResultEntity>;

  /**
   * 🧠 Index single product
   */
  index(product: any): Promise<void>;

  /**
   * 🔥 Bulk index products
   */
  bulkIndex(products: any[]): Promise<void>;

  /**
   * 🗑 Remove product from index
   */
  delete(productId: string): Promise<void>;
}