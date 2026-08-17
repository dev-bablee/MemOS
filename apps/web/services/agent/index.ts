import { ApiClient } from "../api/api-client";
import { Agent, ExecutionPlan } from "@/types/agent";
import { ApiResponse } from "@/types/api";

export interface AgentChatResult {
  sessionId: string;
  response: string;
  retrievedMemories: unknown[];
  executedTools: unknown[];
  tokensUsed: number;
}

export const agentService = {
  async listAgents(projectId?: string): Promise<ApiResponse<Agent[]>> {
    return ApiClient.get("/agents", projectId ? { projectId } : undefined);
  },

  async getAgent(id: string): Promise<ApiResponse<Agent>> {
    return ApiClient.get(`/agents/${id}`);
  },

  async createAgent(data: {
    name: string;
    description?: string;
    projectId?: string | null;
    model?: string;
    systemPrompt: string;
    memoryConfig?: Record<string, unknown>;
    tools?: string[];
  }): Promise<ApiResponse<Agent>> {
    return ApiClient.post("/agents", data);
  },

  async updateAgent(id: string, data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return ApiClient.patch(`/agents/${id}`, data);
  },

  async deleteAgent(id: string): Promise<ApiResponse<{ message: string }>> {
    return ApiClient.delete(`/agents/${id}`);
  },

  async planGoal(goal: string): Promise<ApiResponse<ExecutionPlan>> {
    return ApiClient.post("/agents/plan", { goal });
  },

  async chat(agentId: string, message: string, sessionId?: string): Promise<ApiResponse<AgentChatResult>> {
    return ApiClient.post(`/agents/${agentId}/chat`, { message, sessionId });
  },
};
