// apps/analytics-service/src/application/use-cases/track-order-created.usecase.ts

import { AnalyticsEntity } from '../../domain/entities/analytics.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';
import logger from '@org/shared-logger';

export class TrackOrderCreatedUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(data: {
    orderId: string;
    userId: string;
    totalAmount: number;
    itemCount: number;
    timestamp?: Date;
  }) {
    try {
      const event = new AnalyticsEntity(
        '',
        'order.created',
        data.userId,
        undefined,
        data.orderId,
        {
          totalAmount: data.totalAmount,
          itemCount: data.itemCount,
        },
        data.timestamp || new Date()
      );

      await this.analyticsRepository.saveEvent(event);

      logger.info('Tracked order created', { 
        orderId: data.orderId, 
        userId: data.userId 
      });

      return event;
    } catch (error: any) {
      logger.error('Failed to track order created', {
        orderId: data.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}