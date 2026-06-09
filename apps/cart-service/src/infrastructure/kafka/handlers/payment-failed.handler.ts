import logger from '@org/shared-logger';

import { CartCheckoutOrchestrator } from '../../checkout/cart-checkout.orchestrator';

export class PaymentFailedHandler {
  constructor(
    private readonly orchestrator: CartCheckoutOrchestrator
  ) {}

  async handle(message: any) {
    const data = message.data;

    logger.warn(
      '❌ Processing payment.failed',
      {
        orderId: data.orderId,
      }
    );

    if (data.orderId) {
      await this.orchestrator
        .handlePaymentFailure(
          data.orderId
        );
    }
  }
}