// apps/search-service/src/analytics/search.analytics.service.ts

import logger from '@org/shared-logger';
import { getRedis } from '@org/shared-redis';

export class SearchAnalyticsService {
  /**
   * 🔍 Track search query (for trending searches)
   */
  async trackSearch(query: string) {
    if (!query?.trim()) return;

    try {
      const redis = await getRedis();
      await redis.zIncrBy('search:trending', 1, query.toLowerCase().trim());

      logger.info('Search query tracked', { query });
    } catch (error: any) {
      logger.error('Failed to track search query', {
        query,
        error: error.message,
      });
    }
  }

  /**
   * 👆 Track product click (global)
   */
  async trackClick(productId: string) {
    try {
      const redis = await getRedis();
      await redis.zIncrBy('product:clicks', 1, productId);

      logger.info('Product click tracked', { productId });
    } catch (error: any) {
      logger.error('Failed to track product click', {
        productId,
        error: error.message,
      });
    }
  }

  /**
   * 💰 Track purchase / conversion
   */
  async trackConversion(productId: string) {
    try {
      const redis = await getRedis();
      await redis.zIncrBy('product:conversions', 1, productId);

      logger.info('Product conversion tracked', { productId });
    } catch (error: any) {
      logger.error('Failed to track conversion', {
        productId,
        error: error.message,
      });
    }
  }

  /**
   * Get trending searches
   */
  async getTrendingSearches(limit = 10): Promise<string[]> {
    try {
      const redis = await getRedis();
      return await redis.zRange('search:trending', 0, limit - 1);
    } catch (error: any) {
      logger.error('Failed to get trending searches', { error: error.message });
      return [];
    }
  }
}

export const searchAnalytics = new SearchAnalyticsService();
