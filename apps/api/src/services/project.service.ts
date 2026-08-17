import { ProjectRepository, ProjectEntity } from "../repositories/project.repository.js";
import { AppError } from "../middleware/error-handler.js";

export class ProjectService {
  static async listProjects(tenantId: string): Promise<ProjectEntity[]> {
    return ProjectRepository.listByTenant(tenantId);
  }

  static async getProject(id: string, tenantId: string): Promise<ProjectEntity> {
    const project = await ProjectRepository.findById(id, tenantId);
    if (!project) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }
    return project;
  }

  static async createProject(data: {
    tenantId: string;
    name: string;
    description?: string;
    settings?: Record<string, any>;
  }): Promise<ProjectEntity> {
    return ProjectRepository.create({
      tenant_id: data.tenantId,
      name: data.name,
      description: data.description,
      settings: data.settings,
    });
  }

  static async updateProject(
    id: string,
    tenantId: string,
    data: Partial<{ name: string; description: string; settings: Record<string, any> }>
  ): Promise<ProjectEntity> {
    const updated = await ProjectRepository.update(id, tenantId, data);
    if (!updated) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }
    return updated;
  }

  static async deleteProject(id: string, tenantId: string): Promise<boolean> {
    const deleted = await ProjectRepository.delete(id, tenantId);
    if (!deleted) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }
    return true;
  }
}
