"use client";

import { useEffect, useState } from "react";
import { FolderGit2, Plus, ArrowRight } from "lucide-react";
import { useProjectStore } from "@/stores/projectStore";

export default function ProjectsPage() {
  const { projects, fetchProjects, createProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProject({ name, description });
    setName("");
    setDescription("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Project Workspaces
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Context Boundaries
            </span>
          </h1>
          <p className="text-[14px] text-[#A1A1AA] mt-1">
            Partition agent memories, documents, and execution state by project boundaries.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-4 hover:border-white/[0.15] transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <h3 className="text-[17px] font-bold text-white tracking-tight">{proj.name}</h3>
              <p className="text-[13px] text-[#A1A1AA] leading-relaxed line-clamp-2">
                {proj.description || "Persistent memory and multi-agent collaboration workspace."}
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[12px] text-[#71717A]">
              <span>Created {new Date(proj.created_at).toLocaleDateString()}</span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                Open Workspace <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[20px] border border-white/[0.12] bg-[#0A0A0A] p-6 space-y-6 shadow-2xl">
            <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-cyan-400" />
              Create Project Workspace
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-white">Project Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Infrastructure Modernization"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-white">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Workspace context summary..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[13px] text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
