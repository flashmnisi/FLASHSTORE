// apps/catalog-service/src/application/use-cases/update-product.usecase.ts

import { ProductEntity } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { CatalogProducer } from '../../infrastructure/kafka/producer/catalog.producer';
import { UpdateProductDto } from '../dtos/update-product.dto';
import logger from '@org/shared-logger';

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly producer: CatalogProducer
  ) {}

  async execute(productId: string, dto: UpdateProductDto): Promise<ProductEntity> {
    try {
      const existing = await this.productRepository.findById(productId);
      if (!existing) {
        throw new Error('Product not found');
      }

      const updatedProduct = await this.productRepository.update(productId, {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        currency: dto.currency,
        brand: dto.brand,
        images: dto.images,
        tags: dto.tags,
        stockQuantity: dto.stockQuantity,
        isActive: dto.isActive,
      });

      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }

      // Publish update event
      await this.producer.productUpdated(updatedProduct);

      logger.info('Product updated successfully', {
        productId: updatedProduct.id,
        name: updatedProduct.name,
      });

      return updatedProduct;
    } catch (error: any) {
      logger.error('Failed to update product', {
        productId,
        error: error.message,
      });
      throw error;
    }
  }
}