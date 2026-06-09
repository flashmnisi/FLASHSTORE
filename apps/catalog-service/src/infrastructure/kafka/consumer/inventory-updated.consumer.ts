//apps/catalog-service/src/infrastructure/kafka/consumer/consumer.ts

import {
  subscribe,
  EVENTS,
  TOPICS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { OrderCancelledHandler } from './handlers/order-cancelled.handler';
import { PaymentCompletedHandler } from './handlers/payment-completed.handler';
import { OrderCreatedHandler } from './handlers/order-created.handler';

export const startCatalogConsumer = async (
  inventoryService: any
) => {

  const orderCreatedHandler =
    new OrderCreatedHandler(
      inventoryService
    );

  const orderCancelledHandler =
    new OrderCancelledHandler(
      inventoryService
    );

  const paymentCompletedHandler =
    new PaymentCompletedHandler();

  /**
   * =========================
   * ORDERS
   * =========================
   */

  await subscribe(
    {
      topics: [TOPICS.ORDERS],
      groupId: 'catalog-service',
      serviceName: 'catalog-service',
    },
    async (message: any) => {

      switch (message.event) {

        case EVENTS.ORDER_CREATED:
          await orderCreatedHandler.handle(
            message
          );
          break;

        case EVENTS.ORDER_CANCELLED:
          await orderCancelledHandler.handle(
            message
          );
          break;
      }
    }
  );

  /**
   * =========================
   * PAYMENTS
   * =========================
   */

  await subscribe(
    {
      topics: [TOPICS.PAYMENTS],
      groupId: 'catalog-service',
      serviceName: 'catalog-service',
    },
    async (message: any) => {

      switch (message.event) {

        case EVENTS.PAYMENT_COMPLETED:
          await paymentCompletedHandler.handle(
            message
          );
          break;
      }
    }
  );

  logger.info(
    '🚀 Catalog consumer started'
  );
};