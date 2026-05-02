// apps/analytics-service/src/domain/repositories/analytics.repository.ts

import { AnalyticsEntity } from '../entities/analytics.entity';
import { MetricEntity } from '../entities/metric.entity';

export interface IAnalyticsRepository {
  /**
   * Save a raw analytics event
   */
  saveEvent(event: AnalyticsEntity): Promise<AnalyticsEntity>;

  /**
   * Find events by user
   */
  findByUserId(userId: string, limit?: number): Promise<AnalyticsEntity[]>;

  /**
   * Find events by type
   */
  findByEventType(eventType: string, limit?: number): Promise<AnalyticsEntity[]>;

  /**
   * Find events by date range
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<AnalyticsEntity[]>;

  /**
   * Get aggregated metrics
   */
  getDailyMetrics(date: Date): Promise<MetricEntity[]>;
  getRevenueMetrics(startDate: Date, endDate: Date): Promise<MetricEntity[]>;
  getTopProducts(limit?: number): Promise<MetricEntity[]>;

  /**
   * Get user engagement stats
   */
  getUserEngagement(userId: string): Promise<MetricEntity[]>;

  /**
   * Count events by type
   */
  countByEventType(eventType: string, startDate?: Date, endDate?: Date): Promise<number>;
}