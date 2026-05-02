// apps/catalog-service/src/presentation/controllers/product.controller.ts

import { Request, Response } from 'express';
import { ProductService } from '../../application/services/product.service';
import { validators } from '../../utils/validators';
import logger from '@org/shared-logger';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * CREATE Product with Image Upload
   */
  createProduct = async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one product image is required',
        });
      }

      const basePath = process.env.IMAGE_BASE_URL || 'http://localhost:8080/assets/';
      const images = files.map(file => `${basePath}${file.filename}`);

      const dto = validators.createProduct.parse(req.body);

      const product = await this.productService.createProduct(dto, images);

      logger.info('Product created with images', {
        productId: product.id,
        imageCount: images.length,
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product.toJSON(),
      });
    } catch (error: any) {
      logger.error('Create product failed', { 
        error: error.message,
        name: req.body?.name 
      });

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create product',
      });
    }
  };

  /**
   * GET Product by ID
   */
  getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);

      return res.json({
        success: true,
        data: product.toJSON(),
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  };

  /**
   * GET Product by Slug (NEW)
   */
  getProductBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const product = await this.productService.getProductBySlug(slug);

      return res.json({
        success: true,
        data: product.toJSON(),
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  };

  /**
   * SEARCH Products
   */
  searchProducts = async (req: Request, res: Response) => {
    try {
      const dto = validators.searchProducts.parse(req.query);
      const result = await this.productService.searchProducts(dto);

      return res.json({
        success: true,
        result,
      });
    } catch (error: any) {
      logger.error('Product search failed', { error: error.message });
      return res.status(400).json({
        success: false,
        message: error.message || 'Search failed',
      });
    }
  };

  /**
   * UPDATE Product
   */
  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dto = validators.updateProduct.parse(req.body);

      const product = await this.productService.updateProduct(id, dto);

      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: product.toJSON(),
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update product',
      });
    }
  };

  /**
   * DELETE Product
   */
  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);

      return res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete product',
      });
    }
  };
}