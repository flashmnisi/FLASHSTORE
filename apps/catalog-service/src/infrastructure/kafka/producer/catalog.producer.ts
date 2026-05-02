// apps/catalog-service/src/infrastructure/kafka/catalog.producer.ts

import { publish } from '@org/shared-kafka';
import { TOPICS, EVENTS } from '../topics';
import logger from '@org/shared-logger';
import { CategoryEntity } from '../../../domain/entities/category.entity';
import { ProductEntity } from '../../../domain/entities/product.entity';

export class CatalogProducer {

  // ==================== PRODUCT EVENTS ====================

  async productCreated(product: ProductEntity) {
    try {
      await publish({
        topic: TOPICS.PRODUCTS,
        key: product.id,
        message: {
          event: EVENTS.PRODUCT_CREATED,
          data: {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            currency: product.currency,
            categoryId: product.categoryId,
            brand: product.brand,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
          },
          metadata: {
            source: 'catalog-service',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info('✅ Product created event published', {
        productId: product.id,
        name: product.name,
      });
    } catch (error: any) {
      logger.error('Failed to publish product.created event', {
        productId: product.id,
        error: error.message,
      });
    }
  }

  async productUpdated(product: ProductEntity) {
    try {
      await publish({
        topic: TOPICS.PRODUCTS,
        key: product.id,
        message: {
          event: EVENTS.PRODUCT_UPDATED,
          data: {
            productId: product.id,
            name: product.name,
            price: product.price,
            inStock: product.inStock,
            stockQuantity: product.stockQuantity,
            isActive: product.isActive,
          },
          metadata: {
            source: 'catalog-service',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info('✅ Product updated event published', { productId: product.id });
    } catch (error: any) {
      logger.error('Failed to publish product.updated event', {
        productId: product.id,
        error: error.message,
      });
    }
  }

  async productDeleted(productId: string) {
    try {
      await publish({
        topic: TOPICS.PRODUCTS,
        key: productId,
        message: {
          event: EVENTS.PRODUCT_DELETED,
          data: { productId },
          metadata: {
            source: 'catalog-service',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info('✅ Product deleted event published', { productId });
    } catch (error: any) {
      logger.error('Failed to publish product.deleted event', {
        productId,
        error: error.message,
      });
    }
  }

  async stockUpdated(product: ProductEntity) {
    try {
      await publish({
        topic: TOPICS.INVENTORY,
        key: product.id,
        message: {
          event: EVENTS.STOCK_UPDATED,
          data: {
            productId: product.id,
            stockQuantity: product.stockQuantity,
            inStock: product.inStock,
          },
          metadata: {
            source: 'catalog-service',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info('✅ Stock updated event published', {
        productId: product.id,
        stock: product.stockQuantity,
      });
    } catch (error: any) {
      logger.error('Failed to publish stock.updated event', {
        productId: product.id,
        error: error.message,
      });
    }
  }

  // ==================== CATEGORY EVENTS ====================

  async categoryCreated(category: CategoryEntity) {
    try {
      await publish({
        topic: TOPICS.CATEGORIES,
        key: category.id,
        message: {
          event: EVENTS.CATEGORY_CREATED,
          data: {
            categoryId: category.id,
            name: category.name,
            slug: category.slug,
            parentId: category.parentId,
          },
          metadata: {
            source: 'catalog-service',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info('✅ Category created event published', {
        categoryId: category.id,
        name: category.name,
      });
    } catch (error: any) {
      logger.error('Failed to publish category.created event', {
        categoryId: category.id,
        error: error.message,
      });
    }
  }

  async categoryUpdated(category: CategoryEntity) {
    try {
      await publish({
        topic: TOPICS.CATEGORIES,
        key: category.id,
        message: {
          event: EVENTS.CATEGORY_UPDATED,
          data: {
            categoryId: category.id,
            name: category.name,
            slug: category.slug,
            parentId: category.parentId,
          },
          metadata: {
            source: 'catalog-service',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info('✅ Category updated event published', {
        categoryId: category.id,
      });
    } catch (error: any) {
      logger.error('Failed to publish category.updated event', {
        categoryId: category.id,
        error: error.message,
      });
    }
  }

  async categoryDeleted(categoryId: string) {
    try {
      await publish({
        topic: TOPICS.CATEGORIES,
        key: categoryId,
        message: {
          event: EVENTS.CATEGORY_DELETED,
          data: { categoryId },
          metadata: {
            source: 'catalog-service',
            timestamp: new Date().toISOString(),
          },
        },
      });

      logger.info('✅ Category deleted event published', { categoryId });
    } catch (error: any) {
      logger.error('Failed to publish category.deleted event', {
        categoryId,
        error: error.message,
      });
    }
  }
}

// Singleton instance
export const catalogProducer = new CatalogProducer();