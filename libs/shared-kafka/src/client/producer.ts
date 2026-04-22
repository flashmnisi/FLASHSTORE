import { Producer, ProducerRecord } from 'kafkajs';
import { getKafka } from './kafka';
import logger from '../utils/logger';

let producer: Producer;

export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    const kafka = getKafka();

    producer = kafka.producer({
      allowAutoTopicCreation: true,
      idempotent: true, // 🔥 important
      maxInFlightRequests: 5,
      retry: { retries: 5 },
    });

    await producer.connect();

    logger.info('🚀 Kafka Producer connected');
  }

  return producer;
};

interface PublishOptions {
  topic: string;
  message: any;
  key?: string;
  headers?: Record<string, string>;
}

export const publish = async ({
  topic,
  message,
  key,
  headers = {},
}: PublishOptions): Promise<void> => {
  try {
    const prod = await getProducer();

    const record: ProducerRecord = {
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(message),
          headers: {
            ...headers,
            'x-event-type': message.event || 'unknown',
          },
        },
      ],
    };

    await prod.send(record);

    logger.info(`📤 Event published`, {
      topic,
      key,
      event: message.event,
    });

  } catch (error: any) {
    logger.error(`❌ Failed to publish`, {
      topic,
      error: error.message,
    });

    throw error;
  }
};