import { query } from "../db/connection.js";

export interface TenantEntity {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: Date;
  updated_at: Date;
}

export class TenantRepository {
  static async findById(id: string): Promise<TenantEntity | null> {
    const res = await query<TenantEntity>(
      `SELECT * FROM tenants WHERE id = $1 LIMIT 1`,
      [id]
    );
    return res.rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<TenantEntity | null> {
    const res = await query<TenantEntity>(
      `SELECT * FROM tenants WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    return res.rows[0] || null;
  }

  static async create(data: { name: string; slug: string; plan?: string }): Promise<TenantEntity> {
    const res = await query<TenantEntity>(
      `INSERT INTO tenants (name, slug, plan)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.slug, data.plan || "pro"]
    );
    return res.rows[0];
  }
}
