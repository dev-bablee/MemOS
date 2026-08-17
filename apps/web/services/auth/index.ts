import { ApiClient } from "../api/api-client";
import { User, ApiKey } from "@/types/auth";
import { ApiResponse } from "@/types/api";

export const authService = {
  async signup(data: { name: string; email: string; password: string; organizationName?: string }): Promise<ApiResponse<{ user: User; token: string; tenantId: string }>> {
    return ApiClient.post("/auth/signup", data);
  },

  async login(data: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string; tenantId: string }>> {
    return ApiClient.post("/auth/login", data);
  },

  async getMe(): Promise<ApiResponse<User>> {
    return ApiClient.get("/auth/me");
  },

  async listApiKeys(): Promise<ApiResponse<ApiKey[]>> {
    return ApiClient.get("/api-keys");
  },

  async createApiKey(data: { name: string; scopes?: string[]; expiresInDays?: number }): Promise<ApiResponse<{ apiKey: ApiKey; rawKey: string }>> {
    return ApiClient.post("/api-keys", data);
  },

  async deleteApiKey(id: string): Promise<ApiResponse<{ message: string }>> {
    return ApiClient.delete(`/api-keys/${id}`);
  },
};
