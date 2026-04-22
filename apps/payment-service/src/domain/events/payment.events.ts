export interface PaymentCompletedPayload {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
}

export interface PaymentFailedPayload {
  paymentId: string;
  orderId: string;
  userId: string;
  error: string;
}

export const PaymentEvents = {
  COMPLETED: 'payment.completed',
  FAILED: 'payment.failed',
};