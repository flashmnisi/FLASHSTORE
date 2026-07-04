// apps/payment-service/src/application/interfaces/payment.provider.ts

export interface IPaymentProvider {
  createPaymentIntent(params: {
    amount: number;
    currency: string;
    orderId: string;
    userId: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentIntentId: string;
    clientSecret: string;
  }>;

  verifyWebhookSignature(
    payload: Buffer | string,
    signature: string
  ): Promise<any>;

  getPaymentIntent?(paymentIntentId: string): Promise<any>;

  refundPayment?(paymentIntentId: string, amount?: number): Promise<any>;

  cancelPaymentIntent?(paymentIntentId: string): Promise<any>;
}
