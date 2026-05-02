// apps/catalog-service/src/infrastructure/cache/product.cache.ts

import { getRedis } from '@org/shared-redis';
import logger from '@org/shared-logger';
import { ProductEntity } from '../../domain/entities/product.entity';

const CACHE_TTL = 60 * 30; // 30 minutes

export class ProductCache {
  private readonly prefix = 'catalog:product';

  /**
   * Get product from cache
   */
  async get(id: string): Promise<ProductEntity | null> {
    try {
      const redis = await getRedis();
      const key = `${this.prefix}:${id}`;
      const data = await redis.get(key);

      if (!data) return null;

      const parsed = JSON.parse(data);
      return new ProductEntity(
        parsed.id,
        parsed.name,
        parsed.slug,
        parsed.description,
        parsed.price,
        parsed.currency,
        parsed.categoryId,
        parsed.brand,
        parsed.images,
        parsed.tags,
        parsed.inStock,
        parsed.stockQuantity,
        parsed.isActive,
        new Date(parsed.createdAt),
        new Date(parsed.updatedAt)
      );
    } catch (error: any) {
      logger.error('Failed to get product from cache', { productId: id, error: error.message });
      return null;
    }
  }

  /**
   * Save product to cache
   */
  async save(product: ProductEntity): Promise<void> {
    try {
      const redis = await getRedis();
      const key = `${this.prefix}:${product.id}`;

      await redis.set(
        key,
        JSON.stringify(product.toJSON()),
        { EX: CACHE_TTL }
      );

      logger.debug('Product cached', { productId: product.id });
    } catch (error: any) {
      logger.warn('Failed to cache product', { productId: product.id, error: error.message });
    }
  }

  /**
   * Delete product from cache
   */
  async delete(id: string): Promise<void> {
    try {
      const redis = await getRedis();
      await redis.del(`${this.prefix}:${id}`);
    } catch (error: any) {
      logger.warn('Failed to delete product from cache', { productId: id });
    }
  }

  /**
   * Clear all product cache (useful for bulk operations)
   */
  async clearAll(): Promise<void> {
    try {
      const redis = await getRedis();
      // Note: This is a simple implementation. In production, use SCAN for large datasets
      const keys = await redis.keys(`${this.prefix}:*`);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error: any) {
      logger.error('Failed to clear product cache', { error: error.message });
    }
  }
}

// Singleton
export const productCache = new ProductCache();