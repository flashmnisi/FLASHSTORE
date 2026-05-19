// apps/order-service/src/infrastructure/kafka/producer.ts

import { publish ,TOPICS, EVENTS } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export class OrderProducer {
  async orderCreated(payload: any) {
    try {
      await publish({
        topic: TOPICS.ORDERS,
        key: payload.orderId || payload.id,
        message: {
          event: EVENTS.ORDER_CREATED,
          data: payload,
          timestamp: new Date().toISOString(),
        },
      });

      logger.info('✅ OrderCreated event published', { orderId: payload.orderId });
    } catch (error: any) {
      logger.error('Failed to publish order.created event', {
        orderId: payload.orderId,
        error: error.message,
      });
    }
  }

  async orderUpdated(payload: any) {
    try {
      await publish({
        topic: TOPICS.ORDERS,
        key: payload.orderId || payload.id,
        message: {
          event: EVENTS.ORDER_UPDATED,
          data: payload,
          timestamp: new Date().toISOString(),
        },
      });

      logger.info('✅ OrderUpdated event published', { orderId: payload.orderId });
    } catch (error: any) {
      logger.error('Failed to publish order.updated event', error);
    }
  }
}