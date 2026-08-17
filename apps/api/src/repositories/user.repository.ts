import { query } from "../db/connection.js";

export interface UserEntity {
  id: string;
  tenant_id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export class UserRepository {
  static async findByEmail(email: string): Promise<UserEntity | null> {
    const res = await query<UserEntity>(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase().trim()]
    );
    return res.rows[0] || null;
  }

  static async findById(id: string): Promise<UserEntity | null> {
    const res = await query<UserEntity>(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );
    return res.rows[0] || null;
  }

  static async create(data: {
    tenant_id: string;
    email: string;
    password_hash: string;
    name: string;
    role?: string;
  }): Promise<UserEntity> {
    const res = await query<UserEntity>(
      `INSERT INTO users (tenant_id, email, password_hash, name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.tenant_id, data.email.toLowerCase().trim(), data.password_hash, data.name, data.role || "admin"]
    );
    return res.rows[0];
  }
}
