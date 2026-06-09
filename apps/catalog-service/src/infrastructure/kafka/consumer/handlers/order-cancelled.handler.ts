import logger from '@org/shared-logger';

export class OrderCancelledHandler {
  constructor(
    private readonly inventoryService: any
  ) {}

  async handle(message: any) {
    const data = message.data;

    await this.inventoryService.restoreStock(
      data.items || []
    );

    logger.info(
      '📈 Inventory restored',
      {
        orderId: data.orderId,
      }
    );
  }
}