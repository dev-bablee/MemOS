import { create } from "zustand";
import { LongTermMemory, MemorySearchResult, MemoryType } from "@/types/memory";
import { memoryService } from "@/services/memory";

interface IngestMemoryPayload {
  content: string;
  memoryType?: MemoryType;
  agentId?: string | null;
  projectId?: string | null;
  summary?: string;
  importanceScore?: number;
}

interface MemoryFilterParams {
  agentId?: string;
  projectId?: string;
  memoryType?: string;
  limit?: number;
  offset?: number;
}

interface MemoryWeights {
  vector?: number;
  recency?: number;
  importance?: number;
  frequency?: number;
  halfLifeDays?: number;
}

interface MemoryState {
  memories: LongTermMemory[];
  searchResults: MemorySearchResult[];
  total: number;
  isLoading: boolean;
  searchQuery: string;
  fetchMemories: (params?: MemoryFilterParams) => Promise<void>;
  searchMemories: (query: string, weights?: MemoryWeights) => Promise<void>;
  ingestMemory: (data: IngestMemoryPayload) => Promise<boolean>;
  deleteMemory: (id: string) => Promise<boolean>;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: [],
  searchResults: [],
  total: 0,
  isLoading: false,
  searchQuery: "",

  fetchMemories: async (params) => {
    set({ isLoading: true });
    const res = await memoryService.listMemories(params);
    if (res.success && res.data) {
      set({
        memories: res.data,
        total: res.pagination?.total || res.data.length,
        isLoading: false,
      });
    } else {
      set({
        memories: [],
        total: 0,
        isLoading: false,
      });
    }
  },

  searchMemories: async (query, weights) => {
    set({ isLoading: true, searchQuery: query });
    const res = await memoryService.searchMemories({ query, weights });
    if (res.success && res.data) {
      set({ searchResults: res.data, isLoading: false });
    } else {
      set({ searchResults: [], isLoading: false });
    }
  },

  ingestMemory: async (data) => {
    set({ isLoading: true });
    const res = await memoryService.ingestMemory(data);
    if (res.success && res.data) {
      set((state) => ({
        memories: [res.data!, ...state.memories],
        total: state.total + 1,
        isLoading: false,
      }));
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  deleteMemory: async (id) => {
    const res = await memoryService.deleteMemory(id);
    if (res.success) {
      set((state) => ({
        memories: state.memories.filter((m) => m.id !== id),
        searchResults: state.searchResults.filter((m) => m.id !== id),
        total: Math.max(0, state.total - 1),
      }));
      return true;
    }
    return false;
  },
}));
