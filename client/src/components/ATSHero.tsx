import { motion } from "framer-motion";
import { BarChart3, Key, Wrench, Zap, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";

export function ATSHero() {
  return (
    <section className="text-center max-w-3xl mx-auto pt-4 pb-10 md:pt-6 md:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          data-testid="badge-powered-by"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6 ring-1 ring-indigo-200/50 dark:ring-indigo-700/50 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Powered by WebLLM
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4"
        data-testid="text-hero-headline"
      >
        AI{" "}
        <span className="text-gradient">ATS Resume Matcher</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
        data-testid="text-hero-subheadline"
      >
        Paste any job description + your resume to see your exact match percentage, missing keywords and skills instantly. 100% private, runs entirely in your browser.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 text-sm"
        data-testid="container-trust-badges"
      >
        {[
          { icon: BarChart3, label: "Exact Match Score" },
          { icon: Key, label: "Missing Keywords" },
          { icon: Wrench, label: "Missing Skills" },
          { icon: Zap, label: "Instant Analysis" },
          { icon: TrendingUp, label: "Score Improvement Tips" },
          { icon: ShieldCheck, label: "100% Private" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            data-testid={`badge-trust-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-sm text-slate-600 dark:text-slate-300"
          >
            <Icon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="font-medium">{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
