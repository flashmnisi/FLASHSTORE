import { ProducerRecord } from 'kafkajs';
import { getProducer } from '../client/producer';
import logger from '@org/shared-logger';

export const publish = async (options: {
  topic: string;
  event: string;
  data: any;
  key?: string;

  correlationId?: string;
  traceId?: string;

  headers?: Record<string, string>;
}) => {
  try {
    const producer = await getProducer();

    const message = {
      event: options.event,
      data: options.data,
      metadata: {
        eventId: crypto.randomUUID(),
        correlationId: options.correlationId,
        traceId: options.traceId,
        timestamp: Date.now(),
      },
    };

    const record: ProducerRecord = {
      topic: options.topic,
      messages: [
        {
          key: options.key,
          value: JSON.stringify(message),
          headers: {
            ...options.headers,
            'x-event-type': options.event,
            'x-correlation-id': options.correlationId || '',
            'x-trace-id': options.traceId || '',
          },
        },
      ],
    };

    await producer.send(record);

    logger.info('📤 Event published', {
      topic: options.topic,
      event: options.event,
      key: options.key,
    });

    return message.metadata.eventId;
  } catch (error: any) {
    logger.error('❌ Publish failed', {
      topic: options.topic,
      error: error.message,
    });

    throw error;
  }
};