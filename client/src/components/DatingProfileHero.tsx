import { motion } from "framer-motion";
import { Flame, MessageCircle, Camera, Target, ShieldCheck } from "lucide-react";

export function DatingProfileHero() {
  return (
    <section className="text-center max-w-3xl mx-auto pt-4 pb-10 md:pt-6 md:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          data-testid="badge-powered-by"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6 ring-1 ring-purple-200/50 shadow-sm"
        >
          <Flame className="w-4 h-4" />
          Powered by WebLLM
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight mb-4"
        data-testid="text-hero-headline"
      >
        AI{" "}
        <span className="text-gradient">Dating Profile Generator</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto"
        data-testid="text-hero-subheadline"
      >
        Get more matches with AI-crafted bios, opening lines, and photo captions
        tailored to your dating apps. No data leaves your browser. 100% local AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 text-sm"
        data-testid="container-trust-badges"
      >
        {[
          { icon: Flame, label: "Match-Rate Optimized" },
          { icon: MessageCircle, label: "Ready Openers" },
          { icon: Camera, label: "Photo Captions" },
          { icon: Target, label: "App-Specific" },
          { icon: ShieldCheck, label: "100% Private" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            data-testid={`badge-trust-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/60 shadow-sm text-slate-600"
          >
            <Icon className="w-4 h-4 text-purple-500" />
            <span className="font-medium">{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
