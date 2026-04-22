import { redis } from '../../config/redis';
import logger from '../../utils/logger';

const TTL = 60 * 5; // 5 minutes cache

export class SearchCache {
  /**
   * 🔥 Get cached search result
   */
  async get(key: string) {
    try {
      const cached = await redis.get(this.formatKey(key));

      if (cached) {
        logger.info('⚡ Cache hit', { key });
        return JSON.parse(cached);
      }

      return null;
    } catch (error: any) {
      logger.error('Cache read error', { error: error.message });
      return null;
    }
  }

  /**
   * 🔥 Store search result in cache
   */
  async set(key: string, value: any) {
    try {
      await redis.set(
        this.formatKey(key),
        JSON.stringify(value),
        'EX',
        TTL
      );

      logger.info('💾 Cache stored', { key });
    } catch (error: any) {
      logger.error('Cache write error', { error: error.message });
    }
  }

  /**
   * ❌ Clear specific search cache
   */
  async invalidate(key: string) {
    try {
      await redis.del(this.formatKey(key));
    } catch (error: any) {
      logger.error('Cache invalidation error', { error: error.message });
    }
  }

  /**
   * 🔑 Normalize cache key
   */
  private formatKey(key: string) {
    return `search:${key.toLowerCase().trim()}`;
  }
}