// apps/order-service/src/infrastructure/kafka/handlers/order-updated.handler.ts

import logger from '@org/shared-logger';

export class OrderUpdatedHandler {
  async handle(message: any) {
    const data = message.data;

    logger.info(
      '📝 Processing order.updated',
      {
        orderId: data.orderId,
      }
    );
  }
}