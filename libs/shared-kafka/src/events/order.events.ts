import { BaseEvent } from './base-event';

export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: string;
}

export type OrderCreatedEvent = BaseEvent<OrderCreatedPayload>;

export const createOrderCreatedEvent = (
  payload: OrderCreatedPayload,
  metadata?: BaseEvent['metadata']
): OrderCreatedEvent => ({
  event: 'order.created',
  version: 1,
  timestamp: new Date().toISOString(),
  data: payload,
  metadata,
});