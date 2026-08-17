import { ApiClient } from "../api/api-client";
import { LongTermMemory, MemorySearchResult, MemoryType } from "@/types/memory";
import { ApiResponse } from "@/types/api";

export const memoryService = {
  async listMemories(params?: {
    agentId?: string;
    projectId?: string;
    memoryType?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<LongTermMemory[]>> {
    return ApiClient.get("/memories", params);
  },

  async getMemory(id: string): Promise<ApiResponse<LongTermMemory>> {
    return ApiClient.get(`/memories/${id}`);
  },

  async ingestMemory(data: {
    content: string;
    memoryType?: MemoryType;
    agentId?: string | null;
    projectId?: string | null;
    summary?: string;
    importanceScore?: number;
  }): Promise<ApiResponse<LongTermMemory>> {
    return ApiClient.post("/memories", data);
  },

  async searchMemories(data: {
    query: string;
    agentId?: string;
    projectId?: string;
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
  }): Promise<ApiResponse<MemorySearchResult[]>> {
    return ApiClient.post("/memories/search", data);
  },

  async deleteMemory(id: string): Promise<ApiResponse<{ message: string }>> {
    return ApiClient.delete(`/memories/${id}`);
  },
};
