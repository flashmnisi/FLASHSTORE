/**
 * Events coming from Payment Service → Order Service
 */

export interface PaymentCompletedEvent {
  event: 'payment.completed';
  data: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
  };
}

export interface PaymentFailedEvent {
  event: 'payment.failed';
  data: {
    paymentId: string;
    orderId: string;
    userId: string;
    reason?: string;
  };
}

/**
 * Consumer contract (what Order Service must implement)
 */
export interface IPaymentConsumer {
  handlePaymentCompleted(event: PaymentCompletedEvent): Promise<void>;

  handlePaymentFailed(event: PaymentFailedEvent): Promise<void>;
}