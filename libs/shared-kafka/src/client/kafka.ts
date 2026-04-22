import { Kafka, logLevel } from 'kafkajs';
import logger from '../utils/logger';

let kafka: Kafka;

export const getKafka = (): Kafka => {
  if (!kafka) {
    const brokers = (process.env.KAFKA_BROKERS || 'kafka:9092')
      .split(',')
      .map(b => b.trim());

    kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'flashstore',
      brokers,
      logLevel: logLevel.INFO,

      retry: {
        initialRetryTime: 300,
        retries: 10,
      },

      connectionTimeout: 10000,
      requestTimeout: 30000,
    });

    logger.info(`✅ Kafka initialized`, { brokers });
  }

  return kafka;
};