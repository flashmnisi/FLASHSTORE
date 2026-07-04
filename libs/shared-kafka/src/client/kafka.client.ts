import logger from '@org/shared-logger';
import { Kafka, logLevel } from 'kafkajs';

let kafkaInstance: Kafka | null = null;

export const getKafka = (): Kafka => {
  if (!kafkaInstance) {
    const brokers = (process.env.KAFKA_BROKERS || 'kafka:9092')
      .split(',')
      .map((b) => b.trim());

    kafkaInstance = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'flashstore-shared',
      brokers,
      logLevel: logLevel.INFO,
      retry: {
        initialRetryTime: 300,
        retries: 10,
        maxRetryTime: 30000,
      },
      connectionTimeout: 10000,
      requestTimeout: 30000,
    });

    logger.info(`✅ Kafka client initialized: ${brokers.join(', ')}`);
  }
  return kafkaInstance;
};

export const disconnectKafka = async () => {
  kafkaInstance = null;
  logger.info('Kafka client disconnected');
};
