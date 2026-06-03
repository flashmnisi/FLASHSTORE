// apps/catalog-service/src/application/use-cases/delete-product.usecase.ts

import { IProductRepository } from '../../domain/repositories/product.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly outboxService: OutboxService
  ) {}

  async execute(productId: string): Promise<boolean> {
    try {
      const deleted = await this.productRepository.delete(productId);

      if (deleted) {
        await this.outboxService.write({
          topic: TOPICS.PRODUCTS,
          event: EVENTS.PRODUCT_DELETED,
          data: { productId },
          key: productId,
        });

        logger.info('🗑️ Product deleted and queued in outbox', { productId });
      }

      return deleted;
    } catch (error: any) {
      logger.error('❌ Failed to delete product', {
        productId,
        error: error.message,
      });
      throw error;
    }
  }
}