// apps/cart-service/src/application/interface/product.client.ts

export interface ProductDto {
  id: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  inStock: boolean;
}

export interface IProductClient {
  getProduct(productId: string): Promise<ProductDto | null>;

  // 🔥 Optional batch (for checkout validation)
  getProducts(productIds: string[]): Promise<ProductDto[]>;
}