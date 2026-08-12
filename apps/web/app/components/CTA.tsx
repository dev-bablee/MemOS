import { ArrowRight, Github } from "lucide-react";

export function CTA() {
  return (
    <section className="w-full bg-[#050505] py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px] w-[72%]">
        {/* CTA Card Container */}
        <div className="relative rounded-[44px] border border-white/10 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-purple-500/10 overflow-hidden px-8 py-[72px] sm:px-12">
          {/* Background gradients - clearly visible like reference */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            {/* Dark navy/blue glow upper center - clearly visible */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(47,125,249,0.18)_0%,transparent_70%)]" />
            {/* Purple/blue atmospheric glow right center - clearly visible */}
            <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)]" />
            {/* Teal/cyan hint lower left */}
            <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)]" />
            {/* Additional center glow for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,125,249,0.12)_0%,transparent_60%)]" />
          </div>

          {/* Tiny ambient particles near bottom */}
          <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex items-center gap-[20px] pointer-events-none">
            <div className="w-1 h-1 rounded-full bg-cyan-300/60" />
            <div className="w-0.5 h-0.5 rounded-full bg-cyan-300/40" />
            <div className="w-1 h-1 rounded-full bg-cyan-300/60" />
            <div className="w-0.75 h-0.75 rounded-full bg-cyan-300/40" />
            <div className="w-0.5 h-0.5 rounded-full bg-cyan-300/40" />
            <div className="w-1 h-1 rounded-full bg-cyan-300/60" />
            <div className="w-0.75 h-0.75 rounded-full bg-cyan-300/40" />
            <div className="w-0.5 h-0.5 rounded-full bg-cyan-300/30" />
          </div>

          <div className="relative flex flex-col items-center text-center max-w-[900px] mx-auto">
            {/* Heading - ONE LINE on desktop */}
            <h2 className="text-[48px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.05] text-white max-w-[900px] mx-auto whitespace-nowrap">
              Ready to Build Stateful AI Agents?
            </h2>

            {/* Subtitle - 2 lines */}
            <p className="mt-[24px] text-[20px] font-normal leading-[1.45] text-[#8892A0] max-w-[650px] mx-auto">
              Build AI systems with persistent memory<br />
              powered by CockroachDB and AWS.
            </p>

            {/* Buttons */}
            <div className="mt-[40px] flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary Button */}
              <a
                href="/get-started"
                className="group inline-flex items-center justify-center gap-2 rounded-[12px] bg-white text-black font-semibold text-[15px] h-[56px] w-[180px] px-5 transition-all duration-200 hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-200 h-4 w-4" />
              </a>

              {/* Secondary Button */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/[0.06] bg-[#101528] text-white font-medium text-[15px] h-[56px] w-[190px] px-5 transition-all duration-200 hover:bg-[#161D3A] hover:border-white/[0.1]"
              >
                <Github className="h-4.5 w-4.5" />
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}