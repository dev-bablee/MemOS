"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Sparkles,
  Network,
  Share2,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { useMemoryStore } from "@/stores/memoryStore";
import { searchService } from "@/services/search";
import { KnowledgeGraphData } from "@/types/memory";

export default function SearchPage() {
  const { searchResults, searchMemories } = useMemoryStore();
  const [query, setQuery] = useState("CockroachDB vector storage");
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({ nodes: [], edges: [] });

  // Dynamic Weights Sliders
  const [wVector, setWVector] = useState(0.50);
  const [wRecency, setWRecency] = useState(0.20);
  const [wImportance, setWImportance] = useState(0.20);
  const [wFrequency, setWFrequency] = useState(0.10);

  useEffect(() => {
    searchMemories(query, {
      vector: wVector,
      recency: wRecency,
      importance: wImportance,
      frequency: wFrequency,
    });
    searchService.getKnowledgeGraph().then((res) => {
      if (res.success && res.data) {
        setGraphData(res.data);
      } else {
        // Fallback demo graph
        setGraphData({
          nodes: [
            { id: "e1", tenant_id: "demo", project_id: null, name: "CockroachDB", entity_type: "SYSTEM", properties: { role: "Distributed Vector Storage" }, created_at: "", updated_at: "" },
            { id: "e2", tenant_id: "demo", project_id: null, name: "Amazon Bedrock", entity_type: "SYSTEM", properties: { models: "Claude 3.5 Sonnet, Titan" }, created_at: "", updated_at: "" },
            { id: "e3", tenant_id: "demo", project_id: null, name: "MemOS Kernel", entity_type: "CONCEPT", properties: { role: "Cognitive Memory OS" }, created_at: "", updated_at: "" },
          ],
          edges: [
            { id: "r1", tenant_id: "demo", subject_id: "e3", predicate: "PERSISTS_TO", object_id: "e1", weight: 1.0, subject_name: "MemOS Kernel", object_name: "CockroachDB", created_at: "" },
            { id: "r2", tenant_id: "demo", subject_id: "e3", predicate: "ORCHESTRATED_WITH", object_id: "e2", weight: 0.95, subject_name: "MemOS Kernel", object_name: "Amazon Bedrock", created_at: "" },
          ],
        });
      }
    });
  }, [query, wVector, wRecency, wImportance, wFrequency, searchMemories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchMemories(query, {
      vector: wVector,
      recency: wRecency,
      importance: wImportance,
      frequency: wFrequency,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Cognitive Vector & Graph Search
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Hybrid Scoring Active
          </span>
        </h1>
        <p className="text-[14px] text-[#A1A1AA] mt-1">
          Explore multi-dimensional vector similarity combined with biological time-decay and knowledge graph triplets.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Query semantic memory e.g. 'CockroachDB scoring formula'..."
          className="w-full bg-[#0A0A0A] border border-white/[0.12] rounded-2xl pl-12 pr-28 py-4 text-[15px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50 shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-1.5"
        >
          <span>Search</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      {/* Dynamic Weight Tuning Panel */}
      <div className="p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
            <span>Mathematical Decay Weights Tuning</span>
          </span>
          <span className="text-[12px] text-cyan-400 font-mono font-semibold">
            Σ = {(wVector + wRecency + wImportance + wFrequency).toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* W1 Vector */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-[#A1A1AA]">w₁ Vector Similarity</span>
              <span className="text-cyan-400 font-bold font-mono">{wVector.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={wVector}
              onChange={(e) => setWVector(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* W2 Recency */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-[#A1A1AA]">w₂ Recency Decay (e^-λt)</span>
              <span className="text-purple-400 font-bold font-mono">{wRecency.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={wRecency}
              onChange={(e) => setWRecency(parseFloat(e.target.value))}
              className="w-full accent-purple-400"
            />
          </div>

          {/* W3 Importance */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-[#A1A1AA]">w₃ Importance Score</span>
              <span className="text-emerald-400 font-bold font-mono">{wImportance.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={wImportance}
              onChange={(e) => setWImportance(parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>

          {/* W4 Access Freq */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-[#A1A1AA]">w₄ Access Frequency</span>
              <span className="text-amber-400 font-bold font-mono">{wFrequency.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={wFrequency}
              onChange={(e) => setWFrequency(parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Search Results Matrix & Graph View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ranked Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-white tracking-tight">
              Ranked Search Results ({searchResults.length})
            </h2>
            <span className="text-[12px] text-[#71717A]">Sorted by Composite Score</span>
          </div>

          {searchResults.map((res, i) => (
            <div
              key={res.id}
              className="p-5 rounded-[18px] border border-white/[0.08] bg-[#0A0A0A] space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 rounded-full bg-white/[0.08] text-white text-[11px] font-bold items-center justify-center">
                    #{i + 1}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      res.memory_type === "SEMANTIC"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}
                  >
                    {res.memory_type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[12.5px] font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Score: {res.final_score}</span>
                </div>
              </div>

              <p className="text-[13.5px] text-white/90 leading-relaxed">{res.content}</p>

              {/* Mathematical breakdown pills */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-[11px]">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[#71717A] block">Vector Sim:</span>
                  <span className="font-mono text-cyan-300 font-bold">{res.vector_similarity}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[#71717A] block">Recency Decay:</span>
                  <span className="font-mono text-purple-300 font-bold">{res.recency_decay}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[#71717A] block">Importance:</span>
                  <span className="font-mono text-emerald-300 font-bold">{(res.importance_score * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Knowledge Graph Neighborhood Visualizer (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
                <Network className="h-4 w-4 text-cyan-400" />
                <span>Knowledge Graph</span>
              </h2>
              <span className="text-[11px] text-purple-400 font-semibold">
                {graphData.nodes.length} Entities • {graphData.edges.length} Triplet Links
              </span>
            </div>
            <p className="text-[12.5px] text-[#A1A1AA] mt-1">
              Entities and semantic relationships extracted into CockroachDB graph space.
            </p>

            {/* Visual Node & Edge Cards */}
            <div className="space-y-3 mt-4">
              {graphData.nodes.map((node) => (
                <div
                  key={node.id}
                  className="p-3.5 rounded-[12px] border border-white/[0.08] bg-white/[0.02] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      {node.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#71717A] px-1.5 py-0.5 rounded bg-white/[0.04]">
                      {node.entity_type}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A1A1AA] font-mono truncate">
                    {JSON.stringify(node.properties)}
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-[12px] bg-black/40 border border-white/[0.06] space-y-1.5">
                <span className="text-[11px] uppercase font-bold text-[#71717A]">Active Relations</span>
                {graphData.edges.map((edge) => (
                  <div key={edge.id} className="text-[12px] text-cyan-400 font-mono flex items-center gap-1.5">
                    <Share2 className="h-3 w-3" />
                    <span>
                      ({edge.subject_name || "MemOS"}) ──[{edge.predicate}]──&gt; ({edge.object_name || "Target"})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
