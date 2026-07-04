// apps/cart-service/src/infrastructure/clients/product.client.ts

import { IProductClient, ProductDto } from "../../application/interfaces/product.client";


export class ProductClient implements IProductClient {

  async getProduct(
    productId: string
  ): Promise<ProductDto | null> {

    return {
      id: productId,
      name: 'iPhone 15',
      price: 1299.99,
      currency: 'USD',
      image: 'https://example.com/product.jpg',
      inStock: true,
    };
  }

  async getProducts(
    productIds: string[]
  ): Promise<ProductDto[]> {

    return productIds.map(id => ({
      id,
      name: 'iPhone 15',
      price: 1299.99,
      currency: 'USD',
      image: 'https://example.com/product.jpg',
      inStock: true,
    }));
  }
}