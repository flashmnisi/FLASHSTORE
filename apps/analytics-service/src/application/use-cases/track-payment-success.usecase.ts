// apps/analytics-service/src/application/use-cases/track-payment-success.usecase.ts

import { AnalyticsEntity } from '../../domain/entities/analytics.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';
import logger from '@org/shared-logger';

export class TrackPaymentSuccessUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(data: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    timestamp?: Date;
  }) {
    try {
      const event = new AnalyticsEntity(
        '',
        'payment.succeeded',
        data.userId,
        undefined,
        data.orderId,
        {
          paymentId: data.paymentId,
          amount: data.amount,
        },
        data.timestamp || new Date()
      );

      await this.analyticsRepository.saveEvent(event);

      logger.info('Tracked payment success', { 
        orderId: data.orderId, 
        amount: data.amount 
      });

      return event;
    } catch (error: any) {
      logger.error('Failed to track payment success', {
        orderId: data.orderId,
        error: error.message,
      });
      throw error;
    }
  }
}