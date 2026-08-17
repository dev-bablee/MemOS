import { query } from "../db/connection.js";

export interface ApiKeyEntity {
  id: string;
  tenant_id: string;
  name: string;
  key_hash: string;
  prefix: string;
  scopes: string[];
  expires_at: Date | null;
  last_used_at: Date | null;
  created_at: Date;
}

export class ApiKeyRepository {
  static async listByTenant(tenantId: string): Promise<ApiKeyEntity[]> {
    const res = await query<ApiKeyEntity>(
      `SELECT id, tenant_id, name, prefix, scopes, expires_at, last_used_at, created_at
       FROM api_keys WHERE tenant_id = $1 ORDER BY created_at DESC`,
      [tenantId]
    );
    return res.rows;
  }

  static async create(data: {
    tenant_id: string;
    name: string;
    key_hash: string;
    prefix: string;
    scopes?: string[];
    expires_at?: Date | null;
  }): Promise<ApiKeyEntity> {
    const res = await query<ApiKeyEntity>(
      `INSERT INTO api_keys (tenant_id, name, key_hash, prefix, scopes, expires_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)
       RETURNING *`,
      [
        data.tenant_id,
        data.name,
        data.key_hash,
        data.prefix,
        JSON.stringify(data.scopes || ["*"]),
        data.expires_at || null,
      ]
    );
    return res.rows[0];
  }

  static async delete(id: string, tenantId: string): Promise<boolean> {
    const res = await query(
      `DELETE FROM api_keys WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );
    return (res.rowCount ?? 0) > 0;
  }
}
