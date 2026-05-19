// apps/user-service/src/infrastructure/kafka/consumers/auth/auth.login.consumer.ts

import { createConsumer, runConsumer, EVENTS, TOPICS } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export const startAuthLoginConsumer = async () => {
  try {
    const groupId = 'user-service-auth-login';

    const consumer = createConsumer({
      groupId,
      topics: [TOPICS.AUTH],
      serviceName: 'user-service',
    });

    logger.info(`📥 Starting Auth Login Consumer on topic: ${TOPICS.AUTH}`);

    await runConsumer(
      consumer,
      {
        groupId,
        topics: [TOPICS.AUTH],
        serviceName: 'user-service',
      },
      async (message: any) => {
        try {
          /**
           * ============================
           * NORMALIZE MESSAGE
           * ============================
           */
          const event =
            typeof message === 'string'
              ? JSON.parse(message)
              : message;

          const eventType = event?.event || event?.type;
          const payload = event?.data ?? event?.payload ?? event;

          if (!eventType) {
            logger.warn('⚠️ Missing event type in auth message', { message });
            return;
          }

          /**
           * ============================
           * HANDLE LOGIN EVENT
           * ============================
           */
          if (eventType === EVENTS.USER_LOGGED_IN) {
            const userId = payload?.userId;
            const email = payload?.email;

            logger.info('📥 Processing user.logged_in event', {
              userId,
              email,
            });

            // =====================================
            // BUSINESS LOGIC (SAFE PLACE)
            // =====================================
            // - update last login timestamp
            // - login history
            // - fraud detection hooks
            // - analytics tracking

            logger.info('✅ Login event processed successfully', {
              userId,
            });

            return;
          }

          /**
           * UNKNOWN EVENTS
           */
          logger.warn('⚠️ Unhandled auth event received', {
            eventType,
            payload,
          });
        } catch (error: any) {
          logger.error('❌ Failed to handle auth login event', {
            error: error.message,
            rawMessage:
              typeof message === 'string'
                ? message.substring(0, 300)
                : message,
          });

          throw error;
        }
      }
    );

    logger.info('✅ Auth Login Consumer started and running');
  } catch (error: any) {
    logger.error('❌ Failed to start Auth Login Consumer', {
      error: error.message,
    });

    throw error;
  }
};