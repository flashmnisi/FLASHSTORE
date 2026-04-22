import { getElasticClient } from './client';
import { productMapping } from './mappings/product.mapping';
import logger from '../../utils/logger';

const INDEX_NAME = 'products';

export const initProductIndex = async () => {
  const client = getElasticClient();

  const exists = await client.indices.exists({
    index: INDEX_NAME,
  });

  if (!exists) {
    await client.indices.create({
      index: INDEX_NAME,
      ...productMapping,
    });

    logger.info('📦 Product index created in Elasticsearch');
  } else {
    logger.info('📦 Product index already exists');
  }
};