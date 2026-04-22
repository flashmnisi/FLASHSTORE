// apps/payment-service/src/config/kafka.ts

import { getKafkaClient } from '@org/shared-kafka';
import env from './env';
import logger from '../utils/logger';

export const kafka = getKafkaClient();

export const kafkaConfig = {
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(','),
};

export const initKafka = async () => {
  logger.info('📡 Kafka initialized', {
    brokers: kafkaConfig.brokers,
    clientId: kafkaConfig.clientId,
  });

  return kafka;
};