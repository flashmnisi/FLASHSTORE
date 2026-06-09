// apps/order-service/src/infrastructure/kafka/handlers/order-completed.handler.ts

import logger from '@org/shared-logger';

export class OrderCompletedHandler {
  async handle(message: any) {
    const data = message.data;

    logger.info(
      '🎉 Processing order.completed',
      {
        orderId: data.orderId,
      }
    );
  }
}