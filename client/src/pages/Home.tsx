import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock, Zap, Cpu, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { toolCategories, type ToolCategory, type Tool } from "@/lib/tools-data";
import { AdBlock } from "@/components/AdBlock";

export default function Home() {
  return (
    <>
      <HomeHero />
      <TrustBar />
      <AdBlock slot="home-top" format="horizontal" className="mb-10 md:mb-14" />
      <ToolsCatalog />
      <AdBlock slot="home-mid" format="horizontal" className="mb-10 md:mb-14" />
      <PrivacySection />
      <AdBlock slot="home-bottom" format="horizontal" className="mb-10 md:mb-14" />
    </>
  );
}

function HomeHero() {
  return (
    <section className="text-center max-w-4xl mx-auto pt-4 pb-12 md:pt-8 md:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6 ring-1 ring-purple-200/50 shadow-sm">
          <Sparkles className="w-4 h-4" />
          Free AI Tools - Running 100% In Your Browser
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        AI Tools That Run{" "}
        <br className="hidden md:block" />
        <span className="text-gradient">In Your Browser</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Private, free, and offline-ready AI tools for content creators, marketers, and professionals. No signups. No data collection. Just powerful AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link
          href="/ai-hook-generator"
          data-testid="link-try-hook-generator"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-primary shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-lg"
        >
          Try AI Hook Generator <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-3 text-sm text-slate-400">Our first tool is live - more coming soon</p>
      </motion.div>
    </section>
  );
}

function TrustBar() {
  return (
    <motion.section
      className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {[
        { icon: Lock, label: "No Servers", sublabel: "100% Private", color: "text-emerald-500" },
        { icon: Zap, label: "Always Free", sublabel: "No Hidden Costs", color: "text-amber-500" },
        { icon: Cpu, label: "Works Offline", sublabel: "After First Load", color: "text-blue-500" },
      ].map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100"
        >
          <item.icon className={`w-5 h-5 ${item.color}`} />
          <div>
            <div className="text-sm font-semibold text-slate-800">{item.label}</div>
            <div className="text-xs text-slate-400">{item.sublabel}</div>
          </div>
        </div>
      ))}
    </motion.section>
  );
}

function ToolsCatalog() {
  return (
    <section className="mb-16 md:mb-20" id="tools">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">
          All AI Tools
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Every tool runs locally in your browser using WebLLM. Your data never touches a server.
        </p>
      </div>

      <div className="space-y-8">
        {toolCategories.map((category, i) => (
          <motion.div
            key={category.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i }}
          >
            <CategorySection category={category} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategorySection({ category }: { category: ToolCategory }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-800">{category.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
          {category.tools.length} tools
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {category.tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  if (tool.available) {
    return (
      <Link
        href={tool.slug}
        data-testid={`link-tool-${tool.id}`}
        className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-purple-100 bg-purple-50/50 group hover:border-purple-200 hover:bg-purple-50 transition-all"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800 truncate">{tool.name}</div>
          <div className="text-xs text-emerald-600 font-medium">Available Now</div>
        </div>
        <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    );
  }

  return (
    <div
      data-testid={`card-tool-${tool.id}`}
      className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-100 bg-slate-50/30"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-500 truncate">{tool.name}</div>
        <div className="text-xs text-slate-400">Coming Soon</div>
      </div>
    </div>
  );
}

function PrivacySection() {
  return (
    <section className="mb-16 md:mb-20">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 mb-5">
            <Lock className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
            Your Data Never Leaves Your Browser
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Unlike other AI tools that send your data to cloud servers, Browser AI Tools runs everything locally using WebLLM. Your prompts and results stay 100% private on your device.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/70 border border-red-100">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 font-bold text-sm">X</div>
              <div className="text-left">
                <div className="text-sm font-semibold text-red-700">Other AI Tools</div>
                <div className="text-xs text-red-500">Data sent to cloud servers</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold text-sm">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-emerald-700">Browser AI Tools</div>
                <div className="text-xs text-emerald-500">Everything stays on your device</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

