// apps/payment-service/src/infrastructure/kafka/shared/consumer.ts
// or wherever you keep the shared consumer logic

import { Consumer } from 'kafkajs';
import { getKafka } from './kafka.client';
import { sendToDLQ } from '../resilience/dlq/dlq.publisher';
import { retryExecutor } from '../resilience/retry/retry.executor';
import logger from '@org/shared-logger';
import { idempotencyService } from '../resilience/indempotency/idempotency.service';

interface ConsumerConfig {
  groupId: string;
  topics: string[];
  serviceName: string;
}

export const createConsumer = (config: ConsumerConfig): Consumer => {
  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: config.groupId,
    retry: { retries: 5 },
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

  for (const topic of config.topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const raw = message.value?.toString();
      if (!raw) return;

      let parsed: any;

      try {
        parsed = JSON.parse(raw);
      } catch {
        logger.error('Invalid JSON message', { topic, raw });
        return;
      }

      const eventId =
        parsed?.metadata?.requestId ||
        idempotencyService.generateEventId(parsed?.data || {});

      try {
        // Idempotency check
        const isDuplicate = await idempotencyService.isDuplicate(
          eventId,
          config.serviceName
        );

        if (isDuplicate) {
          logger.info('Duplicate event skipped', { eventId });
          return;
        }

        logger.info('📥 Processing event', {
          topic,
          event: parsed.event,
          eventId,
        });

        // Retry wrapper
        await retryExecutor(async () => {
          await handler(parsed);
        });

        // Mark as processed
        await idempotencyService.markAsProcessed(eventId, config.serviceName);

      } catch (error: any) {
        logger.error('❌ Event processing failed', {
          topic,
          event: parsed?.event,
          error: error.message,
        });

        // ✅ FIXED: Send to DLQ with correct shape
// Inside the catch block of eachMessage:

        // ✅ FIXED: Match your current DLQEvent interface
        await sendToDLQ({
          topic,
          event: 'dlq.message',                    // or 'payment.payment_failed' etc.
          payload: parsed,                         // Put the full event here instead of originalEvent
          error: {
            message: error.message,
            stack: error.stack,
          },
          retryCount: parsed?.metadata?.retryCount ?? 0,
          serviceName: config.serviceName,
          correlationId: parsed?.metadata?.correlationId,
          traceId: parsed?.metadata?.traceId,
          //timestamp: new Date().toISOString(),
        });
      }
    },
  });

  logger.info('✅ Consumer running', { groupId: config.groupId });
};