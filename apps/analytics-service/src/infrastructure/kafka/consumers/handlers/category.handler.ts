// apps/analytics-service/src/infrastructure/kafka/handlers/category.handler.ts

import logger from '@org/shared-logger';
import { EVENTS } from '@org/shared-kafka';

export class CategoryHandler {
  async handle(message: any) {
    try {
      const eventType =
        message.event ||
        message.type;

      const data =
        message.data ||
        message.payload ||
        {};

      switch (eventType) {

        case EVENTS.CATEGORY_CREATED:

          logger.info('📂 New category created', {
            categoryId: data.categoryId || data.id,
            name: data.name,
            slug: data.slug,
          });

          break;

        case EVENTS.CATEGORY_UPDATED:

          logger.info('📝 Category updated', {
            categoryId: data.categoryId || data.id,
            name: data.name,
          });

          break;

        case EVENTS.CATEGORY_DELETED:

          logger.info('🗑️ Category deleted', {
            categoryId: data.categoryId || data.id,
          });

          break;

        default:

          logger.warn('⚠️ Unknown category event received', {
            eventType,
            categoryId: data.categoryId || data.id,
          });
      }

    } catch (error: any) {

      logger.error('❌ Error in CategoryHandler', {
        eventType: message?.event,
        error: error.message,
      });
    }
  }
}