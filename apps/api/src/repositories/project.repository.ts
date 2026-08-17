import { query } from "../db/connection.js";

export interface ProjectEntity {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class ProjectRepository {
  static async listByTenant(tenantId: string): Promise<ProjectEntity[]> {
    const res = await query<ProjectEntity>(
      `SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC`,
      [tenantId]
    );
    return res.rows;
  }

  static async findById(id: string, tenantId: string): Promise<ProjectEntity | null> {
    const res = await query<ProjectEntity>(
      `SELECT * FROM projects WHERE id = $1 AND tenant_id = $2 LIMIT 1`,
      [id, tenantId]
    );
    return res.rows[0] || null;
  }

  static async create(data: {
    tenant_id: string;
    name: string;
    description?: string;
    settings?: Record<string, any>;
  }): Promise<ProjectEntity> {
    const res = await query<ProjectEntity>(
      `INSERT INTO projects (tenant_id, name, description, settings)
       VALUES ($1, $2, $3, $4::jsonb)
       RETURNING *`,
      [data.tenant_id, data.name, data.description || null, JSON.stringify(data.settings || {})]
    );
    return res.rows[0];
  }

  static async update(
    id: string,
    tenantId: string,
    data: Partial<{ name: string; description: string; settings: Record<string, any> }>
  ): Promise<ProjectEntity | null> {
    const res = await query<ProjectEntity>(
      `UPDATE projects 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           settings = COALESCE($3::jsonb, settings),
           updated_at = NOW()
       WHERE id = $4 AND tenant_id = $5
       RETURNING *`,
      [
        data.name ?? null,
        data.description ?? null,
        data.settings ? JSON.stringify(data.settings) : null,
        id,
        tenantId,
      ]
    );
    return res.rows[0] || null;
  }

  static async delete(id: string, tenantId: string): Promise<boolean> {
    const res = await query(
      `DELETE FROM projects WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
