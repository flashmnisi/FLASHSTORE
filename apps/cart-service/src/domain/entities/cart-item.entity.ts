export class CartItemEntity {
  constructor(
    public readonly productId: string,
    public quantity: number,
    public price: number, 
    public readonly name = '', 
    public readonly image?: string
  ) {}

  get subtotal(): number {
    return this.price * this.quantity;
  }

  increase(by = 1): void {
    this.quantity += by;
  }

  setQuantity(quantity: number): void {
    if (quantity < 1) throw new Error('Quantity must be at least 1');
    this.quantity = quantity;
  }

  assertValid(): void {
    if (this.quantity < 1) throw new Error('Quantity must be at least 1');
    if (this.price <= 0) throw new Error('Price must be positive');
  }
}