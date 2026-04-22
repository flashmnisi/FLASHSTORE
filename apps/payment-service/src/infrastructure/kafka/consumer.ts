// apps/payment-service/src/infrastructure/kafka/consumer.ts

import { createConsumer, runConsumer } from '@org/shared-kafka';
import { PAYMENT_TOPICS, PAYMENT_EVENTS } from './topics';
import logger from '@org/shared-logger';
import { PaymentService } from '../../application/services/payment.service';

export class PaymentConsumer {
  private consumer = createConsumer({
    groupId: 'payment-service-group',
    topics: [PAYMENT_TOPICS.ORDERS],
  });

  constructor(private readonly paymentService: PaymentService) {}

  async start() {
    await runConsumer(
      this.consumer,
      {
        groupId: 'payment-service-group',
        topics: [PAYMENT_TOPICS.ORDERS],
      },
      async (message: any) => {
        const { event, data } = message;

        switch (event) {

          case PAYMENT_EVENTS.ORDER_CREATED:
            logger.info('🧾 Received order.created event', {
              orderId: data.orderId,
            });

            // OPTIONAL: auto-create payment or prepare payment
            await this.handleOrderCreated(data);
            break;

          default:
            logger.warn('Unknown event received in payment-service', {
              event,
            });
        }
      }
    );
  }

  private async handleOrderCreated(data: any) {
    try {
      // You can:
      // 1. Pre-create payment record
      // 2. Or trigger payment flow
      logger.info('Preparing payment for order', {
        orderId: data.orderId,
        userId: data.userId,
      });

      // Optional: call paymentService here
      // await this.paymentService.preparePayment(data);

    } catch (error: any) {
      logger.error('Failed to handle order.created', {
        error: error.message,
      });
    }
  }
}