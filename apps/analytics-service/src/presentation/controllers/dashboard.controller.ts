// apps/analytics-service/src/presentation/controllers/dashboard.controller.ts

import { Request, Response } from 'express';
import { DashboardService } from '../../application/services/dashboard.service';
import logger from '@org/shared-logger';

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * GET Overview Dashboard
   */
  getOverview = async (req: Request, res: Response) => {
    try {
      const dashboard = await this.dashboardService.getOverview();

      return res.json(dashboard);
    } catch (error: any) {
      logger.error('Dashboard overview failed', { error: error.message });
      return res.status(500).json({
        success: false,
        message: 'Failed to load dashboard overview',
      });
    }
  };

  /**
   * GET Sales Dashboard
   */
  getSalesDashboard = async (req: Request, res: Response) => {
    try {
      const data = await this.dashboardService.getSalesDashboard();

      return res.json({
        success: true,
        data,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load sales dashboard',
      });
    }
  };
}