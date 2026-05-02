// apps/catalog-service/src/application/use-cases/delete-product.usecase.ts

import { IProductRepository } from '../../domain/repositories/product.repository';
import logger from '@org/shared-logger';
import { CatalogProducer } from '../../infrastructure/kafka/producer/catalog.producer';

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly producer: CatalogProducer
  ) {}

  async execute(productId: string): Promise<boolean> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const deleted = await this.productRepository.delete(productId);

      if (deleted) {
        await this.producer.productDeleted(productId);
        logger.info('Product deleted successfully', { productId });
      }

      return deleted;
    } catch (error: any) {
      logger.error('Failed to delete product', {
        productId,
        error: error.message,
      });
      throw error;
    }
  }
}