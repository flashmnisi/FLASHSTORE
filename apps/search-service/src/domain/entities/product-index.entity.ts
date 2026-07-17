export class ProductIndexEntity {
  constructor(
    public readonly id: string, 

    public name: string,
    public description: string,

    public price: number,
    public currency = 'ZAR',

    public category: string,
    public brand?: string,

    public tags: string[] = [],
    public images: string[] = [],

    public inStock = true,

    public rating = 0,
    public reviewCount = 0,

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  /**
   * 🔥 Elasticsearch-friendly document transformation
   */
  toSearchDocument() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      currency: this.currency,
      category: this.category,
      brand: this.brand,
      tags: this.tags,
      images: this.images,
      inStock: this.inStock,
      rating: this.rating,
      reviewCount: this.reviewCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}