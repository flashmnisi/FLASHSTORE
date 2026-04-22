import { createConsumer, runConsumer } from '@org/shared-kafka';
import { KAFKA_TOPICS, PRODUCT_EVENTS } from './topics';
import { handleProductCreated } from './handlers/product-index.handler';
import { handleProductUpdated } from './handlers/product-update.handler';
import logger from '../../utils/logger';

export const startKafkaConsumer = async () => {
  const consumer = createConsumer({
    groupId: 'search-service-group',
    topics: [KAFKA_TOPICS.PRODUCTS],
  });

  await runConsumer(
    consumer,
    {
      groupId: 'search-service-group',
      topics: [KAFKA_TOPICS.PRODUCTS],
    },
    async (message) => {
      try {
        const eventType = message.event;

        switch (eventType) {
          case PRODUCT_EVENTS.PRODUCT_CREATED:
            await handleProductCreated(message);
            break;

          case PRODUCT_EVENTS.PRODUCT_UPDATED:
            await handleProductUpdated(message);
            break;

          default:
            logger.warn('Unhandled product event', { eventType });
        }
      } catch (error: any) {
        logger.error('Kafka handler failed', {
          error: error.message,
        });

        throw error; // 🔥 enables retry / DLQ
      }
    }
  );

  logger.info('🚀 Search Kafka consumer started');
};