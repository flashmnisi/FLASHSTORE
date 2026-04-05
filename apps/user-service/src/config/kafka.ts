import { getKafkaClient } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import env from './env';

export const initKafka = async () => {
  try {
    const kafka = getKafkaClient();
    
    logger.info(
      { brokers: env.KAFKA_BROKERS },
      `✅ Kafka client initialized with brokers: ${env.KAFKA_BROKERS}`
    );

    return kafka;
  } catch (error: any) {
    logger.error(
      { 
        error: error.message,
        brokers: env.KAFKA_BROKERS 
      },
      '❌ Failed to initialize Kafka client'
    );
    throw error;
  }
};

// Optional: Graceful shutdown helper
export const disconnectKafka = async () => {
  try {
    logger.info('Kafka client disconnected');
    // You can extend shared-kafka later to support actual disconnection
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error(
      { error: errorMessage },
      'Error disconnecting Kafka'
    );
  }
};