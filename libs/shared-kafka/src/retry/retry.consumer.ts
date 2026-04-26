//import logger from '@org/shared-logger';
import logger from '@org/shared-logger';
import { createConsumer, runConsumer } from '../client/consumer';
import { calculateDelay, DEFAULT_RETRY_POLICY } from './retry.policy';

interface RetryConsumerOptions {
  groupId: string;
  topic: string;
  handler: (message: any) => Promise<void>;
}

export const startRetryConsumer = async ({
  groupId,
  topic,
  handler,
}: RetryConsumerOptions) => {
  const retryTopic = `${topic}.retry`;

  const consumer = createConsumer({
    groupId: `${groupId}-retry`,
    topics: [retryTopic],
    serviceName: groupId,
  });

  await runConsumer(
    consumer,
    { groupId, topics: [retryTopic], serviceName: groupId },
    async (event: any) => {
      const headers = event?.metadata?.headers || {};
      const retryCount = parseInt(headers['x-retry-count'] || '0');

      const delay = calculateDelay(retryCount, DEFAULT_RETRY_POLICY);

      logger.info('⏳ Retry delay started', {
        retryCount,
        delay,
        topic,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));

      try {
        await handler(event);

        logger.info('✅ Retry successful', {
          retryCount,
          topic,
        });
      } catch (error: any) {
        logger.error('❌ Retry failed again', {
          retryCount,
          error: error.message,
        });

        throw error; // let retry pipeline handle it
      }
    }
  );
};