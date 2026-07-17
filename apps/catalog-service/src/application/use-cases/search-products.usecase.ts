// apps/catalog-service/src/application/use-cases/search-products.usecase.ts

import { SearchProductsDto } from '../dtos/search-products.dto';
import { elasticsearchRepository } from '../../infrastructure/search/elasticsearch.repository';
import logger from '@org/shared-logger';

export class SearchProductsUseCase {
  async execute(dto: SearchProductsDto) {
    try {
      logger.info('🔍 Executing product search', {
        query: dto.query,
        categoryId: dto.categoryId,
        brand: dto.brand,
        minPrice: dto.minPrice,
        maxPrice: dto.maxPrice,
        inStock: dto.inStock,
        page: dto.page,
        limit: dto.limit,
      });

      const result = await elasticsearchRepository.search(
        dto.query || '',
        {
          categoryId: dto.categoryId,
          brand: dto.brand,
          minPrice: dto.minPrice,
          maxPrice: dto.maxPrice,
          inStock: dto.inStock,
        },
        dto.page || 1,
        dto.limit || 20
      );

      return {
        success: true,
        products: result.products,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      };
    } catch (error: unknown) {
      logger.error('❌ Search products use case failed', {
        query: dto.query,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}