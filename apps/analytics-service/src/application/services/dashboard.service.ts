// apps/analytics-service/src/application/services/dashboard.service.ts

import { MetricsService } from './metrics.service';
import { metricsCache } from '../../infrastructure/redis/metrics.cache';
import logger from '@org/shared-logger';

export class DashboardService {
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * Get Overview Dashboard (Heavily Cached)
   */
  async getOverview() {
    const cacheKey = 'dashboard:overview';

    const cached = await metricsCache.get(cacheKey);
    if (cached) return cached;

    try {
      const [topProducts, revenueMetrics, userStats] = await Promise.all([
        this.metricsService.getTopProducts(5),
        this.metricsService.getRevenueMetrics(
          new Date(Date.now() - 30 * 86400000),
          new Date()
        ),
        this.getUserStats()
      ]);

      const totalRevenue = revenueMetrics.reduce((sum, item) => sum + (item.value || 0), 0);

      const dashboardData = {
        success: true,
        data: {
          topProducts,
          revenue: {
            total: totalRevenue,
            today: 0,           // Add your logic
            growth: 0,          // Add your logic
          },
          userStats,
          lastUpdated: new Date(),
        },
      };

      await metricsCache.set(cacheKey, dashboardData, 60 * 10);

      return dashboardData;
    } catch (error: any) {
      logger.error('Dashboard overview failed', { error: error.message });
      throw error;
    }
  }

  private async getUserStats() {
    return {
      totalUsers: 0,
      activeToday: 0,
      newThisMonth: 0,
    };
  }

  /**
   * Get Sales Dashboard
   */
  async getSalesDashboard() {
    const cacheKey = 'dashboard:sales';

    const cached = await metricsCache.get(cacheKey);
    if (cached) return cached;

    try {
      const data = {
        totalSales: 0,
        averageOrderValue: 0,
        conversionRate: 0,
      };

      await metricsCache.set(cacheKey, data, 60 * 15);
      return data;
    } catch (error: any) {
      logger.error('Sales dashboard failed', { error: error.message });
      throw error;
    }
  }
}