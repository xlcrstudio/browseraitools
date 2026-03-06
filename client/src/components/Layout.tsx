import { ReactNode } from "react";
import { Link } from "wouter";
import { ShieldCheck, Sparkles, Github, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[120px] pointer-events-none z-0" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b-0 border-white/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" data-testid="link-home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Hook<span className="text-purple-600">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div data-testid="status-privacy" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-700 text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Private (Local AI)
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white/50 backdrop-blur-sm relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} HookAI. Powered by WebLLM.
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Your data never leaves your browser.
          </div>
        </div>
      </footer>
    </div>
  );
}
