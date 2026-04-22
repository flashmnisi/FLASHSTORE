import { BaseEvent } from '@org/shared-kafka';

/**
 * ORDER CREATED EVENT
 */
export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  currency: string;
}

export type OrderCreatedEvent = BaseEvent<OrderCreatedPayload>;

export const createOrderCreatedEvent = (
  payload: OrderCreatedPayload
): OrderCreatedEvent => ({
  event: 'order.created',
  version: 1,
  timestamp: new Date().toISOString(),
  data: payload,
  metadata: {
    source: 'order-service',
  },
});

/**
 * ORDER STATUS UPDATED EVENT
 */
export interface OrderStatusUpdatedPayload {
  orderId: string;
  userId: string;
  previousStatus: string;
  newStatus: string;
}

export type OrderStatusUpdatedEvent = BaseEvent<OrderStatusUpdatedPayload>;

export const createOrderStatusUpdatedEvent = (
  payload: OrderStatusUpdatedPayload
): OrderStatusUpdatedEvent => ({
  event: 'order.status.updated',
  version: 1,
  timestamp: new Date().toISOString(),
  data: payload,
  metadata: {
    source: 'order-service',
  },
});