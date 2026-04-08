import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export const startCatalogConsumer = async () => {
  try {
    const consumer = createConsumer({
      groupId: 'catalog-service-group',
      topics: ['flashstore.inventory']
    });

    await runConsumer(consumer, {
      groupId: 'catalog-service-group',
      topics: ['flashstore.inventory']
    }, async (message) => {
      logger.info(
        { event: message.event, productId: message.data?.productId },
        'Catalog service received inventory event'
      );

      // Example: Update stock when inventory service sends update
      if (message.event === 'stock.updated') {
        // TODO: Update product stock in catalog
        logger.info('Stock update received for product', { productId: message.data?.productId });
      }
    });

    logger.info('👥 Catalog consumer started successfully');
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to start catalog consumer');
  }
};