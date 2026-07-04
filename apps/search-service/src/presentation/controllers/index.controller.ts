// apps/search-service/src/presentation/controllers/index.controller.ts

import { Request, Response } from 'express';
import { IndexService } from '../../application/services/index.service';
import { ProductIndexEntity } from '../../domain/entities/product-index.entity';
import { ElasticIndexer } from '../../infrastructure/indexer/elastic.indexer';
import logger from '@org/shared-logger';

// =============================
// 🔥 DEPENDENCIES
// =============================
const elasticIndexer = new ElasticIndexer();
const indexService = new IndexService(elasticIndexer);

export const indexController = {
  /**
   * 🔥 Index single product
   * POST /api/index
   */
  async indexProduct(req: Request, res: Response): Promise<Response> {
    try {
      const payload = req.body;

      if (!payload?.id) {
        return res.status(400).json({
          success: false,
          message: 'Product id is required',
        });
      }

      const product = new ProductIndexEntity(
        payload.id,
        payload.name,
        payload.description,
        payload.price,
        payload.currency,
        payload.category,
        payload.brand,
        payload.tags || [],
        payload.images || [],
        payload.inStock ?? true,
        payload.rating || 0,
        payload.reviewCount || 0
      );

      await indexService.indexProduct(product);

      return res.json({
        success: true,
        message: 'Product indexed successfully',
        productId: payload.id,
      });
    } catch (error: any) {
      logger.error('Index product failed', {
        productId: req.body?.id,
        error: error.message,
      });

      return res.status(500).json({
        success: false,
        message: 'Indexing failed',
      });
    }
  },

  /**
   * 🔥 Bulk index products
   * POST /api/index/bulk
   */
  async bulkIndex(req: Request, res: Response): Promise<Response> {
    try {
      const products = req.body.products || req.body || [];

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'products array is required and cannot be empty',
        });
      }

      const entities = products.map(
        (p: any) =>
          new ProductIndexEntity(
            p.id,
            p.name,
            p.description,
            p.price,
            p.currency,
            p.category,
            p.brand,
            p.tags || [],
            p.images || [],
            p.inStock ?? true,
            p.rating || 0,
            p.reviewCount || 0
          )
      );

      await indexService.bulkIndex(entities);

      return res.json({
        success: true,
        message: `${entities.length} products indexed successfully`,
      });
    } catch (error: any) {
      logger.error('Bulk index failed', { error: error.message });

      return res.status(500).json({
        success: false,
        message: 'Bulk indexing failed',
      });
    }
  },

  /**
   * Health check for indexer
   */
  async health(req: Request, res: Response): Promise<Response> {
    return res.json({
      success: true,
      service: 'search-indexer',
      status: 'OK',
    });
  },
};
