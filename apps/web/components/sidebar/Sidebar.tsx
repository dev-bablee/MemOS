"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  Database,
  Bot,
  Search,
  FolderGit2,
  Settings,
  User as UserIcon,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Persistent Memory", href: "/memory", icon: Database },
  { name: "AI Agents", href: "/agents", icon: Bot },
  { name: "Search & Graph", href: "/search", icon: Search },
  { name: "Projects", href: "/projects", icon: FolderGit2 },
  { name: "Settings & API Keys", href: "/settings", icon: Settings },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 shrink-0 bg-[#050505] border-r border-white/[0.08] flex flex-col justify-between h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[0.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Brain className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-bold tracking-tight text-white flex items-center gap-1.5">
                MemOS
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Kernel
                </span>
              </span>
              <span className="text-[11px] text-[#71717A]">Cognitive OS</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[13.5px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.08] text-white border border-white/[0.12] shadow-[0_0_20px_rgba(255,255,255,0.03)]"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-[#71717A]"}`} />
                <span>{item.name}</span>
                {item.name === "AI Agents" && (
                  <span className="ml-auto flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & User Profile */}
      <div className="p-4 border-t border-white/[0.08] space-y-4">
        {/* Live Infrastructure Badge */}
        <div className="rounded-[12px] border border-white/[0.08] bg-[#0A0A0A] p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#A1A1AA] flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              CockroachDB
            </span>
            <span className="text-emerald-400 font-semibold text-[10px]">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#A1A1AA] flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              Amazon Bedrock
            </span>
            <span className="text-cyan-400 font-semibold text-[10px]">READY</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-[12px] font-bold shrink-0">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[12.5px] font-medium text-white truncate">
                {user?.name || "AI Engineer"}
              </span>
              <span className="text-[10.5px] text-[#71717A] truncate">
                {user?.email || "admin@memos.ai"}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="text-[#71717A] hover:text-white transition-colors p-1"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
