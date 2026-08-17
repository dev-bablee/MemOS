"use client";

import { useEffect, useState } from "react";
import {
  Database,
  Plus,
  Search,
  Trash2,
  Brain,
  Sparkles,
} from "lucide-react";
import { useMemoryStore } from "@/stores/memoryStore";
import { MemoryType } from "@/types/memory";

export default function MemoryPage() {
  const { memories, fetchMemories, ingestMemory, deleteMemory } = useMemoryStore();

  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New Memory Form State
  const [content, setContent] = useState<string>("");
  const [memoryType, setMemoryType] = useState<MemoryType>("SEMANTIC");
  const [importance, setImportance] = useState<number>(0.8);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    await ingestMemory({
      content,
      memoryType,
      importanceScore: importance,
    });
    setContent("");
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const filteredMemories = memories.filter((m) => {
    const matchesType = selectedType === "ALL" || m.memory_type === selectedType;
    const matchesSearch = m.content.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Persistent Memory Substrate
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              CockroachDB Vector Space
            </span>
          </h1>
          <p className="text-[14px] text-[#A1A1AA] mt-1">
            Browse, manage, and vectorize episodic, semantic, and procedural knowledge across all agents.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[13px] font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Ingest New Memory</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-[16px] border border-white/[0.08] bg-[#0A0A0A]">
        {/* Memory Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
          {["ALL", "SEMANTIC", "EPISODIC", "PROCEDURAL"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors whitespace-nowrap ${
                selectedType === type
                  ? "bg-white/[0.1] text-white shadow-sm"
                  : "text-[#71717A] hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter memories..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-[12.5px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Memories Grid */}
      <div className="space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-3">
            <Database className="h-8 w-8 text-[#71717A] mx-auto" />
            <p className="text-[14px] text-white font-medium">No memories found</p>
            <p className="text-[12.5px] text-[#71717A]">
              Ingest a new memory vector to get started.
            </p>
          </div>
        ) : (
          filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="p-5 rounded-[16px] border border-white/[0.08] bg-[#0A0A0A] hover:border-white/[0.15] transition-all space-y-3 group relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10.5px] uppercase font-bold px-2 py-0.5 rounded ${
                      mem.memory_type === "SEMANTIC"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : mem.memory_type === "EPISODIC"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {mem.memory_type}
                  </span>
                  <span className="text-[11.5px] text-[#71717A]">
                    Created: {new Date(mem.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-[11.5px] text-[#71717A]">
                    • Access Count: {mem.access_count}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/80 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                    <span>Importance:</span>
                    <span className="text-cyan-400">{(mem.importance_score * 100).toFixed(0)}%</span>
                  </div>
                  <button
                    onClick={() => deleteMemory(mem.id)}
                    title="Delete Memory"
                    className="text-[#71717A] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-[14px] text-white/95 leading-relaxed font-sans">
                {mem.content}
              </p>

              {/* Progress Importance Bar */}
              <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  style={{ width: `${mem.importance_score * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ingestion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[20px] border border-white/[0.12] bg-[#0A0A0A] p-6 space-y-6 shadow-2xl relative">
            <div>
              <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                Ingest Cognitive Memory
              </h2>
              <p className="text-[13px] text-[#A1A1AA] mt-1">
                Generates a 1536-dimensional Bedrock Titan embedding and indexes into CockroachDB.
              </p>
            </div>

            <form onSubmit={handleIngest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-white">Memory Content</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Architectural decision: All services must communicate over TLS 1.3 with JWT auth..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12.5px] font-medium text-white">Memory Tier</label>
                  <select
                    value={memoryType}
                    onChange={(e) => setMemoryType(e.target.value as MemoryType)}
                    className="w-full bg-[#050505] border border-white/[0.08] rounded-lg p-2.5 text-[12.5px] text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="SEMANTIC">SEMANTIC (Domain Facts)</option>
                    <option value="EPISODIC">EPISODIC (Past Turns)</option>
                    <option value="PROCEDURAL">PROCEDURAL (Workflows)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12.5px] text-white font-medium">
                    <span>Importance</span>
                    <span className="text-cyan-400 font-bold">{(importance * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={importance}
                    onChange={(e) => setImportance(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 mt-2"
                  />
                </div>
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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Commit to CockroachDB</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
