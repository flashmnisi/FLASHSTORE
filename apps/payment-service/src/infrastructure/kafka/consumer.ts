// apps/payment-service/src/infrastructure/kafka/consumer.ts

import {
  createConsumer,
  runConsumer,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { PaymentService } from '../../application/services/payment.service';

export class PaymentConsumer {

  constructor(
    private readonly paymentService: PaymentService
  ) {}

  async start() {

    const groupId =
      'payment-service-group';

    const consumer = createConsumer({
      groupId,

      topics: [
        TOPICS.ORDERS,
      ],

      serviceName: 'payment-service',
    });

    await runConsumer(
      consumer,
      {
        groupId,

        topics: [
          TOPICS.ORDERS,
        ],

        serviceName: 'payment-service',
      },

      async (event: any) => {
        try {

          const eventType =
            event?.event;

          const data =
            event?.data || {};

          if (!eventType) {

            logger.warn(
              '⚠️ Malformed payment event received',
              { event }
            );

            return;
          }

          logger.info(
            '📥 Payment service received event',
            {
              eventType,
              orderId: data.orderId,
            }
          );

          switch (eventType) {

            /**
             * ===================================
             * 📦 ORDER CREATED
             * ===================================
             */

            case EVENTS.ORDER_CREATED:

              await this.handleOrderCreated(data);

              break;

            /**
             * ===================================
             * ❌ ORDER CANCELLED
             * ===================================
             */

            case EVENTS.ORDER_CANCELLED:

              await this.handleOrderCancelled(
                data.orderId
              );

              break;

            /**
             * ===================================
             * 🎉 ORDER COMPLETED
             * ===================================
             */

            case EVENTS.ORDER_COMPLETED:

              logger.info(
                '🎉 Order completed received',
                {
                  orderId: data.orderId,
                }
              );

              break;

            default:

              logger.warn(
                '⚠️ Unknown event in payment-service',
                {
                  eventType,
                }
              );
          }

        } catch (error: any) {

          logger.error(
            '❌ Failed to process payment event',
            {
              error: error.message,
              stack: error.stack,
            }
          );

          throw error;
        }
      }
    );

    logger.info(
      '✅ Payment Consumer started successfully'
    );
  }

  /**
   * ===================================
   * CREATE PAYMENT FROM ORDER
   * ===================================
   */

  private async handleOrderCreated(
    data: any
  ) {
    try {

      logger.info(
        '💳 Creating payment from order',
        {
          orderId: data.orderId,
          amount: data.totalAmount,
        }
      );

      await this.paymentService
        .createPaymentFromOrder({
          orderId: data.orderId,

          userId: data.userId,

          amount: data.totalAmount,

          currency:
            data.currency || 'ZAR',
        });

      logger.info(
        '✅ Payment created from order',
        {
          orderId: data.orderId,
        }
      );

    } catch (error: any) {

      logger.error(
        '❌ Failed to create payment from order',
        {
          orderId: data.orderId,
          error: error.message,
        }
      );

      throw error;
    }
  }

  /**
   * ===================================
   * CANCEL PENDING PAYMENT
   * ===================================
   */

  private async handleOrderCancelled(
    orderId: string
  ) {
    try {

      logger.info(
        '🚫 Cancelling pending payment',
        {
          orderId,
        }
      );

      // Optional future implementation
      // await this.paymentService.cancelPendingPayment(orderId);

    } catch (error: any) {

      logger.error(
        '❌ Failed to cancel payment',
        {
          orderId,
          error: error.message,
        }
      );
    }
  }
}