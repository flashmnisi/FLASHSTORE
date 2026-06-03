// apps/catalog-service/src/infrastructure/persistence/mongoose/repositories/product.repository.impl.ts

import {
  ProductEntity,
} from '../../../../domain/entities/product.entity';

import {
  IProductRepository,
  ProductSearchCriteria,
  ProductSearchResult,
} from '../../../../domain/repositories/product.repository';

import {
  ProductModel,
  IProductDocument,
} from '../models/product.model';

import logger from '@org/shared-logger';

export class ProductRepositoryImpl
  implements IProductRepository
{
  /**
   * =========================================
   * CREATE PRODUCT
   * =========================================
   */
  async create(
    product: ProductEntity
  ): Promise<ProductEntity> {
    const doc = await ProductModel.create({
      name: product.name,
      slug: product.slug,
      description: product.description,

      price: product.price,
      currency: product.currency,

      categoryId: product.categoryId,
      subCategoryId: product.subCategory,

      brand: product.brand,

      images: product.images,
      tags: product.tags,

      isFeatured: product.isFeatured,
      isHotDeal: product.isHotDeal,
      isNewArrival: product.isNewArrival,

      discountPercentage:
        product.discountPercentage,

      inStock: product.inStock,
      stockQuantity: product.stockQuantity,

      isActive: product.isActive,
    });

    logger.info('Product created', {
      productId: doc._id.toString(),
      slug: doc.slug,
    });

    return this.mapToEntity(doc);
  }

  /**
   * =========================================
   * FIND PRODUCT BY ID
   * =========================================
   */
  async findById(
    id: string
  ): Promise<ProductEntity | null> {
    const doc = await ProductModel.findOne({
      _id: id,
      isActive: true,
    });

    return doc
      ? this.mapToEntity(doc)
      : null;
  }

  /**
   * =========================================
   * FIND PRODUCT BY SLUG
   * =========================================
   */
  async findBySlug(
    slug: string
  ): Promise<ProductEntity | null> {
    const doc = await ProductModel.findOne({
      slug,
      isActive: true,
    });

    return doc
      ? this.mapToEntity(doc)
      : null;
  }

  /**
   * =========================================
   * UPDATE PRODUCT
   * =========================================
   */
  async update(
    id: string,
    data: Partial<ProductEntity>
  ): Promise<ProductEntity | null> {
    const doc =
      await ProductModel.findByIdAndUpdate(
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
   * SOFT DELETE PRODUCT
   * =========================================
   */
  async delete(id: string): Promise<boolean> {
    const result =
      await ProductModel.updateOne(
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
   * UPDATE STOCK
   * =========================================
   */
  async updateStock(
    productId: string,
    quantity: number
  ): Promise<ProductEntity | null> {
    const doc =
      await ProductModel.findByIdAndUpdate(
        productId,
        {
          stockQuantity: quantity,
          inStock: quantity > 0,
          updatedAt: new Date(),
        },
        {
          new: true,
        }
      );

    return doc
      ? this.mapToEntity(doc)
      : null;
  }

  /**
   * =========================================
   * CHECK EXISTS
   * =========================================
   */
  async exists(id: string): Promise<boolean> {
    const count =
      await ProductModel.countDocuments({
        _id: id,
        isActive: true,
      });

    return count > 0;
  }

  /**
   * =========================================
   * SEARCH PRODUCTS
   * =========================================
   */
  async search(
    criteria: ProductSearchCriteria
  ): Promise<ProductSearchResult> {

    const {
      query,
      categoryId,
      subCategory,
      brand,
      tags,

      isFeatured,
      isHotDeal,
      isNewArrival,

      minPrice,
      maxPrice,

      inStock,

      sort = 'newest',

      page = 1,
      limit = 20,
    } = criteria;

    const skip = (page - 1) * limit;

    const filter: any = {
      isActive: true,
    };

    // =====================================
    // TEXT SEARCH
    // =====================================

    if (query) {
      filter.$or = [
        {
          name: {
            $regex: query,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: query,
            $options: 'i',
          },
        },
        {
          brand: {
            $regex: query,
            $options: 'i',
          },
        },
      ];
    }

    // =====================================
    // CATEGORY FILTERS
    // =====================================

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (subCategory) {
      filter.subCategory = subCategory;
    }

    // =====================================
    // BRAND
    // =====================================

    if (brand) {
      filter.brand = brand;
    }

    // =====================================
    // TAGS
    // =====================================

    if (tags?.length) {
      filter.tags = {
        $in: tags,
      };
    }

    // =====================================
    // MARKETING FLAGS
    // =====================================

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured;
    }

    if (isHotDeal !== undefined) {
      filter.isHotDeal = isHotDeal;
    }

    if (isNewArrival !== undefined) {
      filter.isNewArrival = isNewArrival;
    }

    // =====================================
    // PRICE RANGE
    // =====================================

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    // =====================================
    // STOCK FILTER
    // =====================================

    if (inStock !== undefined) {
      filter.inStock = inStock;
    }

    // =====================================
    // SORTING
    // =====================================

    let sortOption: any = {
      createdAt: -1,
    };

    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;

      case 'price_desc':
        sortOption = { price: -1 };
        break;

      case 'oldest':
        sortOption = { createdAt: 1 };
        break;

      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    const [docs, total] =
      await Promise.all([
        ProductModel.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(limit),

        ProductModel.countDocuments(filter),
      ]);

    return {
      products: docs.map(doc =>
        this.mapToEntity(doc)
      ),

      total,

      page,

      limit,

      totalPages: Math.ceil(
        total / limit
      ),
    };
  }

  /**
   * =========================================
   * FEATURED PRODUCTS
   * =========================================
   */
  async findFeatured(): Promise<ProductEntity[]> {
    const docs = await ProductModel.find({
      isFeatured: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return docs.map(doc =>
      this.mapToEntity(doc)
    );
  }

  /**
   * =========================================
   * HOT DEALS
   * =========================================
   */
  async findHotDeals(): Promise<ProductEntity[]> {
    const docs = await ProductModel.find({
      isHotDeal: true,
      isActive: true,
    })
      .sort({
        discountPercentage: -1,
      })
      .limit(20);

    return docs.map(doc =>
      this.mapToEntity(doc)
    );
  }

  /**
   * =========================================
   * NEW ARRIVALS
   * =========================================
   */
  async findNewArrivals(): Promise<ProductEntity[]> {
    const docs = await ProductModel.find({
      isNewArrival: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return docs.map(doc =>
      this.mapToEntity(doc)
    );
  }

  /**
   * =========================================
   * PRODUCTS BY CATEGORY
   * =========================================
   */
  async findByCategory(
    categoryId: string
  ): Promise<ProductEntity[]> {
    const docs = await ProductModel.find({
      categoryId,
      isActive: true,
    });

    return docs.map(doc =>
      this.mapToEntity(doc)
    );
  }

  /**
   * =========================================
   * MAP DOCUMENT → ENTITY
   * =========================================
   */
  private mapToEntity(
    doc: IProductDocument
  ): ProductEntity {
    return new ProductEntity(
      doc._id.toString(),

      doc.name,
      doc.slug,
      doc.description,

      doc.price,
      doc.currency,

      doc.categoryId.toString(),

      doc.subCategoryId?.toString(),

      doc.brand,

      doc.images || [],
      doc.tags || [],

      doc.isFeatured,
      doc.isHotDeal,
      doc.isNewArrival,

      doc.discountPercentage,

      doc.inStock,
      doc.stockQuantity,

      doc.isActive,

      doc.createdAt,
      doc.updatedAt
    );
  }
}