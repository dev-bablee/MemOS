import { ApiResponse } from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window === "undefined") return "mem_live_9f83a2bc7190de44";
    return localStorage.getItem("memos_token") || "mem_live_9f83a2bc7190de44";
  }

  static async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse<T>;

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: "HTTP_ERROR",
            message: `Request failed with status ${response.status}`,
          },
        };
      }

      return data;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`API request to ${url} failed:`, errorMsg);
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: "Could not connect to MemOS backend service at " + API_BASE,
        },
      };
    }
  }

  static get<T = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) qs.append(k, String(v));
      });
      const qStr = qs.toString();
      if (qStr) url += `?${qStr}`;
    }
    return this.request<T>(url, { method: "GET" });
  }

  static post<T = unknown>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(urlFormatted(endpoint), {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static patch<T = unknown>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(urlFormatted(endpoint), {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  static delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(urlFormatted(endpoint), {
      method: "DELETE",
    });
  }
}

function urlFormatted(ep: string) {
  return ep.startsWith("/") ? ep : `/${ep}`;
}
