import { publish } from '@org/shared-kafka';
import { USER_EVENTS } from '../../domain/events/user.events';
import logger from '@org/shared-logger';

export class EventPublisher {
  async publishUserRegistered(user: any) {
    await publish({
      topic: 'flashstore.users',
      message: {
        event: USER_EVENTS.USER_REGISTERED,
        data: {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        source: 'user-service',
        timestamp: new Date().toISOString(),
      },
      key: user.id,
    });
    logger.info({ userId: user.id }, `✅ Published ${USER_EVENTS.USER_REGISTERED}`);
  }

  async publishUserLoggedIn(user: any) {
    await publish({
      topic: 'flashstore.users',
      message: {
        event: USER_EVENTS.USER_LOGGED_IN,
        data: { userId: user.id, email: user.email },
        source: 'user-service',
      },
      key: user.id,
    });
  }
}