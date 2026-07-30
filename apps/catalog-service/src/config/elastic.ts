// // apps/catalog-service/config/elastic.ts

// import { Client } from '@elastic/elasticsearch';
// import env from './env';
// import logger from '@org/shared-logger';

// let client: Client;

// export const getElasticClient = () => {
//   if (!client) {
//     const auth = env.ELASTIC_USERNAME && env.ELASTIC_PASSWORD
//       ? {
//           username: env.ELASTIC_USERNAME,
//           password: env.ELASTIC_PASSWORD,
//         }
//       : undefined;

//     client = new Client({
//       node: env.ELASTIC_UR,
//       auth,
//       maxRetries: 5,
//       requestTimeout: 10000,
//       sniffOnStart: false,
//     });

//     logger.info('⚡ Elasticsearch client initialized', {
//       node: env.ELASTIC_UR,
//       hasAuth: !!auth,
//     });
//   }

//   return client;
// };