import { Client } from '@elastic/elasticsearch';
import env from './env';
import logger from '@org/shared-logger';

let client: Client;

export const getElasticClient = () => {
  if (!client) {
    client = new Client({
      node: env.ELASTIC_URL,

      auth: env.ELASTIC_USERNAME
        ? {
            username: env.ELASTIC_USERNAME,
            password: env.ELASTIC_PASSWORD,
          }
        : undefined,

      maxRetries: 5,
      requestTimeout: 10000,
      sniffOnStart: false,
    });

    logger.info('⚡ Elasticsearch client initialized', {
      node: env.ELASTIC_URL,
    });
  }

  return client;
};