// apps/catalog-service/src/presentation/controllers/category.controller.ts

import { Request, Response } from 'express';
import { CategoryService } from '../../application/services/category.service';
import { validators } from '../../utils/validators';
import logger from '@org/shared-logger';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * CREATE Category
   */
  createCategory = async (req: Request, res: Response) => {
    try {
      const dto = validators.category.parse(req.body);
      const category = await this.categoryService.createCategory(dto);

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category.toJSON(),
      });
    } catch (error: any) {
      logger.error('Create category failed', { error: error.message });
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create category',
      });
    }
  };

  /**
   * GET Category by ID
   */
  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);

      return res.json({
        success: true,
        data: category.toJSON(),
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
  };

  /**
   * GET All Categories
   */
  getAllCategories = async (req: Request, res: Response) => {
    try {
      const { parentId } = req.query;
      const categories = await this.categoryService.getAllCategories(
        parentId as string | undefined
      );

      return res.json({
        success: true,
        data: categories.map((c) => c.toJSON()),
      });
    } catch (error: any) {
      logger.error('Get all categories failed', { error: error.message });
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
      });
    }
  };

  /**
   * GET Category Tree (Hierarchical)
   */
  getCategoryTree = async (req: Request, res: Response) => {
    try {
      const tree = await this.categoryService.getCategoryTree();
      return res.json({
        success: true,
        data: tree.map((c) => c.toJSON()),
      });
    } catch (error: any) {
      logger.error('Get category tree failed', { error: error.message });
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch category tree',
      });
    }
  };

  /**
   * UPDATE Category
   */
  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dto = validators.category.partial().parse(req.body); // Allow partial updates

      const category = await this.categoryService.updateCategory(id, dto);

      return res.json({
        success: true,
        message: 'Category updated successfully',
        data: category.toJSON(),
      });
    } catch (error: any) {
      logger.error('Update category failed', { error: error.message });
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update category',
      });
    }
  };

  /**
   * DELETE Category
   */
  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await this.categoryService.deleteCategory(id);   // ← Removed unused 'deleted' variable

      return res.json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete category failed', { 
        error: error.message,
        categoryId: req.params.id 
      });

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete category',
      });
    }
  };
}