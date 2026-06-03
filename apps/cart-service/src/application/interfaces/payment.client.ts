// apps/cart-service/src/application/interface/payment.client.ts

export interface IPaymentClient {
  processPayment(dto: {
    orderId: string;
    userId: string;
    amount: number;
    idempotencyKey?: string;
    correlationId?: string;
  }): Promise<{
    paymentId: string;
    clientSecret: string;
    status: string;
  }>;
}