import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { OrderService } from '../../application/sevices/order.service';
//import { OrderService } from '../../application/services/order.service';   // Fixed typo: sevices → services

export const startOrderConsumer = async (orderService: OrderService) => {
  const groupId = 'order-service-group';

  try {
    const consumer = createConsumer({
      groupId,
      topics: ['flashstore.payments'],
      serviceName:groupId
    });

    await runConsumer(
      consumer,
      {
        groupId,
        topics: ['flashstore.payments'],
        serviceName:groupId
      },
      async (message: any) => {
        const event = message;

        if (!event?.event) {
          logger.warn('Received malformed event', { message });
          return;
        }

        logger.info('📥 Order consumer received event', {
          event: event.event,
          orderId: event.data?.orderId,
        });

        try {
          switch (event.event) {
            /**
             * =============================
             * 💳 PAYMENT SUCCESS → CONFIRM ORDER
             * =============================
             */
            case 'payment.completed':
              await orderService.handlePaymentCompleted(event);
              break;

            /**
             * =============================
             * ❌ PAYMENT FAILED → CANCEL ORDER
             * =============================
             */
            case 'payment.failed':
              await orderService.handlePaymentFailed(event);
              break;

            default:
              logger.warn('Unhandled payment event received', {
                event: event.event,
              });
          }
        } catch (err: any) {
          logger.error('Failed to process payment event', {
            event: event.event,
            orderId: event.data?.orderId,
            error: err.message,
          });
        }
      }
    );

    logger.info('🚀 Order Kafka consumer started successfully', { groupId });

  } catch (error: any) {
    logger.error('Failed to start Order Kafka consumer', {
      error: error.message,
      groupId,
    });
  }
};