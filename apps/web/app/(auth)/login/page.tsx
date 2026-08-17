"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, Sparkles, Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await login(email, password);
    router.push("/dashboard");
  };

  const handleDemoLogin = async () => {
    setEmail("admin@memos.ai");
    setPassword("password123");
    await login("admin@memos.ai", "password123");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col justify-center items-center p-6 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[0.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">MemOS</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-[13.5px] text-[#A1A1AA]">
            Sign in to access your persistent agent memory space.
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-8 rounded-[24px] border border-white/[0.08] bg-[#0A0A0A] shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12.5px]">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-white">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-[13.5px] hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#0A0A0A] px-3 text-[11px] uppercase font-bold text-[#71717A] absolute">
              Quick Test
            </span>
          </div>

          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold text-[13px] hover:bg-cyan-500/15 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch 1-Click Demo Session</span>
          </button>
        </div>

        <div className="text-center text-[13px] text-[#71717A]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
