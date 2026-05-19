// apps/analytics-service/src/infrastructure/schedulers/aggregation.job.ts

import cron from 'node-cron';
import logger from '@org/shared-logger';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';

export class AggregationJob {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  /**
   * Start daily aggregation job (runs at midnight)
   */
  start() {
    // Run every day at 00:30 AM
    cron.schedule('30 0 * * *', async () => {
      await this.runDailyAggregation();
    });

    logger.info('✅ Aggregation Job scheduled (daily at 00:30)');
  }

  private async runDailyAggregation() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      logger.info('Starting daily analytics aggregation', { date: yesterday });

      // Aggregate various metrics
const [revenue, signups, logins, orders, views] = await Promise.all([
  this.analyticsRepository.getRevenueMetrics(yesterday, new Date()),
  this.analyticsRepository.countByEventType('user.registered', yesterday),
  this.analyticsRepository.countByEventType('user.logged_in', yesterday),
  this.analyticsRepository.countByEventType('order.created', yesterday),
  this.analyticsRepository.countByEventType('product.viewed', yesterday),
]);

const revenueValue = revenue.length > 0 ? revenue[0].value : 0;

logger.info('Daily aggregation completed', {
  date: yesterday.toISOString().split('T')[0],
  revenue: revenueValue,
  newUsers: signups,
  logins,
  orders,
  productViews: views,
});

    } catch (error: any) {
      logger.error('Daily aggregation job failed', {
        error: error.message,
      });
    }
  }
}

