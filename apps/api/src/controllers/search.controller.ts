import { Request, Response, NextFunction } from "express";
import { MemoryService } from "../memory/memory.service.js";
import { KnowledgeGraphService } from "../memory/knowledge-graph.service.js";

export class SearchController {
  /**
   * Unified search endpoint querying both memory vectors and the knowledge graph.
   */
  static async universalSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = (req.query.q as string) || (req.body.query as string);
      if (!query || query.trim().length === 0) {
        res.status(200).json({
          success: true,
          data: { memories: [], graph: { nodes: [], edges: [] } },
        });
        return;
      }

      const [memories, graph] = await Promise.all([
        MemoryService.searchMemories({
          tenantId: req.user!.tenantId,
          query,
          limit: 10,
        }),
        KnowledgeGraphService.getGraph(req.user!.tenantId, undefined, 20),
      ]);

      res.status(200).json({
        success: true,
        data: {
          query,
          memories,
          graph,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getKnowledgeGraph(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const graph = await KnowledgeGraphService.getGraph(
        req.user!.tenantId,
        req.query.projectId as string | undefined,
        req.query.limit ? parseInt(req.query.limit as string, 10) : 100
      );
      res.status(200).json({
        success: true,
        data: graph,
      });
    } catch (err) {
      next(err);
    }
  }
}
