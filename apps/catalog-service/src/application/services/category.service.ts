// apps/catalog-service/src/application/services/category.service.ts

import { CategoryEntity } from '../../domain/entities/category.entity';
import { ICategoryRepository } from '../../domain/repositories/category.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import { CategoryDto } from '../dtos/category.dto';

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class CategoryService {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly outboxService: OutboxService
  ) {}

  async createCategory(dto: CategoryDto): Promise<CategoryEntity> {
    const category = new CategoryEntity(
      '',
      dto.name,
      dto.slug,
      dto.description,
      dto.parentId,
      dto.imageUrl
    );

    const created = await this.categoryRepository.create(category);

    await this.outboxService.write({
      topic: TOPICS.CATEGORIES,
      event: EVENTS.CATEGORY_CREATED,
      data: created,
      key: created.id,
    });

    logger.info('✅ Category created and queued in outbox', { 
      categoryId: created.id, 
      name: created.name 
    });

    return created;
  }

  async updateCategory(id: string, dto: Partial<CategoryDto>): Promise<CategoryEntity> {
    const updated = await this.categoryRepository.update(id, dto);

    if (!updated) {
      throw new Error('Category not found');
    }

    await this.outboxService.write({
      topic: TOPICS.CATEGORIES,
      event: EVENTS.CATEGORY_UPDATED,
      data: updated,
      key: updated.id,
    });

    logger.info('✅ Category updated and queued in outbox', { 
      categoryId: id 
    });

    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const deleted = await this.categoryRepository.delete(id);

    if (deleted) {
      await this.outboxService.write({
        topic: TOPICS.CATEGORIES,
        event: EVENTS.CATEGORY_DELETED,
        data: { categoryId: id },
        key: id,
      });

      logger.info('🗑️ Category deleted and queued in outbox', { categoryId: id });
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