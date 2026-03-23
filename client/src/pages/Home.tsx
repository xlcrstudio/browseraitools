import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Zap, Cpu, Sparkles, ChevronRight, Search, X } from "lucide-react";
import { toolCategories, type ToolCategory, type Tool } from "@/lib/tools-data";
import { AdBlock } from "@/components/AdBlock";
import { AIChatWidget } from "@/components/AIChatWidget";

// ─── Data ─────────────────────────────────────────────────────────────────────

const allTools: (Tool & { categoryName: string })[] = toolCategories.flatMap((cat) =>
  cat.tools.map((tool) => ({ ...tool, categoryName: cat.name }))
);

// ─── Search Dropdown ──────────────────────────────────────────────────────────

function SearchDropdown({
  query,
  onSelect,
}: {
  query: string;
  onSelect: () => void;
}) {
  const results = allTools
    .filter((t) => t.name.toLowerCase().includes(query))
    .slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      {results.length === 0 ? (
        <div className="flex items-center gap-3 px-4 py-4 text-slate-400 dark:text-slate-500">
          <Search className="w-4 h-4 shrink-0" />
          <span className="text-sm">No tools found for "{query}"</span>
        </div>
      ) : (
        <ul>
          {results.map((tool, i) => {
            const Icon = tool.icon;
            const idx = tool.name.toLowerCase().indexOf(query);
            return (
              <li key={tool.id}>
                {tool.available ? (
                  <Link
                    href={tool.slug}
                    data-testid={`dropdown-tool-${tool.id}`}
                    onClick={onSelect}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ${
                      i > 0 ? "border-t border-slate-100 dark:border-slate-700" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {tool.name.slice(0, idx)}
                        <mark className="bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 rounded px-0.5 not-italic">
                          {tool.name.slice(idx, idx + query.length)}
                        </mark>
                        {tool.name.slice(idx + query.length)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{tool.categoryName}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  </Link>
                ) : (
                  <div
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i > 0 ? "border-t border-slate-100 dark:border-slate-700" : ""
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-400 dark:text-slate-500 truncate">{tool.name}</p>
                      <p className="text-xs text-slate-300 dark:text-slate-600">Coming Soon</p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function SearchResultCard({ tool, query }: { tool: Tool & { categoryName: string }; query: string }) {
  const Icon = tool.icon;
  if (tool.available) {
    return (
      <Link
        href={tool.slug}
        data-testid={`link-tool-${tool.id}`}
        className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-purple-100 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20 group hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
            <HighlightMatch text={tool.name} query={query} />
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">{tool.categoryName}</div>
        </div>
        <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    );
  }
  return (
    <div
      data-testid={`card-tool-${tool.id}`}
      className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400 dark:text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-500 truncate">
          <HighlightMatch text={tool.name} query={query} />
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-600">Coming Soon</div>
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: ToolCategory }) {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200">{category.name}</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{category.description}</p>
        </div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full">
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
        className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-purple-100 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20 group hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 shadow-sm">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{tool.name}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Available Now</div>
        </div>
        <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    );
  }
  return (
    <div
      data-testid={`card-tool-${tool.id}`}
      className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-400 dark:text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-500 truncate">{tool.name}</div>
        <div className="text-xs text-slate-400 dark:text-slate-600">Coming Soon</div>
      </div>
    </div>
  );
}

function PrivacySection() {
  return (
    <section className="mb-16 md:mb-20">
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 mb-5">
            <Lock className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
            Your Data Never Leaves Your Browser
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Unlike other AI tools that send your data to cloud servers, Browser AI Tools runs everything locally using WebLLM. Your prompts and results stay 100% private on your device.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/70 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0 text-red-500 dark:text-red-400 font-bold text-sm">X</div>
              <div className="text-left">
                <div className="text-sm font-semibold text-red-700 dark:text-red-400">Other AI Tools</div>
                <div className="text-xs text-red-500 dark:text-red-500/80">Data sent to cloud servers</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Browser AI Tools</div>
                <div className="text-xs text-emerald-500 dark:text-emerald-500/80">Everything stays on your device</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          className="flex items-center gap-2.5 bg-white dark:bg-slate-800/60 px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <item.icon className={`w-5 h-5 ${item.color}`} />
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{item.sublabel}</div>
          </div>
        </div>
      ))}
    </motion.section>
  );
}

function ToolsCatalog({ query }: { query: string }) {
  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length > 0;
  const results = isSearching
    ? allTools.filter((t) => t.name.toLowerCase().includes(trimmed))
    : [];

  return (
    <section className="mb-16 md:mb-20" id="tools">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">All AI Tools</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Every tool runs locally in your browser using WebLLM. Your data never touches a server.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {results.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No tools found for "{query}"</p>
                <p className="text-sm mt-1">Try a different keyword</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center">
                  {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {results.map((tool) => (
                    <SearchResultCard key={tool.id} tool={tool} query={trimmed} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HomeHero({
  query,
  setQuery,
  inputRef,
}: {
  query: string;
  setQuery: (q: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <section className="text-center max-w-4xl mx-auto pt-4 pb-12 md:pt-8 md:pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-6 ring-1 ring-purple-200/50 dark:ring-purple-700/50 shadow-sm">
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
        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Private, free, and offline-ready AI tools for content creators, marketers, and professionals. No signups. No data collection. Just powerful AI.
      </motion.p>

      {/* Search bar with predictive dropdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative max-w-lg mx-auto mb-8 text-left"
      >
        {/* Input row — own relative context so top-1/2 centers against input only */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
          <input
            ref={inputRef}
            data-testid="input-tool-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="Search tools…"
            autoComplete="off"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-10 py-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                data-testid="button-clear-search"
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Predictive dropdown — positioned relative to the outer container */}
        <AnimatePresence>
          {query.trim() && (
            <SearchDropdown query={query.trim().toLowerCase()} onSelect={() => setQuery("")} />
          )}
        </AnimatePresence>
      </motion.div>

      <AIChatWidget />
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <HomeHero query={query} setQuery={setQuery} inputRef={inputRef} />
      <TrustBar />
      <AdBlock slot="home-top" format="horizontal" className="mb-10 md:mb-14" />
      <ToolsCatalog query={query} />
      <AdBlock slot="home-mid" format="horizontal" className="mb-10 md:mb-14" />
      <PrivacySection />
      <AdBlock slot="home-bottom" format="horizontal" className="mb-10 md:mb-14" />
    </>
  );
}
