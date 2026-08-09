import { Brain, Share2, Network, Search, Workflow, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Persistent Memory",
    description: "Context survives across sessions and restarts.",
    icon: Brain,
    glowColor: "rgba(59, 130, 246, 0.3)", // blue
  },
  {
    title: "Shared Knowledge",
    description: "Every agent learns from every interaction.",
    icon: Share2,
    glowColor: "rgba(6, 182, 212, 0.3)", // cyan/teal
  },
  {
    title: "Agent Orchestration",
    description: "Coordinate specialized agents that hand off work.",
    icon: Network,
    glowColor: "rgba(168, 85, 247, 0.3)", // purple
  },
  {
    title: "Semantic Memory",
    description: "Vector search on CockroachDB, in milliseconds.",
    icon: Search,
    glowColor: "rgba(34, 197, 94, 0.3)", // green
  },
  {
    title: "Workflow Automation",
    description: "Durable execution with retries and checkpoints.",
    icon: Workflow,
    glowColor: "rgba(249, 115, 22, 0.3)", // yellow/orange
  },
  {
    title: "Enterprise Security",
    description: "Permissions, audit logs, and access control. SOC 2 ready.",
    icon: ShieldCheck,
    glowColor: "rgba(239, 68, 68, 0.3)", // red
  }
];

export function Features() {
  return (
    <section className="w-full bg-[#050505] -mt-20 pt-0 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#0A0A0A] p-6 sm:p-7 h-full min-h-[220px]"
              >
                {/* Subtle colored glow spreading into card background */}
                <div
                  className="absolute top-0 left-0 w-[200px] h-[200px] pointer-events-none -translate-x-1/4 -translate-y-1/4"
                  style={{
                    background: `radial-gradient(circle, ${feature.glowColor.replace('0.3', '0.12')} 0%, transparent 70%)`
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/[0.08] bg-[#050505] shadow-sm overflow-hidden"
                  >
                    {/* Inner stronger glow for the icon container */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ backgroundColor: feature.glowColor }}
                    />
                    <Icon className="relative z-10 h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <h3 className="mb-1.5 text-[17px] font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] font-normal leading-[1.6] text-[#A1A1AA]">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
