// apps/search-service/src/infrastructure/kafka/consumer.ts

import {
  subscribe,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';
import { CategoryEventHandler } from './handler/category-event.handler';
import { ProductEventHandler } from './handler/product-event.handler';

export const startSearchConsumer = async () => {

  const productEventHandler =
    new ProductEventHandler();

  const categoryEventHandler =
    new CategoryEventHandler();

  /**
   * =========================
   * PRODUCTS
   * =========================
   */

  await subscribe(
    {
      topics: [TOPICS.PRODUCTS],
      groupId: 'search-service',
      serviceName: 'search-service',
    },
    async (message: any) => {

      switch (message.event) {

        case EVENTS.PRODUCT_CREATED:
          break;

        case EVENTS.PRODUCT_UPDATED:
          break;

        case EVENTS.PRODUCT_DELETED:

          await productEventHandler.handle(
            message
          );

          break;
      }
    }
  );

  /**
   * =========================
   * CATEGORIES
   * =========================
   */

  await subscribe(
    {
      topics: [TOPICS.CATEGORIES],
      groupId: 'search-service',
      serviceName: 'search-service',
    },
    async (message: any) => {

      switch (message.event) {

        case EVENTS.CATEGORY_CREATED:
          break;

        case EVENTS.CATEGORY_UPDATED:
          break;

        case EVENTS.CATEGORY_DELETED:

          await categoryEventHandler.handle(
            message
          );

          break;
      }
    }
  );

  logger.info(
    '🚀 Search Kafka consumer started successfully'
  );
};