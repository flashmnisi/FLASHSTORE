import { Client } from '@elastic/elasticsearch';
import { PRODUCT_INDEX } from '../../infrastructure/persistence/models/product-index.model';
import logger from '@org/shared-logger';

export class SuggestService {
  constructor(private readonly client: Client) {}

  async suggest(query: string) {
    if (!query) return [];

    try {
      const res = await this.client.search({
        index: PRODUCT_INDEX,
        size: 5,
        query: {
          match_phrase_prefix: {
            name: {
              query,
              max_expansions: 10,
            },
          },
        },
      });

      return res.hits.hits.map((hit: any) => ({
        id: hit._id,
        name: hit._source.name,
      }));
    } catch (error: any) {
      logger.error('Autocomplete failed', { error: error.message });
      return [];
    }
  }
}
