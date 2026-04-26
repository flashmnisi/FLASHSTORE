export class OrderEntity {
  public readonly id: string;
  public userId: string;
  public items: OrderItem[];
  public totalAmount: number;
  public status: 'pending' | 'confirmed' | 'cancelled' | 'shipped';
  public paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    items: OrderItem[],
    totalAmount: number,
    status: 'pending' | 'confirmed' | 'cancelled' | 'shipped' = 'pending',
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' = 'pending',
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.createdAt = createdAt;
    this.updatedAt = new Date();
  }

  // Helper method to calculate total (optional but useful)
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Business method example
  confirmOrder() {
    this.status = 'confirmed';
    this.paymentStatus = 'paid';
    this.updatedAt = new Date();
  }

  cancelOrder() {
    this.status = 'cancelled';
    this.updatedAt = new Date();
  }
}

// Optional: Separate Item type for better type safety
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}