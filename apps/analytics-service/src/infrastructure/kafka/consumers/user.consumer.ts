// apps/analytics-service/src/infrastructure/kafka/consumers/user.consumer.ts

import { createConsumer, runConsumer } from '@org/shared-kafka';
import { TrackUserRegistrationUseCase } from '../../../application/use-cases/track-user-registration.usecase';
import logger from '@org/shared-logger';

export class UserEventsConsumer {
  constructor(private readonly trackUserRegistration: TrackUserRegistrationUseCase) {}

  async start() {
    const consumer = createConsumer({
      groupId: 'analytics-user-events',
      topics: ['flashstore.users'],
      serviceName: 'analytics-service',
    });

    await runConsumer(
      consumer,
      {
        groupId: 'analytics-user-events',
        topics: ['flashstore.users'],
        serviceName: 'analytics-service',
      },
      async (event: any) => {
        try {
          const { event: eventType, data } = event;

          if (eventType === 'user.registered') {
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
          throw error; // Let shared-kafka handle retry + DLQ
        }
      }
    );

    logger.info('✅ User Events Consumer started');
  }
}