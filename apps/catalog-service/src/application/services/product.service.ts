// apps/catalog-service/src/application/services/product.service.ts

import { ProductEntity } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { OutboxService } from '../../infrastructure/outbox/outbox.service';

import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { SearchProductsDto } from '../dtos/search-products.dto';

import { CreateProductUseCase } from '../use-cases/create-product.usecase';
import { UpdateProductUseCase } from '../use-cases/update-product.usecase';
import { DeleteProductUseCase } from '../use-cases/delete-product.usecase';
import { SearchProductsUseCase } from '../use-cases/search-products.usecase';

import logger from '@org/shared-logger';

export class ProductService {
  private readonly createProductUseCase: CreateProductUseCase;
  private readonly updateProductUseCase: UpdateProductUseCase;
  private readonly deleteProductUseCase: DeleteProductUseCase;
  private readonly searchProductsUseCase: SearchProductsUseCase;

  constructor(
    private readonly productRepository: IProductRepository,
    private readonly outboxService: OutboxService   
  ) {
    this.createProductUseCase = new CreateProductUseCase(
      this.productRepository,
      this.outboxService
    );

    this.updateProductUseCase = new UpdateProductUseCase(
      this.productRepository,
      this.outboxService
    );

    this.deleteProductUseCase = new DeleteProductUseCase(
      this.productRepository,
      this.outboxService
    );

    this.searchProductsUseCase = new SearchProductsUseCase(
      
    );
  }

  async createProduct(dto: CreateProductDto): Promise<ProductEntity> {
    try {
      const product = await this.createProductUseCase.execute(dto);

      logger.info('✅ Product created successfully', {
        productId: product.id,
        name: product.name,
      });

      return product;
    } catch (error: any) {
      logger.error('❌ Product creation failed', {
        error: error.message,
        name: dto.name,
      });
      throw error;
    }
  }

  async updateProduct(productId: string, dto: UpdateProductDto): Promise<ProductEntity> {
    try {
      const product = await this.updateProductUseCase.execute(productId, dto);

      logger.info('✅ Product updated successfully', { productId });
      return product;
    } catch (error: any) {
      logger.error('❌ Product update failed', { productId, error: error.message });
      throw error;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const deleted = await this.deleteProductUseCase.execute(productId);

      logger.info('🗑️ Product deleted successfully', { productId });
      return deleted;
    } catch (error: any) {
      logger.error('❌ Product deletion failed', { productId, error: error.message });
      throw error;
    }
  }

  async searchProducts(dto: SearchProductsDto) {
    try {
      return await this.searchProductsUseCase.execute(dto);
    } catch (error: any) {
      logger.error('❌ Product search failed', { error: error.message });
      throw error;
    }
  }

  // Other methods remain unchanged
  async getProductById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async getProductBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async getFeaturedProducts(): Promise<ProductEntity[]> {
    return this.productRepository.findFeatured();
  }

  async getHotDeals(): Promise<ProductEntity[]> {
    return this.productRepository.findHotDeals();
  }

  async getNewArrivals(): Promise<ProductEntity[]> {
    return this.productRepository.findNewArrivals();
  }

  async getProductsByCategory(categoryId: string): Promise<ProductEntity[]> {
    return this.productRepository.findByCategory(categoryId);
  }
}