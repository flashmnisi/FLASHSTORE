// apps/catalog-service/src/infrastructure/persistence/mongoose/repositories/category.repository.impl.ts

import { CategoryEntity } from '../../../../domain/entities/category.entity';
import { ICategoryRepository } from '../../../../domain/repositories/category.repository';
import { CategoryModel } from '../models/category.model';
import logger from '@org/shared-logger';

export class CategoryRepositoryImpl implements ICategoryRepository {
  async create(category: CategoryEntity): Promise<CategoryEntity> {
    const doc = await CategoryModel.create({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
    });

    logger.info('Category created in database', { categoryId: doc._id });
    return this.mapToEntity(doc);
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findOne({ slug });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(parentId?: string): Promise<CategoryEntity[]> {
    const query = parentId ? { parentId } : {};
    const docs = await CategoryModel.find(query).sort({ name: 1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findCategoryTree(): Promise<CategoryEntity[]> {
    const docs = await CategoryModel.find({ isActive: true })
      .sort({ name: 1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async update(id: string, data: Partial<CategoryEntity>): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true }
    );
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async exists(id: string): Promise<boolean> {
    const count = await CategoryModel.countDocuments({ _id: id });
    return count > 0;
  }

  private mapToEntity(doc: any): CategoryEntity {
    return new CategoryEntity(
      doc._id.toString(),
      doc.name,
      doc.slug,
      doc.description,
      doc.parentId?.toString(),
      doc.imageUrl,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }
}