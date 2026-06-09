// apps/analytics-service/src/infrastructure/kafka/handlers/product.handler.ts

import logger from '@org/shared-logger';
import { EVENTS } from '@org/shared-kafka';

export class ProductHandler {
  async handle({
    event,
    data,
  }: {
    event: string;
    data: any;
  }) {
    try {
      switch (event) {

        case EVENTS.PRODUCT_CREATED:
          logger.info('📱 New product added', {
            productId: data.productId || data.id,
            name: data.name,
            categoryId: data.categoryId,
            price: data.price,
          });
          break;

        case EVENTS.PRODUCT_UPDATED:
          logger.info('📝 Product updated', {
            productId: data.productId || data.id,
            name: data.name,
          });
          break;

        case EVENTS.PRODUCT_DELETED:
          logger.info('🗑️ Product deleted', {
            productId: data.productId || data.id,
          });
          break;

        case EVENTS.PRODUCT_VIEWED:
          logger.info('👀 Product viewed', {
            productId: data.productId,
            userId: data.userId,
          });
          break;

        default:
          logger.warn(
            '⚠️ Unknown product event received',
            {
              event,
              productId: data.productId || data.id,
            }
          );
      }
    } catch (error: any) {
      logger.error(
        '❌ ProductHandler failed',
        {
          event,
          error: error.message,
          stack: error.stack,
        }
      );
    }
  }
}