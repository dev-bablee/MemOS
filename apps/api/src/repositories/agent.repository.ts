import { query } from "../db/connection.js";

export interface AgentEntity {
  id: string;
  tenant_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  model: string;
  system_prompt: string;
  memory_config: {
    halfLifeDays?: number;
    minImportance?: number;
    vectorWeight?: number;
  };
  tools: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class AgentRepository {
  static async listByTenant(tenantId: string, projectId?: string): Promise<AgentEntity[]> {
    let sql = `SELECT * FROM agents WHERE tenant_id = $1`;
    const params: any[] = [tenantId];

    if (projectId) {
      sql += ` AND project_id = $2`;
      params.push(projectId);
    }
    sql += ` ORDER BY created_at DESC`;

    const res = await query<AgentEntity>(sql, params);
    return res.rows;
  }

  static async findById(id: string, tenantId: string): Promise<AgentEntity | null> {
    const res = await query<AgentEntity>(
      `SELECT * FROM agents WHERE id = $1 AND tenant_id = $2 LIMIT 1`,
      [id, tenantId]
    );
    return res.rows[0] || null;
  }

  static async create(data: {
    tenant_id: string;
    project_id?: string | null;
    name: string;
    description?: string;
    model?: string;
    system_prompt: string;
    memory_config?: Record<string, any>;
    tools?: string[];
  }): Promise<AgentEntity> {
    const res = await query<AgentEntity>(
      `INSERT INTO agents (tenant_id, project_id, name, description, model, system_prompt, memory_config, tools)
       VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
       RETURNING *`,
      [
        data.tenant_id,
        data.project_id || null,
        data.name,
        data.description || null,
        data.model || "anthropic.claude-3-5-sonnet-20241022-v2:0",
        data.system_prompt,
        JSON.stringify(data.memory_config || { halfLifeDays: 7, minImportance: 0.3, vectorWeight: 0.5 }),
        JSON.stringify(data.tools || ["search_memory", "save_memory", "knowledge_graph"]),
      ]
    );
    return res.rows[0];
  }

  static async update(
    id: string,
    tenantId: string,
    data: Partial<{
      name: string;
      description: string;
      model: string;
      system_prompt: string;
      memory_config: Record<string, any>;
      tools: string[];
      is_active: boolean;
    }>
  ): Promise<AgentEntity | null> {
    const res = await query<AgentEntity>(
      `UPDATE agents
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           model = COALESCE($3, model),
           system_prompt = COALESCE($4, system_prompt),
           memory_config = COALESCE($5::jsonb, memory_config),
           tools = COALESCE($6::jsonb, tools),
           is_active = COALESCE($7, is_active),
           updated_at = NOW()
       WHERE id = $8 AND tenant_id = $9
       RETURNING *`,
      [
        data.name ?? null,
        data.description ?? null,
        data.model ?? null,
        data.system_prompt ?? null,
        data.memory_config ? JSON.stringify(data.memory_config) : null,
        data.tools ? JSON.stringify(data.tools) : null,
        data.is_active ?? null,
        id,
        tenantId,
      ]
    );
    return res.rows[0] || null;
  }

  static async delete(id: string, tenantId: string): Promise<boolean> {
    const res = await query(
      `DELETE FROM agents WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
