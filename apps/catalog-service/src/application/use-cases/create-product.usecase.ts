// apps/catalog-service/src/application/use-cases/create-product.usecase.ts

import { ProductEntity } from '../../domain/entities/product.entity';
import { Slug } from '../../domain/value-objects/slug.vo';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { CreateProductDto } from '../dtos/create-product.dto';

import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly outboxService: OutboxService   // ← Only these two
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductEntity> {
    try {
      const slug = Slug.create(dto.name);

      const product = new ProductEntity(
        '',
        dto.name,
        slug.value,
        dto.description,
        dto.price,
        dto.currency || 'ZAR',
        dto.categoryId,
        dto.subCategory,
        dto.brand,
        dto.images || [],
        dto.tags || [],
        dto.isFeatured || false,
        dto.isHotDeal || false,
        dto.isNewArrival || false,
        dto.discountPercentage || 0,
        (dto.stockQuantity ?? 0) > 0,
        dto.stockQuantity ?? 0,
        dto.isActive ?? true
      );

      const createdProduct = await this.productRepository.create(product);

      await this.outboxService.write({
        topic: TOPICS.PRODUCTS,
        event: EVENTS.PRODUCT_CREATED,
        data: createdProduct,
        key: createdProduct.id,
      });

      logger.info('✅ Product created and queued in outbox', {
        productId: createdProduct.id,
        name: createdProduct.name,
      });

      return createdProduct;

    } catch (error: any) {
      logger.error('❌ Failed to create product', {
        error: error.message,
        productName: dto.name,
      });
      throw error;
    }
  }
}