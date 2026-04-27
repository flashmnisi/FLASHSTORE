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