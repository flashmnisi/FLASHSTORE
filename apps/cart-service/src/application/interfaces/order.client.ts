// apps/cart-service/src/application/interface/order.client.ts

export interface IOrderClient {
  createOrder(dto: {
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
  }>;

  cancelOrder(orderId: string): Promise<void>;
}