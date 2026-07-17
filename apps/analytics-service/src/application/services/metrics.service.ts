// apps/analytics-service/src/application/services/metrics.service.ts

import { metricsCache } from '../../infrastructure/redis/metrics.cache';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';
import logger from '@org/shared-logger';
import { MetricEntity } from '../../domain/entities/metric.entity';

export class MetricsService {
  constructor(private readonly repository: IAnalyticsRepository) {}

  /**
   * Get Daily Metrics with Cache
   */
  async getDailyMetrics(date: Date) {
    const cacheKey = `daily:${date.toISOString().split('T')[0]}`;

    // Try cache first
    const cached = await metricsCache.get(cacheKey);
    if (cached) return cached;

    try {
      const metrics = await this.repository.getDailyMetrics(date);

      // Cache for 1 hour
      await metricsCache.set(cacheKey, metrics, 60 * 60);

      return metrics;
    } catch (error: any) {
      logger.error('Failed to get daily metrics', { date, error: error.message });
      throw error;
    }
  }

  /**
   * Get Top Products with Cache
   */
  async getTopProducts(limit = 10) {
    const cacheKey = `top-products:${limit}`;

    const cached = await metricsCache.get(cacheKey);
    if (cached) return cached;

    try {
      const topProducts = await this.repository.getTopProducts(limit);

      await metricsCache.set(cacheKey, topProducts, 60 * 30); // 30 minutes

      return topProducts;
    } catch (error: any) {
      logger.error('Failed to get top products', { limit, error: error.message });
      throw error;
    }
  }

  /**
   * Get Revenue Metrics with Cache
   */
async getRevenueMetrics(
  startDate: Date,
  endDate: Date
): Promise<MetricEntity[]> {     // Changed return type

  const cacheKey = `revenue:${startDate.toISOString().split('T')[0]}:${endDate.toISOString().split('T')[0]}`;

  const cached = await metricsCache.get<MetricEntity[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const revenue = await this.repository.getRevenueMetrics(startDate, endDate);

  await metricsCache.set(cacheKey, revenue, 60 * 60);

  return revenue;
}

  /**
   * Get User Engagement
   */
  async getUserEngagement(userId: string) {
    const cacheKey = `user-engagement:${userId}`;

    const cached = await metricsCache.get(cacheKey);
    if (cached) return cached;

    try {
      const engagement = await this.repository.getUserEngagement(userId);

      await metricsCache.set(cacheKey, engagement, 60 * 15); // 15 minutes

      return engagement;
    } catch (error: any) {
      logger.error('Failed to get user engagement', { userId, error: error.message });
      throw error;
    }
  }
}