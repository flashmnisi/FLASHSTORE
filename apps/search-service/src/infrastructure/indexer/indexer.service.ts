import { getElasticClient } from '../elasticsearch/client';
import logger from '../../utils/logger';
import { ProductIndexEntity } from '../../domain/entities/product-index.entity';

const INDEX_NAME = 'products';

export class IndexerService {
  private client = getElasticClient();

  /**
   * 🔥 INDEX SINGLE PRODUCT
   */
  async indexProduct(product: ProductIndexEntity) {
    try {
      await this.client.index({
        index: INDEX_NAME,
        id: product.id,
        document: product.toSearchDocument(),
        refresh: true,
      });

      logger.info('📌 Product indexed', {
        productId: product.id,
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
   * 🔥 BULK INDEX (HIGH PERFORMANCE)
   */
  async bulkIndex(products: ProductIndexEntity[]) {
    try {
      const body = products.flatMap((product) => [
        {
          index: {
            _index: INDEX_NAME,
            _id: product.id,
          },
        },
        product.toSearchDocument(),
      ]);

      await this.client.bulk({
        refresh: true,
        operations: body,
      });

      logger.info('🚀 Bulk indexed products', {
        count: products.length,
      });
    } catch (error: any) {
      logger.error('❌ Bulk indexing failed', {
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * 🔥 DELETE FROM INDEX
   */
  async deleteProduct(productId: string) {
    try {
      await this.client.delete({
        index: INDEX_NAME,
        id: productId,
      });

      logger.info('🗑️ Product removed from index', {
        productId,
      });
    } catch (error: any) {
      logger.error('❌ Delete failed', {
        productId,
        error: error.message,
      });
    }
  }

  /**
   * 🔥 REINDEX EVERYTHING (MASSIVE SCALE FEATURE)
   */
  async reindexAll(products: ProductIndexEntity[]) {
    logger.info('♻️ Starting full reindex...');

    await this.client.indices.delete({
      index: INDEX_NAME,
      ignore_unavailable: true,
    });

    await this.client.indices.create({
      index: INDEX_NAME,
      ...productMapping,
    });

    await this.bulkIndex(products);

    logger.info('✅ Full reindex completed');
  }
}