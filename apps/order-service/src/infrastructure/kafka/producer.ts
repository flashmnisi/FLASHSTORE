import { publish } from '@org/shared-kafka';
import logger from '../../utils/logger';
import { ORDER_TOPICS, ORDER_EVENTS } from './topics';

export class OrderProducer {
  /**
   * ORDER CREATED (Saga start)
   */
  async orderCreated(payload: any) {
    await publish({
      topic: ORDER_TOPICS.ORDERS,
      key: payload.orderId,
      message: {
        event: ORDER_EVENTS.ORDER_CREATED,
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
      topic: ORDER_TOPICS.ORDERS,
      key: payload.orderId,
      message: {
        event: ORDER_EVENTS.ORDER_UPDATED,
        data: payload,
      },
    });

    logger.info('OrderUpdated event published', {
      orderId: payload.orderId,
    });
  }
}