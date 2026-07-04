// apps/search-service/src/infrastructure/search/elasticsearch.repository.ts

import { Client } from '@elastic/elasticsearch';
import { ISearchRepository } from '../../application/interfaces/search.repository';
import { SearchQueryVO } from '../../domain/value-objects/search-query.vo';
import { productMapping } from '../elasticsearch/mappings/product.mapping';
import logger from '@org/shared-logger';

const INDEX_NAME = 'products';

export class ElasticSearchRepository implements ISearchRepository {
  constructor(private readonly client: Client) {}

  async search(queryVO: SearchQueryVO): Promise<{
    products: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await this.client.search({
        index: INDEX_NAME,
        from: queryVO.offset,
        size: queryVO.limit,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: queryVO.normalizedQuery,
                  fields: ['name^3', 'description', 'brand', 'category'],
                  fuzziness: 'AUTO',
                },
              },
            ],
            filter: queryVO.toElasticFilters(),
          },
        },
        sort: this.buildSort(queryVO.sort),
      });

      const hits = response.hits.hits.map((hit: any) => hit._source);
      const total =
        typeof response.hits.total === 'number'
          ? response.hits.total
          : response.hits.total?.value || 0;

      return {
        products: hits,
        total,
        page: queryVO.page,
        limit: queryVO.limit,
        totalPages: Math.ceil(total / queryVO.limit),
      };
    } catch (error: any) {
      logger.error('Elasticsearch search failed', {
        query: queryVO.query,
        error: error.message,
      });
      throw error;
    }
  }

  private buildSort(sort: string): any[] {
    switch (sort) {
      case 'price_asc':
        return [{ price: 'asc' }];
      case 'price_desc':
        return [{ price: 'desc' }];
      case 'newest':
        return [{ createdAt: 'desc' }];
      case 'rating_desc':
        return [{ rating: 'desc' }];
      default:
        return ['_score'];
    }
  }

  async index(product: any): Promise<void> {
    await this.client.index({
      index: INDEX_NAME,
      id: product.id,
      document: product,
      refresh: 'wait_for',
    });
  }

  async bulkIndex(products: any[]): Promise<void> {
    if (products.length === 0) return;

    const operations = products.flatMap((product) => [
      { index: { _index: INDEX_NAME, _id: product.id } },
      product,
    ]);

    await this.client.bulk({
      operations,
      refresh: 'wait_for',
    });
  }

  async delete(productId: string): Promise<void> {
    await this.client.delete({
      index: INDEX_NAME,
      id: productId,
    });
  }

  async ensureIndex(): Promise<void> {
    const exists = await this.client.indices.exists({ index: INDEX_NAME });

    if (!exists) {
      await this.client.indices.create({
        index: INDEX_NAME,
        settings: productMapping.settings,
        mappings: productMapping.mappings,
      });
      logger.info(`✅ Index '${INDEX_NAME}' created`);
    }
  }
}
