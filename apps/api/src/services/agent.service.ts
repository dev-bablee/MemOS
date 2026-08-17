import { AgentRepository, AgentEntity } from "../repositories/agent.repository.js";
import { AppError } from "../middleware/error-handler.js";

export class AgentService {
  static async listAgents(tenantId: string, projectId?: string): Promise<AgentEntity[]> {
    return AgentRepository.listByTenant(tenantId, projectId);
  }

  static async getAgent(id: string, tenantId: string): Promise<AgentEntity> {
    const agent = await AgentRepository.findById(id, tenantId);
    if (!agent) {
      throw new AppError("Agent not found", 404, "AGENT_NOT_FOUND");
    }
    return agent;
  }

  static async createAgent(data: {
    tenantId: string;
    projectId?: string | null;
    name: string;
    description?: string;
    model?: string;
    systemPrompt: string;
    memoryConfig?: Record<string, any>;
    tools?: string[];
  }): Promise<AgentEntity> {
    return AgentRepository.create({
      tenant_id: data.tenantId,
      project_id: data.projectId,
      name: data.name,
      description: data.description,
      model: data.model,
      system_prompt: data.systemPrompt,
      memory_config: data.memoryConfig,
      tools: data.tools,
    });
  }

  static async updateAgent(
    id: string,
    tenantId: string,
    data: Partial<{
      name: string;
      description: string;
      model: string;
      systemPrompt: string;
      memoryConfig: Record<string, any>;
      tools: string[];
      isActive: boolean;
    }>
  ): Promise<AgentEntity> {
    const updated = await AgentRepository.update(id, tenantId, {
      name: data.name,
      description: data.description,
      model: data.model,
      system_prompt: data.systemPrompt,
      memory_config: data.memoryConfig,
      tools: data.tools,
      is_active: data.isActive,
    });

    if (!updated) {
      throw new AppError("Agent not found or update failed", 404, "AGENT_NOT_FOUND");
    }
    return updated;
  }

  static async deleteAgent(id: string, tenantId: string): Promise<boolean> {
    const deleted = await AgentRepository.delete(id, tenantId);
    if (!deleted) {
      throw new AppError("Agent not found", 404, "AGENT_NOT_FOUND");
    }
    return true;
  }
}
