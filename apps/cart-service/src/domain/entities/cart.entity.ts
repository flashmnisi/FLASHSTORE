import { CartItemEntity } from './cart-item.entity';

export class CartEntity {
  constructor(
    public readonly id: string, // userId
    public readonly userId: string,
    public items: CartItemEntity[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  get totalItems(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalAmount(): number {
    return this.items.reduce((sum, i) => sum + i.subtotal, 0);
  }

  addItem(item: CartItemEntity): void {
    const existing = this.items.find(i => i.productId === item.productId);

    if (existing) {
      existing.increase(item.quantity);
    } else {
      this.items.push(item);
    }

    this.touch();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(i => i.productId !== productId);
    this.touch();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const item = this.items.find(i => i.productId === productId);
    if (!item) return;

    item.setQuantity(quantity);
    this.touch();
  }

  clear(): void {
    this.items = [];
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}