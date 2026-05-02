// apps/catalog-service/src/application/services/catalog.service.ts

import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import logger from '@org/shared-logger';

export class CatalogService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService
  ) {}

  // Product related
  get products() {
    return this.productService;
  }

  // Category related
  get categories() {
    return this.categoryService;
  }

  /**
   * Health check for catalog service
   */
  async healthCheck() {
    logger.info('Catalog service health check');
    return {
      status: 'healthy',
      services: {
        products: 'operational',
        categories: 'operational',
      },
    };
  }
}