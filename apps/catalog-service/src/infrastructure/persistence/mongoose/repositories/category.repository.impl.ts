// apps/catalog-service/src/infrastructure/persistence/mongoose/repositories/category.repository.impl.ts

import { CategoryEntity } from '../../../../domain/entities/category.entity';
import { ICategoryRepository } from '../../../../domain/repositories/category.repository';

import {
  CategoryModel,
  ICategoryDocument,
} from '../models/category.model';

import logger from '@org/shared-logger';

export class CategoryRepositoryImpl
  implements ICategoryRepository
{
  /**
   * =========================================
   * CREATE CATEGORY
   * =========================================
   */
  async create(
    category: CategoryEntity
  ): Promise<CategoryEntity> {
 const doc = await CategoryModel.create({
  name: category.name,
  slug: category.slug,
  description: category.description,
  parentId: category.parentId,
  imageUrl: category.imageUrl,
  icon: category.icon,
  isFeatured: category.isFeatured,
  sortOrder: category.sortOrder,
  isActive: category.isActive,
});

    logger.info('Category created in database', {
      categoryId: doc._id.toString(),
      slug: doc.slug,
    });

    return this.mapToEntity(doc);
  }

  /**
   * =========================================
   * FIND CATEGORY BY ID
   * =========================================
   */
  async findById(
    id: string
  ): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findById(id);

    return doc
      ? this.mapToEntity(doc)
      : null;
  }

  /**
   * =========================================
   * FIND CATEGORY BY SLUG
   * =========================================
   */
  async findBySlug(
    slug: string
  ): Promise<CategoryEntity | null> {
    const doc = await CategoryModel.findOne({
      slug,
      isActive: true,
    });

    return doc
      ? this.mapToEntity(doc)
      : null;
  }

  /**
   * =========================================
   * FIND ALL CATEGORIES
   * =========================================
   */
  async findAll(
    parentId?: string
  ): Promise<CategoryEntity[]> {
    const query: any = {
      isActive: true,
    };

    if (parentId) {
      query.parentId = parentId;
    }

    const docs = await CategoryModel
      .find(query)
      .sort({ name: 1 });

    return docs.map(doc =>
      this.mapToEntity(doc)
    );
  }

  /**
   * =========================================
   * FIND CATEGORY TREE
   * =========================================
   */
  async findCategoryTree(): Promise<CategoryEntity[]> {
    const docs = await CategoryModel
      .find({ isActive: true })
      .sort({ name: 1 });

    return docs.map(doc =>
      this.mapToEntity(doc)
    );
  }

  /**
   * =========================================
   * UPDATE CATEGORY
   * =========================================
   */
  async update(
    id: string,
    data: Partial<CategoryEntity>
  ): Promise<CategoryEntity | null> {
    const doc =
      await CategoryModel.findByIdAndUpdate(
        id,
        {
          ...data,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return doc
      ? this.mapToEntity(doc)
      : null;
  }

  /**
   * =========================================
   * DELETE CATEGORY
   * =========================================
   */
  async delete(id: string): Promise<boolean> {

    // SOFT DELETE (recommended)
    const result =
      await CategoryModel.updateOne(
        { _id: id },
        {
          isActive: false,
          updatedAt: new Date(),
        }
      );

    return result.modifiedCount > 0;
  }

  /**
   * =========================================
   * CHECK CATEGORY EXISTS
   * =========================================
   */
  async exists(id: string): Promise<boolean> {
    const count =
      await CategoryModel.countDocuments({
        _id: id,
        isActive: true,
      });

    return count > 0;
  }

  /**
   * =========================================
   * MAP MONGOOSE DOC → ENTITY
   * =========================================
   */
private mapToEntity(
  doc: ICategoryDocument
): CategoryEntity {
  return new CategoryEntity(
    doc._id.toString(),

    doc.name,
    doc.slug,

    doc.description,

    doc.parentId?.toString(),

    doc.imageUrl,
    doc.icon,

    doc.isFeatured,
    doc.sortOrder,

    doc.isActive,

    doc.createdAt,
    doc.updatedAt
  );
}
}