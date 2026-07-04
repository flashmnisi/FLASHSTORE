// libs/shared-kafka/src/lib/producer.ts

import { Producer, ProducerRecord, Partitioners } from 'kafkajs';

import crypto from 'crypto';

import { getKafka } from './kafka.client';

import logger from '@org/shared-logger';

let producer: Producer | null = null;

export const getProducer = async (): Promise<Producer> => {
  if (!producer) {
    const kafka = getKafka();

    producer = kafka.producer({
      /**
       * Prevent KafkaJS v2 partition warning
       */
      createPartitioner: Partitioners.LegacyPartitioner,

      allowAutoTopicCreation: true,

      /**
       * Enables Exactly Once Semantics support
       */
      idempotent: true,

      maxInFlightRequests: 5,

      retry: {
        retries: 5,
      },
    });

    await producer.connect();

    logger.info('🚀 Kafka Producer connected successfully');
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

    /**
     * ==================================================
     * EVENT METADATA
     * ==================================================
     */

    const requestId =
      options.message?.metadata?.requestId || crypto.randomUUID();

    const correlationId = options.message?.metadata?.correlationId || requestId;

    const timestamp = new Date().toISOString();

    /**
     * ==================================================
     * FINAL EVENT PAYLOAD
     * ==================================================
     */

    const payload = {
      ...options.message,

      metadata: {
        ...options.message?.metadata,

        requestId,
        correlationId,
        timestamp,
      },
    };

    const record: ProducerRecord = {
      topic: options.topic,

      messages: [
        {
          key: options.key,

          value: JSON.stringify(payload),

          headers: {
            ...options.headers,

            'x-request-id': requestId,

            'x-correlation-id': correlationId,

            'x-event-type': payload?.event || 'unknown',

            'x-service': payload?.serviceName || 'shared-kafka',

            'x-timestamp': timestamp,
          },
        },
      ],
    };

    await prod.send(record);

    logger.info('📤 Event published', {
      topic: options.topic,
      key: options.key,
      event: payload?.event,
      requestId,
    });
  } catch (error: any) {
    logger.error('❌ Failed to publish event', {
      topic: options.topic,
      error: error.message,
    });

    throw error;
  }
};
