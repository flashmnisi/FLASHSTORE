import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';

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
      const redis = await getRedis();

      const queryKey = this.buildQueryKey(data.query);
      const productKey = this.buildProductKey(data.query);

      // 🔥 1. Track product popularity for this query
      await redis.zIncrBy(productKey, 1, data.productId);
      await redis.expire(productKey, CLICK_TTL);

      // 🔥 2. ALSO feed trending system
      await redis.zIncrBy('search:trending:24h', 3, queryKey);

      logger.info('Click tracked', {
        productId: data.productId,
        query: data.query,
      });
    } catch (error: any) {
      logger.error('Click tracking failed', {
        productId: data.productId,
        query: data.query,
        error: error.message,
      });
    }
  }

  /**
   * 🔥 Top products for a query
   */
  async getTopClicks(query: string, limit = 10) {
    try {
      const redis = await getRedis();
      const key = this.buildProductKey(query);

      return await redis.zRange(key, 0, limit - 1, {
        REV: true,
      });
    } catch (error: any) {
      logger.error('Failed to get top clicks', {
        query,
        error: error.message,
      });
      return [];
    }
  }

  private buildProductKey(query: string) {
    return `clicks:products:${this.normalize(query)}`;
  }

  private buildQueryKey(query: string) {
    return this.normalize(query);
  }

  private normalize(query: string) {
    return encodeURIComponent(query.toLowerCase().trim());
  }
}

export const clickTracker = new ClickTracker();
