import { MemoryRepository, LongTermMemoryEntity, MemorySearchResult, MemoryType } from "../repositories/memory.repository.js";
import { EmbeddingService } from "./embedding.service.js";
import { AppError } from "../middleware/error-handler.js";
import { logger } from "../config/logger.js";

export class MemoryService {
  static async ingestMemory(data: {
    tenantId: string;
    agentId?: string | null;
    projectId?: string | null;
    sessionId?: string | null;
    memoryType?: MemoryType;
    content: string;
    summary?: string;
    importanceScore?: number;
    metadata?: Record<string, any>;
  }): Promise<LongTermMemoryEntity> {
    if (!data.content || data.content.trim().length === 0) {
      throw new AppError("Memory content cannot be empty", 400, "INVALID_CONTENT");
    }

    logger.debug("Ingesting memory", {
      tenantId: data.tenantId,
      agentId: data.agentId,
      type: data.memoryType,
      length: data.content.length,
    });

    // Generate vector embedding
    const embedding = await EmbeddingService.generateEmbedding(data.content);

    return MemoryRepository.create({
      tenant_id: data.tenantId,
      agent_id: data.agentId,
      project_id: data.projectId,
      session_id: data.sessionId,
      memory_type: data.memoryType || "SEMANTIC",
      content: data.content.trim(),
      summary: data.summary,
      embedding,
      importance_score: data.importanceScore ?? 0.5,
      metadata: data.metadata,
    });
  }

  static async searchMemories(params: {
    tenantId: string;
    agentId?: string;
    projectId?: string;
    query: string;
    memoryTypes?: MemoryType[];
    limit?: number;
    minScore?: number;
    weights?: {
      vector?: number;
      recency?: number;
      importance?: number;
      frequency?: number;
      halfLifeDays?: number;
    };
  }): Promise<MemorySearchResult[]> {
    const queryEmbedding = await EmbeddingService.generateEmbedding(params.query);

    return MemoryRepository.searchWithDecayScoring({
      tenantId: params.tenantId,
      agentId: params.agentId,
      projectId: params.projectId,
      queryEmbedding,
      queryText: params.query,
      memoryTypes: params.memoryTypes,
      limit: params.limit || 10,
      minScore: params.minScore || 0.0,
      weights: params.weights,
    });
  }

  static async listMemories(
    tenantId: string,
    options: { agentId?: string; projectId?: string; memoryType?: string; limit?: number; offset?: number } = {}
  ): Promise<{ memories: LongTermMemoryEntity[]; total: number }> {
    return MemoryRepository.listByTenant(tenantId, options);
  }

  static async getMemory(id: string, tenantId: string): Promise<LongTermMemoryEntity> {
    const memory = await MemoryRepository.findById(id, tenantId);
    if (!memory) {
      throw new AppError("Memory not found", 404, "MEMORY_NOT_FOUND");
    }
    return memory;
  }

  static async deleteMemory(id: string, tenantId: string): Promise<boolean> {
    const deleted = await MemoryRepository.delete(id, tenantId);
    if (!deleted) {
      throw new AppError("Memory not found", 404, "MEMORY_NOT_FOUND");
    }
    return true;
  }
}
