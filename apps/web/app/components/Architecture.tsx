import { User, ListTodo, Brain, Database, GitBranch, Server, Cpu } from "lucide-react";

const wideCardStyle = "w-[300px] h-[76px] flex items-center gap-3 rounded-[14px] border border-white/[0.12] bg-[#050505] px-4 transition-all duration-300";
const wideCardHighlightStyle = "w-[300px] h-[76px] flex items-center gap-3 rounded-[14px] border border-cyan-500/20 bg-[#050505] shadow-[0_0_30px_rgba(6,182,212,0.06)] px-4 transition-all duration-300";
const engineCardStyle = "w-[150px] h-[115px] flex flex-col items-center justify-center gap-2.5 rounded-[14px] border border-white/[0.12] bg-[#050505] px-3.5 transition-all duration-300";
const iconContainerStyle = "flex h-9 w-9 items-center justify-center rounded-[9px] border border-white/[0.06] bg-[#050505] shrink-0 relative overflow-hidden";
const iconContainerHighlightStyle = "flex h-9 w-9 items-center justify-center rounded-[9px] border border-cyan-500/20 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)] shrink-0 relative overflow-hidden";
const engineIconStyle = "flex h-11 w-11 items-center justify-center rounded-[11px] border border-white/[0.06] bg-[#050505] relative overflow-hidden shrink-0";

function WideCard({ icon: Icon, title, description, highlight = false, glowColor, className = "" }) {
  const iconStyle = highlight ? iconContainerHighlightStyle : iconContainerStyle;
  const glowStyle = glowColor ? {
    backgroundColor: glowColor.replace('0.3', '0.1'),
    boxShadow: `0 0 10px ${glowColor.replace('0.3', '0.2')}, 0 0 20px ${glowColor.replace('0.3', '0.06')}`
  } : {};

  return (
    <div className={`${highlight ? wideCardHighlightStyle : wideCardStyle} ${className}`}>
      <div className={iconStyle} style={glowStyle}>
        <Icon className="relative z-10 h-5 w-5 text-white" />
      </div>
      <div className="text-left">
        <h3 className="text-[15px] font-bold text-white tracking-tight">{title}</h3>
        {description && (
          <p className="mt-1 text-[12px] font-normal leading-[1.4] text-[#A1A1AA]">{description}</p>
        )}
      </div>
    </div>
  );
}

function EngineCard({ icon: Icon, title, glowColor }) {
  const glowStyle = glowColor ? {
    backgroundColor: glowColor.replace('0.3', '0.1'),
    boxShadow: `0 0 14px ${glowColor.replace('0.3', '0.25')}, 0 0 28px ${glowColor.replace('0.3', '0.08')}`
  } : {};

  return (
    <div className={engineCardStyle}>
      <div className={engineIconStyle} style={glowStyle}>
        <Icon className="relative z-10 h-6 w-6 text-white" />
      </div>
      <h3 className="text-[14px] font-bold text-white tracking-tight text-center">{title}</h3>
    </div>
  );
}

function GapConnector() {
  return <div className="w-[1px] h-8 bg-cyan-500/30" />;
}

function EngineGapConnector() {
  return <div className="w-[1px] h-6 bg-cyan-500/30" />;
}

function LeftStackConnector() {
  return <div className="w-[1px] h-6 bg-cyan-500/30" />;
}

export function Architecture() {
  return (
    <section className="w-full bg-[#050505] pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="relative z-10 mx-auto max-w-[900px] text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[12px] font-medium tracking-wider text-white/60 mb-6">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
          <span>ARCHITECTURE</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold tracking-[-0.03em] leading-[1.05] text-white max-w-[1000px] mx-auto">
          A stack designed<br />
          for <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">production AI</span>
        </h2>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg text-[#A1A1AA] font-normal leading-relaxed max-w-[700px] mx-auto">
          From user goal to executed work &mdash; every layer<br />
          is observable, durable, and horizontally scalable.
        </p>

        {/* Architecture Diagram */}
        <div className="mt-16 flex flex-col items-center relative">
          {/* Left side vertical line for bottom 3 cards - continuous */}
          <div className="absolute left-1/2 -translate-x-1/2 -left-[150px] top-[358px] h-[276px] w-[1px] bg-cyan-500/30 pointer-events-none" />

          {/* User Card */}
          <WideCard
            icon={User}
            title="User"
            description="Give a goal in natural language"
            glowColor="rgba(59, 130, 246, 0.3)"
          />

          {/* Connector */}
          <GapConnector />

          {/* Planner Card */}
          <WideCard
            icon={ListTodo}
            title="Planner"
            description="Decomposes the goal into tasks"
            glowColor="rgba(6, 182, 212, 0.3)"
          />

          {/* Connector */}
          <GapConnector />

          {/* MemOS Kernel Card */}
          <WideCard
            icon={Brain}
            title="MemOS Kernel"
            description="The orchestration brain"
            highlight
            glowColor="rgba(168, 85, 247, 0.3)"
          />

          {/* Connector to engines */}
          <GapConnector />

          {/* Engine Cards Row */}
          <div className="flex items-start justify-center gap-4 relative z-10">
            <div className="flex flex-col items-center">
              <EngineCard icon={Database} title="Memory Engine" glowColor="rgba(34, 197, 94, 0.3)" />
            </div>
            <div className="flex flex-col items-center">
              <EngineCard icon={GitBranch} title="Workflow Engine" glowColor="rgba(249, 115, 22, 0.3)" />
            </div>
          </div>

          {/* Gap after engines */}
          <div className="h-6" />

          {/* CockroachDB Card */}
          <WideCard
            icon={Server}
            title="CockroachDB"
            description="Transactional + vector memory"
            glowColor="rgba(239, 68, 68, 0.3)"
          />

          {/* Connector */}
          <LeftStackConnector />

          {/* AWS Services Card */}
          <WideCard
            icon={Server}
            title="AWS Services"
            description="Scalable execution & storage"
            glowColor="rgba(249, 115, 22, 0.3)"
          />

          {/* Connector */}
          <LeftStackConnector />

          {/* AI Models Card */}
          <WideCard
            icon={Cpu}
            title="AI Models"
            description="Bedrock, OpenAI, Anthropic"
            glowColor="rgba(168, 85, 247, 0.3)"
          />
        </div>
      </div>
    </section>
  );
}