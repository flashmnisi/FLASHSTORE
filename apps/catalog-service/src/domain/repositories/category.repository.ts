// apps/catalog-service/src/domain/repositories/category.repository.ts

import { CategoryEntity } from '../entities/category.entity';

export interface ICategoryRepository {
  /**
   * Create a new category
   */
  create(category: CategoryEntity): Promise<CategoryEntity>;

  /**
   * Find category by ID
   */
  findById(id: string): Promise<CategoryEntity | null>;

  /**
   * Find category by slug
   */
  findBySlug(slug: string): Promise<CategoryEntity | null>;

  /**
   * Get all categories (with optional parent filter)
   */
  findAll(parentId?: string): Promise<CategoryEntity[]>;

  /**
   * Get category tree (hierarchical)
   */
  findCategoryTree(): Promise<CategoryEntity[]>;

  /**
   * Update category
   */
  update(id: string, category: Partial<CategoryEntity>): Promise<CategoryEntity | null>;

  /**
   * Delete category
   */
  delete(id: string): Promise<boolean>;

  /**
   * Check if category exists
   */
  exists(id: string): Promise<boolean>;
}