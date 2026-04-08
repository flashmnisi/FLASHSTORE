import { Category } from './category.model';
import { CreateCategoryDto } from './category.dto';
import logger from '@org/shared-logger';
import { publish } from '@org/shared-kafka';

export class CategoryService {
  async createCategory(dto: CreateCategoryDto, images: string[]) {
    try {
      const category = await Category.create({
        name: dto.name,
        images,
      });

      await publish({
        topic: 'flashstore.categories',
        message: {
          event: 'category.created',
          data: {
            categoryId: category._id,
            name: category.name,
            images: category.images,
          },
          source: 'catalog-service',
        },
        key: String(category._id),
      });

      logger.info({ categoryId: category._id, name: category.name }, 'Category created successfully');
      return category;
    } catch (error: any) {
      logger.error({ error: error.message, name: dto.name }, 'Failed to create category');
      throw error;
    }
  }

  async getAllCategories() {
    return Category.find({ isActive: true }).sort({ createdAt: -1 });
  }
}

export const categoryService = new CategoryService();