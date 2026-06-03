// apps/catalog-service/src/application/services/catalog.service.ts

import { ProductService } from './product.service';
import { CategoryService } from './category.service';

import logger from '@org/shared-logger';

export class CatalogService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) {}

  /**
   * =========================================
   * PRODUCT ACCESS
   * =========================================
   */
  get products(): ProductService {
    return this.productService;
  }

  /**
   * =========================================
   * CATEGORY ACCESS
   * =========================================
   */
  get categories(): CategoryService {
    return this.categoryService;
  }

  /**
   * =========================================
   * HEALTH CHECK
   * =========================================
   */
  async healthCheck() {
    logger.info('🩺 Catalog service health check');

    return {
      success: true,
      service: 'catalog-service',
      status: 'healthy',

      services: {
        products: 'operational',
        categories: 'operational',
      },

      timestamp: new Date().toISOString(),
    };
  }
}