export interface User {
  id: string;
  tenant_id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  tenant_id: string;
  name: string;
  prefix: string;
  scopes: string[];
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
