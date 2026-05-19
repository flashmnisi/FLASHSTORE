// apps/gateway/src/config/kafka.ts

import { getKafka } from '@org/shared-kafka';
import env from './env';
import logger from '@org/shared-logger';

export const kafkaConfig = {
  clientId: env.KAFKA_CLIENT_ID || 'api-gateway',

  brokers: env.KAFKA_BROKERS
    ? env.KAFKA_BROKERS.split(',')
    : ['kafka:9092'],
};

/**
 * Sleep Helper
 */
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Initialize Kafka
 */
export const initKafka = async (
  retries = 10
) => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      attempt++;

      logger.info(
        `📡 Connecting to Kafka (${attempt}/${retries})`,
        {
          brokers: kafkaConfig.brokers,
        }
      );

      const kafka = getKafka();

      /**
       * Verify broker connection
       */
      const admin = kafka.admin();

      await admin.connect();

      logger.info('✅ Kafka admin connected');

      /**
       * Ensure topics exist
       */
      const existingTopics =
        await admin.listTopics();

      const requiredTopics = [
        'flashstore.users',
        'flashstore.auth',
        'flashstore.orders',
        'flashstore.analytics',
      ];

      const missingTopics = requiredTopics.filter(
        (topic) => !existingTopics.includes(topic)
      );

      if (missingTopics.length > 0) {
        logger.warn(
          '⚠️ Creating missing Kafka topics',
          {
            topics: missingTopics,
          }
        );

        await admin.createTopics({
          waitForLeaders: true,

          topics: missingTopics.map((topic) => ({
            topic,
            numPartitions: 1,
            replicationFactor: 1,
          })),
        });

        logger.info(
          '✅ Missing Kafka topics created'
        );
      }

      await admin.disconnect();

      logger.info(
        '✅ Kafka initialized successfully',
        {
          clientId: kafkaConfig.clientId,
          brokers: kafkaConfig.brokers,
        }
      );

      return kafka;
    } catch (error: any) {
      logger.warn(
        `⚠️ Kafka connection failed (${attempt}/${retries})`,
        {
          error: error.message,
        }
      );

      if (attempt >= retries) {
        logger.error(
          '❌ Kafka initialization failed permanently',
          {
            error: error.message,
          }
        );

        return undefined;
      }

      await delay(5000);
    }
  }

  return undefined;
};

/**
 * Kafka Health Check
 */
export const checkKafkaHealth =
  async (): Promise<boolean> => {
    try {
      const kafka = getKafka();

      const admin = kafka.admin();

      await admin.connect();

      await admin.listTopics();

      await admin.disconnect();

      return true;
    } catch (error: any) {
      logger.warn(
        '⚠️ Kafka health check failed',
        {
          error: error.message,
        }
      );

      return false;
    }
  };