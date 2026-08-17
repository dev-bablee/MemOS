import { ApiClient } from "../api/api-client";
import { KnowledgeGraphData, MemorySearchResult } from "@/types/memory";
import { ApiResponse } from "@/types/api";

export interface DashboardMetricsPayload {
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
    cockroachDb: string;
    bedrockRuntime: string;
    vectorIndexStatus: string;
  };
}

export const searchService = {
  async universalSearch(query: string): Promise<ApiResponse<{
    query: string;
    memories: MemorySearchResult[];
    graph: KnowledgeGraphData;
  }>> {
    return ApiClient.get("/search", { q: query });
  },

  async getKnowledgeGraph(projectId?: string, limit = 100): Promise<ApiResponse<KnowledgeGraphData>> {
    return ApiClient.get("/graph", { projectId, limit });
  },

  async getDashboardMetrics(): Promise<ApiResponse<DashboardMetricsPayload>> {
    return ApiClient.get("/dashboard/metrics");
  },
};
