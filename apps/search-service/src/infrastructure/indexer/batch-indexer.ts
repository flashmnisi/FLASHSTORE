import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/logger';
import { ProductIndexEntity } from '../../domain/entities/product-index.entity';

export class BatchIndexer {
  constructor(private readonly client: Client) {}

  /**
   * 🔥 BULK INDEX PRODUCTS (HIGH PERFORMANCE INGESTION)
   */
  async indexProducts(products: ProductIndexEntity[]): Promise<void> {
    if (!products.length) return;

    const body: any[] = [];

    for (const product of products) {
      // Action metadata (required by Elasticsearch bulk API)
      body.push({
        index: {
          _index: 'products',
          _id: product.id,
        },
      });

      // Document
      body.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        category: product.category,
        brand: product.brand,
        tags: product.tags,
        images: product.images,
        inStock: product.inStock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }

    try {
      const response = await this.client.bulk({
        refresh: true,
        body,
      });

      // ==============================
      // HANDLE ERRORS (CRITICAL PART)
      // ==============================
      if (response.errors) {
        const failedItems: any[] = [];

        response.items.forEach((item: any, index: number) => {
          const action = item.index;

          if (action && action.error) {
            failedItems.push({
              product: products[index],
              error: action.error,
            });
          }
        });

        logger.error('⚠️ Partial batch indexing failure', {
          failedCount: failedItems.length,
          total: products.length,
        });

        // Optional: retry failed items only
        await this.retryFailed(failedItems.map(f => f.product));
      } else {
        logger.info('✅ Batch indexed successfully', {
          count: products.length,
        });
      }
    } catch (error: any) {
      logger.error('❌ Batch indexing failed', {
        error: error.message,
        count: products.length,
      });

      // 🔥 fallback retry
      await this.retryFailed(products);
    }
  }

  /**
   * 🔁 RETRY MECHANISM (SAFE REPROCESSING)
   */
  private async retryFailed(products: ProductIndexEntity[]) {
    if (!products.length) return;

    logger.warn('♻️ Retrying failed batch', {
      count: products.length,
    });

    // simple exponential backoff
    await new Promise(res => setTimeout(res, 2000));

    try {
      await this.indexProducts(products);
    } catch (error: any) {
      logger.error('🔥 Retry batch failed permanently', {
        error: error.message,
        count: products.length,
      });
    }
  }
}