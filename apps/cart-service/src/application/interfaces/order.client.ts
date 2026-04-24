export interface IOrderClient {
  createOrder(input: {
    userId: string;
    items: any[];
    totalAmount: number;
  }): Promise<{
    orderId: string;
    status: string;
  }>;

  cancelOrder(orderId: string): Promise<void>;
}