// apps/analytics-service/src/presentation/routes/analytics.routes.ts

import { Router } from 'express';

import { AnalyticsController } from '../controllers/analytics.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { protect } from '../../middlewares/auth.middleware';

// Import from container (Recommended)
import { 
  analyticsService, 
  dashboardService 
} from '../../container';

const router = Router();

/**
 * ====================== DEPENDENCY INJECTION ======================
 */
const analyticsController = new AnalyticsController(analyticsService);
const dashboardController = new DashboardController(dashboardService);

/**
 * ====================== ANALYTICS ROUTES ======================
 */

// Track events (Public - called from other services or frontend)
router.post('/track', analyticsController.trackEvent);

// Get user events (Protected)
router.get('/users/:userId/events', protect, analyticsController.getUserEvents);

// Get events by type (Protected)
router.get('/events/:eventType', protect, analyticsController.getEventsByType);

// ====================== DASHBOARD ROUTES ======================

// Overview Dashboard
router.get('/dashboard/overview', protect, dashboardController.getOverview);

// Sales Dashboard
router.get('/dashboard/sales', protect, dashboardController.getSalesDashboard);

export default router;