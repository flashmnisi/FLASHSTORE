// apps/catalog-service/src/application/use-cases/update-product.usecase.ts

import { ProductEntity } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';
import { UpdateProductDto } from '../dtos/update-product.dto';
import logger from '@org/shared-logger';
import { EVENTS, TOPICS } from '@org/shared-kafka';

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly outboxService: OutboxService
  ) {}

  async execute(productId: string, dto: UpdateProductDto): Promise<ProductEntity> {
    try {
      const updatedProduct = await this.productRepository.update(productId, dto);

      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }

      await this.outboxService.write({
        topic: TOPICS.PRODUCTS,
        event: EVENTS.PRODUCT_UPDATED,
        data: updatedProduct,
        key: updatedProduct.id,
      });

      logger.info('✅ Product updated and queued in outbox', { productId });

      return updatedProduct;
    } catch (error: any) {
      logger.error('❌ Failed to update product', {
        productId,
        error: error.message,
      });
      throw error;
    }
  }
}