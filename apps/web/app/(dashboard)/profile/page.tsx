"use client";

import { useAuthStore } from "@/stores/authStore";
import { Shield, Building } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">User Profile</h1>
        <p className="text-[14px] text-[#A1A1AA] mt-1">
          Tenant organization membership and role assignments.
        </p>
      </div>

      <div className="p-8 rounded-[24px] border border-white/[0.08] bg-[#0A0A0A] space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || "Lead AI Engineer"}</h2>
            <p className="text-[13.5px] text-[#A1A1AA]">{user?.email || "admin@memos.ai"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
            <Shield className="h-5 w-5 text-cyan-400" />
            <div>
              <span className="text-[11.5px] text-[#71717A] block">Role Permission</span>
              <span className="text-[14px] font-semibold text-white uppercase">{user?.role || "ADMIN"}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-3">
            <Building className="h-5 w-5 text-purple-400" />
            <div>
              <span className="text-[11.5px] text-[#71717A] block">Tenant Organization</span>
              <span className="text-[14px] font-semibold text-white">MemOS Enterprise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
