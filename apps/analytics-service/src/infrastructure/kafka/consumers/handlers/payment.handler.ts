// apps/analytics-service/src/infrastructure/kafka/handlers/payment.handler.ts

import logger from '@org/shared-logger';
import { EVENTS } from '@org/shared-kafka';

export class PaymentHandler {
  async handle({
    event,
    data,
  }: {
    event: string;
    data: any;
  }) {
    try {
      switch (event) {

        case EVENTS.PAYMENT_COMPLETED:
        case EVENTS.PAYMENT_SUCCEEDED:

          logger.info(
            '💳 Payment successful tracked',
            {
              paymentId: data.paymentId,
              orderId: data.orderId,
              userId: data.userId,
              amount: data.amount,
              currency: data.currency,
            }
          );

          break;

        case EVENTS.PAYMENT_FAILED:

          logger.warn(
            '❌ Payment failed tracked',
            {
              paymentId: data.paymentId,
              orderId: data.orderId,
              userId: data.userId,
              reason: data.reason,
            }
          );

          break;

        case EVENTS.PAYMENT_REFUNDED:

          logger.info(
            '↩️ Payment refunded tracked',
            {
              paymentId: data.paymentId,
              orderId: data.orderId,
              amount: data.amount,
            }
          );

          break;

        case EVENTS.PAYMENT_INITIATED:

          logger.info(
            '💰 Payment initiated tracked',
            {
              paymentId: data.paymentId,
              orderId: data.orderId,
              amount: data.amount,
            }
          );

          break;

        default:

          logger.warn(
            '⚠️ Unknown payment event received',
            {
              event,
              paymentId: data.paymentId,
            }
          );
      }

    } catch (error: any) {

      logger.error(
        '❌ PaymentHandler failed',
        {
          event,
          error: error.message,
          stack: error.stack,
        }
      );
    }
  }
}