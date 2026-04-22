import { getKafkaClient } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import env from '../../config/env';

let initialized = false;

export const initKafka = async () => {
  if (initialized) return;

  try {
    getKafkaClient(); // initializes the shared Kafka client
    logger.info(`✅ Kafka client initialized with brokers: ${env.KAFKA_BROKERS}`);
    initialized = true;
  } catch (error: any) {
    logger.error('❌ Failed to initialize Kafka client', { error: error.message });
    throw error;
  }
};