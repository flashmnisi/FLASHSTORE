import {
  subscribe,
  EVENTS,
  TOPICS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { CartCheckoutOrchestrator } from '../checkout/cart-checkout.orchestrator';

import { PaymentCompletedHandler } from './handlers/payment-completed.handler';
import { PaymentFailedHandler } from './handlers/payment-failed.handler';
import { OrderCancelledHandler } from './handlers/order-cancelled.handler';

export const startCartConsumer = async (
  orchestrator: CartCheckoutOrchestrator
) => {

  const paymentCompletedHandler =
    new PaymentCompletedHandler(
      orchestrator
    );

  const paymentFailedHandler =
    new PaymentFailedHandler(
      orchestrator
    );

  const orderCancelledHandler =
    new OrderCancelledHandler(
      orchestrator
    );

  /**
   * =========================
   * PAYMENTS
   * =========================
   */

  await subscribe(
    {
      topics: [TOPICS.PAYMENTS],
      groupId: 'cart-service',
      serviceName: 'cart-service',
    },
    async (message: any) => {
      switch (message.event) {

        case EVENTS.PAYMENT_COMPLETED:
          await paymentCompletedHandler.handle(
            message
          );
          break;

        case EVENTS.PAYMENT_FAILED:
          await paymentFailedHandler.handle(
            message
          );
          break;
      }
    }
  );

  /**
   * =========================
   * ORDERS
   * =========================
   */

  await subscribe(
    {
      topics: [TOPICS.ORDERS],
      groupId: 'cart-service',
      serviceName: 'cart-service',
    },
    async (message: any) => {
      switch (message.event) {

        case EVENTS.ORDER_CANCELLED:
          await orderCancelledHandler.handle(
            message
          );
          break;
      }
    }
  );

  logger.info(
    '🚀 Cart Kafka consumer started successfully'
  );
};