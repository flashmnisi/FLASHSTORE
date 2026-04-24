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
  const dlqTopics = topics.map(topic => `${topic}.dlq`);

  const consumer = createConsumer({
    groupId: `${groupId}-dlq`,
    topics: dlqTopics,
    serviceName, // ✅ REQUIRED
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
        // ✅ FIXED LOGGER
        logger.error(
          {
            event: message?.originalMessage?.event,
            error: message?.error?.message,
            correlationId: message?.metadata?.correlationId,
          },
          '💀 DLQ message received'
        );

        // Optional recovery logic
        if (handler) {
          await handler(message);
        }

      } catch (error: any) {
        logger.error(
          {
            error: error.message,
          },
          '❌ DLQ handler failed'
        );
      }
    }
  );

  logger.info(
    { topics: dlqTopics },
    '🚨 DLQ Consumer started'
  );
};