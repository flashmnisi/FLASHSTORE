import { createConsumer, runConsumer } from '@org/shared-kafka';
import logger from '@org/shared-logger';

export const startCatalogConsumer = async () => {
  try {
    const consumer = createConsumer({
      groupId: 'catalog-service-group',
      topics: ['flashstore.inventory']
    });

    await runConsumer(
      consumer,
      {
        groupId: 'catalog-service-group',
        topics: ['flashstore.inventory']
      },
      async (message) => {
        logger.info(
          {
            event: message.event,
            productId: message.data?.productId,
            data: message.data
          },
          'Catalog service received inventory event'
        );

        // Example: Handle stock updates from inventory service
        if (message.event === 'stock.updated') {
          logger.info(
            {
              productId: message.data?.productId,
              newStock: message.data?.stock
            },
            'Stock update received for product'
          );

          // TODO: Update product stock in catalog DB
          // await updateProductStock(message.data?.productId, message.data?.stock);
        }
      }
    );

    logger.info('👥 Catalog consumer started successfully');
  } catch (error: any) {
    logger.error(
      { error: error.message },
      'Failed to start catalog consumer'
    );
  }
};