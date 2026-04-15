import { publish } from '@org/shared-kafka';
import { USER_EVENTS } from '../../domain/events/user.events';
import logger from '@org/shared-logger';
import { UserEntity } from '../../domain/entities/user.entities';

export class UserProducer {
  async userRegistered(user: UserEntity) {
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
    logger.info({ userId: user.id, email: user.email }, '✅ Published user.registered event');
  }

  async userLoggedIn(user: UserEntity) {
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