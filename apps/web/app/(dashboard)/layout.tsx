"use client";

import { Sidebar } from "@/components/sidebar";
import { Search, Bell, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-foreground font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="h-16 border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
              <input
                type="text"
                placeholder="Search memories, vectors, entities... (⌘K)"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-9 pr-4 py-1.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[12.5px] font-semibold hover:bg-cyan-500/15 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Launch Agent</span>
            </Link>
            <button className="h-8 w-8 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
