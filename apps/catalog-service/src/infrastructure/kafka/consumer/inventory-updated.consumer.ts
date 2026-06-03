import {
  createConsumer,
  runConsumer,
  EVENTS,
  TOPICS,
} from '@org/shared-kafka';

import logger from '@org/shared-logger';

export const startCatalogConsumer = async (
  inventoryService: any
) => {

  const groupId = 'catalog-service-group';

  const consumer = createConsumer({
    groupId,
    topics: [
      TOPICS.ORDERS,
      TOPICS.PAYMENTS,
    ],
    serviceName: 'catalog-service',
  });

  await runConsumer(
    consumer,
    {
      groupId,
      topics: [
        TOPICS.ORDERS,
        TOPICS.PAYMENTS,
      ],
      serviceName: 'catalog-service',
    },

    async (event: any) => {

      try {

        const eventType = event?.event;
        const data = event?.data || {};

        logger.info('📥 Catalog event received', {
          eventType,
          orderId: data.orderId,
        });

        switch (eventType) {

          /**
           * =====================================
           * 📦 ORDER CREATED
           * Reduce inventory
           * =====================================
           */
          case EVENTS.ORDER_CREATED:

            await inventoryService.reduceStock(
              data.items || []
            );

            logger.info('📉 Inventory reduced', {
              orderId: data.orderId,
            });

            break;

          /**
           * =====================================
           * ❌ ORDER CANCELLED
           * Restore inventory
           * =====================================
           */
          case EVENTS.ORDER_CANCELLED:

            await inventoryService.restoreStock(
              data.items || []
            );

            logger.info('📈 Inventory restored', {
              orderId: data.orderId,
            });

            break;

          /**
           * =====================================
           * 💳 PAYMENT COMPLETED
           * Finalize stock
           * =====================================
           */
          case EVENTS.PAYMENT_COMPLETED:

            logger.info('💰 Payment confirmed for inventory', {
              orderId: data.orderId,
            });

            break;

          default:

            logger.warn('Unknown catalog event', {
              eventType,
            });
        }

      } catch (error: any) {

        logger.error('❌ Catalog consumer failed', {
          error: error.message,
        });

        throw error;
      }
    }
  );

  logger.info('🚀 Catalog consumer started');
};