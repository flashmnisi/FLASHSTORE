// apps/catalog-service/src/presentation/controllers/product.controller.ts

import { Request, Response } from 'express';
import { ProductService } from '../../application/services/product.service';
import { validators } from '../../utils/validators';
import logger from '@org/shared-logger';

export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

/**
 * =========================================
 * CREATE PRODUCT
 * =========================================
 */
createProduct = async (req: Request, res: Response) => {
  try {
    
       const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            res.status(400).json({ error: "No images uploaded" });
            return;
        }

        console.log('BODY:', req.body);
        console.log('FILES:', req.files);

    // Build image URLs
    const imageBaseUrl = process.env.IMAGE_BASE_URL || 'http://localhost:8080/uploads/products/';

    const images = files?.map(file => `${imageBaseUrl}${file.filename}`) || [];

    // Prepare data for validation
    const rawData = {
      ...req.body,
      images,
      price: Number(req.body.price),
      stockQuantity: Number(req.body.stockQuantity || 0),
      discountPercentage: Number(req.body.discountPercentage || 0),
      
      // Handle tags (comma-separated or array)
      tags: typeof req.body.tags === 'string'
        ? req.body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : Array.isArray(req.body.tags) ? req.body.tags : [],

      // Boolean conversion
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isHotDeal: req.body.isHotDeal === 'true' || req.body.isHotDeal === true,
      isNewArrival: req.body.isNewArrival === 'true' || req.body.isNewArrival === true,
      inStock: req.body.inStock !== 'false', // default true
    };

    const dto = validators.createProduct.parse(rawData);

    const product = await this.productService.createProduct(dto);

    logger.info('✅ Product created successfully', {
      productId: product.id,
      name: product.name,
      imagesCount: images.length,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product.toJSON ? product.toJSON() : product,
    });

  } catch (error: any) {
    logger.error('❌ Create product failed', { 
      error: error.message,
      body: req.body 
    });

    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

  /**
   * =========================================
   * GET PRODUCT BY ID
   * =========================================
   */
  getProductById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const product =
        await this.productService.getProductById(id);

      res.status(200).json({
        success: true,
        data: product.toJSON(),
      });
    } catch (error: any) {
      logger.error('❌ Get product failed', {
        error: error.message,
      });

      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  };

  /**
   * =========================================
   * GET PRODUCT BY SLUG
   * =========================================
   */
  getProductBySlug = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { slug } = req.params;

      const product =
        await this.productService.getProductBySlug(slug);

      res.status(200).json({
        success: true,
        data: product.toJSON(),
      });
    } catch (error: any) {
      logger.error('❌ Get product by slug failed', {
        error: error.message,
      });

      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  };

  /**
   * =========================================
   * SEARCH PRODUCTS
   * =========================================
   */
  searchProducts = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const dto = validators.searchProducts.parse({
        ...req.query,

        page: req.query.page
          ? Number(req.query.page)
          : 1,

        limit: req.query.limit
          ? Number(req.query.limit)
          : 20,

        minPrice: req.query.minPrice
          ? Number(req.query.minPrice)
          : undefined,

        maxPrice: req.query.maxPrice
          ? Number(req.query.maxPrice)
          : undefined,

        isFeatured:
          req.query.isFeatured === 'true',

        isHotDeal:
          req.query.isHotDeal === 'true',

        isNewArrival:
          req.query.isNewArrival === 'true',

        inStock:
          req.query.inStock === 'true',

        tags:
          typeof req.query.tags === 'string'
            ? req.query.tags
                .split(',')
                .map((t) => t.trim())
            : undefined,
      });

      const result =
        await this.productService.searchProducts(dto);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error: any) {
      logger.error('❌ Search products failed', {
        error: error.message,
      });

      res.status(400).json({
        success: false,
        message: error.message || 'Search failed',
      });
    }
  };

  /**
   * =========================================
   * UPDATE PRODUCT
   * =========================================
   */
  updateProduct = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;

      const imageBaseUrl =
        process.env.IMAGE_BASE_URL ||
        'http://localhost:8080/uploads/';

      const uploadedImages =
        files?.map(
          (file) => `${imageBaseUrl}${file.filename}`
        ) || undefined;

      const dto = validators.updateProduct.parse({
        ...req.body,

        images: uploadedImages,

        price: req.body.price
          ? Number(req.body.price)
          : undefined,

        stockQuantity: req.body.stockQuantity
          ? Number(req.body.stockQuantity)
          : undefined,

        discountPercentage: req.body.discountPercentage
          ? Number(req.body.discountPercentage)
          : undefined,

        tags:
          typeof req.body.tags === 'string'
            ? req.body.tags.split(',').map((t: string) => t.trim())
            : req.body.tags,

        isFeatured:
          req.body.isFeatured === 'true' ||
          req.body.isFeatured === true,

        isHotDeal:
          req.body.isHotDeal === 'true' ||
          req.body.isHotDeal === true,

        isNewArrival:
          req.body.isNewArrival === 'true' ||
          req.body.isNewArrival === true,

        inStock:
          req.body.inStock === 'true' ||
          req.body.inStock === true,

        isActive:
          req.body.isActive === 'true' ||
          req.body.isActive === true,
      });

      const { id } = req.params;

      const product =
        await this.productService.updateProduct(
          id,
          dto
        );

      logger.info('✅ Product updated', {
        productId: id,
      });

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product.toJSON(),
      });
    } catch (error: any) {
      logger.error('❌ Update product failed', {
        error: error.message,
      });

      res.status(400).json({
        success: false,
        message:
          error.message || 'Failed to update product',
      });
    }
  };

  /**
   * =========================================
   * DELETE PRODUCT
   * =========================================
   */
  deleteProduct = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      await this.productService.deleteProduct(id);

      logger.info('🗑️ Product deleted', {
        productId: id,
      });

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error: any) {
      logger.error('❌ Delete product failed', {
        error: error.message,
      });

      res.status(400).json({
        success: false,
        message:
          error.message || 'Failed to delete product',
      });
    }
  };

  /**
   * =========================================
   * FEATURED PRODUCTS
   * =========================================
   */
  getFeaturedProducts = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products =
        await this.productService.getFeaturedProducts();

      res.status(200).json({
        success: true,
        data: products.map((p) => p.toJSON()),
      });
    } catch (error: any) {
      logger.error('❌ Featured products failed', {
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured products',
      });
    }
  };

  /**
   * =========================================
   * HOT DEALS
   * =========================================
   */
  getHotDeals = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products =
        await this.productService.getHotDeals();

      res.status(200).json({
        success: true,
        data: products.map((p) => p.toJSON()),
      });
    } catch (error: any) {
      logger.error('❌ Hot deals failed', {
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: 'Failed to fetch hot deals',
      });
    }
  };

  /**
   * =========================================
   * NEW ARRIVALS
   * =========================================
   */
  getNewArrivals = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products =
        await this.productService.getNewArrivals();

      res.status(200).json({
        success: true,
        data: products.map((p) => p.toJSON()),
      });
    } catch (error: any) {
      logger.error('❌ New arrivals failed', {
        error: error.message,
      });

      res.status(500).json({
        success: false,
        message: 'Failed to fetch new arrivals',
      });
    }
  };
}