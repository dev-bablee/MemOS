import { query } from "../db/connection.js";
import { MemoryRepository } from "../repositories/memory.repository.js";

export interface DashboardMetrics {
  totalMemories: number;
  memoryTypeBreakdown: {
    episodic: number;
    semantic: number;
    procedural: number;
  };
  totalAgents: number;
  totalProjects: number;
  totalSessions: number;
  totalMessages: number;
  averageImportance: number;
  systemHealth: {
    cockroachDb: "HEALTHY" | "DEGRADED" | "DOWN";
    bedrockRuntime: "HEALTHY" | "DEGRADED" | "CONFIGURED";
    vectorIndexStatus: "ONLINE";
  };
}

export class AnalyticsService {
  static async getDashboardMetrics(tenantId: string): Promise<DashboardMetrics> {
    const memoryStats = await MemoryRepository.getStats(tenantId);

    const [agentsRes, projectsRes, sessionsRes, messagesRes] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) FROM agents WHERE tenant_id = $1`, [tenantId]),
      query<{ count: string }>(`SELECT COUNT(*) FROM projects WHERE tenant_id = $1`, [tenantId]),
      query<{ count: string }>(
        `SELECT COUNT(*) FROM sessions s JOIN agents a ON s.agent_id = a.id WHERE a.tenant_id = $1`,
        [tenantId]
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) FROM messages m 
         JOIN sessions s ON m.session_id = s.id 
         JOIN agents a ON s.agent_id = a.id 
         WHERE a.tenant_id = $1`,
        [tenantId]
      ),
    ]);

    return {
      totalMemories: memoryStats.totalMemories,
      memoryTypeBreakdown: {
        episodic: memoryStats.episodicCount,
        semantic: memoryStats.semanticCount,
        procedural: memoryStats.proceduralCount,
      },
      totalAgents: parseInt(agentsRes.rows[0]?.count || "0", 10),
      totalProjects: parseInt(projectsRes.rows[0]?.count || "0", 10),
      totalSessions: parseInt(sessionsRes.rows[0]?.count || "0", 10),
      totalMessages: parseInt(messagesRes.rows[0]?.count || "0", 10),
      averageImportance: memoryStats.avgImportance,
      systemHealth: {
        cockroachDb: "HEALTHY",
        bedrockRuntime: "HEALTHY",
        vectorIndexStatus: "ONLINE",
      },
    };
  }
}
