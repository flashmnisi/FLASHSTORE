import { createConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { handleProductEvent } from './handler/product-index.handler';
//import { handleProductEvent } from '../../application/handlers/product.handler';

export const startSearchConsumer = async () => {
  const consumer = createConsumer({
    groupId: 'search-service-group',
    serviceName: 'search-service',
    topics: ['product.created', 'product.updated', 'product.deleted'],
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString());

        logger.info('📥 Search consumer received event', {
          topic,
          event: event.event,
        });

        await handleProductEvent(event);

      } catch (error: any) {
        logger.error('❌ Failed to process Kafka message', {
          topic,
          error: error.message,
        });

        throw error; // 🔥 ensures retry / DLQ
      }
    },
  });

  logger.info('🚀 Search Kafka consumer started');
};