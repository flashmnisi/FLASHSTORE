import { Kafka } from 'kafkajs';
import { env } from './env';
import logger from '../utils/logger';

export const kafka = new Kafka({
  clientId: 'cart-service',
  brokers: env.KAFKA_BROKERS,
  retry: {
    retries: 5,
  },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'cart-service-group' });

export const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();

    logger.info('Kafka connected', {
      brokers: env.KAFKA_BROKERS,
    });
  } catch (error: any) {
    logger.error('Kafka connection failed', {
      error: error.message,
    });

    throw error;
  }
};