// apps/analytics-service/src/application/use-cases/track-order-created.usecase.ts

import { AnalyticsEntity } from '../../domain/entities/analytics.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';
import logger from '@org/shared-logger';

export interface TrackOrderCreatedInput {
  orderId: string;
  userId: string;
  totalAmount: number;
  itemCount: number;
  createdAt?: Date | string;
  currency?: string;
}

export class TrackOrderCreatedUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(input: TrackOrderCreatedInput): Promise<void> {
    try {
      const { 
        orderId, 
        userId, 
        totalAmount, 
        itemCount, 
        createdAt = new Date(),
        currency = 'ZAR' 
      } = input;

      const analyticsEvent = new AnalyticsEntity(
        '', // ID will be generated in entity or repository
        'order.created',
        userId,
        undefined,           // productId (not needed for order level)
        orderId,
        {
          totalAmount,
          itemCount,
          currency,
        },
        new Date(createdAt)
      );

      await this.analyticsRepository.saveEvent(analyticsEvent);

      // Optional: Update daily/monthly aggregates
      await this.analyticsRepository.updateDailyStats?.({
        date: new Date(createdAt),
        totalRevenue: totalAmount,
        orderCount: 1,
        itemCount,
      });

      logger.info('✅ Order tracked in analytics', {
        orderId,
        userId,
        totalAmount,
        itemCount,
        currency,
      });

    } catch (error: any) {
      logger.error('❌ Failed to track order in analytics', {
        orderId: input.orderId,
        userId: input.userId,
        totalAmount: input.totalAmount,
        error: error.message,
      });

      // Do NOT re-throw → prevent consumer crash
    }
  }
}