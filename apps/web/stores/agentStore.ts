import { create } from "zustand";
import { Agent, ExecutionPlan, Message } from "@/types/agent";
import { agentService } from "@/services/agent";

export interface CreateAgentPayload {
  name: string;
  description?: string;
  projectId?: string | null;
  model?: string;
  systemPrompt: string;
  memoryConfig?: Record<string, unknown>;
  tools?: string[];
}

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  currentPlan: ExecutionPlan | null;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  fetchAgents: (projectId?: string) => Promise<void>;
  selectAgent: (agent: Agent) => void;
  createAgent: (data: CreateAgentPayload) => Promise<boolean>;
  deleteAgent: (id: string) => Promise<boolean>;
  planGoal: (goal: string) => Promise<ExecutionPlan | null>;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  selectedAgent: null,
  currentPlan: null,
  messages: [],
  isLoading: false,
  isStreaming: false,

  fetchAgents: async (projectId) => {
    set({ isLoading: true });
    const res = await agentService.listAgents(projectId);
    if (res.success && res.data && res.data.length > 0) {
      set({
        agents: res.data,
        selectedAgent: get().selectedAgent || res.data[0],
        isLoading: false,
      });
    } else {
      // Demo Agents
      set({
        agents: [],
        selectedAgent: null,
        isLoading: false,
      });
    }
  },

  selectAgent: (agent) => {
    set({ selectedAgent: agent, messages: [] });
  },

  createAgent: async (data) => {
    set({ isLoading: true });
    const res = await agentService.createAgent(data);
    if (res.success && res.data) {
      set((state) => ({
        agents: [res.data!, ...state.agents],
        selectedAgent: res.data!,
        isLoading: false,
      }));
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  deleteAgent: async (id) => {
    await agentService.deleteAgent(id);
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
      selectedAgent: state.selectedAgent?.id === id ? state.agents[0] || null : state.selectedAgent,
    }));
    return true;
  },

  planGoal: async (goal) => {
    set({ isLoading: true });
    const res = await agentService.planGoal(goal);
    if (res.success && res.data) {
      set({ currentPlan: res.data, isLoading: false });
      return res.data;
    }
    set({ currentPlan: null, isLoading: false });
    return null;
  },

  sendMessage: async (content) => {
    const agent = get().selectedAgent;
    if (!agent) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      session_id: "session_current",
      role: "user",
      content,
      tokens: Math.ceil(content.length / 4),
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isStreaming: true,
    }));

    const res = await agentService.chat(agent.id, content);
    if (res.success && res.data) {
      const assistantMsg: Message = {
        id: `msg_resp_${Date.now()}`,
        session_id: res.data.sessionId || "session_current",
        role: "assistant",
        content: res.data.response || "No response received.",
        tokens: res.data.tokensUsed || 100,
        created_at: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isStreaming: false,
      }));
    } else {
      const assistantMsg: Message = {
        id: `msg_resp_${Date.now()}`,
        session_id: "session_current",
        role: "assistant",
        content: (typeof res.error === "string" ? res.error : res.error?.message) || "Unable to reach agent service.",
        tokens: 10,
        created_at: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isStreaming: false,
      }));
    }
  },

  clearChat: () => {
    set({ messages: [] });
  },
}));
