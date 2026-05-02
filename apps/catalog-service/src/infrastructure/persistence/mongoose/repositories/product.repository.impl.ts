// apps/catalog-service/src/infrastructure/persistence/mongoose/repositories/product.repository.impl.ts

import { ProductEntity } from '../../../../domain/entities/product.entity';
import { IProductRepository } from '../../../../domain/repositories/product.repository';
import { ProductModel } from '../models/product.model';

export class ProductRepositoryImpl implements IProductRepository {
  async create(product: ProductEntity): Promise<ProductEntity> {
    const doc = await ProductModel.create({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      currency: product.currency,
      categoryId: product.categoryId,
      brand: product.brand,
      images: product.images,
      tags: product.tags,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
    });

    return this.mapToEntity(doc);
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const doc = await ProductModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const doc = await ProductModel.findOne({ slug });
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(id: string, data: Partial<ProductEntity>): Promise<ProductEntity | null> {
    const doc = await ProductModel.findByIdAndUpdate(id, data, { new: true });
    return doc ? this.mapToEntity(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async updateStock(productId: string, quantity: number): Promise<ProductEntity | null> {
    const doc = await ProductModel.findByIdAndUpdate(
      productId,
      { 
        stockQuantity: quantity,
        inStock: quantity > 0 
      },
      { new: true }
    );
    return doc ? this.mapToEntity(doc) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await ProductModel.countDocuments({ _id: id });
    return count > 0;
  }

  /**
   * Full Search Logic with Filters & Pagination
   */
  async search(criteria: {
    query?: string;
    categoryId?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    inStock?: boolean;
    sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
    page?: number;
    limit?: number;
  }): Promise<{
    products: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { 
      query, categoryId, brand, minPrice, maxPrice, 
      tags, inStock, sort = 'relevance', 
      page = 1, limit = 20 
    } = criteria;

    const skip = (page - 1) * limit;
    const filter: any = { isActive: true };

    // Text Search
    if (query) {
      filter.$text = { $search: query };
    }

    // Category Filter
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Brand Filter
    if (brand) {
      filter.brand = brand;
    }

    // Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // Tags Filter
    if (tags && tags.length > 0) {
      filter.tags = { $all: tags };
    }

    // Stock Filter
    if (inStock === true) {
      filter.inStock = true;
    }

    // Sorting
    let sortOption: any = { createdAt: -1 };
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
    }

    const [docs, total] = await Promise.all([
      ProductModel.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      ProductModel.countDocuments(filter)
    ]);

    const products = docs.map(doc => this.mapToEntity(doc));

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private mapToEntity(doc: any): ProductEntity {
    return new ProductEntity(
      doc._id.toString(),
      doc.name,
      doc.slug,
      doc.description,
      doc.price,
      doc.currency,
      doc.categoryId.toString(),
      doc.brand,
      doc.images,
      doc.tags,
      doc.inStock,
      doc.stockQuantity,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt
    );
  }
}