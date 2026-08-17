import { query } from "../db/connection.js";

export interface SessionEntity {
  id: string;
  agent_id: string;
  user_id: string | null;
  status: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface MessageEntity {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tokens: number;
  tool_calls: any | null;
  metadata: Record<string, any>;
  created_at: Date;
}

export class SessionRepository {
  static async create(data: {
    agent_id: string;
    user_id?: string | null;
    metadata?: Record<string, any>;
  }): Promise<SessionEntity> {
    const res = await query<SessionEntity>(
      `INSERT INTO sessions (agent_id, user_id, metadata)
       VALUES ($1, $2, $3::jsonb)
       RETURNING *`,
      [data.agent_id, data.user_id || null, JSON.stringify(data.metadata || {})]
    );
    return res.rows[0];
  }

  static async findById(id: string): Promise<SessionEntity | null> {
    const res = await query<SessionEntity>(
      `SELECT * FROM sessions WHERE id = $1 LIMIT 1`,
      [id]
    );
    return res.rows[0] || null;
  }

  static async listByAgent(agentId: string, limit = 20): Promise<SessionEntity[]> {
    const res = await query<SessionEntity>(
      `SELECT * FROM sessions WHERE agent_id = $1 ORDER BY updated_at DESC LIMIT $2`,
      [agentId, limit]
    );
    return res.rows;
  }

  static async appendMessage(data: {
    session_id: string;
    role: "user" | "assistant" | "system" | "tool";
    content: string;
    tokens?: number;
    tool_calls?: any;
    metadata?: Record<string, any>;
  }): Promise<MessageEntity> {
    const res = await query<MessageEntity>(
      `INSERT INTO messages (session_id, role, content, tokens, tool_calls, metadata)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
       RETURNING *`,
      [
        data.session_id,
        data.role,
        data.content,
        data.tokens || 0,
        data.tool_calls ? JSON.stringify(data.tool_calls) : null,
        JSON.stringify(data.metadata || {}),
      ]
    );

    // Touch session updated_at
    await query(`UPDATE sessions SET updated_at = NOW() WHERE id = $1`, [data.session_id]);

    return res.rows[0];
  }

  static async getMessages(sessionId: string, limit = 50): Promise<MessageEntity[]> {
    const res = await query<MessageEntity>(
      `SELECT * FROM messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT $2`,
      [sessionId, limit]
    );
    return res.rows;
  }
}
