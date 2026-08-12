"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import TrustedBy from "./components/TrustedBy";
import { Features } from "./components/Features";
import { Architecture } from "./components/Architecture";
import { TrustedInfrastructure } from "./components/TrustedInfrastructure";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col relative">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center p-8 min-h-[calc(100vh-80px)] relative">
          {/* Extremely subtle background gradient behind heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex w-full max-w-[1400px] flex-col items-center text-center mt-8 px-4"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[12px] font-medium tracking-wide text-white/60 mb-10">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400"></div>
              <span>Built with CockroachDB + AWS</span>
              <ArrowRight className="h-3.5 w-3.5 ml-0.5 opacity-60" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-[70px] md:text-[84px] lg:text-[90px] font-bold tracking-[-0.04em] leading-[0.9] text-white w-full max-w-[1000px] mx-auto antialiased">
              The Operating<br />
              System for <span className="whitespace-nowrap">AI{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Agents
                </span></span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-[700px] text-lg text-white/60 sm:text-[19px] font-normal leading-relaxed mt-6">
              Give every AI agent a persistent memory, shared knowledge,
              and production-ready orchestration powered by CockroachDB.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full">
              <Button className="bg-white text-black rounded-lg font-semibold text-[15px] h-[52px] px-8 transition-colors hover:bg-white/90">
                Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-lg h-[52px] px-8 border border-white/[0.08] bg-white/[0.02] text-white font-medium transition-colors hover:bg-white/[0.05] hover:text-white">
                <Github className="mr-2 h-5 w-5" />
                View GitHub
              </Button>
            </div>
          </motion.div>
        </section>

        <TrustedBy />
        <Features />
        <Architecture />
        <TrustedInfrastructure />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
