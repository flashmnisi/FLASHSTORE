// apps/cart-service/src/infrastructure/clients/order.client.ts

import { IOrderClient } from '../../application/interfaces/order.client';

export class OrderClient implements IOrderClient {

  /**
   * Create a new order via Order Service
   */
  async createOrder(dto: {
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    idempotencyKey?: string;
    correlationId?: string;
  }): Promise<{
    orderId: string;
  }> {
    console.log('📦 [OrderClient] Creating order for user:', dto.userId);

    return {
      orderId: `order_${Date.now()}`,
    };
  }

  /**
   * Cancel an order (used for compensation)
   */
  async cancelOrder(orderId: string): Promise<void> {
    console.log('❌ [OrderClient] Cancelling order:', orderId);
    return;
  }
}