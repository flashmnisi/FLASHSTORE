// apps/search-service/src/infrastructure/kafka/consumer.ts

import {
  createConsumer,
  runConsumer,
  TOPICS,
  EVENTS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

import { handleProductEvent } from './handler/product-index.handler';

export const startSearchConsumer = async () => {

  const groupId = 'search-service-group';

  try {

    const consumer = createConsumer({
      groupId,
      serviceName: 'search-service',

      topics: [
        TOPICS.PRODUCTS,
        TOPICS.CATEGORIES,
      ],
    });

    logger.info('📥 Starting Search Kafka Consumer', {
      groupId,
      topics: [
        TOPICS.PRODUCTS,
        TOPICS.CATEGORIES,
      ],
    });

    await runConsumer(
      consumer,
      {
        groupId,
        serviceName: 'search-service',

        topics: [
          TOPICS.PRODUCTS,
          TOPICS.CATEGORIES,
        ],
      },

      async (message: any) => {

        try {

          const event =
            typeof message === 'string'
              ? JSON.parse(message)
              : message;

          const eventType = event.event;
          const data = event.data || {};

          logger.info('📥 Search consumer received event', {
            event: eventType,
            productId: data.productId,
            categoryId: data.categoryId,
          });

          switch (eventType) {

            // =====================================
            // PRODUCT EVENTS
            // =====================================

            case EVENTS.PRODUCT_CREATED:

            case EVENTS.PRODUCT_UPDATED:

            case EVENTS.PRODUCT_DELETED:

              await handleProductEvent(event);

              logger.info('✅ Product search index updated', {
                event: eventType,
                productId: data.productId,
              });

              break;

            // =====================================
            // CATEGORY EVENTS
            // =====================================

            case EVENTS.CATEGORY_CREATED:

            case EVENTS.CATEGORY_UPDATED:

            case EVENTS.CATEGORY_DELETED:

              logger.info('📂 Category event received in search-service', {
                event: eventType,
                categoryId: data.categoryId,
              });

              // optional:
              // update category search metadata

              break;

            default:

              logger.warn('⚠️ Unhandled event in search-service', {
                event: eventType,
              });
          }

        } catch (error: any) {

          logger.error('❌ Failed to process Kafka message', {
            error: error.message,
            stack: error.stack,
          });

          throw error; // retry + DLQ
        }
      }
    );

    logger.info('🚀 Search Kafka consumer started successfully');

  } catch (error: any) {

    logger.error('❌ Failed to start Search Kafka consumer', {
      error: error.message,
    });

    throw error;
  }
};