import { publish } from '@org/shared-kafka';
import { TOPICS, EVENTS } from './topics';
import logger from '@org/shared-logger';

export class OrderProducer {
  /**
   * ORDER CREATED (Saga start)
   */
  async orderCreated(payload: any) {
    await publish({
      topic: TOPICS.ORDERS,
      key: payload.orderId,
      message: {
        event: EVENTS.ORDER_CREATED,
        data: payload,
      },
    });

    logger.info('OrderCreated event published', {
      orderId: payload.orderId,
    });
  }

  /**
   * ORDER UPDATED (status changes)
   */
  async orderUpdated(payload: any) {
    await publish({
      topic: TOPICS.ORDERS,
      key: payload.orderId,
      message: {
        event: EVENTS.ORDER_UPDATED,
        data: payload,
      },
    });

    logger.info('OrderUpdated event published', {
      orderId: payload.orderId,
    });
  }
}