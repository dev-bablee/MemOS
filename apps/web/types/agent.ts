export interface Agent {
  id: string;
  tenant_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  model: string;
  system_prompt: string;
  memory_config: {
    halfLifeDays?: number;
    minImportance?: number;
    vectorWeight?: number;
  };
  tools: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  agent_id: string;
  user_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tokens: number;
  created_at: string;
}

export interface PlanStep {
  id: number;
  title: string;
  tool: string;
  input: Record<string, unknown>;
  dependsOn: number[];
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  result?: unknown;
}

export interface ExecutionPlan {
  goal: string;
  steps: PlanStep[];
  status: "PLANNED" | "EXECUTING" | "COMPLETED" | "FAILED";
}
