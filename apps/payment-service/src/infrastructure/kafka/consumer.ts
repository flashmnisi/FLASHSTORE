// apps/payment-service/src/infrastructure/kafka/consumer.ts

import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { PaymentService } from '../../application/services/payment.service';
import { EVENTS, TOPICS } from './topics';

export class PaymentConsumer {
  constructor(private readonly paymentService: PaymentService) {}

  async start() {
    const consumer = createConsumer({
      groupId: 'payment-service-group',
      topics: [TOPICS.ORDERS],
      serviceName: 'payment-service',
    });

    await runConsumer(
      consumer,
      {
        groupId: 'payment-service-group',
        topics: [TOPICS.ORDERS],
        serviceName: 'payment-service',
      },
      async (event: any) => {
        try {
          const { event: eventType, data } = event;

          switch (eventType) {
            case EVENTS.ORDER_CREATED:
              logger.info('🧾 Received order.created event from Order Service', {
                orderId: data.orderId,
                userId: data.userId,
                totalAmount: data.totalAmount,
              });

              await this.handleOrderCreated(data);
              break;

            case EVENTS.ORDER_CANCELLED:
              logger.info('Received order.cancelled event', {
                orderId: data.orderId,
              });
              await this.handleOrderCancelled(data.orderId);
              break;

            default:
              logger.warn('Unknown event received in payment consumer', {
                event: eventType,
              });
          }
        } catch (error: any) {
          logger.error('Failed to process event in payment consumer', {
            error: error.message,
            eventType: event?.event,
          });
          // Re-throw so shared-kafka can handle retry + DLQ
          throw error;
        }
      }
    );

    logger.info('✅ Payment Consumer started and running');
  }

  /**
   * Handle new order → trigger payment creation (Saga step)
   */
  private async handleOrderCreated(data: any) {
    try {
      logger.info('💳 Preparing payment for new order', {
        orderId: data.orderId,
        userId: data.userId,
        amount: data.totalAmount,
      });

      await this.paymentService.createPaymentFromOrder({
        orderId: data.orderId,
        userId: data.userId,
        amount: data.totalAmount,
        currency: data.currency || 'ZAR',
      });

    } catch (error: any) {
      logger.error('Failed to handle order.created event', {
        orderId: data.orderId,
        error: error.message,
      });
      throw error; // Let shared-kafka retry + DLQ handle it
    }
  }

  /**
   * Handle order cancellation → cancel pending payment if exists
   */
  private async handleOrderCancelled(orderId: string) {
    try {
      logger.info('Order cancelled, checking for pending payment', { orderId });

      // TODO: Implement this when you add cancel logic in PaymentService
      // await this.paymentService.cancelPendingPayment(orderId);

    } catch (error: any) {
      logger.error('Failed to handle order.cancelled event', {
        orderId,
        error: error.message,
      });
      // Do not re-throw here if you don't want to trigger DLQ for cancellations
    }
  }
}