import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service.js";

export class ProjectController {
  static async listProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await ProjectService.listProjects(req.user!.tenantId);
      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.getProject(req.params.id, req.user!.tenantId);
      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.createProject({
        tenantId: req.user!.tenantId,
        name: req.body.name,
        description: req.body.description,
        settings: req.body.settings,
      });
      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await ProjectService.updateProject(req.params.id, req.user!.tenantId, req.body);
      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ProjectService.deleteProject(req.params.id, req.user!.tenantId);
      res.status(200).json({
        success: true,
        message: "Project deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}
