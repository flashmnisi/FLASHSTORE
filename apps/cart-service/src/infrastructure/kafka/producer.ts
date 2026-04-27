// apps/cart-service/src/infrastructure/kafka/producer.ts

import { publish } from '@org/shared-kafka';
import { TOPICS, EVENTS } from './topics';
import logger from '@org/shared-logger';

export class CartProducer {

  /**
   * Publish cart updated event
   */
  async cartUpdated(payload: any) {
    try {
await publish({
  topic: TOPICS.CART,
  key: payload.userId,
  message: {
    event: EVENTS.CART_UPDATED,
    data: {
      userId: payload.userId,
      items: payload.items,
      totalAmount: payload.totalAmount,
      timestamp: new Date().toISOString(),
    },
  },
});

      logger.info('Cart updated event published', {
        userId: payload.userId,
      });
    } catch (error: any) {
      logger.error('Failed to publish cart.updated event', {
        error: error.message,
        userId: payload.userId,
      });
    }
  }

  /**
   * Publish cart checked out event
   */
  async cartCheckedOut(payload: any) {
    try {
await publish({
  topic: TOPICS.CART,
  key: payload.userId,
  message: {
    event: EVENTS.CART_CHECKED_OUT,
    data: {
      userId: payload.userId,
      orderId: payload.orderId,
      totalAmount: payload.totalAmount,
      timestamp: new Date().toISOString(),
    },
  },
});

      logger.info('Cart checkout event published', {
        userId: payload.userId,
        orderId: payload.orderId,
      });
    } catch (error: any) {
      logger.error('Failed to publish cart.checked_out event', {
        error: error.message,
        userId: payload.userId,
      });
    }
  }
}