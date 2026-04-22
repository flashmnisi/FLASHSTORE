import { BaseEvent } from './base-event';

export interface PaymentCompletedPayload {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'success';
}

export type PaymentCompletedEvent = BaseEvent<PaymentCompletedPayload>;

export const createPaymentCompletedEvent = (
  payload: PaymentCompletedPayload,
  metadata?: BaseEvent['metadata']
): PaymentCompletedEvent => ({
  event: 'payment.completed',
  version: 1,
  timestamp: new Date().toISOString(),
  data: payload,
  metadata,
});