import { Kafka, logLevel } from 'kafkajs';
import logger from '../utils/logger';

let kafka: Kafka;

export const createKafka = () => {
  if (!kafka) {
    const brokers = (process.env.KAFKA_BROKERS || 'kafka:9092')
      .split(',')
      .map(b => b.trim());

    kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'flashstore',
      brokers,
      logLevel: logLevel.INFO,
      retry: {
        retries: 8,
      },
    });

    logger.info(`✅ Kafka initialized`, { brokers });
  }

  return kafka;
};