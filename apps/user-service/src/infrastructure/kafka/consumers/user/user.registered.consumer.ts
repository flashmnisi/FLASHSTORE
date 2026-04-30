// apps/user-service/src/infrastructure/kafka/consumers/user/user.registered.consumer.ts

import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';
import { USER_EVENTS } from '../../events/user.events';

export const startUserRegisteredConsumer = async () => {
  const consumer = createConsumer({
    groupId: 'user-service-user-registered',
    topics: ['flashstore.users'],        // ← Required
    serviceName: 'user-service',
  });

  await runConsumer(
    consumer,
    {
      groupId: 'user-service-user-registered',
      topics: ['flashstore.users'],
      serviceName: 'user-service',
    },
    async (event: any) => {               // ← event, not message
      try {
        if (event.event === USER_EVENTS.REGISTERED) {
          const { userId, email, name } = event.data || {};

          logger.info('📥 Processing user.registered event', {
            userId,
            email,
            name,
          });

          // TODO: Add your business logic here
          // Examples:
          // - Trigger welcome email via Notification Service
          // - Initialize user profile in other services
          // - Track registration analytics

          logger.info('🎉 Welcome event processed for new user', { userId });
        }
      } catch (error: any) {
        logger.error('Failed to process user.registered event', {
          error: error.message,
          eventData: event.data,
        });
        throw error; // Important: Let shared-kafka handle retry + DLQ
      }
    }
  );

  logger.info('✅ User Registered Consumer started and running');
};