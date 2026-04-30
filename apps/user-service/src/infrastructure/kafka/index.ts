// apps/user-service/src/infrastructure/kafka/index.ts

import logger from '@org/shared-logger';
import { initKafka } from '../../config/kafka';
import { startAllConsumers } from './consumers/index';

export const initializeKafka = async () => {
  await initKafka();
  await startAllConsumers();

  logger.info('✅ Kafka fully initialized (Producer + Consumers)');
};