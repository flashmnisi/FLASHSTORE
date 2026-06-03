// apps/order-service/src/domain/events/order.events.ts

import { BaseEvent } from "@org/shared-kafka";

/**
 * ORDER CREATED EVENT
 */
export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  
  // Added for Notification Service
  userEmail: string;
  customerName?: string;

  items: {
    productId: string;
    name?: string;
    quantity: number;
    price: number;
  }[];
  
  totalAmount: number;
  currency: string;
  
  // Optional useful fields
  shippingAddress?: any;
  paymentMethod?: string;
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
  // Optional: Add userEmail here too if needed in future
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