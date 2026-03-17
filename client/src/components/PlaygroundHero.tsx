import { motion } from "framer-motion";
import { Code, Play, Wrench, ShieldCheck, HardDrive, Terminal } from "lucide-react";

export function PlaygroundHero() {
  return (
    <section className="text-center max-w-3xl mx-auto pt-4 pb-10 md:pt-6 md:pb-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div data-testid="badge-powered-by" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6 ring-1 ring-emerald-200/50 shadow-sm">
          <Terminal className="w-4 h-4" />
          Powered by WebLLM
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight mb-4" data-testid="text-hero-headline">
        Private AI <span className="text-gradient">Code Playground</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subheadline">
        Generate, run, and instantly fix code entirely in your browser. No data leaves your device. No limits. No login.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap justify-center gap-3 text-sm">
        {[
          { icon: Code, label: "Monaco Editor" },
          { icon: Play, label: "Instant Run" },
          { icon: Wrench, label: "One-Click Fix" },
          { icon: Terminal, label: "JS + Python" },
          { icon: HardDrive, label: "Persistent Projects" },
          { icon: ShieldCheck, label: "100% Private" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} data-testid={`badge-trust-${label.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/60 shadow-sm text-slate-600">
            <Icon className="w-4 h-4 text-emerald-500" />
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
