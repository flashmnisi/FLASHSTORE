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

  // Optional methods
  getPaymentIntent?(paymentIntentId: string): Promise<any>;

  refundPayment?(paymentIntentId: string, amount?: number): Promise<any>;

  cancelPaymentIntent?(paymentIntentId: string): Promise<any>;
}

// export interface CreatePaymentIntentInput {
//   amount: number;
//   currency: string;
//   orderId: string;
//   userId: string;
//   metadata?: Record<string, any>;
// }

// export interface PaymentIntentResult {
//   paymentIntentId: string;
//   clientSecret: string;
// }

// export interface PaymentVerificationResult {
//   success: boolean;
//   eventType: string;
//   data: any;
// }

// export interface RefundResult {
//   refundId: string;
//   status: 'succeeded' | 'failed' | 'pending';
// }

// export interface IPaymentProvider {
//   /**
//    * Create payment intent (Stripe / Paystack / etc.)
//    */
//   createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult>;

//   /**
//    * 🔐 Verify webhook signature (security critical)
//    */
//   verifyWebhookSignature(
//     payload: string,
//     signature: string
//   ): Promise<PaymentVerificationResult>;

//   /**
//    * 🔍 Retrieve payment status from provider
//    */
//   retrievePaymentIntent(paymentIntentId: string): Promise<any>;

//   /**
//    * 🔥 Refund capability (future-proof)
//    */
//   refundPayment(paymentIntentId: string): Promise<RefundResult>;
// }