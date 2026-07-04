// shared-kafka/src/dlq/dlq.consumer.ts

import { createConsumer, runConsumer } from '../client/consumer';
import logger from '@org/shared-logger';

interface DLQConsumerOptions {
  groupId: string;
  topics: string[];
  serviceName: string;
  recoveryHandler?: (message: any) => Promise<boolean>;
}

export const startDLQConsumer = async (options: DLQConsumerOptions) => {
  const dlqTopics = options.topics.map((t) => `${t}.dlq`);

  await runConsumer(
    createConsumer({
      groupId: `${options.groupId}-dlq`,
      topics: dlqTopics,
      serviceName: options.serviceName,
    }),
    {
      groupId: `${options.groupId}-dlq`,
      topics: dlqTopics,
      serviceName: options.serviceName,
    },
    async (message: any) => {
      try {
        const originalTopic =
          message?.originalTopic || message?.topic?.replace('.dlq', '');

        logger.error('💀 DLQ Message Received', {
          dlqTopic: message?.topic,
          originalTopic,
          originalEvent: message?.originalEvent,
          retryCount: message?.metadata?.retryCount,
          correlationId: message?.metadata?.correlationId,
        });

        // Optional automatic recovery
        if (options.recoveryHandler) {
          const recovered = await options.recoveryHandler(message);
          if (recovered) {
            logger.info('♻️ DLQ Message recovered successfully', {
              originalTopic,
            });
            return;
          }
        }

        // If not recovered, keep in DLQ or move to permanent storage
        logger.warn(
          '📌 DLQ Message not auto-recovered - manual intervention needed',
          {
            originalTopic,
          }
        );
      } catch (err: any) {
        logger.error('❌ DLQ Consumer handler failed', { error: err.message });
      }
    }
  );

  logger.info('🚀 DLQ Consumer started', {
    dlqTopics,
    serviceName: options.serviceName,
  });
};
