import { publish } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export const publishProductEvent = async (eventType: string, data: any) => {
  try {
    await publish({
      topic: 'flashstore.products',
      message: {
        event: eventType,
        data,
        source: 'catalog-service',
        timestamp: new Date().toISOString(),
      },
      key: data.productId || data._id || 'catalog',
    });

    logger.info({ event: eventType, productId: data.productId }, `Published ${eventType} event`);
  } catch (error: any) {
    logger.error({ error: error.message, event: eventType }, 'Failed to publish product event');
  }
};

export const publishCategoryEvent = async (eventType: string, data: any) => {
  try {
    await publish({
      topic: 'flashstore.categories',
      message: {
        event: eventType,
        data,
        source: 'catalog-service',
        timestamp: new Date().toISOString(),
      },
      key: data.categoryId || data._id || 'catalog',
    });

    logger.info({ event: eventType, categoryId: data.categoryId }, `Published ${eventType} event`);
  } catch (error: any) {
    logger.error({ error: error.message, event: eventType }, 'Failed to publish category event');
  }
};