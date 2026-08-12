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
                className="relative flex flex-col overflow-hidden rounded-[20px] border border-white/[0.12] bg-[#050505] p-5 sm:p-6 h-[220px] w-full"
              >
                <div className="relative z-10">
                  <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/[0.08] overflow-hidden"
                    style={{
                      backgroundColor: feature.glowColor.replace('0.3', '0.15'),
                      boxShadow: `0 0 16px ${feature.glowColor.replace('0.3', '0.35')}, 0 0 32px ${feature.glowColor.replace('0.3', '0.12')}`
                    }}
                  >
                    <Icon className="relative z-10 h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <h3 className="mb-1.5 text-[17px] font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] font-medium leading-[1.6] text-[#A1A1AA]">
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
