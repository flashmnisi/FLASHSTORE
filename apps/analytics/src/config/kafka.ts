import { getKafkaClient } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import env from './env';

export const initKafka = async () => {
  try {
    const kafka = getKafkaClient();
    logger.info(`✅ Kafka client initialized for analytics-service with brokers: ${env.KAFKA_BROKERS}`);
    return kafka;
  } catch (error: any) {
    logger.error({ error: error.message }, '❌ Failed to initialize Kafka in analytics-service');
    throw error;
  }
};