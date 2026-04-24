// apps/cart-service/src/infrastructure/kafka/producer.ts

import { publish } from '@org/shared-kafka';
import { CART_TOPICS } from './topics';
import logger from '../../utils/logger';

export class CartProducer {

  async cartUpdated(payload: any) {
    await publish({
      topic: CART_TOPICS.UPDATED,
      message: {
        event: 'cart.updated',
        data: payload,
      },
    });

    logger.info('Cart updated event published');
  }

  async cartCheckedOut(payload: any) {
    await publish({
      topic: CART_TOPICS.CHECKED_OUT,
      message: {
        event: 'cart.checked_out',
        data: payload,
      },
    });

    logger.info('Cart checkout event published');
  }
}