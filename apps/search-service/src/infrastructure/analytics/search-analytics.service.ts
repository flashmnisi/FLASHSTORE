//import { redis } from '../../../../../libs/shared-redis/src';
import { getRedis } from '@org/shared-redis';
import logger from '../../utils/logger';

export class SearchAnalyticsService {
  /**
   * 🔍 Track search query
   */
  async trackSearch(query: string) {
    if (!query) return;

    try {
      await getRedis.zincrby('search:trending', 1, query);
    } catch (error: any) {
      logger.error('Track search failed', { error: error.message });
    }
  }

  /**
   * 👆 Track click
   */
  async trackClick(productId: string) {
    try {
      await redis.zincrby('product:clicks', 1, productId);
    } catch (error: any) {
      logger.error('Track click failed', { error: error.message });
    }
  }

  /**
   * 💰 Track purchase (optional)
   */
  async trackConversion(productId: string) {
    try {
      await redis.zincrby('product:conversions', 1, productId);
    } catch (error: any) {
      logger.error('Track conversion failed', { error: error.message });
    }
  }
}