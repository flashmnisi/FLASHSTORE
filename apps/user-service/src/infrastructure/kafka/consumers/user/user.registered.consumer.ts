// apps/user-service/src/infrastructure/kafka/consumers/user/user.registered.consumer.ts

import { createConsumer, runConsumer, EVENTS, TOPICS } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export const startUserRegisteredConsumer = async () => {
  try {
    const groupId = 'user-service-user-registered';

    const consumer = createConsumer({
      groupId,
      topics: [TOPICS.USERS],
      serviceName: 'user-service',
    });

    logger.info('📥 Starting User Registered Consumer', {
      groupId,
      topic: TOPICS.USERS,
    });

    await runConsumer(
      consumer,
      {
        groupId,
        topics: [TOPICS.USERS],
        serviceName: 'user-service',
      },
      async (message: any) => {
        try {
          /**
           * =========================================
           * 1. NORMALIZE EVENT (VERY IMPORTANT FIX)
           * =========================================
           */
          const event =
            typeof message === 'string'
              ? JSON.parse(message)
              : message;

          const eventType = event?.event || event?.type;
          const payload = event?.data ?? event?.payload ?? event;

          if (!eventType) {
            logger.warn('⚠️ Missing event type', { message });
            return;
          }

          /**
           * =========================================
           * 2. HANDLE ONLY USER REGISTERED
           * =========================================
           */
          if (eventType === EVENTS.USER_REGISTERED) {
            const userId = payload?.userId;
            const email = payload?.email;
            const name = payload?.name;

            logger.info('📥 Processing user.registered event', {
              userId,
              email,
              name,
            });

            // ================================
            // BUSINESS LOGIC (SAFE PLACE)
            // ================================
            // TODO:
            // - send welcome email
            // - create default profile
            // - analytics tracking
            // - onboarding flow

            logger.info('🎉 User registration processed successfully', {
              userId,
              email,
            });

            return;
          }

          /**
           * =========================================
           * 3. HANDLE UNKNOWN EVENTS SAFELY
           * =========================================
           */
          logger.warn('⚠️ Unhandled user event received', {
            eventType,
            payload,
          });
        } catch (error: any) {
          logger.error('❌ Failed to process user event', {
            error: error.message,
            rawMessage:
              typeof message === 'string'
                ? message.substring(0, 300)
                : message,
          });

          // IMPORTANT: rethrow for Kafka retry/DLQ
          throw error;
        }
      }
    );

    logger.info('✅ User Registered Consumer started successfully');
  } catch (error: any) {
    logger.error('❌ Failed to start User Registered Consumer', {
      error: error.message,
    });

    throw error;
  }
};