import { motion } from "framer-motion";
import { Smartphone, Sparkles, Type, Palette, Users, ShieldCheck } from "lucide-react";

export function IGBioHero() {
  return (
    <section className="text-center max-w-3xl mx-auto pt-4 pb-10 md:pt-6 md:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          data-testid="badge-powered-by"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-sm font-semibold mb-6 ring-1 ring-pink-200/50 dark:ring-pink-700/50 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Powered by Qwen 2.5
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
        <span className="text-gradient">Instagram Bio Generator</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
        data-testid="text-hero-subheadline"
      >
        Create the perfect Instagram bio in seconds. Generate 5 unique bio options with emojis, perfect formatting, and personality. Stand out and get more followers. Free and instant.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 text-sm"
        data-testid="container-trust-badges"
      >
        {[
          { icon: Smartphone, label: "150-Character Optimized" },
          { icon: Sparkles, label: "5 Unique Variations" },
          { icon: Type, label: "Smart Emoji Placement" },
          { icon: Palette, label: "Aesthetic Formatting" },
          { icon: Users, label: "Niche-Specific Bios" },
          { icon: ShieldCheck, label: "100% Private" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            data-testid={`badge-trust-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-sm text-slate-600 dark:text-slate-300"
          >
            <Icon className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            <span className="font-medium">{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
