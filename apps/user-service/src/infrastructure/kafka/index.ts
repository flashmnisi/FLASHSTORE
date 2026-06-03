// apps/user-service/src/infrastructure/kafka/index.ts

import logger from '@org/shared-logger';
import { initKafka } from '../../config/kafka';

export const initializeKafka = async () => {
  await initKafka();

  logger.info('✅ Kafka fully initialized (Producer + Consumers)');
};