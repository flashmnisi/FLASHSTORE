import { getKafka } from '@org/shared-kafka';
import env from '../../config/env';
import logger from '@org/shared-logger';

let initialized = false;

export const initKafka = async () => {
  if (initialized) return;

  try {
    getKafka(); // initializes the shared Kafka client
    logger.info(`✅ Kafka client initialized with brokers: ${env.KAFKA_BROKERS}`);
    initialized = true;
  } catch (error: any) {
    logger.error('❌ Failed to initialize Kafka client', {
      error: error.message 
    });
    throw error;
  }
};