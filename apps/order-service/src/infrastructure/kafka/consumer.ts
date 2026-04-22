import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '../../utils/logger';
import { OrderService } from '../../application/services/order.service';

export const startOrderConsumer = async (orderService: OrderService) => {
  const consumer = createConsumer({
    groupId: 'order-service-group',
    topics: ['flashstore.payments'],
  });

  await runConsumer(
    consumer,
    {
      groupId: 'order-service-group',
      topics: ['flashstore.payments'],
    },
    async (message) => {
      const event = message;

      if (!event?.event) return;

      logger.info('📥 Order consumer received event', {
        event: event.event,
      });

      switch (event.event) {
        /**
         * =============================
         * 💳 PAYMENT SUCCESS → CONFIRM ORDER
         * =============================
         */
        case 'payment.completed': {
          await orderService.handlePaymentCompleted(event);
          break;
        }

        /**
         * =============================
         * ❌ PAYMENT FAILED → CANCEL ORDER
         * =============================
         */
        case 'payment.failed': {
          await orderService.handlePaymentFailed(event);
          break;
        }

        default:
          logger.info('Unhandled payment event', {
            event: event.event,
          });
      }
    }
  );

  logger.info('🚀 Order Kafka consumer started');
};