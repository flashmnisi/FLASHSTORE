// apps/catalog-service/src/presentation/controllers/category.controller.ts

import { Request, Response } from 'express';
import { CategoryService } from '../../application/services/category.service';
import { validators } from '../../utils/validators';
import logger from '@org/shared-logger';

export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

 /**
   * ================================
   * CREATE CATEGORY WITH IMAGE
   * ================================
   */
createCategory = async (req: Request, res: Response) => {
  try {

    const file =
      req.file as Express.Multer.File | undefined;

    const imageBaseUrl =
      process.env.IMAGE_BASE_URL ||
      'http://localhost:8080/uploads/categories/';

    const imageUrl =
      file
        ? `${imageBaseUrl}${file.filename}`
        : undefined;

    const dto = validators.category.parse({
      ...req.body,
      imageUrl,
    });

    const category =
      await this.categoryService.createCategory(dto);

    logger.info('✅ Category created with image', {
      categoryId: category.id,
      name: category.name,
      imageUrl: category.imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category.toJSON
        ? category.toJSON()
        : category,
    });

  } catch (error: any) {

    logger.error(
      '❌ Create category failed',
      {
        error: error.message,
      }
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        'Failed to create category',
    });
  }
};

  /**
   * ================================
   * UPDATE CATEGORY (with optional image)
   * ================================
   */
  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const dto = validators.category.partial().parse({
        ...req.body,
        imageUrl: req.file ? `/uploads/categories/${req.file.filename}` : undefined,
      });

      const category = await this.categoryService.updateCategory(id, dto);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      return res.json({
        success: true,
        message: 'Category updated successfully',
        data: category.toJSON ? category.toJSON() : category,
      });
    } catch (error: any) {
      logger.error('❌ Update category failed', { error: error.message });

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update category',
      });
    }
  };

  /**
   * ================================
   * GET CATEGORY BY ID
   * ================================
   */
  getCategoryById = async (
    req: Request,
    res: Response
  ) => {
    try {

      const { id } = req.params;

      const category =
        await this.categoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }

      return res.json({
        success: true,
        data: category.toJSON(),
      });

    } catch (error: any) {

      logger.error(
        '❌ Get category failed',
        {
          error: error.message,
          categoryId: req.params.id,
        }
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch category',
      });
    }
  };

  /**
   * ================================
   * GET ALL CATEGORIES
   * ================================
   */
  getAllCategories = async (
    req: Request,
    res: Response
  ) => {
    try {

      const { parentId } = req.query;

      const categories =
        await this.categoryService.getAllCategories(
          parentId as string | undefined
        );

      return res.json({
        success: true,
        count: categories.length,
        data: categories.map(c => c.toJSON()),
      });

    } catch (error: any) {

      logger.error(
        '❌ Get categories failed',
        {
          error: error.message,
        }
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
      });
    }
  };

  /**
   * ================================
   * GET CATEGORY TREE
   * ================================
   */
  getCategoryTree = async (
    req: Request,
    res: Response
  ) => {
    try {

      const tree =
        await this.categoryService.getCategoryTree();

      return res.json({
        success: true,
        count: tree.length,
        data: tree.map(c => c.toJSON()),
      });

    } catch (error: any) {

      logger.error(
        '❌ Get category tree failed',
        {
          error: error.message,
        }
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch category tree',
      });
    }
  };

  /**
   * ================================
   * DELETE CATEGORY
   * ================================
   */
  deleteCategory = async (
    req: Request,
    res: Response
  ) => {
    try {

      const { id } = req.params;

      await this.categoryService.deleteCategory(id);

      logger.info(
        '🗑️ Category deleted',
        {
          categoryId: id,
        }
      );

      return res.json({
        success: true,
        message: 'Category deleted successfully',
      });

    } catch (error: any) {

      logger.error(
        '❌ Delete category failed',
        {
          error: error.message,
          categoryId: req.params.id,
        }
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          'Failed to delete category',
      });
    }
  };
}