// apps/catalog-service/src/presentation/routes/category.routes.ts

import { Router } from 'express';

import { CategoryController } from '../controllers/category.controller';
import { protect } from '../../middlewares/auth.middleware';

// Import infrastructure for DI
import { CategoryRepositoryImpl } from '../../infrastructure/persistence/mongoose/repositories/category.repository.impl';
import { CatalogProducer } from '../../infrastructure/kafka/producer/catalog.producer';
import { CategoryService } from '../../application/services/category.service';

const router = Router();

/**
 * ====================== DEPENDENCY INJECTION ======================
 */
const categoryRepository = new CategoryRepositoryImpl();
const catalogProducer = new CatalogProducer();   // or import from container if you have one

const categoryService = new CategoryService(
  categoryRepository,
  catalogProducer
);

const controller = new CategoryController(categoryService);

/**
 * ====================== CATEGORY ROUTES ======================
 */

// Create Category (Protected)
router.post(
  '/',
  protect,
  controller.createCategory
);

// Get All Categories (Public)
router.get('/', controller.getAllCategories);

// Get Category Tree (Public)
router.get('/tree', controller.getCategoryTree);

// Get Category by ID (Public)
router.get('/:id', controller.getCategoryById);

// Update Category (Protected)
router.put(
  '/:id',
  protect,
  controller.updateCategory
);

// Delete Category (Protected)
router.delete(
  '/:id',
  protect,
  controller.deleteCategory
);

export default router;