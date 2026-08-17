import { create } from "zustand";
import { User } from "@/types/auth";
import { authService } from "@/services/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, orgName?: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("memos_token") : null,
  tenantId: typeof window !== "undefined" ? localStorage.getItem("memos_tenant_id") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("memos_token") : false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      localStorage.setItem("memos_token", res.data.token);
      localStorage.setItem("memos_tenant_id", res.data.tenantId);
      set({
        user: res.data.user,
        token: res.data.token,
        tenantId: res.data.tenantId,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  signup: async (name, email, password, orgName) => {
    set({ isLoading: true });
    const res = await authService.signup({ name, email, password, organizationName: orgName });
    if (res.success && res.data) {
      localStorage.setItem("memos_token", res.data.token);
      localStorage.setItem("memos_tenant_id", res.data.tenantId);
      set({
        user: res.data.user,
        token: res.data.token,
        tenantId: res.data.tenantId,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  logout: () => {
    localStorage.removeItem("memos_token");
    localStorage.removeItem("memos_tenant_id");
    set({
      user: null,
      token: null,
      tenantId: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("memos_token");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    set({ isLoading: true });
    const res = await authService.getMe();
    if (res.success && res.data) {
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } else {
      // Keep state or reset if explicitly unauthorized
      set({ isLoading: false });
    }
  },
}));
