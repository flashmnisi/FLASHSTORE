import { Client } from '@elastic/elasticsearch';
import logger from '../../utils/logger';

let client: Client | null = null;

export const getElasticClient = (): Client => {
  if (!client) {
    client = new Client({
      node: process.env.ELASTIC_URL || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTIC_USER || 'elastic',
        password: process.env.ELASTIC_PASSWORD || 'changeme',
      },
      maxRetries: 5,
      requestTimeout: 10000,
      sniffOnStart: true,
    });

    logger.info('🔎 Elasticsearch client initialized');
  }

  return client;
};