// apps/catalog-service/src/application/services/product.service.ts

import { ProductEntity } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { SearchProductsDto } from '../dtos/search-products.dto';
import { CreateProductUseCase } from '../use-cases/create-product.usecase';
import { UpdateProductUseCase } from '../use-cases/update-product.usecase';
import { DeleteProductUseCase } from '../use-cases/delete-product.usecase';
import { SearchProductsUseCase } from '../use-cases/search-products.usecase';
import { CatalogProducer } from '../../infrastructure/kafka/producer/catalog.producer';
import logger from '@org/shared-logger';

export class ProductService {
  private readonly createProductUseCase: CreateProductUseCase;
  private readonly updateProductUseCase: UpdateProductUseCase;
  private readonly deleteProductUseCase: DeleteProductUseCase;
  private readonly searchProductsUseCase: SearchProductsUseCase;

  constructor(
    private readonly productRepository: IProductRepository,
    private readonly producer: CatalogProducer
  ) {
    this.createProductUseCase = new CreateProductUseCase(productRepository, producer);
    this.updateProductUseCase = new UpdateProductUseCase(productRepository, producer);
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository, producer);
    
    // FIXED: SearchProductsUseCase takes no arguments (uses singleton repository)
    this.searchProductsUseCase = new SearchProductsUseCase();
  }

  /**
   * Create Product with Images
   */
  async createProduct(
    dto: CreateProductDto, 
    images: string[] = []
  ): Promise<ProductEntity> {
    try {
      const product = await this.createProductUseCase.execute(dto, images);

      logger.info('Product created with images', {
        productId: product.id,
        name: product.name,
        imageCount: images.length,
      });

      return product;
    } catch (error: any) {
      logger.error('Product creation failed in service', {
        error: error.message,
        name: dto.name,
      });
      throw error;
    }
  }

  /**
   * Update Product
   */
  async updateProduct(productId: string, dto: UpdateProductDto): Promise<ProductEntity> {
    return this.updateProductUseCase.execute(productId, dto);
  }

  /**
   * Delete Product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    return this.deleteProductUseCase.execute(productId);
  }

  /**
   * Search Products (using Elasticsearch)
   */
  async searchProducts(dto: SearchProductsDto) {
    return this.searchProductsUseCase.execute(dto);
  }

  /**
   * Get Product by ID
   */
  async getProductById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  /**
   * Get Product by Slug
   */
  async getProductBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) throw new Error('Product not found');
    return product;
  }

  /**
   * Update Stock
   */
  async updateStock(productId: string, quantity: number): Promise<ProductEntity> {
    const product = await this.productRepository.updateStock(productId, quantity);
    if (!product) throw new Error('Product not found');

    await this.producer.stockUpdated(product);
    return product;
  }
}