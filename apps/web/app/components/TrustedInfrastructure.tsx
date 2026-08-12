import { Database, Cloud, GitBranch, Sparkles, Code } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TechCardData {
  name: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
}

const techCards: TechCardData[] = [
  { name: "CockroachDB", icon: Database, bgColor: "#241713", borderColor: "#3D2520" },
  { name: "AWS", icon: Cloud, bgColor: "#211B10", borderColor: "#3A301E" },
  { name: "LangGraph", icon: GitBranch, bgColor: "#102329", borderColor: "#1E3A44" },
  { name: "OpenAI", icon: Sparkles, bgColor: "#10231D", borderColor: "#1E3A2F" },
  { name: "Next.js", icon: Code, bgColor: "#17191B", borderColor: "#2D2F32" },
];

interface TechCardProps {
  name: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
}

function TechCard({ name, icon: Icon, bgColor, borderColor }: TechCardProps) {
  return (
    <div className="group flex items-center gap-3 rounded-[16px] border border-white/[0.12] bg-[#000000] px-5 py-4 transition-all duration-300 h-[88px]">
      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] shrink-0" style={{ backgroundColor: bgColor, borderColor: borderColor, borderWidth: "1px", borderStyle: "solid" }}>
        <Icon className="h-5 w-5 text-white/80" />
      </div>
      <span className="text-[15px] font-medium text-white tracking-tight whitespace-nowrap">{name}</span>
    </div>
  );
}

export function TrustedInfrastructure() {
  return (
    <section className="w-full bg-[#050505] pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[900px] text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[12px] font-medium tracking-wider text-white/60 mb-6">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
          <span>POWERED BY</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold tracking-[-0.03em] leading-[1.05] text-white max-w-[1000px] mx-auto">
          Powered by trusted<br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">infrastructure</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-[#A1A1AA] font-normal leading-relaxed max-w-[700px] mx-auto">
          Built on trusted AI and cloud infrastructure.
        </p>

        {/* Technology Cards */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          {techCards.map((tech) => (
            <TechCard key={tech.name} {...tech} />
          ))}
        </div>
      </div>
    </section>
  );
}