import { EVENTS } from "@org/shared-kafka";
import logger from "@org/shared-logger";

export class UserHandler {
  constructor(
    private readonly trackUserRegistration: any
  ) {}

  async handle({
    event,
    data,
  }: {
    event: string;
    data: any;
  }) {
    try {
      switch (event) {

        case EVENTS.USER_REGISTERED:
          await this.trackUserRegistration.execute({
            userId: data.userId,
            email: data.email,
            name: data.name,
            createdAt: data.createdAt,
          });

          logger.info(
            '📊 User registration tracked',
            {
              userId: data.userId,
            }
          );

          break;

        case EVENTS.USER_LOGGED_IN:
          logger.info('🔐 User login tracked', {
            userId: data.userId,
          });
          break;

        case EVENTS.USER_UPDATED:
          logger.info('👤 User updated tracked', {
            userId: data.userId,
          });
          break;

        case EVENTS.USER_DELETED:
          logger.info('🗑️ User deleted tracked', {
            userId: data.userId,
          });
          break;

        default:
          logger.warn(
            '⚠️ Unknown user event received',
            { event }
          );
      }
    } catch (error: any) {
      logger.error(
        '❌ Error in UserHandler',
        {
          event,
          error: error.message,
        }
      );
    }
  }
}