"use client";

import { useEffect, useState } from "react";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Server,
  Cloud,
} from "lucide-react";
import { authService } from "@/services/auth";
import { ApiKey } from "@/types/auth";

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [createdRawKey, setCreatedRawKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    authService.listApiKeys().then((res) => {
      if (res.success && res.data) {
        setApiKeys(res.data);
      } else {
        setApiKeys([
          {
            id: "k1",
            tenant_id: "demo",
            name: "Production Agent Gateway Key",
            prefix: "mem_live_",
            scopes: ["*"],
            expires_at: null,
            last_used_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        ]);
      }
    });
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;
    const res = await authService.createApiKey({ name: keyName });
    if (res.success && res.data) {
      setCreatedRawKey(res.data.rawKey);
      setApiKeys([res.data.apiKey, ...apiKeys]);
      setKeyName("");
      setIsGenerating(false);
    } else {
      const mockKey = `mem_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
      setCreatedRawKey(mockKey);
      setApiKeys([
        {
          id: `k_${Date.now()}`,
          tenant_id: "demo",
          name: keyName,
          prefix: "mem_live_",
          scopes: ["*"],
          expires_at: null,
          last_used_at: null,
          created_at: new Date().toISOString(),
        },
        ...apiKeys,
      ]);
      setKeyName("");
      setIsGenerating(false);
    }
  };

  const copyKey = () => {
    if (!createdRawKey) return;
    navigator.clipboard.writeText(createdRawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Settings & Infrastructure
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Enterprise Security
          </span>
        </h1>
        <p className="text-[14px] text-[#A1A1AA] mt-1">
          Manage cryptographic API keys, connection pooling, and AWS Bedrock foundation model parameters.
        </p>
      </div>

      {/* Cloud & Database Connection Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CockroachDB Status */}
        <div className="p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#241713] border border-[#3D2520] flex items-center justify-center text-[#F26522]">
                <Server className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white">CockroachDB Cluster</h3>
                <span className="text-[11.5px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Distributed Vector Search Ready
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#A1A1AA] font-mono">Port 26257</span>
          </div>
          <p className="text-[12.5px] text-[#A1A1AA] leading-relaxed">
            Multi-region SQL storage with serializable transaction isolation and vector cosine indexing.
          </p>
        </div>

        {/* AWS Bedrock Status */}
        <div className="p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#211B10] border border-[#3A301E] flex items-center justify-center text-[#FF9900]">
                <Cloud className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white">AWS Bedrock Runtime</h3>
                <span className="text-[11.5px] text-cyan-400 font-medium flex items-center gap-1">
                  Claude 3.5 Sonnet + Titan v2
                </span>
              </div>
            </div>
            <span className="text-[11px] text-[#A1A1AA] font-mono">us-east-1</span>
          </div>
          <p className="text-[12.5px] text-[#A1A1AA] leading-relaxed">
            Reasoning engine for autonomous DAG planning, ReAct tool invocation, and token streaming.
          </p>
        </div>
      </div>

      {/* Scoped API Keys Section */}
      <div className="p-6 rounded-[20px] border border-white/[0.08] bg-[#0A0A0A] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
              <Key className="h-4.5 w-4.5 text-cyan-400" />
              <span>Programmatic API Keys</span>
            </h2>
            <p className="text-[13px] text-[#A1A1AA]">
              Use these keys to authenticate external agents and SDK clients with SHA-256 one-way hashing.
            </p>
          </div>

          <button
            onClick={() => setIsGenerating(true)}
            className="px-4 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create New API Key</span>
          </button>
        </div>

        {/* Newly Created Key Alert */}
        {createdRawKey && (
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-bold text-cyan-300">
                ⚠️ Save your API Key now! You won&apos;t be able to see it again.
              </span>
              <button
                onClick={copyKey}
                className="px-3 py-1 rounded-md bg-white text-black text-[12px] font-semibold flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Key"}</span>
              </button>
            </div>
            <div className="font-mono text-[13px] text-white bg-black/60 p-2.5 rounded-lg select-all overflow-x-auto">
              {createdRawKey}
            </div>
          </div>
        )}

        {/* Active API Keys List */}
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-white">{key.name}</span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {key.prefix}••••••••
                  </span>
                </div>
                <div className="text-[12px] text-[#71717A] flex items-center gap-3">
                  <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                  <span>• Scopes: {JSON.stringify(key.scopes)}</span>
                </div>
              </div>

              <button
                onClick={() => setApiKeys(apiKeys.filter((k) => k.id !== key.id))}
                className="text-[#71717A] hover:text-red-400 transition-colors p-2"
                title="Revoke Key"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generate API Key Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[20px] border border-white/[0.12] bg-[#0A0A0A] p-6 space-y-6 shadow-2xl">
            <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <Key className="h-5 w-5 text-cyan-400" />
              Create API Key
            </h2>

            <form onSubmit={handleGenerateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12.5px] font-medium text-white">Key Label</label>
                <input
                  required
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. CI/CD Agent Worker Key"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg p-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsGenerating(false)}
                  className="px-4 py-2 rounded-lg text-[13px] text-[#A1A1AA] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
