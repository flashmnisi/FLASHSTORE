// apps/analytics-service/src/infrastructure/redis/metrics.cache.ts

import { getRedis } from '@org/shared-redis';
import logger from '@org/shared-logger';

const CACHE_TTL = 60 * 15; // 15 minutes for metrics (frequently changing)

export class MetricsCache {
  private readonly prefix = 'analytics:metrics';

  /**
   * Get cached metrics
   */
  async get(key: string): Promise<any | null> {
    try {
      const redis = await getRedis();
      const cacheKey = `${this.prefix}:${key}`;
      const data = await redis.get(cacheKey);

      if (!data) return null;

      return JSON.parse(data);
    } catch (error: any) {
      logger.warn('Failed to get metrics from cache', { key, error: error.message });
      return null;
    }
  }

  /**
   * Save metrics to cache
   */
  async set(key: string, value: any, ttlSeconds: number = CACHE_TTL): Promise<void> {
    try {
      const redis = await getRedis();
      const cacheKey = `${this.prefix}:${key}`;

      await redis.set(
        cacheKey,
        JSON.stringify(value),
        { EX: ttlSeconds }
      );

      logger.debug('Metrics cached', { key });
    } catch (error: any) {
      logger.warn('Failed to cache metrics', { key, error: error.message });
    }
  }

  /**
   * Delete specific metrics from cache
   */
  async delete(key: string): Promise<void> {
    try {
      const redis = await getRedis();
      await redis.del(`${this.prefix}:${key}`);
    } catch (error: any) {
      logger.warn('Failed to delete metrics from cache', { key });
    }
  }

  /**
   * Clear all metrics cache (useful after major updates)
   */
  async clearAll(): Promise<void> {
    try {
      const redis = await getRedis();
      const keys = await redis.keys(`${this.prefix}:*`);
      
      if (keys.length > 0) {
        await redis.del(keys);
        logger.info(`Cleared ${keys.length} metrics cache entries`);
      }
    } catch (error: any) {
      logger.error('Failed to clear metrics cache', { error: error.message });
    }
  }

  /**
   * Generate cache key for dashboard/overview
   */
  static getDashboardKey(period: string = 'today'): string {
    return `dashboard:${period}`;
  }

  /**
   * Generate cache key for revenue metrics
   */
  static getRevenueKey(startDate: string, endDate: string): string {
    return `revenue:${startDate}:${endDate}`;
  }

  /**
   * Generate cache key for top products
   */
  static getTopProductsKey(limit: number = 10): string {
    return `top-products:${limit}`;
  }
}

// Singleton
export const metricsCache = new MetricsCache();