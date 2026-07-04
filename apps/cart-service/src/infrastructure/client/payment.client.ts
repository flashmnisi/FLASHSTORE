// apps/cart-service/src/infrastructure/clients/payment.client.ts

import { IPaymentClient } from '../../application/interfaces/payment.client';

export class PaymentClient implements IPaymentClient {

  /**
   * Process payment via Payment Service
   */
  async processPayment(dto: {
    orderId: string;
    userId: string;
    amount: number;
    idempotencyKey?: string;
    correlationId?: string;
  }): Promise<{
    paymentId: string;
    clientSecret: string;
    status: string;
  }> {
    
    console.log('💳 [PaymentClient] Processing payment for order:', dto.orderId);

    return {
      paymentId: `pay_${Date.now()}`,
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      status: 'requires_payment_method',
    };
  }
}