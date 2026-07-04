// apps/search-service/src/application/interfaces/indexer.provider.ts

import { ProductIndexEntity } from '../../domain/entities/product-index.entity';

export interface IIndexerProvider {
  /**
   * 🔥 Index single product
   */
  indexProduct(product: ProductIndexEntity): Promise<void>;

  /**
   * ⚡ Bulk index products
   */
  bulkIndex(products: ProductIndexEntity[]): Promise<void>;

  /**
   * 🗑 Delete from index
   */
  deleteProduct(productId: string): Promise<void>;

  /**
   * (Should be called on startup)
   */
  ensureIndex(): Promise<void>;
}