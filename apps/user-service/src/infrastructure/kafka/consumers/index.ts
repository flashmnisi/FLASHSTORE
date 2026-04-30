// apps/user-service/src/infrastructure/kafka/consumers/index.ts

import logger from '@org/shared-logger';

import { startUserRegisteredConsumer } from './user/user.registered.consumer';
import { startUserUpdatedConsumer } from './user/user.updated.consumer';
import { startAuthLoginConsumer } from './auth/auth.login.consumer';

export const startAllConsumers = async (): Promise<void> => {
  try {
    logger.info('🚀 Starting all Kafka consumers...');

    await Promise.allSettled([
      startUserRegisteredConsumer(),
      startUserUpdatedConsumer(),
      startAuthLoginConsumer(),
    ]);

    logger.info('✅ All Kafka consumers started successfully');
  } catch (error: any) {
    logger.error('❌ Failed to start Kafka consumers', { error: error.message });
  }
};