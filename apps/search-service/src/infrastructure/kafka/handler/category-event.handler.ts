// apps/search-service/src/infrastructure/kafka/handlers/category-event.handler.ts

import logger from '@org/shared-logger';

export class CategoryEventHandler {
  async handle(message: any) {
    const data = message.data;

    logger.info(
      '📂 Category event received in search-service',
      {
        event: message.event,
        categoryId: data.categoryId,
      }
    );

    // future:
    // update category metadata
    // sync elasticsearch category index
  }
}