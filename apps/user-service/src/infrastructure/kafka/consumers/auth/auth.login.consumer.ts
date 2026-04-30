// apps/user-service/src/infrastructure/kafka/consumers/auth/auth.login.consumer.ts

import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { AUTH_EVENTS } from '../../events/auth.events';

export const startAuthLoginConsumer = async () => {
  const consumer = createConsumer({
    groupId: 'user-service-auth-login',
    topics: ['flashstore.auth'],
    serviceName: 'user-service',
  });

  await runConsumer(
    consumer,
    {
      groupId: 'user-service-auth-login',
      topics: ['flashstore.auth'],
      serviceName: 'user-service',
    },
    async (event: any) => {
      try {
        if (event.event === AUTH_EVENTS.LOGIN_SUCCESS) {
          logger.info('📥 Processing auth.login.success event', {
            userId: event.data.userId,
          });

          // TODO: Update last login timestamp, security audit, etc.
        }
      } catch (error: any) {
        logger.error('Failed to handle login event', { error: error.message });
        throw error;
      }
    }
  );

  logger.info('✅ Auth Login Consumer is running');
};