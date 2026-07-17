// apps/catalog-service/src/domain/entities/product.entity.ts

export class ProductEntity {
  constructor(
    public readonly id = '',

    private _name: string,
    private _slug: string,
    private _description: string,

    private _price: number,
    private _currency = 'ZAR',

    // Category
    private _categoryId: string,
    private _subCategory?: string,

    // Branding
    private _brand?: string,

    // Media
    private _images: string[] = [],

    // Tags
    private _tags: string[] = [],

    // Marketing flags
    private _isFeatured = false,
    private _isHotDeal = false,
    private _isNewArrival = false,

    // Discount
    private _discountPercentage = 0,

    // Inventory
    private _inStock = true,
    private _stockQuantity = 0,

    // Status
    private _isActive = true,

    // Dates
    public readonly createdAt: Date = new Date(),
    private _updatedAt?: Date
  ) {}

  // =========================================
  // GETTERS
  // =========================================

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get currency(): string {
    return this._currency;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get subCategory(): string | undefined {
    return this._subCategory;
  }

  get brand(): string | undefined {
    return this._brand;
  }

  get images(): string[] {
    return this._images;
  }

  get tags(): string[] {
    return this._tags;
  }

  get isFeatured(): boolean {
    return this._isFeatured;
  }

  get isHotDeal(): boolean {
    return this._isHotDeal;
  }

  get isNewArrival(): boolean {
    return this._isNewArrival;
  }

  get discountPercentage(): number {
    return this._discountPercentage;
  }

  get discountedPrice(): number {
    if (this._discountPercentage <= 0) {
      return this._price;
    }

    return Number(
      (
        this._price -
        (this._price * this._discountPercentage) / 100
      ).toFixed(2)
    );
  }

  get inStock(): boolean {
    return this._inStock;
  }

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // =========================================
  // STOCK METHODS
  // =========================================

  updateStock(quantity: number): void {
    this._stockQuantity = quantity;
    this._inStock = quantity > 0;
    this.touch();
  }

  decreaseStock(quantity: number): void {
    if (quantity > this._stockQuantity) {
      throw new Error('Insufficient stock');
    }

    this._stockQuantity -= quantity;
    this._inStock = this._stockQuantity > 0;

    this.touch();
  }

  increaseStock(quantity: number): void {
    this._stockQuantity += quantity;
    this._inStock = true;

    this.touch();
  }

  // =========================================
  // PRICE METHODS
  // =========================================

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be positive');
    }

    this._price = newPrice;

    this.touch();
  }

  applyDiscount(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Discount must be between 0 and 100');
    }

    this._discountPercentage = percentage;

    this.touch();
  }

  removeDiscount(): void {
    this._discountPercentage = 0;

    this.touch();
  }

  // =========================================
  // STATUS METHODS
  // =========================================

  activate(): void {
    this._isActive = true;

    this.touch();
  }

  deactivate(): void {
    this._isActive = false;

    this.touch();
  }

  // =========================================
  // MARKETING METHODS
  // =========================================

  markAsFeatured(): void {
    this._isFeatured = true;

    this.touch();
  }

  removeFeatured(): void {
    this._isFeatured = false;

    this.touch();
  }

  markAsHotDeal(): void {
    this._isHotDeal = true;

    this.touch();
  }

  removeHotDeal(): void {
    this._isHotDeal = false;

    this.touch();
  }

  markAsNewArrival(): void {
    this._isNewArrival = true;

    this.touch();
  }

  removeNewArrival(): void {
    this._isNewArrival = false;

    this.touch();
  }

  // =========================================
  // IMAGE METHODS
  // =========================================

  addImage(imageUrl: string): void {
    if (!this._images.includes(imageUrl)) {
      this._images.push(imageUrl);

      this.touch();
    }
  }

  removeImage(imageUrl: string): void {
    this._images = this._images.filter(
      (img) => img !== imageUrl
    );

    this.touch();
  }

  // =========================================
  // TAG METHODS
  // =========================================

  addTag(tag: string): void {
    if (!this._tags.includes(tag)) {
      this._tags.push(tag);

      this.touch();
    }
  }

  removeTag(tag: string): void {
    this._tags = this._tags.filter(
      (t) => t !== tag
    );

    this.touch();
  }

  // =========================================
  // PRIVATE HELPER
  // =========================================

  private touch(): void {
    this._updatedAt = new Date();
  }

  // =========================================
  // SERIALIZATION
  // =========================================

  toJSON() {
    return {
      id: this.id,

      name: this._name,
      slug: this._slug,
      description: this._description,

      price: this._price,
      discountedPrice: this.discountedPrice,
      discountPercentage: this._discountPercentage,

      currency: this._currency,

      categoryId: this._categoryId,
      subCategory: this._subCategory,

      brand: this._brand,

      images: this._images,
      tags: this._tags,

      isFeatured: this._isFeatured,
      isHotDeal: this._isHotDeal,
      isNewArrival: this._isNewArrival,

      inStock: this._inStock,
      stockQuantity: this._stockQuantity,

      isActive: this._isActive,

      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }
}