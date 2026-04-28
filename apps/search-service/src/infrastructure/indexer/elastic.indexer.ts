// apps/search-service/src/infrastructure/indexer/elastic.indexer.ts

import { Client } from '@elastic/elasticsearch';
import { IIndexerProvider } from '../../application/interfaces/indexer.provider';
import { ProductIndexEntity } from '../../domain/entities/product-index.entity';
import { productMapping } from '../elasticsearch/mappings/product.mapping';
import logger from '@org/shared-logger';

const INDEX_NAME = 'products';

export class ElasticIndexer implements IIndexerProvider {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    });
  }

  /**
   * Index a single product
   */
  async indexProduct(product: ProductIndexEntity): Promise<void> {
    try {
      await this.client.index({
        index: INDEX_NAME,
        id: product.id,
        document: product.toSearchDocument(),
        refresh: 'wait_for',
      });

      logger.info('📌 Product indexed in Elasticsearch', { productId: product.id });
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
        logger.error('❌ Some products failed during bulk indexing', {
          failedCount: failed.length,
          total: products.length,
        });
      }

      logger.info('🚀 Bulk indexing completed', { count: products.length });
    } catch (error: any) {
      logger.error('❌ Bulk indexing failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Delete a product from the index
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.client.delete({
        index: INDEX_NAME,
        id: productId,
      });

      logger.info('🗑️ Product deleted from index', { productId });
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
   * Ensure the index exists with correct mappings
   */
  async ensureIndex(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index: INDEX_NAME });

      if (!exists) {
        await this.client.indices.create({
          index: INDEX_NAME,
          settings: productMapping.settings,
          mappings: productMapping.mappings,
        });
        logger.info(`✅ Elasticsearch index '${INDEX_NAME}' created successfully`);
      } else {
        logger.info(`✅ Elasticsearch index '${INDEX_NAME}' already exists`);
      }
    } catch (error: any) {
      logger.error('❌ Failed to ensure index', { error: error.message });
      throw error;
    }
  }
}