import { Request, Response, NextFunction } from "express";
import { AgentService } from "../services/agent.service.js";
import { AgentExecutor } from "../agent/executor.js";
import { Planner } from "../agent/planner.js";

export class AgentController {
  static async listAgents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agents = await AgentService.listAgents(
        req.user!.tenantId,
        req.query.projectId as string | undefined
      );
      res.status(200).json({
        success: true,
        data: agents,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agent = await AgentService.getAgent(req.params.id, req.user!.tenantId);
      res.status(200).json({
        success: true,
        data: agent,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agent = await AgentService.createAgent({
        tenantId: req.user!.tenantId,
        projectId: req.body.projectId,
        name: req.body.name,
        description: req.body.description,
        model: req.body.model,
        systemPrompt: req.body.systemPrompt,
        memoryConfig: req.body.memoryConfig,
        tools: req.body.tools,
      });
      res.status(201).json({
        success: true,
        data: agent,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agent = await AgentService.updateAgent(req.params.id, req.user!.tenantId, req.body);
      res.status(200).json({
        success: true,
        data: agent,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAgent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AgentService.deleteAgent(req.params.id, req.user!.tenantId);
      res.status(200).json({
        success: true,
        message: "Agent deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Plan a task using the Planner DAG
   */
  static async planGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plan = Planner.generatePlan(req.body.goal);
      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Execute Agent Turn (Supports SSE Streaming and standard JSON)
   */
  static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agent = await AgentService.getAgent(req.params.id, req.user!.tenantId);
      const isStream = req.query.stream === "true" || req.body.stream === true;

      if (isStream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const result = await AgentExecutor.execute({
          tenantId: req.user!.tenantId,
          agentId: agent.id,
          sessionId: req.body.sessionId,
          userPrompt: req.body.message,
          systemPrompt: agent.system_prompt,
          tools: agent.tools,
          onToken: (token: string) => {
            res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
          },
        });

        res.write(`data: ${JSON.stringify({ type: "done", result })}\n\n`);
        res.end();
      } else {
        const result = await AgentExecutor.execute({
          tenantId: req.user!.tenantId,
          agentId: agent.id,
          sessionId: req.body.sessionId,
          userPrompt: req.body.message,
          systemPrompt: agent.system_prompt,
          tools: agent.tools,
        });

        res.status(200).json({
          success: true,
          data: result,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}
