// apps/catalog-service/src/presentation/routes/product.routes.ts

import { Router } from 'express';

import { ProductController } from '../controllers/product.controller';
import { protect } from '../../middlewares/auth.middleware';

import { ProductRepositoryImpl } from '../../infrastructure/persistence/mongoose/repositories/product.repository.impl';
import { ProductService } from '../../application/services/product.service';
import { upload } from '../../middlewares/uploads.middleware';
import { outboxService } from '../../container';

const router = Router();

// =====================================
// MULTER CONFIG
// =====================================

// =====================================
// DEPENDENCY INJECTION
// =====================================

const productRepository =
  new ProductRepositoryImpl();

const productService =
  new ProductService(
    productRepository,
    outboxService
  
  );

const controller =
  new ProductController(productService);

// =====================================
// ROUTES
// =====================================

// CREATE PRODUCT
router.post(
  '/',
  upload.array('images', 10),
  controller.createProduct
);

// SEARCH PRODUCTS
router.get(
  '/search',
  controller.searchProducts
);

// GET PRODUCT BY SLUG
router.get(
  '/slug/:slug',
  controller.getProductBySlug
);

// GET FEATURED PRODUCTS
router.get(
  '/featured',
  controller.getFeaturedProducts
);

// GET HOT DEALS
router.get(
  '/hot-deals',
  controller.getHotDeals
);

// GET NEW ARRIVALS
router.get(
  '/new-arrivals',
  controller.getNewArrivals
);

// GET PRODUCT BY ID
router.get(
  '/:id',
  controller.getProductById
);

// UPDATE PRODUCT
router.put(
  '/:id',
  protect,
  controller.updateProduct
);

// DELETE PRODUCT
router.delete(
  '/:id',
  protect,
  controller.deleteProduct
);

export default router;