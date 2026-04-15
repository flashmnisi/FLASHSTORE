import logger from '@org/shared-logger';

export const handleOrderCreated = async (data: any) => {
  logger.info(
    { orderId: data.orderId, userId: data.userId },
    'Handling order.created'
  );

  // TODO: update user orders
};

export const handleOrderStatusUpdated = async (data: any) => {
  logger.info(
    { orderId: data.orderId, status: data.status },
    'Handling order.status.updated'
  );

  // TODO: update status
};