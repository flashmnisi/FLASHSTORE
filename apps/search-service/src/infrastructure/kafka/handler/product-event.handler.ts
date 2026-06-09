// apps/search-service/src/infrastructure/kafka/handlers/product-event.handler.ts

import logger from '@org/shared-logger';

import { handleProductEvent } from '../handler/product-index.handler';

export class ProductEventHandler {
  async handle(message: any) {
    const data = message.data;

    await handleProductEvent(message);

    logger.info(
      '✅ Product search index updated',
      {
        event: message.event,
        productId: data.productId,
      }
    );
  }
}