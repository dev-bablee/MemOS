import { create } from "zustand";
import { Project } from "@/types/project";
import { projectService } from "@/services/project";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  createProject: (data: { name: string; description?: string }) => Promise<boolean>;
  selectProject: (project: Project) => void;
  deleteProject: (id: string) => Promise<boolean>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    const res = await projectService.listProjects();
    if (res.success && res.data) {
      set({
        projects: res.data,
        selectedProject: get().selectedProject || res.data[0] || null,
        isLoading: false,
      });
    } else {
      set({
        projects: [],
        selectedProject: null,
        isLoading: false,
      });
    }
  },

  createProject: async (data) => {
    set({ isLoading: true });
    const res = await projectService.createProject(data);
    if (res.success && res.data) {
      set((state) => ({
        projects: [res.data!, ...state.projects],
        selectedProject: res.data!,
        isLoading: false,
      }));
      return true;
    }
    set({ isLoading: false });
    return false;
  },

  selectProject: (project) => {
    set({ selectedProject: project });
  },

  deleteProject: async (id) => {
    await projectService.deleteProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProject: state.selectedProject?.id === id ? state.projects[0] || null : state.selectedProject,
    }));
    return true;
  },
}));
