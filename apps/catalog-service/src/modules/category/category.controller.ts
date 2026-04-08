import { Request, Response } from 'express';
import { categoryService } from './category.service';
import logger from '@org/shared-logger';
import { createCategorySchema } from './category.dto';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No images uploaded" 
      });
    }

    const basePath = "http://localhost:8080/assets/";   
    const images = files.map(file => `${basePath}${file.filename}`);

    const validatedData = createCategorySchema.parse(req.body);

    const category = await categoryService.createCategory(validatedData, images);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Create category failed');
    return res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create category' 
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, 'Get categories failed');
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};