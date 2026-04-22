import { createConsumer, runConsumer } from '../client/consumer';
import logger from '@org/shared-logger';

interface DLQConsumerOptions {
  groupId: string;
  topics: string[]; // base topics (without .dlq)
  handler?: (message: any) => Promise<void>;
}

/**
 * DLQ Consumer
 * Used for:
 * - Logging failures
 * - Alerting
 * - Manual recovery
 */
export const startDLQConsumer = async ({
  groupId,
  topics,
  handler,
}: DLQConsumerOptions) => {
  const dlqTopics = topics.map(topic => `${topic}.dlq`);

  const consumer = createConsumer({
    groupId: `${groupId}-dlq`,
    topics: dlqTopics,
  });

  await runConsumer(
    consumer,
    { groupId, topics: dlqTopics },
    async (message: any) => {
      try {
        logger.error(`💀 DLQ message received`, {
          event: message?.originalMessage?.event,
          error: message?.error,
        });

        // Optional custom handler (manual recovery, alerts, etc.)
        if (handler) {
          await handler(message);
        }

      } catch (error: any) {
        logger.error(`❌ DLQ handler failed`, {
          error: error.message,
        });
      }
    }
  );

  logger.info(`🚨 DLQ Consumer started`, {
    topics: dlqTopics,
  });
};