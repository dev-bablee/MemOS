"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 border p-6 rounded-lg shadow-sm"
      >
        <Terminal className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">MemOS Web Application Initialized</h1>
      </motion.div>
    </main>
  );
}
