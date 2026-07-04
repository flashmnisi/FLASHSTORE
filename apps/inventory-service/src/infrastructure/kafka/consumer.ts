// apps/inventory-service/src/infrastructure/kafka/consumer.ts

import { subscribe, EVENTS, TOPICS } from '@org/shared-kafka';

import { OrderCreatedHandler } from './handlers/order-created.handler';
import { PaymentFailedHandler } from './handlers/payment-failed.handler';
import { PaymentSuccessHandler } from './handlers/payment-completed.handler';

export async function startInventoryConsumer(
  orderHandler: OrderCreatedHandler,
  paymentSuccessHandler: PaymentSuccessHandler,
  paymentFailedHandler: PaymentFailedHandler
) {
  /**
   * =========================
   * ORDERS TOPIC
   * =========================
   */
  await subscribe(
    {
      topics: [TOPICS.ORDERS],
      groupId: 'inventory-service',
      serviceName: 'inventory-service',
    },
    async (message: any) => {
      switch (message.event) {
        case EVENTS.ORDER_CREATED:
          await orderHandler.handle(message);
          break;
      }
    }
  );

  /**
   * =========================
   * PAYMENTS TOPIC
   * =========================
   */
  await subscribe(
    {
      topics: [TOPICS.PAYMENTS],
      groupId: 'inventory-service',
      serviceName: 'inventory-service',
    },
    async (message: any) => {
      switch (message.event) {
        case EVENTS.PAYMENT_COMPLETED:
          await paymentSuccessHandler.handle(message);
          break;

        case EVENTS.PAYMENT_FAILED:
          await paymentFailedHandler.handle(message);
          break;
      }
    }
  );
}
