import { query, withTransaction } from "../db/connection.js";
import { env } from "../config/env.js";

export type MemoryType = "EPISODIC" | "SEMANTIC" | "PROCEDURAL";

export interface LongTermMemoryEntity {
  id: string;
  tenant_id: string;
  agent_id: string | null;
  project_id: string | null;
  session_id: string | null;
  memory_type: MemoryType;
  content: string;
  summary: string | null;
  embedding: number[] | null;
  importance_score: number;
  access_count: number;
  last_accessed_at: Date;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface MemorySearchResult extends LongTermMemoryEntity {
  vector_similarity: number;
  recency_decay: number;
  final_score: number;
}

export class MemoryRepository {
  static async create(data: {
    tenant_id: string;
    agent_id?: string | null;
    project_id?: string | null;
    session_id?: string | null;
    memory_type?: MemoryType;
    content: string;
    summary?: string;
    embedding?: number[];
    importance_score?: number;
    metadata?: Record<string, any>;
  }): Promise<LongTermMemoryEntity> {
    const res = await query<LongTermMemoryEntity>(
      `INSERT INTO long_term_memories 
       (tenant_id, agent_id, project_id, session_id, memory_type, content, summary, embedding, importance_score, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb)
       RETURNING *`,
      [
        data.tenant_id,
        data.agent_id || null,
        data.project_id || null,
        data.session_id || null,
        data.memory_type || "SEMANTIC",
        data.content,
        data.summary || null,
        data.embedding ? JSON.stringify(data.embedding) : null,
        data.importance_score ?? 0.5,
        JSON.stringify(data.metadata || {}),
      ]
    );
    return res.rows[0];
  }

  static async listByTenant(
    tenantId: string,
    options: { agentId?: string; projectId?: string; memoryType?: string; limit?: number; offset?: number } = {}
  ): Promise<{ memories: LongTermMemoryEntity[]; total: number }> {
    let where = `WHERE tenant_id = $1`;
    const params: any[] = [tenantId];
    let pIdx = 2;

    if (options.agentId) {
      where += ` AND agent_id = $${pIdx++}`;
      params.push(options.agentId);
    }
    if (options.projectId) {
      where += ` AND project_id = $${pIdx++}`;
      params.push(options.projectId);
    }
    if (options.memoryType) {
      where += ` AND memory_type = $${pIdx++}`;
      params.push(options.memoryType);
    }

    const countRes = await query<{ count: string }>(`SELECT COUNT(*) FROM long_term_memories ${where}`, params);
    const total = parseInt(countRes.rows[0]?.count || "0", 10);

    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const listRes = await query<LongTermMemoryEntity>(
      `SELECT * FROM long_term_memories ${where} ORDER BY created_at DESC LIMIT $${pIdx++} OFFSET $${pIdx++}`,
      [...params, limit, offset]
    );

    return { memories: listRes.rows, total };
  }

  static async findById(id: string, tenantId: string): Promise<LongTermMemoryEntity | null> {
    const res = await query<LongTermMemoryEntity>(
      `SELECT * FROM long_term_memories WHERE id = $1 AND tenant_id = $2 LIMIT 1`,
      [id, tenantId]
    );
    return res.rows[0] || null;
  }

  static async delete(id: string, tenantId: string): Promise<boolean> {
    const res = await query(
      `DELETE FROM long_term_memories WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    return (res.rowCount ?? 0) > 0;
  }

  /**
   * Hybrid Dynamic Cognitive Scoring Retrieval Algorithm
   * Computes cosine similarity, recency decay e^(-lambda * delta_t), importance weighting, and log-scaled access frequency.
   */
  static async searchWithDecayScoring(params: {
    tenantId: string;
    agentId?: string;
    projectId?: string;
    queryEmbedding?: number[];
    queryText?: string;
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
    const limit = params.limit || 10;
    const minScore = params.minScore || 0.0;
    const w1 = params.weights?.vector ?? env.MEMORY_WEIGHT_VECTOR;
    const w2 = params.weights?.recency ?? env.MEMORY_WEIGHT_RECENCY;
    const w3 = params.weights?.importance ?? env.MEMORY_WEIGHT_IMPORTANCE;
    const w4 = params.weights?.frequency ?? env.MEMORY_WEIGHT_FREQUENCY;
    const halfLifeDays = params.weights?.halfLifeDays ?? env.MEMORY_DECAY_HALF_LIFE_DAYS;
    const lambda = Math.LN2 / halfLifeDays;

    let sql = `
      SELECT 
        id, tenant_id, agent_id, project_id, session_id, memory_type, content, summary,
        embedding, importance_score, access_count, last_accessed_at, metadata, created_at, updated_at
      FROM long_term_memories
      WHERE tenant_id = $1
    `;
    const queryParams: any[] = [params.tenantId];
    let pIdx = 2;

    if (params.agentId) {
      sql += ` AND (agent_id = $${pIdx++} OR agent_id IS NULL)`;
      queryParams.push(params.agentId);
    }
    if (params.projectId) {
      sql += ` AND (project_id = $${pIdx++} OR project_id IS NULL)`;
      queryParams.push(params.projectId);
    }
    if (params.memoryTypes && params.memoryTypes.length > 0) {
      sql += ` AND memory_type = ANY($${pIdx++})`;
      queryParams.push(params.memoryTypes);
    }

    const rows = (await query<LongTermMemoryEntity>(sql, queryParams)).rows;
    if (rows.length === 0) return [];

    const now = Date.now();
    const scoredResults: MemorySearchResult[] = [];
    const accessedIds: string[] = [];

    // Find max access count in set for normalization
    const maxAccess = Math.max(...rows.map((r) => r.access_count || 0), 1);

    for (const mem of rows) {
      // 1. Vector Cosine Similarity
      let vectorSim = 0.5; // default midpoint if no embedding provided
      if (params.queryEmbedding && mem.embedding && Array.isArray(mem.embedding)) {
        vectorSim = cosineSimilarity(params.queryEmbedding, mem.embedding);
      } else if (params.queryText && mem.content.toLowerCase().includes(params.queryText.toLowerCase())) {
        vectorSim = 0.9;
      }

      // 2. Exponential Recency Decay: e^(-lambda * delta_days)
      const lastAccessed = new Date(mem.last_accessed_at).getTime();
      const deltaDays = Math.max(0, (now - lastAccessed) / (1000 * 60 * 60 * 24));
      const recencyDecay = Math.exp(-lambda * deltaDays);

      // 3. Importance Score: [0.0, 1.0]
      const importance = mem.importance_score || 0.5;

      // 4. Access Frequency Log Scaling: ln(1 + count) / ln(1 + max)
      const frequency = Math.log(1 + (mem.access_count || 0)) / Math.log(1 + maxAccess);

      // Final Dynamic Composite Score
      const finalScore = w1 * vectorSim + w2 * recencyDecay + w3 * importance + w4 * frequency;

      if (finalScore >= minScore) {
        scoredResults.push({
          ...mem,
          vector_similarity: parseFloat(vectorSim.toFixed(4)),
          recency_decay: parseFloat(recencyDecay.toFixed(4)),
          final_score: parseFloat(finalScore.toFixed(4)),
        });
      }
    }

    // Sort descending by final score
    scoredResults.sort((a, b) => b.final_score - a.final_score);
    const topResults = scoredResults.slice(0, limit);

    // Asynchronously increment access count and update last_accessed_at for retrieved memories
    if (topResults.length > 0) {
      const ids = topResults.map((r) => r.id);
      query(
        `UPDATE long_term_memories 
         SET access_count = access_count + 1, last_accessed_at = NOW() 
         WHERE id = ANY($1)`,
        [ids]
      ).catch(() => {});
    }

    return topResults;
  }

  static async getStats(tenantId: string): Promise<{
    totalMemories: number;
    episodicCount: number;
    semanticCount: number;
    proceduralCount: number;
    avgImportance: number;
  }> {
    const res = await query<{
      total: string;
      episodic: string;
      semantic: string;
      procedural: string;
      avg_imp: string;
    }>(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE memory_type = 'EPISODIC') as episodic,
         COUNT(*) FILTER (WHERE memory_type = 'SEMANTIC') as semantic,
         COUNT(*) FILTER (WHERE memory_type = 'PROCEDURAL') as procedural,
         AVG(importance_score) as avg_imp
       FROM long_term_memories
       WHERE tenant_id = $1`,
      [tenantId]
    );

    const r = res.rows[0];
    return {
      totalMemories: parseInt(r?.total || "0", 10),
      episodicCount: parseInt(r?.episodic || "0", 10),
      semanticCount: parseInt(r?.semantic || "0", 10),
      proceduralCount: parseInt(r?.procedural || "0", 10),
      avgImportance: parseFloat(parseFloat(r?.avg_imp || "0.5").toFixed(2)),
    };
  }
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  const sim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, (sim + 1) / 2)); // Normalized to [0, 1]
}
