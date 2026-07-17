// apps/analytics-service/src/infrastructure/redis/metrics.cache.ts

import { getRedis } from '@org/shared-redis';
import logger from '@org/shared-logger';

const CACHE_TTL = 60 * 15;

export class MetricsCache {
  private readonly prefix = 'analytics:metrics';

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      const redis = await getRedis();
      const cacheKey = `${this.prefix}:${key}`;
      const data = await redis.get(cacheKey);

      if (!data) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      logger.warn('Failed to get metrics from cache', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });

      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds = CACHE_TTL
  ): Promise<void> {
    try {
      const redis = await getRedis();
      const cacheKey = `${this.prefix}:${key}`;

      await redis.set(cacheKey, JSON.stringify(value), {
        EX: ttlSeconds,
      });

      logger.debug('Metrics cached', { key });
    } catch (error) {
      logger.warn('Failed to cache metrics', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const redis = await getRedis();
      await redis.del(`${this.prefix}:${key}`);
    } catch (error) {
      logger.warn('Failed to delete metrics from cache', {
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async clearAll(): Promise<void> {
    try {
      const redis = await getRedis();
      const keys = await redis.keys(`${this.prefix}:*`);

      if (keys.length > 0) {
        await redis.del(keys);
        logger.info(`Cleared ${keys.length} metrics cache entries`);
      }
    } catch (error) {
      logger.error('Failed to clear metrics cache', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  static getDashboardKey(period = 'today'): string {
    return `dashboard:${period}`;
  }

  static getRevenueKey(startDate: string, endDate: string): string {
    return `revenue:${startDate}:${endDate}`;
  }

  static getTopProductsKey(limit = 10): string {
    return `top-products:${limit}`;
  }
}

export const metricsCache = new MetricsCache();