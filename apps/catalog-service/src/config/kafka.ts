// apps/catalog-service/src/config/kafka.ts

import { getKafka } from '@org/shared-kafka';
import env from './env';
import logger from '@org/shared-logger';

export const kafkaConfig = {
  clientId: env.KAFKA_CLIENT_ID || 'catalog-service',
  brokers: env.KAFKA_BROKERS ? env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
};

export const initKafka = async () => {
  try {
    const kafka = getKafka();

    logger.info('📡 Kafka initialized successfully', {
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
    });

    return kafka;
  } catch (error: any) {
    logger.error('❌ Failed to initialize Kafka', {
      error: error.message,
    });
    throw error;
  }
};