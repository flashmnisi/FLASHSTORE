export class CartItemEntity {
  constructor(
    public readonly productId: string,
    public quantity: number,
    public price: number, // snapshot price
    public name?: string,
    public image?: string
  ) {
    this.assertValid();
  }

  get subtotal(): number {
    return this.price * this.quantity;
  }

  increase(qty: number) {
    this.quantity += qty;
    this.assertValid();
  }

  setQuantity(qty: number) {
    this.quantity = qty;
    this.assertValid();
  }

  private assertValid() {
    if (!this.productId) throw new Error('Invalid productId');
    if (!Number.isInteger(this.quantity) || this.quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }
    if (this.quantity > 100) {
      throw new Error('Quantity exceeds allowed limit');
    }
    if (this.price < 0) throw new Error('Invalid price');
  }
}