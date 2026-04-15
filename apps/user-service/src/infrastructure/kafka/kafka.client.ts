import { getKafkaClient } from '@org/shared-kafka';
import logger from '@org/shared-logger';

let initialized = false;

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

export const initKafka = async (retries = MAX_RETRIES): Promise<void> => {
  if (initialized) return;

  try {
    const kafka = getKafkaClient();

    // Optional: test connection by creating admin
    const admin = kafka.admin();
    await admin.connect();
    await admin.disconnect();

    logger.info('✅ Kafka client initialized successfully');
    initialized = true;
  } catch (error: any) {
    logger.error(
      {
        error: error.message,
        retriesLeft: retries,
      },
      '❌ Kafka initialization failed'
    );

    if (retries > 0) {
      logger.warn(`Retrying Kafka in ${RETRY_DELAY / 1000}s...`);
      setTimeout(() => initKafka(retries - 1), RETRY_DELAY);
    } else {
      logger.error('❌ Kafka failed after retries. Exiting...');
      process.exit(1);
    }
  }
};