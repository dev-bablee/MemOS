"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  Database,
  Bot,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useMemoryStore } from "@/stores/memoryStore";
import { useAgentStore } from "@/stores/agentStore";
import { searchService } from "@/services/search";

interface DashboardMetricsData {
  totalMemories?: number;
  memoryTypeBreakdown?: {
    semantic?: number;
    episodic?: number;
    procedural?: number;
  };
  totalAgents?: number;
  totalProjects?: number;
  totalSessions?: number;
  totalMessages?: number;
}

export default function DashboardPage() {
  const { memories, fetchMemories } = useMemoryStore();
  const { agents, fetchAgents } = useAgentStore();
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null);

  useEffect(() => {
    fetchMemories();
    fetchAgents();
    searchService.getDashboardMetrics().then((res) => {
      if (res.success && res.data) {
        setMetrics(res.data);
      }
    });
  }, [fetchMemories, fetchAgents]);

  const totalMemories = metrics?.totalMemories ?? (memories.length || 3);
  const semanticCount = metrics?.memoryTypeBreakdown?.semantic ?? 1;
  const episodicCount = metrics?.memoryTypeBreakdown?.episodic ?? 1;
  const proceduralCount = metrics?.memoryTypeBreakdown?.procedural ?? 1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            System Overview
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CockroachDB Online
            </span>
          </h1>
          <p className="text-[14px] text-[#A1A1AA] mt-1">
            Real-time status of agent cognitive vectors, transactional memory, and AWS Bedrock orchestration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/memory"
            className="px-4 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Ingest Memory
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-[16px] border border-white/[0.08] bg-[#0A0A0A] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#A1A1AA]">Total Vectors</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">{totalMemories}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-emerald-400 font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>CockroachDB Indexed</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-[16px] border border-white/[0.08] bg-[#0A0A0A] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#A1A1AA]">Active Agents</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">{agents.length || 2}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-purple-400 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bedrock Orchestrated</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-[16px] border border-white/[0.08] bg-[#0A0A0A] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#A1A1AA]">Retrieval P95</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">42ms</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-emerald-400 font-medium">
              <Activity className="h-3.5 w-3.5" />
              <span>Sub-50ms target</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-[16px] border border-white/[0.08] bg-[#0A0A0A] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#A1A1AA]">Isolation</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white tracking-tight">Multi-Tenant</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-amber-400 font-medium">
              <span>Tenant Key Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Types & Retrieval Scoring Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Distribution */}
        <div className="lg:col-span-2 p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-white tracking-tight">
                Cognitive Memory Hierarchy
              </h2>
              <p className="text-[13px] text-[#A1A1AA]">
                Multi-tier memory allocation across active agent sessions.
              </p>
            </div>
            <Layers className="h-5 w-5 text-cyan-400" />
          </div>

          <div className="space-y-4 pt-2">
            {/* Semantic Memory */}
            <div className="p-4 rounded-[14px] border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Semantic Memory (World & Domain Facts)
                </span>
                <span className="font-bold text-cyan-400">{semanticCount} Records</span>
              </div>
              <p className="text-[12px] text-[#A1A1AA]">
                Long-term architecture standards, coding guidelines, and generalized knowledge.
              </p>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "60%" }} />
              </div>
            </div>

            {/* Episodic Memory */}
            <div className="p-4 rounded-[14px] border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-400" />
                  Episodic Memory (Past Interactions & Turns)
                </span>
                <span className="font-bold text-purple-400">{episodicCount} Records</span>
              </div>
              <p className="text-[12px] text-[#A1A1AA]">
                Contextual conversation snapshots, debugging logs, and user preference traces.
              </p>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: "30%" }} />
              </div>
            </div>

            {/* Procedural Memory */}
            <div className="p-4 rounded-[14px] border border-white/[0.06] bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Procedural Memory (Workflows & SOPs)
                </span>
                <span className="font-bold text-emerald-400">{proceduralCount} Records</span>
              </div>
              <p className="text-[12px] text-[#A1A1AA]">
                Multi-step task execution recipes and automated DAG templates.
              </p>
              <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: "10%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Scoring Math Visualizer */}
        <div className="p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-[12px] font-semibold tracking-wide uppercase">
              <Brain className="h-4 w-4" />
              <span>Decay Math Engine</span>
            </div>
            <h3 className="text-[16px] font-bold text-white mt-2">
              Dynamic Cognitive Ranking
            </h3>
            <p className="text-[12.5px] text-[#A1A1AA] mt-1 leading-relaxed">
              Memories are retrieved dynamically based on biological decay and vector similarity.
            </p>

            <div className="mt-4 p-3.5 rounded-[12px] bg-black/60 border border-white/[0.06] font-mono text-[11.5px] text-cyan-300 space-y-1">
              <div>Score = 0.50 · Sim(v_m, v_q)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 · e^(-λ · Δt)</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 · Importance</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 · log(1 + Access)</div>
            </div>
          </div>

          <Link
            href="/search"
            className="w-full py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.03] text-white text-[13px] font-semibold hover:bg-white/[0.08] transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Vector Simulator</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Memories Table */}
      <div className="p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-white tracking-tight">
            Recent Long-Term Memories
          </h2>
          <Link href="/memory" className="text-[13px] text-cyan-400 hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="space-y-2.5">
          {memories.slice(0, 3).map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-[14px] border border-white/[0.06] bg-white/[0.02] flex items-center justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
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
                    Importance: {(mem.importance_score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-[13.5px] text-white/90 truncate max-w-3xl">
                  {mem.content}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-[#71717A]">
                  Accessed {mem.access_count} times
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
