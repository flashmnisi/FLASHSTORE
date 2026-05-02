// apps/analytics-service/src/application/use-cases/track-product-view.usecase.ts

import { AnalyticsEntity } from '../../domain/entities/analytics.entity';
import { IAnalyticsRepository } from '../../domain/repositories/analytics.repository';
import logger from '@org/shared-logger';

export class TrackProductViewUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(data: {
    productId: string;
    userId?: string;
    timestamp?: Date;
  }) {
    try {
      const event = new AnalyticsEntity(
        '',
        'product.viewed',
        data.userId,
        data.productId,
        undefined,
        {},
        data.timestamp || new Date()
      );

      await this.analyticsRepository.saveEvent(event);

      logger.debug('Tracked product view', { 
        productId: data.productId, 
        userId: data.userId 
      });

      return event;
    } catch (error: any) {
      logger.error('Failed to track product view', {
        productId: data.productId,
        error: error.message,
      });
      throw error;
    }
  }
}
