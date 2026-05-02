// apps/catalog-service/src/domain/repositories/product.repository.ts

import { ProductEntity } from '../entities/product.entity';

export interface IProductRepository {
  /**
   * Create a new product
   */
  create(product: ProductEntity): Promise<ProductEntity>;

  /**
   * Find product by ID
   */
  findById(id: string): Promise<ProductEntity | null>;

  /**
   * Find product by slug
   */
  findBySlug(slug: string): Promise<ProductEntity | null>;

  /**
   * Update product
   */
  update(id: string, product: Partial<ProductEntity>): Promise<ProductEntity | null>;

  /**
   * Delete product (soft delete - recommended)
   */
  delete(id: string): Promise<boolean>;

  /**
   * Search products with filters and pagination
   */
  search(criteria: {
    query?: string;
    categoryId?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    inStock?: boolean;
    sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
    page?: number;
    limit?: number;
  }): Promise<{
    products: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Update stock quantity
   */
  updateStock(productId: string, quantity: number): Promise<ProductEntity | null>;

  /**
   * Check if product exists
   */
  exists(id: string): Promise<boolean>;
}