import logger from '@org/shared-logger';

import { CartCheckoutOrchestrator } from '../../checkout/cart-checkout.orchestrator';

export class PaymentCompletedHandler {
  constructor(
    private readonly orchestrator: CartCheckoutOrchestrator
  ) {}

  async handle(message: any) {
    const data = message.data;

    logger.info(
      '💰 Processing payment.completed',
      {
        orderId: data.orderId,
      }
    );

    if (
      data.userId &&
      data.orderId
    ) {
      await this.orchestrator
        .handlePaymentSuccess(
          data.userId,
          data.orderId
        );
    }
  }
}