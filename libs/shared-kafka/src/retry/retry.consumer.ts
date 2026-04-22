import { createConsumer, runConsumer } from '../client/consumer';
import { calculateDelay, DEFAULT_RETRY_POLICY } from './retry.policy';
import logger from '@org/shared-logger';

interface RetryConsumerOptions {
  groupId: string;
  topic: string;
  handler: (message: any) => Promise<void>;
}

/**
 * Retry consumer
 * Listens to *.retry topics and reprocesses messages with delay
 */
export const startRetryConsumer = async ({
  groupId,
  topic,
  handler,
}: RetryConsumerOptions) => {
  const retryTopic = `${topic}.retry`;

  const consumer = createConsumer({
    groupId: `${groupId}-retry`,
    topics: [retryTopic],
  });

  await runConsumer(
    consumer,
    { groupId, topics: [retryTopic] },
    async (message: any, raw?: any) => {
      const headers = raw?.headers || {};
      const retryCount = parseInt(headers['x-retry-count'] || '0');

      const delay = calculateDelay(retryCount, DEFAULT_RETRY_POLICY);

      logger.info(`⏳ Delaying retry`, {
        retryCount,
        delay,
        topic,
      });

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));

      try {
        await handler(message);

        logger.info(`✅ Retry successful`, {
          retryCount,
          topic,
        });

      } catch (error: any) {
        logger.error(`❌ Retry failed again`, {
          retryCount,
          error: error.message,
        });

        throw error; // triggers retry handler again
      }
    }
  );
};