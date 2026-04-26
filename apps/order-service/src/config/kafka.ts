import { getKafka } from '@org/shared-kafka';
import env from './env';
import logger from '@org/shared-logger';

export const kafka = getKafka();

export const kafkaConfig = {
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS.split(',').map(b => b.trim()),
};

export const initKafka = async () => {
  logger.info('⚡ Kafka configured for Order Service', {
    brokers: kafkaConfig.brokers,
    clientId: kafkaConfig.clientId,
  });
};