// apps/gateway/src/infrastructure/cache/response.cache.ts

import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';

const CACHE_TTL = 60; // 1 minute default for gateway responses

export class ResponseCache {
  private readonly prefix = 'gateway:cache';

  /**
   * Get cached response
   */
  async get(key: string): Promise<any | null> {
    try {
      const redis = await getRedis();
      const cacheKey = `${this.prefix}:${key}`;
      const data = await redis.get(cacheKey);

      if (!data) return null;

      return JSON.parse(data);
    } catch (error: any) {
      logger.debug('Cache get failed', { key, error: error.message });
      return null;
    }
  }

  /**
   * Cache response
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
    } catch (error: any) {
      logger.warn('Failed to cache response', { key, error: error.message });
    }
  }

  /**
   * Delete cached response
   */
  async delete(key: string): Promise<void> {
    try {
      const redis = await getRedis();
      await redis.del(`${this.prefix}:${key}`);
    } catch (error: any) {
      logger.warn('Failed to delete cache', { key });
    }
  }

  /**
   * Clear all gateway cache
   */
  async clearAll(): Promise<void> {
    try {
      const redis = await getRedis();
      const keys = await redis.keys(`${this.prefix}:*`);
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error: any) {
      logger.error('Failed to clear gateway cache', { error: error.message });
    }
  }

  /**
   * Generate cache key from request
   */
  static generateKey(req: any): string {
    const method = req.method;
    const path = req.originalUrl;
    const userId = req.user?.id || req.user?.userId || 'anonymous';
    
    return `${method}:${path}:${userId}`;
  }
}

export const responseCache = new ResponseCache();