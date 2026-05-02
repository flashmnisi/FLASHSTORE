// apps/catalog-service/src/application/services/category.service.ts

import { CategoryEntity } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryDto } from '../dtos/category.dto';
import { CatalogProducer } from '../../infrastructure/kafka/producer/catalog.producer';
import logger from '@org/shared-logger';

export class CategoryService {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly producer: CatalogProducer
  ) {}

  async createCategory(dto: CategoryDto): Promise<CategoryEntity> {
    const category = new CategoryEntity(
      '',
      dto.name,
      '', // Slug will be generated inside entity or use case
      dto.description,
      dto.parentId,
      dto.imageUrl
    );

    const created = await this.categoryRepository.create(category);
    await this.producer.categoryCreated(created);

    logger.info('Category created', { 
      categoryId: created.id, 
      name: created.name 
    });
    return created;
  }

  async updateCategory(id: string, dto: Partial<CategoryDto>): Promise<CategoryEntity> {
    const updated = await this.categoryRepository.update(id, dto);
    if (!updated) throw new Error('Category not found');

    await this.producer.categoryUpdated(updated);
    logger.info('Category updated', { categoryId: id });
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const deleted = await this.categoryRepository.delete(id);
    if (deleted) {
      await this.producer.categoryDeleted(id);
      logger.info('Category deleted', { categoryId: id });
    }
    return deleted;
  }

  async getCategoryById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async getAllCategories(parentId?: string): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll(parentId);
  }

  async getCategoryTree(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findCategoryTree();
  }
}