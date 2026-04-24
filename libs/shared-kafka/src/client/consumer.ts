import { Consumer } from 'kafkajs';
import { getKafka } from './kafka.client';
import { sendToDLQ } from '../resilience/dlq/dlq.publisher';
import { retryExecutor } from '../resilience/retry/retry.executor';
import logger from '@org/shared-logger';
import { idempotencyService } from 'src/resilience/indempotency/idempotency.service';
//import { idempotencyService } from '../resilience/idempotency/idempotency.service';

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

  logger.info(
    {
      groupId: config.groupId,
      topics: config.topics,
    },
    '👥 Consumer created'
  );

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
        logger.error({ topic, raw }, 'Invalid JSON message');
        return;
      }

      const eventId =
        parsed?.metadata?.requestId ||
        idempotencyService.generateEventId(parsed?.data || {});

      try {
        // ✅ Idempotency check
        const isDuplicate = await idempotencyService.isDuplicate(
          eventId,
          config.serviceName
        );

        if (isDuplicate) {
          logger.info({ eventId }, 'Duplicate event skipped');
          return;
        }

        logger.info(
          {
            topic,
            event: parsed.event,
            eventId,
          },
          '📥 Processing event'
        );

        // ✅ Retry wrapper
        await retryExecutor(async () => {
          await handler(parsed);
        });

        // ✅ Mark as processed
        await idempotencyService.markAsProcessed(
          eventId,
          config.serviceName
        );

      } catch (error: any) {
        logger.error(
          {
            topic,
            event: parsed?.event,
            error: error.message,
          },
          '❌ Event processing failed'
        );

        // ✅ Send to DLQ
        await sendToDLQ({
  topic,
  originalEvent: parsed,
  error: error.message,
  timestamp: new Date().toISOString(),
  retryCount: parsed?.metadata?.retryCount ?? 0,
  serviceName: config.serviceName,

  correlationId: parsed?.metadata?.correlationId,
  traceId: parsed?.metadata?.traceId,
  eventId,
});
      }
    },
  });

  logger.info(
    { groupId: config.groupId },
    '✅ Consumer running'
  );
};