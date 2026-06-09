// apps/order-service/src/infrastructure/kafka/handlers/order-created.handler.ts

import logger from '@org/shared-logger';

export class OrderCreatedHandler {
  async handle(message: any) {
    const data = message.data;

    logger.info(
      '📦 Processing order.created',
      {
        orderId: data.orderId,
        userId: data.userId,
        totalAmount: data.totalAmount,
      }
    );

    // Future:
    // analytics
    // notifications
    // auditing
  }
}