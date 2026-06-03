// apps/analytics-service/src/application/use-cases/track-inventory-event.usecase.ts

import logger from '@org/shared-logger';

export class TrackInventoryEventUseCase {
  constructor(
    private readonly analyticsRepository: any
  ) {}

  async execute(data: {
    productId: string;
    quantity: number;
  }) {
    try {

      await this.analyticsRepository.saveEvent({
        type: 'inventory.stock.updated',
        entity: 'inventory',
        entityId: data.productId,
        metadata: {
          quantity: data.quantity,
        },
        createdAt: new Date(),
      });

      logger.info('📦 Inventory analytics tracked', {
        productId: data.productId,
        quantity: data.quantity,
      });

    } catch (error: any) {

      logger.error('❌ Failed to track inventory event', {
        error: error.message,
        productId: data.productId,
      });

      throw error;
    }
  }
}