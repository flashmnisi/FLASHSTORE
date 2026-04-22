import { Consumer } from 'kafkajs';
import { getKafka } from './kafka';
import logger from '../utils/logger';
import { sendToDLQ } from '../dlq/dlq.handler';
import { retryHandler } from '../retry/retry.handler';
import { idempotencyService } from 'src/indepotency/indepotency.service';


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

  logger.info(`👥 Consumer created`, {
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
        logger.error(`Invalid JSON message`, { topic });
        return;
      }

      const eventId =
        parsed?.eventId ||
        idempotencyService.generateEventId(parsed?.data || {});

      try {
        // 🔥 Idempotency check
        const isDuplicate = await idempotencyService.isDuplicate(
          eventId,
          config.serviceName
        );

        if (isDuplicate) return;

        logger.info(`📥 Processing event`, {
          topic,
          event: parsed.event,
          eventId,
        });

        // 🔁 Retry wrapper
        await retryHandler(async () => {
          await handler(parsed);
        });

        await idempotencyService.markAsProcessed(eventId, config.serviceName);

      } catch (error: any) {
        logger.error(`❌ Event processing failed`, {
          topic,
          event: parsed.event,
          error: error.message,
        });

        // 💀 Send to DLQ
        await sendToDLQ({
          topic,
          message: parsed,
          key: message.key?.toString(),
          error: error.message,
        });
      }
    },
  });

  logger.info(`✅ Consumer running`, {
    groupId: config.groupId,
  });
};