// apps/search-service/src/application/services/index.service.ts

import logger from '@org/shared-logger';
import { ProductIndexEntity } from '../../domain/entities/product-index.entity';
import { IIndexerProvider } from '../interfaces/indexer.provider';

export class IndexService {
  constructor(private readonly indexer: IIndexerProvider) {}

  /**
   * Index a single product
   */
  async indexProduct(product: ProductIndexEntity): Promise<void> {
    try {
      await this.indexer.indexProduct(product);

      logger.info('✅ Product indexed successfully', {
        productId: product.id,
        name: product.name,
      });
    } catch (error: any) {
      logger.error('❌ Failed to index product', {
        productId: product.id,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Bulk index multiple products
   */
  async bulkIndex(products: ProductIndexEntity[]): Promise<void> {
    if (products.length === 0) {
      logger.info('No products to index');
      return;
    }

    try {
      await this.indexer.bulkIndex(products);

      logger.info('✅ Bulk indexing completed', {
        count: products.length,
      });
    } catch (error: any) {
      logger.error('❌ Bulk indexing failed', {
        count: products.length,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Delete a product from the index
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.indexer.deleteProduct(productId);

      logger.info('🗑️ Product removed from index', { productId });
    } catch (error: any) {
      logger.error('❌ Failed to delete product from index', {
        productId,
        error: error.message,
      });
    }
  }

  /**
   * Ensure the index exists with proper mappings
   */
  async ensureIndex(): Promise<void> {
    try {
      await this.indexer.ensureIndex();
      logger.info('✅ Search index ensured');
    } catch (error: any) {
      logger.error('❌ Failed to ensure index', { error: error.message });
      throw error;
    }
  }
}
