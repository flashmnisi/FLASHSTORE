// apps/analytics-service/src/domain/repositories/analytics.repository.ts

import { AnalyticsEntity } from '../entities/analytics.entity';
import { MetricEntity } from '../entities/metric.entity';

export interface IAnalyticsRepository {
  /**
   * Core Event Storage
   */
  saveEvent(event: AnalyticsEntity): Promise<AnalyticsEntity>;

  /**
   * Query Methods
   */
  findByUserId(userId: string, limit?: number): Promise<AnalyticsEntity[]>;
  findByEventType(eventType: string, limit?: number): Promise<AnalyticsEntity[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsEntity[]>;

  /**
   * Metrics & Aggregations
   */
  updateDailyStats(stats: {
    date: Date;
    totalRevenue: number;
    orderCount: number;
    itemCount?: number;
  }): Promise<void>;

  getDailyMetrics(date: Date): Promise<MetricEntity[]>;
  getRevenueMetrics(startDate: Date, endDate: Date): Promise<MetricEntity[]>;
  getTopProducts(limit?: number): Promise<MetricEntity[]>;

  /**
   * User Analytics
   */
  getUserEngagement(userId: string): Promise<MetricEntity[]>;
  countByEventType(
    eventType: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number>;

  /**
   * Optional: General stats
   */
  getDailyStats(date: Date): Promise<any>;
}

export default IAnalyticsRepository;