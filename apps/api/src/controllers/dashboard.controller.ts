import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytics.service.js";

export class DashboardController {
  static async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await AnalyticsService.getDashboardMetrics(req.user!.tenantId);
      res.status(200).json({
        success: true,
        data: metrics,
      });
    } catch (err) {
      next(err);
    }
  }

  static async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: "HEALTHY",
      service: "memos-api",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
    });
  }
}
