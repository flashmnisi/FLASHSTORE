// apps/analytics-service/src/infrastructure/kafka/consumers/user.consumer.ts

import { createConsumer, runConsumer } from '@org/shared-kafka';
import { TrackUserRegistrationUseCase } from '../../../application/use-cases/track-user-registration.usecase';
import { TOPICS, EVENTS } from '../topics';
import logger from '@org/shared-logger';

export class UserEventsConsumer {
  constructor(private readonly trackUserRegistration: TrackUserRegistrationUseCase) {}

  async start() {
    const consumer = createConsumer({
      groupId: 'analytics-user-events',
      topics: [TOPICS.USERS],
      serviceName: 'analytics-service',
    });

    await runConsumer(
      consumer,
      {
        groupId: 'analytics-user-events',
        topics: [TOPICS.USERS],
        serviceName: 'analytics-service',
      },
      async (event: any) => {
        try {
          const { event: eventType, data } = event;

          if (eventType === EVENTS.USER_REGISTERED) {
            await this.trackUserRegistration.execute({
              userId: data.userId,
              email: data.email,
              name: data.name,
            });
          }
        } catch (error: any) {
          logger.error('Failed to process user event', {
            eventType: event.event,
            error: error.message,
          });
          throw error;
        }
      }
    );

    logger.info('✅ User Events Consumer started');
  }
}