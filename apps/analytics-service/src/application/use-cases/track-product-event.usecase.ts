// apps/analytics-service/src/application/use-cases/track-product-event.usecase.ts

import logger from '@org/shared-logger';

export class TrackProductEventUseCase {
  constructor(
    private readonly analyticsRepository: any
  ) {}

  async execute(data: {
    eventType: string;
    productId: string;
    name?: string;
    categoryId?: string;
    price?: number;
  }) {
    try {
      await this.analyticsRepository.saveEvent({
        type: data.eventType,
        entity: 'product',
        entityId: data.productId,
        metadata: {
          name: data.name,
          categoryId: data.categoryId,
          price: data.price,
        },
        createdAt: new Date(),
      });

      logger.info('📱 Product analytics tracked', {
        productId: data.productId,
        eventType: data.eventType,
      });

    } catch (error: any) {

      logger.error('❌ Failed to track product event', {
        error: error.message,
        productId: data.productId,
      });

      throw error;
    }
  }
}