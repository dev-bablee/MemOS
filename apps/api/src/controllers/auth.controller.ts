import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.userId) {
        res.status(200).json({
          success: true,
          data: { tenantId: req.user?.tenantId, isApiKey: true, scopes: req.user?.scopes },
        });
        return;
      }
      const user = await AuthService.getCurrentUser(req.user.userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listApiKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const keys = await AuthService.listApiKeys(req.user!.tenantId);
      res.status(200).json({
        success: true,
        data: keys,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.createApiKey({
        tenantId: req.user!.tenantId,
        name: req.body.name,
        scopes: req.body.scopes,
        expiresInDays: req.body.expiresInDays,
      });
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteApiKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.deleteApiKey(req.params.id, req.user!.tenantId);
      res.status(200).json({
        success: true,
        message: "API Key revoked successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}
