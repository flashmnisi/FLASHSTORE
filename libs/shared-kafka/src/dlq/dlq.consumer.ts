// shared-kafka/src/dlq/dlq.consumer.ts

import { createConsumer, runConsumer } from '../client/consumer';
import logger from '@org/shared-logger';

interface DLQConsumerOptions {
  groupId: string;
  topics: string[];
  serviceName: string;
  handler?: (message: any) => Promise<void>;
}

export const startDLQConsumer = async ({
  groupId,
  topics,
  serviceName,
  handler,
}: DLQConsumerOptions) => {

  /**
   * Convert:
   * flashstore.auth
   * ->
   * flashstore.auth.dlq
   */
  const dlqTopics = topics.map(topic => `${topic}.dlq`);

  const consumer = createConsumer({
    groupId: `${groupId}-dlq`,
    topics: dlqTopics,
    serviceName,
  });

  await runConsumer(
    consumer,
    {
      groupId: `${groupId}-dlq`,
      topics: dlqTopics,
      serviceName,
    },
    async (message: any) => {
      try {
        logger.error('💀 DLQ message received', {
          topic: message?.topic,
          event: message?.originalMessage?.event,
          error: message?.error?.message,
          correlationId: message?.metadata?.correlationId,
        });

        /**
         * Optional recovery logic
         */
        if (handler) {
          await handler(message);
        }

      } catch (error: any) {
        logger.error('❌ DLQ handler failed', {
          error: error.message,
        });
      }
    }
  );

  logger.info('🚀 DLQ Consumer started', {
    topics: dlqTopics,
  });
};