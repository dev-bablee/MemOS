import { ApiClient } from "../api/api-client";
import { Project } from "@/types/project";
import { ApiResponse } from "@/types/api";

export const projectService = {
  async listProjects(): Promise<ApiResponse<Project[]>> {
    return ApiClient.get("/projects");
  },

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return ApiClient.get(`/projects/${id}`);
  },

  async createProject(data: { name: string; description?: string; settings?: Record<string, unknown> }): Promise<ApiResponse<Project>> {
    return ApiClient.post("/projects", data);
  },

  async updateProject(id: string, data: Partial<Project>): Promise<ApiResponse<Project>> {
    return ApiClient.patch(`/projects/${id}`, data);
  },

  async deleteProject(id: string): Promise<ApiResponse<{ message: string }>> {
    return ApiClient.delete(`/projects/${id}`);
  },
};
