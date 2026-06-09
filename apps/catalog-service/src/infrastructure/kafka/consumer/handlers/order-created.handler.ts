import logger from '@org/shared-logger';

export class OrderCreatedHandler {
  constructor(
    private readonly inventoryService: any
  ) {}

  async handle(message: any) {
    const data = message.data;

    await this.inventoryService.reduceStock(
      data.items || []
    );

    logger.info(
      '📉 Inventory reduced',
      {
        orderId: data.orderId,
      }
    );
  }
}