import { motion } from "framer-motion";
import { Newspaper, ShieldCheck, Search, BarChart2, Download } from "lucide-react";

export function AIBlogGeneratorHero() {
  return (
    <section className="text-center max-w-3xl mx-auto pt-4 pb-10 md:pt-6 md:pb-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div data-testid="badge-powered-by" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-6 ring-1 ring-emerald-200/50 shadow-sm">
          <Newspaper className="w-4 h-4" />
          Powered by WebLLM
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4" data-testid="text-hero-headline">
        Free <span className="text-gradient">AI Blog Post Generator</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subheadline">
        Generate complete, SEO-optimized blog posts with title, meta description, and full article content. Includes keyword placement analysis and readability scoring. 100% private — runs in your browser.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap justify-center gap-4 text-sm">
        {[
          { icon: ShieldCheck, label: "Text Never Uploaded" },
          { icon: Search, label: "SEO Title & Meta" },
          { icon: BarChart2, label: "SEO Score Analysis" },
          { icon: Download, label: "Export as Markdown" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} data-testid={`badge-trust-${label.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm text-slate-600 dark:text-slate-300">
            <Icon className="w-4 h-4 text-emerald-500" />
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
