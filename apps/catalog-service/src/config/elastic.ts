// apps/search-service/config/elastic.ts

import { Client } from '@elastic/elasticsearch';
import env from './env';
import logger from '@org/shared-logger';

let client: Client;

export const getElasticClient = () => {
  if (!client) {
    const auth = env.ELASTICSEARCH_USERNAME && env.ELASTICSEARCH_PASSWORD
      ? {
          username: env.ELASTICSEARCH_USERNAME,
          password: env.ELASTICSEARCH_PASSWORD,
        }
      : undefined;

    client = new Client({
      node: env.ELASTICSEARCH_URL,
      auth,
      maxRetries: 5,
      requestTimeout: 10000,
      sniffOnStart: false,
    });

    logger.info('⚡ Elasticsearch client initialized', {
      node: env.ELASTICSEARCH_URL,
      hasAuth: !!auth,
    });
  }

  return client;
};