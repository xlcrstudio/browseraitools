import { motion } from "framer-motion";
import { HelpCircle, Code2, Search, ShieldCheck } from "lucide-react";

export function FAQGeneratorHero() {
  return (
    <section className="text-center max-w-3xl mx-auto pt-4 pb-10 md:pt-6 md:pb-14">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div data-testid="badge-powered-by" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6 ring-1 ring-purple-200/50 shadow-sm">
          <HelpCircle className="w-4 h-4" />
          Powered by WebLLM
        </div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight mb-4" data-testid="text-hero-headline">
        AI <span className="text-gradient">FAQ</span> Generator
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subheadline">
        Create SEO-friendly FAQs in seconds. Generate comprehensive Q&A pairs with JSON-LD schema markup ready for your website. Free and 100% private.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap justify-center gap-4 text-sm">
        {[
          { icon: HelpCircle, label: "5-20 Questions" },
          { icon: Code2, label: "JSON-LD Schema" },
          { icon: Search, label: "SEO Optimized" },
          { icon: ShieldCheck, label: "100% Private" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} data-testid={`badge-trust-${label.toLowerCase().replace(/\s+/g, "-")}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/60 shadow-sm text-slate-600">
            <Icon className="w-4 h-4 text-purple-500" />
            {label}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
