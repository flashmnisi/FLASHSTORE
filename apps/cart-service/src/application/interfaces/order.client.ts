export interface IOrderClient {
  createOrder(dto: {
    userId: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    idempotencyKey?: string;      // ← Added
    correlationId?: string;       // ← Added
  }): Promise<{
    orderId: string;
    // other fields returned by order service
  }>;

  cancelOrder(orderId: string): Promise<void>;
}