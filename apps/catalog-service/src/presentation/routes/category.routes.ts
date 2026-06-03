// apps/catalog-service/src/presentation/routes/category.routes.ts
import { Router } from 'express';

import { CategoryController } from '../controllers/category.controller';
import { protect } from '../../middlewares/auth.middleware';

import { CategoryRepositoryImpl } from '../../infrastructure/persistence/mongoose/repositories/category.repository.impl';
import { CategoryService } from '../../application/services/category.service';
import { categoryUpload } from '../../middlewares/category-upload.middleware';
import { outboxService } from '../../container';

const router = Router();

/**
 * =====================================
 * DEPENDENCY INJECTION
 * =====================================
 */

const categoryRepository =
  new CategoryRepositoryImpl();

const categoryService =
  new CategoryService(
    categoryRepository,
    outboxService
  );

const controller =
  new CategoryController(categoryService);

/**
 * =====================================
 * CATEGORY ROUTES
 * =====================================
 */

// Create Category
router.post(
  '/',
  protect,
  categoryUpload.single('image'),
  controller.createCategory
);

// Get All Categories
router.get(
  '/',
  controller.getAllCategories
);

// Get Category Tree
router.get(
  '/tree',
  controller.getCategoryTree
);

// Get Category By ID
router.get(
  '/:id',
  controller.getCategoryById
);

// Update Category
router.put(
  '/:id',
  protect,
 categoryUpload.single('image'),
  controller.updateCategory
);

// Delete Category
router.delete(
  '/:id',
  protect,
  controller.deleteCategory
);

export default router;