export interface IPaymentClient {
  processPayment(input: {
    orderId: string;
    userId: string;
    amount: number;
  }): Promise<{
    paymentId: string;
    clientSecret: string;
  }>;
}