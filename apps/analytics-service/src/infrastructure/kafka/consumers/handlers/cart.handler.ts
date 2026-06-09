// apps/analytics-service/src/infrastructure/kafka/handlers/cart.handler.ts

import logger from '@org/shared-logger';
import { EVENTS } from '@org/shared-kafka';

export class CartHandler {
  async handle(message: any) {
    try {
      const eventType =
        message.event ||
        message.type;

      const data =
        message.data ||
        message.payload ||
        {};

      switch (eventType) {

        case EVENTS.CART_UPDATED:

          logger.info('🛒 Cart updated', {
            userId: data.userId,
            itemCount: data.items?.length || 0,
          });

          break;

        case EVENTS.CART_CLEARED:

          logger.info('🗑️ Cart cleared', {
            userId: data.userId,
          });

          break;

        case EVENTS.CART_CHECKED_OUT:

          logger.info('🛍️ Cart checked out', {
            userId: data.userId,
            orderId: data.orderId,
            totalAmount: data.totalAmount,
          });

          break;

        default:

          logger.warn(
            '⚠️ Unknown cart event received',
            {
              eventType,
              userId: data.userId,
            }
          );
      }

    } catch (error: any) {

      logger.error(
        '❌ Error in CartHandler',
        {
          eventType: message?.event,
          error: error.message,
        }
      );
    }
  }
}