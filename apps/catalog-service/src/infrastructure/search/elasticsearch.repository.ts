// apps/catalog-service/src/infrastructure/search/elasticsearch.repository.ts

import { Client } from '@elastic/elasticsearch';
import env from '../../config/env';
import logger from '@org/shared-logger';
import { ProductEntity } from '../../domain/entities/product.entity';

const INDEX_NAME = 'products';

export class ElasticsearchRepository {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: env.ELASTICSEARCH_URL,
      auth: env.ELASTICSEARCH_USERNAME && env.ELASTICSEARCH_PASSWORD ? {
        username: env.ELASTICSEARCH_USERNAME,
        password: env.ELASTICSEARCH_PASSWORD,
      } : undefined,
    });
  }

  /**
   * Index a single product
   */
  async indexProduct(product: ProductEntity) {
    try {
      await this.client.index({
        index: INDEX_NAME,
        id: product.id,
        document: {
          id: product.id,
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
          createdAt: product.createdAt,
        },
        refresh: 'wait_for',
      });

      logger.info('✅ Product indexed in Elasticsearch', { productId: product.id });
    } catch (error: any) {
      logger.error('Failed to index product in Elasticsearch', {
        productId: product.id,
        error: error.message,
      });
    }
  }

  /**
   * Bulk index products
   */
  async bulkIndex(products: ProductEntity[]) {
    if (products.length === 0) return;

    const operations = products.flatMap((product) => [
      { index: { _index: INDEX_NAME, _id: product.id } },
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        brand: product.brand,
        tags: product.tags,
        inStock: product.inStock,
      },
    ]);

    try {
      await this.client.bulk({ operations, refresh: 'wait_for' });
      logger.info(`✅ Bulk indexed ${products.length} products`);
    } catch (error: any) {
      logger.error('Bulk indexing failed', { error: error.message });
    }
  }

  /**
   * Search products
   */
  async search(
    query: string = '', 
    filters: any = {}, 
    page: number = 1, 
    limit: number = 20
  ) {
    const from = (page - 1) * limit;

    const searchBody = {
      query: {
        bool: {
          must: query 
            ? [{
                multi_match: {
                  query,
                  fields: ['name^3', 'description^2', 'brand', 'tags'],
                  fuzziness: 'AUTO',
                },
              }]
            : [{ match_all: {} }],
          filter: this.buildFilters(filters),
        },
      },
      from,
      size: limit,
      sort: [{ createdAt: 'desc' as const }],
    };

    try {
      const response = await this.client.search({
        index: INDEX_NAME,
        ...searchBody,           
      });

      const hits = response.hits.hits.map((hit: any) => hit._source);
      const total = typeof response.hits.total === 'number' 
        ? response.hits.total 
        : response.hits.total?.value || 0;

      return {
        products: hits,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      logger.error('Elasticsearch search failed', { 
        query, 
        error: error.message 
      });
      throw error;
    }
  }

  private buildFilters(filters: any): any[] {
    const filterArray: any[] = [];

    if (filters.categoryId) {
      filterArray.push({ term: { categoryId: filters.categoryId } });
    }
    if (filters.brand) {
      filterArray.push({ term: { brand: filters.brand } });
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filterArray.push({
        range: {
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
      });
    }
    if (typeof filters.inStock === 'boolean') {
      filterArray.push({ term: { inStock: filters.inStock } });
    }

    return filterArray;
  }
}

// Singleton
export const elasticsearchRepository = new ElasticsearchRepository();