import { Producer, ProducerRecord } from 'kafkajs';
import { getKafka } from './kafka.client';
import logger from '@org/shared-logger';

let producer: Producer | null = null;

export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    const kafka = getKafka();

    producer = kafka.producer({
      allowAutoTopicCreation: true,
      idempotent: true,
      maxInFlightRequests: 5,
      retry: { retries: 5 },
    });

    await producer.connect();

    logger.info('🚀 Kafka Producer connected successfully',{}, );
  }

  return producer;
};

export const publish = async (options: {
  topic: string;
  message: any;
  key?: string;
  headers?: Record<string, string>;
}): Promise<void> => {
  try {
    const prod = await getProducer();

    const record: ProducerRecord = {
      topic: options.topic,
      messages: [
        {
          key: options.key,
          value: JSON.stringify(options.message),
          headers: {
            ...options.headers,
            'x-event-type': options.message?.event || 'unknown',
            'x-service': 'shared-kafka',
            'x-timestamp': new Date().toISOString(),
          },
        },
      ],
    };

    await prod.send(record);

    // ✅ FIXED LOGGER
    logger.info( '📤 Event published',
      {
        topic: options.topic,
        key: options.key,
        event: options.message?.event,
      },
    );

  } catch (error: any) {
    // ✅ FIXED LOGGER
    logger.error('❌ Failed to publish event',
      {
        topic: options.topic,
        error: error.message,
      },
    );

    throw error;
  }
};