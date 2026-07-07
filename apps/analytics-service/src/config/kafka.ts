// apps/analytics-service/src/config/kafka.ts

import { getKafka } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import env from './env';

export const initKafka = async (): Promise<void> => {
  try {
    await getKafka();

    logger.info('✅ Kafka client initialized successfully', {
      brokers: env.KAFKA_BROKERS,
    });
  } catch (error: any) {
    logger.error('❌ Failed to initialize Kafka', {
      error: error.message,
      brokers: env.KAFKA_BROKERS,
    });
    throw error;
  }
};