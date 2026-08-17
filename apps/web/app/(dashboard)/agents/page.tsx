"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Plus,
  Send,
  Sparkles,
  Database,
  ListTodo,
} from "lucide-react";
import { useAgentStore } from "@/stores/agentStore";

export default function AgentsPage() {
  const {
    agents,
    selectedAgent,
    messages,
    isStreaming,
    currentPlan,
    fetchAgents,
    selectAgent,
    createAgent,
    sendMessage,
    planGoal,
    clearChat,
  } = useAgentStore();

  const [inputMessage, setInputMessage] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);

  // New Agent Form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;
    const msg = inputMessage;
    setInputMessage("");
    await sendMessage(msg);
  };

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    await planGoal(goalInput);
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !systemPrompt.trim()) return;
    await createAgent({
      name,
      description,
      systemPrompt,
      model: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      tools: ["search_memory", "save_memory", "knowledge_graph"],
    });
    setName("");
    setDescription("");
    setSystemPrompt("");
    setIsCreatingAgent(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            AI Agent Studio
            <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              AWS Bedrock Claude 3.5 Sonnet
            </span>
          </h1>
          <p className="text-[14px] text-[#A1A1AA] mt-0.5">
            Orchestrate stateful agents equipped with CockroachDB long-term memory and autonomous DAG planners.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingAgent(true)}
          className="px-3.5 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Agent</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Agent Selector & Configuration (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Agent Selection List */}
          <div className="p-4 rounded-[18px] border border-white/[0.08] bg-[#0A0A0A] space-y-3">
            <span className="text-[12px] uppercase font-bold text-[#71717A] tracking-wider">
              Active Agents ({agents.length})
            </span>

            <div className="space-y-2">
              {agents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => selectAgent(agent)}
                    className={`w-full text-left p-3.5 rounded-[12px] border transition-all ${
                      isSelected
                        ? "border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className={`h-4 w-4 ${isSelected ? "text-cyan-400" : "text-[#71717A]"}`} />
                        <span className="text-[13.5px] font-bold text-white tracking-tight">
                          {agent.name}
                        </span>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    {agent.description && (
                      <p className="text-[12px] text-[#A1A1AA] mt-1 line-clamp-2">
                        {agent.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Agent Memory Configuration */}
          {selectedAgent && (
            <div className="p-4 rounded-[18px] border border-white/[0.08] bg-[#0A0A0A] space-y-3">
              <span className="text-[12px] uppercase font-bold text-[#71717A] tracking-wider">
                Memory Policy & Tools
              </span>

              <div className="space-y-2.5 text-[12.5px]">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#A1A1AA]">Memory Decay Half-Life</span>
                  <span className="font-semibold text-white">7 Days</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#A1A1AA]">Vector Similarity Weight</span>
                  <span className="font-semibold text-cyan-400">0.50</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#A1A1AA]">Active MCP Servers</span>
                  <span className="font-semibold text-purple-400">CockroachDB Cloud</span>
                </div>
              </div>
            </div>
          )}

          {/* Goal Decomposition Planner Trigger */}
          <div className="p-4 rounded-[18px] border border-white/[0.08] bg-[#0A0A0A] space-y-3">
            <span className="text-[12px] uppercase font-bold text-[#71717A] tracking-wider flex items-center gap-1.5">
              <ListTodo className="h-3.5 w-3.5 text-cyan-400" />
              <span>DAG Task Planner</span>
            </span>

            <form onSubmit={handlePlan} className="space-y-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Decompose goal e.g. 'Audit DB schemas'..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[12px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-semibold transition-colors"
              >
                Generate Execution DAG
              </button>
            </form>

            {currentPlan && (
              <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                {currentPlan.steps.map((step) => (
                  <div
                    key={step.id}
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[12px] space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>Step {step.id}: {step.title}</span>
                      <span className="text-[10px] text-cyan-400 uppercase">{step.status}</span>
                    </div>
                    <div className="text-[11px] text-[#71717A] font-mono">Tool: {step.tool}()</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Chat Console with Memory Recall Inspection (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] overflow-hidden min-h-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-[14.5px] font-bold text-white">
                  {selectedAgent?.name || "MemOS Architect Agent"}
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CockroachDB Memory Attached
                </span>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="text-[12px] text-[#71717A] hover:text-white transition-colors"
            >
              Clear Session
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-[#71717A]">
                <Database className="h-10 w-10 text-cyan-500/40" />
                <p className="text-[14px] text-white font-medium">Ready for stateful agent interaction</p>
                <p className="text-[12.5px] max-w-sm">
                  Ask a question or provide a goal. The agent automatically retrieves past decisions and writes new learnings to CockroachDB.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl rounded-[16px] p-4 text-[13.5px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white text-black font-medium"
                        : "bg-white/[0.04] border border-white/[0.08] text-white/95"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.08] text-[11.5px] text-cyan-400 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Cognitive Synthesis • CockroachDB Recall</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {isStreaming && (
              <div className="flex items-center gap-2 text-cyan-400 text-[13px] font-medium animate-pulse">
                <Sparkles className="h-4 w-4" />
                <span>Agent reasoning & retrieving cognitive vectors...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/[0.08] bg-black/60 flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${selectedAgent?.name || "agent"}...`}
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13.5px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputMessage.trim()}
              className="h-10 px-5 rounded-xl bg-white text-black font-semibold text-[13px] hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Create Agent Modal */}
      {isCreatingAgent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[20px] border border-white/[0.12] bg-[#0A0A0A] p-6 space-y-6 shadow-2xl">
            <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-400" />
              Create Autonomous Agent
            </h2>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-white">Agent Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lead DevSecOps Auditor"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-white">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Specialized in AWS IAM policies and compliance"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-white">System Prompt (Cognitive Instructions)</label>
                <textarea
                  required
                  rows={4}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are an autonomous AI Agent. Always consult your persistent memory before answering..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreatingAgent(false)}
                  className="px-4 py-2 rounded-lg text-[13px] text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
                >
                  Initialize Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
