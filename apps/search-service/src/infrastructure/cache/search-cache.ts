// apps/search-service/src/infrastructure/cache/search.cache.ts

import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';

const CACHE_TTL = 60 * 5; // 5 minutes

export class SearchCache {
  /**
   * 🔥 Get cached search result
   */
  async get(key: string): Promise<any | null> {
    if (!key) return null;

    try {
      const redis = await getRedis();
      const cached = await redis.get(this.formatKey(key));

      if (cached) {
        logger.debug('⚡ Cache hit', { key });  
        return JSON.parse(cached);
      }

      return null;
    } catch (error: any) {
      logger.warn('Failed to read from search cache', {
        key,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * 🔥 Store search result in cache
   */
  async set(key: string, value: any): Promise<void> {
    if (!key || value === undefined) return;

    try {
      const redis = await getRedis();

      await redis.set(
        this.formatKey(key),
        JSON.stringify(value),
        { EX: CACHE_TTL }
      );

      logger.debug('💾 Search result cached', { key });
    } catch (error: any) {
      logger.warn('Failed to write to search cache', {
        key,
        error: error.message,
      });
    }
  }

  /**
   * ❌ Invalidate specific search cache
   */
  async invalidate(key: string): Promise<void> {
    if (!key) return;

    try {
      const redis = await getRedis();
      await redis.del(this.formatKey(key));

      logger.info('🗑️ Search cache invalidated', { key });
    } catch (error: any) {
      logger.warn('Failed to invalidate search cache', {
        key,
        error: error.message,
      });
    }
  }

  /**
   * 🔑 Normalize cache key (more robust)
   */
  private formatKey(key: string): string {
    return `search:${key
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ':')
      .replace(/[^a-z0-9:]/g, '')}`;  
  }

  /**
   * Clear all search cache (use with caution)
   */
  async clearAll(): Promise<void> {
    logger.warn('clearAll() is intentionally not implemented for safety');
  }
}

// Singleton export
export const searchCache = new SearchCache();