// apps/search-service/src/infrastructure/kafka/handlers/product-updated.handler.ts

import { ProductIndexEntity } from '../../../domain/entities/product-index.entity';
import { IndexService } from '../../../application/services/index.service';
import { IndexerService } from '../../indexer/indexer.service';
import logger from '@org/shared-logger';

// Initialize once (better than creating new instance every time)
const indexService = new IndexService(new IndexerService());

export const handleProductUpdated = async (event: any) => {
  try {
    const data = event.data;

    if (!data?.id) {
      logger.warn('Received product updated event without id', { event });
      return;
    }

    // Create ProductIndexEntity
    const product = new ProductIndexEntity(
      data.id,
      data.name,
      data.description,
      data.price,
      data.currency,
      data.category,
      data.brand,
      data.tags || [],
      data.images || [],
      data.inStock ?? true,
      data.rating || 0,
      data.reviewCount || 0,
      data.createdAt,
      data.updatedAt
    );

    // Index / Update in Elasticsearch
    await indexService.indexProduct(product);

    logger.info('🔄 Product successfully updated in search index', {
      productId: data.id,
      name: data.name,
    });

  } catch (error: any) {
    logger.error('❌ Failed to update product in search index', {
      productId: event.data?.id,
      error: error.message,
      eventType: event.event,
    });

    // Re-throw so the consumer can handle retry/dead letter if needed
    throw error;
  }
};