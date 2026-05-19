// libs/shared-kafka/src/lib/consumer.ts

import { Consumer } from 'kafkajs';
import { getKafka } from './kafka.client';

import { sendToDLQ } from '../resilience/dlq/dlq.publisher';
import { retryExecutor } from '../resilience/retry/retry.executor';
import { idempotencyService } from '../resilience/indempotency/idempotency.service';

import logger from '@org/shared-logger';

interface ConsumerConfig {
  groupId: string;
  topics: string[];
  serviceName: string;
}

export const createConsumer = (
  config: ConsumerConfig
): Consumer => {
  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: config.groupId,
    retry: {
      retries: 5,
    },
  });

  logger.info('👥 Consumer created', {
    groupId: config.groupId,
    topics: config.topics,
  });

  return consumer;
};

export const runConsumer = async (
  consumer: Consumer,
  config: ConsumerConfig,
  handler: (event: any) => Promise<void>
) => {
  await consumer.connect();

  // Subscribe to all topics
  for (const topic of config.topics) {
    await consumer.subscribe({
      topic,
      fromBeginning: false,
    });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawMessage = message.value?.toString();

      if (!rawMessage) {
        logger.warn('⚠️ Empty Kafka message received', {
          topic,
          partition,
        });

        return;
      }

      let parsed: any;

      try {
        parsed = JSON.parse(rawMessage);
      } catch (error) {
        logger.error('❌ Invalid JSON message', {
          topic,
          rawMessage,
        });

        return;
      }

      /**
       * ==================================================
       * FIXED EVENT ID GENERATION
       * ==================================================
       *
       * OLD BUG:
       * generateEventId(parsed.data)
       *
       * user.registered and user.logged_in
       * had same payload → same hash
       *
       * NOW:
       * include event + topic + timestamp
       * so every event becomes unique
       */

      const eventId =
        parsed?.metadata?.requestId ||
        idempotencyService.generateEventId({
          topic,
          event: parsed?.event,
          data: parsed?.data,
          timestamp:
            parsed?.timestamp ||
            parsed?.metadata?.timestamp ||
            message.timestamp ||
            Date.now(),
        });

      try {
        /**
         * ==================================================
         * IDEMPOTENCY CHECK
         * ==================================================
         */

        const isDuplicate =
          await idempotencyService.isDuplicate(
            eventId,
            config.serviceName
          );

        if (isDuplicate) {
          logger.warn('🔄 Duplicate event blocked', {
            topic,
            event: parsed?.event,
            eventId,
            service: config.serviceName,
          });

          return;
        }

        logger.info('📥 Processing event', {
          topic,
          partition,
          event: parsed?.event,
          eventId,
        });

        /**
         * ==================================================
         * EXECUTE HANDLER WITH RETRIES
         * ==================================================
         */

        await retryExecutor(async () => {
          await handler(parsed);
        });

        /**
         * ==================================================
         * MARK EVENT AS PROCESSED
         * ==================================================
         */

        await idempotencyService.markAsProcessed(
          eventId,
          config.serviceName
        );

        logger.info('✅ Event marked as processed', {
          topic,
          event: parsed?.event,
          eventId,
          service: config.serviceName,
        });

      } catch (error: any) {
        logger.error('❌ Event processing failed', {
          topic,
          partition,
          event: parsed?.event,
          eventId,
          error: error.message,
          stack: error.stack,
        });

        /**
         * ==================================================
         * DEAD LETTER QUEUE
         * ==================================================
         */

        await sendToDLQ({
          topic,
          event: parsed?.event || 'unknown.event',

          payload: parsed,

          error: {
            message: error.message,
            stack: error.stack,
          },

          retryCount:
            parsed?.metadata?.retryCount ?? 0,

          serviceName: config.serviceName,

          correlationId:
            parsed?.metadata?.correlationId,

          traceId:
            parsed?.metadata?.traceId,
        });
      }
    },
  });

  logger.info('✅ Consumer running', {
    groupId: config.groupId,
    topics: config.topics,
  });
};