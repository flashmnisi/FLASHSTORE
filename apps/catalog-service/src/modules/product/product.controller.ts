import { Request, Response } from 'express';
import { productService } from './product.service';
import logger from '@org/shared-logger';
import { createProductSchema } from './product.dto';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

    const basePath = "http://localhost:8080/assets/";   // Adjust if using Nginx static serving
    const images = files.map(file => `${basePath}${file.filename}`);

    const validatedData = createProductSchema.parse(req.body);

    const product = await productService.createProduct(validatedData, images);

    return res.status(201).json({
      success: true,
      message: "Product created successfully with images",
      product,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Create product failed');
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create product' 
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Get products failed');
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};