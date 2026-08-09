import { User, ListTodo, Brain, Database, GitBranch, Server, Cpu } from "lucide-react";

const wideCardStyle = "w-[320px] h-[82px] flex items-center gap-4 rounded-[16px] border border-white/[0.06] bg-[#0A0A0A] px-5 transition-all duration-300";
const wideCardHighlightStyle = "w-[265px] h-[82px] flex items-center gap-4 rounded-[16px] border border-cyan-500/30 bg-[#0A0A0A] shadow-[0_0_30px_rgba(6,182,212,0.08)] px-5 transition-all duration-300";
const engineCardStyle = "w-[165px] h-[125px] flex flex-col items-center justify-center gap-3 rounded-[16px] border border-white/[0.06] bg-[#0A0A0A] px-4 transition-all duration-300";
const iconContainerStyle = "flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/[0.08] bg-[#050505] shrink-0";
const iconContainerHighlightStyle = "flex h-10 w-10 items-center justify-center rounded-[10px] border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0";
const engineIconStyle = "flex h-12 w-12 items-center justify-center rounded-[12px] border border-white/[0.08] bg-[#050505]";

function WideCard({ icon: Icon, title, description, highlight = false }) {
  return (
    <div className={highlight ? wideCardHighlightStyle : wideCardStyle}>
      <div className={highlight ? iconContainerHighlightStyle : iconContainerStyle}>
        <Icon className="h-5 w-5 text-white" />
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

function EngineCard({ icon: Icon, title }) {
  return (
    <div className={engineCardStyle}>
      <div className={engineIconStyle}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-[14px] font-bold text-white tracking-tight text-center">{title}</h3>
    </div>
  );
}

function VerticalConnector({ showDots = true }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
      {showDots && <div className="w-2 h-2 rounded-full bg-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />}
      <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-500/30 via-transparent to-transparent" />
    </div>
  );
}

function BranchConnector() {
  return (
    <div className="flex flex-col items-center relative">
      <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
      <div className="w-2 h-2 rounded-full bg-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
      <div className="relative flex items-center gap-8 w-[280px] mt-2">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
        <div className="flex-1 h-[1px] bg-gradient-to-l from-cyan-500/30 to-transparent" />
      </div>
      <div className="w-[1px] h-6 bg-gradient-to-b from-cyan-500/30 via-transparent to-transparent mt-2" />
    </div>
  );
}

function EngineVerticalConnector() {
  return (
    <div className="flex flex-col items-center mt-3">
      <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent" />
      <div className="w-2 h-2 rounded-full bg-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
      <div className="w-[1px] h-6 bg-gradient-to-b from-cyan-500/40 via-transparent to-transparent" />
    </div>
  );
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
        <div className="mt-16 flex flex-col items-center">
          {/* User Card */}
          <WideCard
            icon={User}
            title="User"
            description="Give a goal in natural language"
          />

          {/* Connector */}
          <VerticalConnector />

          {/* Planner Card */}
          <WideCard
            icon={ListTodo}
            title="Planner"
            description="Decomposes the goal into tasks"
          />

          {/* Connector */}
          <VerticalConnector />

          {/* MemOS Kernel Card */}
          <WideCard
            icon={Brain}
            title="MemOS Kernel"
            description="The orchestration brain"
            highlight
          />

          {/* Branch connector to engines */}
          <BranchConnector />

          {/* Engine Cards Row */}
          <div className="flex items-start justify-center gap-4">
            <div className="flex flex-col items-center">
              <EngineCard icon={Database} title="Memory Engine" />
              <EngineVerticalConnector />
            </div>
            <div className="flex flex-col items-center">
              <EngineCard icon={GitBranch} title="Workflow Engine" />
              <EngineVerticalConnector />
            </div>
          </div>

          {/* Connector from engines back to center */}
          <VerticalConnector />

          {/* CockroachDB Card */}
          <WideCard
            icon={Server}
            title="CockroachDB"
            description="Transactional + vector memory"
          />

          {/* Connector */}
          <VerticalConnector />

          {/* AWS Services Card */}
          <WideCard
            icon={Server}
            title="AWS Services"
            description="Scalable execution & storage"
          />

          {/* Connector */}
          <VerticalConnector />

          {/* AI Models Card */}
          <WideCard
            icon={Cpu}
            title="AI Models"
            description="Bedrock, OpenAI, Anthropic"
          />
        </div>
      </div>
    </section>
  );
}