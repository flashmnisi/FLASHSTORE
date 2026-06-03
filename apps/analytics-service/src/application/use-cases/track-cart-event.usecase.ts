// apps/analytics-service/src/application/use-cases/track-cart-event.usecase.ts

import logger from '@org/shared-logger';

export class TrackCartEventUseCase {
  constructor(
    private readonly analyticsRepository: any
  ) {}

  async execute(data: {
    eventType: string;
    userId: string;
    cartId?: string;
    items?: any[];
  }) {
    try {

      await this.analyticsRepository.saveEvent({
        type: data.eventType,
        entity: 'cart',
        entityId: data.cartId || data.userId,
        metadata: {
          userId: data.userId,
          itemCount: data.items?.length || 0,
          items: data.items || [],
        },
        createdAt: new Date(),
      });

      logger.info('🛒 Cart analytics tracked', {
        userId: data.userId,
        eventType: data.eventType,
      });

    } catch (error: any) {

      logger.error('❌ Failed to track cart event', {
        error: error.message,
        userId: data.userId,
      });

      throw error;
    }
  }
}