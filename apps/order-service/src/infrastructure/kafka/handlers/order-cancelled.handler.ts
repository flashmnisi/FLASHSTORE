// apps/order-service/src/infrastructure/kafka/handlers/order-cancelled.handler.ts

import logger from '@org/shared-logger';

export class OrderCancelledHandler {
  async handle(message: any) {
    const data = message.data;

    logger.info(
      '🚫 Processing order.cancelled',
      {
        orderId: data.orderId,
      }
    );
  }
}