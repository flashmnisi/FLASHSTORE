// apps/analytics-service/src/infrastructure/kafka/handlers/order.handler.ts

import logger from '@org/shared-logger';
import { EVENTS } from '@org/shared-kafka';

export class OrderHandler {
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

        case EVENTS.ORDER_CREATED:

          logger.info('📦 New order tracked', {
            orderId: data.orderId,
            userId: data.userId,
            totalAmount: data.totalAmount,
            itemCount: data.items?.length || 0,
          });

          break;

        case EVENTS.ORDER_COMPLETED:

          logger.info('🎉 Order completed tracked', {
            orderId: data.orderId,
            userId: data.userId,
          });

          break;

        case EVENTS.ORDER_CANCELLED:

          logger.info('🚫 Order cancelled tracked', {
            orderId: data.orderId,
            userId: data.userId,
            reason: data.reason,
          });

          break;

        case EVENTS.ORDER_UPDATED:

          logger.info('📝 Order updated tracked', {
            orderId: data.orderId,
            userId: data.userId,
          });

          break;

        case EVENTS.ORDER_STATUS_UPDATED:

          logger.info('🔄 Order status updated tracked', {
            orderId: data.orderId,
            userId: data.userId,
            previousStatus: data.previousStatus,
            newStatus: data.newStatus,
          });

          break;

        default:

          logger.warn(
            '⚠️ Unknown order event received',
            {
              eventType,
              orderId: data.orderId,
            }
          );
      }

    } catch (error: any) {

      logger.error(
        '❌ Error in OrderHandler',
        {
          eventType: message?.event,
          error: error.message,
        }
      );
    }
  }
}