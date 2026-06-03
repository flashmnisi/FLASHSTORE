// apps/catalog-service/src/container.ts

import logger from '@org/shared-logger';

// Infrastructure
import { ProductRepositoryImpl } from './infrastructure/persistence/mongoose/repositories/product.repository.impl';
import { CategoryRepositoryImpl } from './infrastructure/persistence/mongoose/repositories/category.repository.impl';

// Outbox
import { OutboxService } from './infrastructure/outbox/outbox.service';

// Services
import { ProductService } from './application/services/product.service';
import { CategoryService } from './application/services/category.service';
import { CatalogService } from './application/services/catalog.service';

// Use Cases
import { CreateProductUseCase } from './application/use-cases/create-product.usecase';
import { UpdateProductUseCase } from './application/use-cases/update-product.usecase';
import { DeleteProductUseCase } from './application/use-cases/delete-product.usecase';
import { SearchProductsUseCase } from './application/use-cases/search-products.usecase';
import { OutboxRepository } from './infrastructure/outbox/outbox.repository';

// ====================== REPOSITORIES ======================
const productRepository = new ProductRepositoryImpl();
const categoryRepository = new CategoryRepositoryImpl();
const outboxRepository = new OutboxRepository();

// ====================== OUTBOX ======================
const outboxService = new OutboxService(outboxRepository);

// ====================== USE CASES ======================
const createProductUseCase = new CreateProductUseCase(
  productRepository,
  outboxService
);

const updateProductUseCase = new UpdateProductUseCase(
  productRepository,
  outboxService
);

const deleteProductUseCase = new DeleteProductUseCase(
  productRepository,
  outboxService
);

const searchProductsUseCase = new SearchProductsUseCase();

// ====================== SERVICES ======================
const productService = new ProductService(
  productRepository,
  outboxService
);

const categoryService = new CategoryService(
  categoryRepository,
  outboxService
);

const catalogService = new CatalogService(
  productService,
  categoryService
);

// ====================== EXPORT ======================
export {
  catalogService,
  productService,
  categoryService,
  outboxService,
  // Use cases (if needed elsewhere)
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
  searchProductsUseCase,
};

logger.info('✅ Catalog Service Container initialized successfully');