import Link from "next/link";
import { Brain, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6">
      <header className="w-full max-w-7xl rounded-2xl border border-white/[0.08] bg-[#050505]/80 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-[0.4rem] bg-gradient-to-br from-indigo-500 to-purple-500">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">MemOS</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[13px] font-medium text-white/70 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#architecture" className="text-[13px] font-medium text-white/70 hover:text-white transition-colors">
              Architecture
            </Link>
            <Link href="#docs" className="text-[13px] font-medium text-white/70 hover:text-white transition-colors">
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <Button variant="ghost" className="text-[13px] font-medium text-white/70 hover:text-white hover:bg-transparent px-2" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button className="bg-white text-black hover:bg-white/90 rounded-full font-semibold text-[13px] h-8 px-4" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden text-white/70">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
