"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, User, Mail, Lock, Building } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(name, email, password, orgName);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col justify-center items-center p-6 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[0.5rem] bg-gradient-to-br from-cyan-500 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">MemOS</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-[13.5px] text-[#A1A1AA]">
            Start building persistent cognitive agents with CockroachDB.
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-8 rounded-[24px] border border-white/[0.08] bg-[#0A0A0A] shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-white">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-white">Organization Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme AI Labs"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-[13px] text-white placeholder-[#71717A] focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12.5px] font-medium text-white">Work Email</label>
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
              className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-[13.5px] hover:bg-white/90 transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="text-center text-[13px] text-[#71717A]">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
