import { Request, Response, NextFunction } from "express";
import { MemoryService } from "../memory/memory.service.js";

export class MemoryController {
  static async listMemories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await MemoryService.listMemories(req.user!.tenantId, {
        agentId: req.query.agentId as string | undefined,
        projectId: req.query.projectId as string | undefined,
        memoryType: req.query.memoryType as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
      });
      res.status(200).json({
        success: true,
        data: result.memories,
        pagination: {
          total: result.total,
          limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
          offset: req.query.offset ? parseInt(req.query.offset as string, 10) : 0,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const memory = await MemoryService.getMemory(req.params.id, req.user!.tenantId);
      res.status(200).json({
        success: true,
        data: memory,
      });
    } catch (err) {
      next(err);
    }
  }

  static async ingestMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const memory = await MemoryService.ingestMemory({
        tenantId: req.user!.tenantId,
        agentId: req.body.agentId,
        projectId: req.body.projectId,
        sessionId: req.body.sessionId,
        memoryType: req.body.memoryType,
        content: req.body.content,
        summary: req.body.summary,
        importanceScore: req.body.importanceScore,
        metadata: req.body.metadata,
      });
      res.status(201).json({
        success: true,
        data: memory,
      });
    } catch (err) {
      next(err);
    }
  }

  static async searchMemories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const results = await MemoryService.searchMemories({
        tenantId: req.user!.tenantId,
        agentId: req.body.agentId,
        projectId: req.body.projectId,
        query: req.body.query,
        memoryTypes: req.body.memoryTypes,
        limit: req.body.limit,
        minScore: req.body.minScore,
        weights: req.body.weights,
      });
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMemory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await MemoryService.deleteMemory(req.params.id, req.user!.tenantId);
      res.status(200).json({
        success: true,
        message: "Memory record deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}
