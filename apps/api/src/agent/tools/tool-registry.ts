import { MemoryService } from "../../memory/memory.service.js";
import { KnowledgeGraphService } from "../../memory/knowledge-graph.service.js";
import { logger } from "../../config/logger.js";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (args: any, context: { tenantId: string; agentId?: string; projectId?: string }) => Promise<any>;
}

export class ToolRegistry {
  private static tools = new Map<string, ToolDefinition>();

  static register(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  static get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  static getAll(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  static getDefinitions(toolNames?: string[]): Array<Omit<ToolDefinition, "execute">> {
    const list = toolNames
      ? toolNames.map((name) => this.tools.get(name)).filter(Boolean) as ToolDefinition[]
      : Array.from(this.tools.values());

    return list.map(({ name, description, parameters }) => ({
      name,
      description,
      parameters,
    }));
  }

  static async executeTool(
    name: string,
    args: any,
    context: { tenantId: string; agentId?: string; projectId?: string }
  ): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool '${name}' is not registered in ToolRegistry.`);
    }
    logger.info(`Executing tool [${name}]`, { args, tenantId: context.tenantId });
    return tool.execute(args, context);
  }
}

// 1. Tool: search_memory
ToolRegistry.register({
  name: "search_memory",
  description: "Search long-term cognitive memory in CockroachDB using hybrid vector similarity and recency decay.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query or concept to recall from memory" },
      limit: { type: "number", description: "Maximum number of memories to retrieve (default 5)" },
    },
    required: ["query"],
  },
  execute: async (args, ctx) => {
    const results = await MemoryService.searchMemories({
      tenantId: ctx.tenantId,
      agentId: ctx.agentId,
      projectId: ctx.projectId,
      query: args.query,
      limit: args.limit || 5,
    });
    return results.map((r) => ({
      id: r.id,
      content: r.content,
      type: r.memory_type,
      score: r.final_score,
      lastAccessed: r.last_accessed_at,
    }));
  },
});

// 2. Tool: save_memory
ToolRegistry.register({
  name: "save_memory",
  description: "Persist an important fact, architectural decision, or user preference into long-term memory.",
  parameters: {
    type: "object",
    properties: {
      content: { type: "string", description: "The fact, decision, or insight to remember permanently" },
      memoryType: { type: "string", enum: ["EPISODIC", "SEMANTIC", "PROCEDURAL"], description: "Type of memory" },
      importance: { type: "number", description: "Importance rating between 0.1 and 1.0 (default 0.7)" },
    },
    required: ["content"],
  },
  execute: async (args, ctx) => {
    const mem = await MemoryService.ingestMemory({
      tenantId: ctx.tenantId,
      agentId: ctx.agentId,
      projectId: ctx.projectId,
      content: args.content,
      memoryType: args.memoryType || "SEMANTIC",
      importanceScore: args.importance || 0.7,
    });
    return { success: true, memoryId: mem.id, message: "Memory persisted to CockroachDB vector storage." };
  },
});

// 3. Tool: knowledge_graph
ToolRegistry.register({
  name: "knowledge_graph",
  description: "Retrieve entity nodes and relationship triplets from the knowledge graph.",
  parameters: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Maximum number of entities to return" },
    },
  },
  execute: async (args, ctx) => {
    return KnowledgeGraphService.getGraph(ctx.tenantId, ctx.projectId, args.limit || 50);
  },
});

// 4. Tool: calculator
ToolRegistry.register({
  name: "calculator",
  description: "Evaluate basic mathematical expressions safely.",
  parameters: {
    type: "object",
    properties: {
      expression: { type: "string", description: "Mathematical expression e.g. '150 * 1.25'" },
    },
    required: ["expression"],
  },
  execute: async (args) => {
    try {
      const sanitized = args.expression.replace(/[^0-9+\-*/().\s]/g, "");
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${sanitized})`)();
      return { expression: args.expression, result };
    } catch (err: any) {
      return { error: `Calculation failed: ${err.message}` };
    }
  },
});
