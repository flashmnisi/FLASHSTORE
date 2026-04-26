// analytics/click-tracker.ts

//import { redis } from '../config/database'; // or redis config
import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';
//import logger from '../utils/logger';

const CLICK_TTL = 60 * 60 * 24; // 24h

export class ClickTracker {
  /**
   * 👆 Track product click
   */
  async trackClick(data: {
    productId: string;
    query: string;
    userId?: string;
  }) {
    try {
      const key = this.buildKey(data.query);

      await getRedis.zincrby(key, 1, data.productId);

      await redis.expire(key, CLICK_TTL);

      logger.info('Click tracked', {
        productId: data.productId,
        query: data.query,
      });
    } catch (error: any) {
      logger.error('Click tracking failed', {
        error: error.message,
      });
    }
  }

  /**
   * 🔥 Get top clicked products for query
   */
  async getTopClicks(query: string, limit = 10) {
    const key = this.buildKey(query);

    return redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
  }

  /**
   * 🔑 Redis key
   */
  private buildKey(query: string) {
    return `clicks:${query.toLowerCase().trim()}`;
  }
}

export const clickTracker = new ClickTracker();