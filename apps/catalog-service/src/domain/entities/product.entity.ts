// apps/catalog-service/src/domain/entities/product.entity.ts

export class ProductEntity {
  constructor(
    public readonly id: string = '',
    private _name: string,
    private _slug: string,
    private _description: string,
    private _price: number,
    private _currency: string = 'ZAR',
    private _categoryId: string,
    private _brand?: string,
    private _images: string[] = [],
    private _tags: string[] = [],
    private _inStock: boolean = true,
    private _stockQuantity: number = 0,
    private _isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    private _updatedAt?: Date
  ) {}

  // Getters
  get name(): string { return this._name; }
  get slug(): string { return this._slug; }
  get description(): string { return this._description; }
  get price(): number { return this._price; }
  get currency(): string { return this._currency; }
  get categoryId(): string { return this._categoryId; }
  get brand(): string | undefined { return this._brand; }
  get images(): string[] { return this._images; }
  get tags(): string[] { return this._tags; }
  get inStock(): boolean { return this._inStock; }
  get stockQuantity(): number { return this._stockQuantity; }
  get isActive(): boolean { return this._isActive; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // Domain Methods
  updateStock(quantity: number): void {
    this._stockQuantity = quantity;
    this._inStock = quantity > 0;
    this._updatedAt = new Date();
  }

  decreaseStock(quantity: number): void {
    if (quantity > this._stockQuantity) {
      throw new Error('Insufficient stock');
    }
    this._stockQuantity -= quantity;
    this._inStock = this._stockQuantity > 0;
    this._updatedAt = new Date();
  }

  increaseStock(quantity: number): void {
    this._stockQuantity += quantity;
    this._inStock = true;
    this._updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) throw new Error('Price must be positive');
    this._price = newPrice;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  addImage(imageUrl: string): void {
    if (!this._images.includes(imageUrl)) {
      this._images.push(imageUrl);
      this._updatedAt = new Date();
    }
  }

  removeImage(imageUrl: string): void {
    this._images = this._images.filter(img => img !== imageUrl);
    this._updatedAt = new Date();
  }

  // Serialization
  toJSON() {
    return {
      id: this.id,
      name: this._name,
      slug: this._slug,
      description: this._description,
      price: this._price,
      currency: this._currency,
      categoryId: this._categoryId,
      brand: this._brand,
      images: this._images,
      tags: this._tags,
      inStock: this._inStock,
      stockQuantity: this._stockQuantity,
      isActive: this._isActive,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}