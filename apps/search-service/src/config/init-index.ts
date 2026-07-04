import { productMapping } from '../infrastructure/elasticsearch/mappings/product.mapping';
import { getElasticClient } from './elastic';
import logger from '@org/shared-logger';

const INDEX_NAME = 'products';

export const initProductIndex = async () => {
  const client = getElasticClient();

  try {
    const exists = await client.indices.exists({
      index: INDEX_NAME,
    });

    if (!exists) {
      await client.indices.create({
        index: INDEX_NAME,
        settings: productMapping.settings,
        mappings: productMapping.mappings,
      });

      logger.info('📦 Elasticsearch index created', {
        index: INDEX_NAME,
      });
    } else {
      logger.info('📦 Elasticsearch index already exists', {
        index: INDEX_NAME,
      });
    }
  } catch (error: any) {
    logger.error('❌ Failed to initialize index', {
      index: INDEX_NAME,
      error: error.message,
    });

    throw error;
  }
};
