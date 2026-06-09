export class OrderEntity {
  public readonly id: string;

  public userId: string;
  public items: OrderItem[];
  public totalAmount: number;
  public currency: string;

  public status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  public paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';

  public idempotencyKey: string;

  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    items: OrderItem[],
    totalAmount: number,
    idempotencyKey: string, 
    currency: string = 'ZAR', 
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' = 'pending',
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' = 'pending',
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.currency = currency;

    this.idempotencyKey = idempotencyKey; 

    this.status = status;
    this.paymentStatus = paymentStatus;

    this.createdAt = createdAt;
    this.updatedAt = new Date();
  }

  /**
   * Calculate total from items
   */
  calculateTotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  /**
   * Confirm order after payment success
   */
  confirmOrder() {
    this.status = 'confirmed';
    this.paymentStatus = 'paid';
    this.updatedAt = new Date();
  }

  /**
   * Cancel order
   */
  cancelOrder() {
    this.status = 'cancelled';
    this.updatedAt = new Date();
  }
}

/**
 * Order item type
 */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}