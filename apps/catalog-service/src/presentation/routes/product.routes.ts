// apps/catalog-service/src/presentation/routes/product.routes.ts

import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import { ProductController } from '../controllers/product.controller';
import { protect } from '../../middlewares/auth.middleware';

// Infrastructure imports for DI
import { ProductRepositoryImpl } from '../../infrastructure/persistence/mongoose/repositories/product.repository.impl';
import { CatalogProducer } from '../../infrastructure/kafka/producer/catalog.producer';
import { ProductService } from '../../application/services/product.service';

// ====================== MULTER CONFIG ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ====================== DEPENDENCY INJECTION ======================
const productRepository = new ProductRepositoryImpl();
const catalogProducer = new CatalogProducer();

const productService = new ProductService(
  productRepository,
  catalogProducer
);

const controller = new ProductController(productService);   // ← Fixed: passing productService

const router = Router();

/**
 * ====================== PRODUCT ROUTES ======================
 */

// Create Product with multiple images (Protected)
router.post(
  '/',
  protect,
  upload.array('images', 10),   // Max 10 images
  controller.createProduct
);

// Get Product by ID
router.get('/:id', controller.getProductById);

// Get Product by Slug
router.get('/slug/:slug', controller.getProductBySlug);

// Search Products (Public)
router.get('/search', controller.searchProducts);

// Update Product (Protected)
router.put(
  '/:id',
  protect,
  controller.updateProduct
);

// Delete Product (Protected)
router.delete(
  '/:id',
  protect,
  controller.deleteProduct
);

export default router;