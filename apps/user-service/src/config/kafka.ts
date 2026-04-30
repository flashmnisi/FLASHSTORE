// apps/user-service/src/config/kafka.ts

import { getKafka } from '@org/shared-kafka';   // or initKafkaClient — use whatever is actually exported
import logger from '@org/shared-logger';
import env from './env';

export const initKafka = async (): Promise<void> => {
  try {
    // Most shared-kafka libraries initialize with no arguments or via environment
    await getKafka();   // ← Call without arguments

    logger.info('✅ Kafka client initialized successfully', {
      brokers: env.KAFKA_BROKERS,
    });
  } catch (error: any) {
    logger.error('❌ Failed to initialize Kafka', { 
      error: error.message,
      brokers: env.KAFKA_BROKERS 
    });
    throw error;
  }
};