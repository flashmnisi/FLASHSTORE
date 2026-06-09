import logger from '@org/shared-logger';

import { CartCheckoutOrchestrator } from '../../checkout/cart-checkout.orchestrator';

export class OrderCancelledHandler {
  constructor(
    private readonly orchestrator: CartCheckoutOrchestrator
  ) {}

  async handle(message: any) {
    const data = message.data;

    logger.info(
      '🚫 Processing order.cancelled',
      {
        orderId: data.orderId,
      }
    );

    if (data.userId) {
      await this.orchestrator
        .restoreCartAfterCancellation?.(
          data.userId,
          data.orderId
        );
    }
  }
}
