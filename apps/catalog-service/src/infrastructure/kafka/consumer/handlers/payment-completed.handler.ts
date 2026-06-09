import logger from '@org/shared-logger';

export class PaymentCompletedHandler {
  async handle(message: any) {
    const data = message.data;

    logger.info(
      '💰 Payment confirmed for inventory',
      {
        orderId: data.orderId,
      }
    );
  }
}