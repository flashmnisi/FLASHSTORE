// apps/catalog-service/src/domain/repositories/product.repository.ts

import { ProductEntity } from '../entities/product.entity';

export interface ProductSearchCriteria {
  query?: string;

  // Category
  categoryId?: string;
  subCategory?: string;

  // Brand
  brand?: string;

  // Tags
  tags?: string[];

  // Marketing flags
  isFeatured?: boolean;
  isHotDeal?: boolean;
  isNewArrival?: boolean;

  // Price filters
  minPrice?: number;
  maxPrice?: number;

  // Inventory
  inStock?: boolean;

  // Sorting
  sort?:
    | 'relevance'
    | 'price_asc'
    | 'price_desc'
    | 'newest'
    | 'oldest';

  // Pagination
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: ProductEntity[];

  total: number;

  page: number;
  limit: number;

  totalPages: number;
}

export interface IProductRepository {
  /**
   * =========================================
   * CREATE PRODUCT
   * =========================================
   */
  create(
    product: ProductEntity
  ): Promise<ProductEntity>;

  /**
   * =========================================
   * FIND BY ID
   * =========================================
   */
  findById(
    id: string
  ): Promise<ProductEntity | null>;

  /**
   * =========================================
   * FIND BY SLUG
   * =========================================
   */
  findBySlug(
    slug: string
  ): Promise<ProductEntity | null>;

  /**
   * =========================================
   * UPDATE PRODUCT
   * =========================================
   */
  update(
    id: string,
    product: Partial<ProductEntity>
  ): Promise<ProductEntity | null>;

  /**
   * =========================================
   * SOFT DELETE PRODUCT
   * =========================================
   */
  delete(
    id: string
  ): Promise<boolean>;

  /**
   * =========================================
   * SEARCH PRODUCTS
   * =========================================
   */
  search(
    criteria: ProductSearchCriteria
  ): Promise<ProductSearchResult>;

  /**
   * =========================================
   * FIND FEATURED PRODUCTS
   * =========================================
   */
  findFeatured(): Promise<ProductEntity[]>;

  /**
   * =========================================
   * FIND HOT DEAL PRODUCTS
   * =========================================
   */
  findHotDeals(): Promise<ProductEntity[]>;

  /**
   * =========================================
   * FIND NEW ARRIVAL PRODUCTS
   * =========================================
   */
  findNewArrivals(): Promise<ProductEntity[]>;

  /**
   * =========================================
   * FIND PRODUCTS BY CATEGORY
   * =========================================
   */
  findByCategory(
    categoryId: string
  ): Promise<ProductEntity[]>;

  /**
   * =========================================
   * UPDATE STOCK
   * =========================================
   */
  updateStock(
    productId: string,
    quantity: number
  ): Promise<ProductEntity | null>;

  /**
   * =========================================
   * CHECK IF PRODUCT EXISTS
   * =========================================
   */
  exists(
    id: string
  ): Promise<boolean>;
}