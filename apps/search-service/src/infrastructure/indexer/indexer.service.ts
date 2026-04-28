// apps/search-service/src/application/services/indexer.service.ts

import { getElasticClient } from '../elasticsearch/client';
import { ProductIndexEntity } from '../../domain/entities/product-index.entity';
import { productMapping } from '../elasticsearch/mappings/product.mapping';
import logger from '@org/shared-logger';

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
        refresh: 'wait_for',
      });

      logger.info('📌 Product indexed successfully', { productId: product.id });
    } catch (error: any) {
      logger.error('❌ Failed to index product', {
        productId: product.id,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * 🔥 BULK INDEX (Safe & Production Ready)
   */
  async bulkIndex(products: ProductIndexEntity[]) {
    if (products.length === 0) return;

    try {
      const operations = products.flatMap((product) => [
        { index: { _index: INDEX_NAME, _id: product.id } },
        product.toSearchDocument(),
      ]);

      const response = await this.client.bulk({
        refresh: 'wait_for',
        operations,
      });

      if (response.errors) {
        const failed = response.items.filter((item: any) => item.index?.error);
        logger.error('❌ Some documents failed during bulk index', {
          failedCount: failed.length,
          total: products.length,
        });
      }

      logger.info('🚀 Bulk indexed products', { count: products.length });
    } catch (error: any) {
      logger.error('❌ Bulk indexing failed', { error: error.message });
      throw error;
    }
  }

  /**
   * 🔥 DELETE PRODUCT FROM INDEX
   */
  async deleteProduct(productId: string) {
    try {
      await this.client.delete({
        index: INDEX_NAME,
        id: productId,
      });

      logger.info('🗑️ Product removed from index', { productId });
    } catch (error: any) {
      if (error.meta?.statusCode !== 404) {
        logger.error('❌ Failed to delete product from index', {
          productId,
          error: error.message,
        });
      }
    }
  }

   /**
   * 🔥 ENSURE INDEX EXISTS WITH MAPPING
   */
  async ensureIndex() {
    const exists = await this.client.indices.exists({ 
      index: INDEX_NAME 
    });

    if (!exists) {
      try {
        await this.client.indices.create({
          index: INDEX_NAME,
          settings: productMapping.settings,
          mappings: productMapping.mappings,
        });

        logger.info('✅ Elasticsearch index created with mappings', { index: INDEX_NAME });
      } catch (error: any) {
        logger.error('❌ Failed to create index', {
          index: INDEX_NAME,
          error: error.message,
        });
        throw error;
      }
    } else {
      logger.info('✅ Index already exists', { index: INDEX_NAME });
    }
  }

  /**
   * 🔥 FULL REINDEX (Safe version)
   */
  async reindexAll(products: ProductIndexEntity[]) {
    logger.info('♻️ Starting full reindex...');

    try {
      const exists = await this.client.indices.exists({ index: INDEX_NAME });

      if (exists) {
        await this.client.indices.delete({ index: INDEX_NAME });
        logger.info('🗑️ Deleted existing index for reindexing');
      }

      // Create index with proper structure
      await this.client.indices.create({
        index: INDEX_NAME,
        settings: productMapping.settings,
        mappings: productMapping.mappings,
      });

      await this.bulkIndex(products);

      logger.info('✅ Full reindex completed successfully');
    } catch (error: any) {
      logger.error('❌ Reindex failed', { error: error.message });
      throw error;
    }
  }
}