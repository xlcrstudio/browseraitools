import { useState, useRef, lazy, Suspense } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Zap, Cpu, UserX, Sparkles, ChevronRight,
  Search, X,
} from "lucide-react";
import { toolCategories, type ToolCategory, type Tool } from "@/lib/tools-data";
import { AdBlock } from "@/components/AdBlock";

// Lazy-load the heavy chat widget so it doesn't block initial paint
const AIChatWidget = lazy(() =>
  import("@/components/AIChatWidget").then((m) => ({ default: m.AIChatWidget }))
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const allTools: (Tool & { categoryName: string })[] = toolCategories.flatMap((cat) =>
  cat.tools.map((tool) => ({ ...tool, categoryName: cat.name }))
);

// Pick 8 real available tools as "featured"
const FEATURED_SLUGS = [
  "/ai-chatbot",
  "/ai-text-summarizer",
  "/ai-blog-post-generator",
  "/ai-grammar-checker",
  "/ai-essay-writer",
  "/ai-paraphrasing-tool",
  "/ai-cover-letter-generator",
  "/ai-instagram-caption-generator",
];
const featuredTools = FEATURED_SLUGS
  .map((slug) => allTools.find((t) => t.slug === slug))
  .filter((t): t is Tool & { categoryName: string } => !!t && t.available);

// ─── Search Dropdown ──────────────────────────────────────────────────────────

function SearchDropdown({ query, onSelect }: { query: string; onSelect: () => void }) {
  const results = allTools.filter((t) => t.name.toLowerCase().includes(query)).slice(0, 8);
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
                  <div className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-slate-100 dark:border-slate-700" : ""}`}>
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

function SeoSection() {
  return (
    <section className="mb-16 md:mb-20" data-testid="section-seo-content">
      <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-10 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-5 text-slate-900 dark:text-slate-100">
          Free AI Tools That Run in Your Browser
        </h2>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Most AI tools ask you to create an account, agree to a privacy policy, and trust that your data stays safe on their servers. BrowserAI Tools works differently. Every tool on this site runs entirely inside your browser using WebLLM — a technology that downloads a lightweight AI model to your device and runs it locally, without ever sending your text to a server.
        </p>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          That means your writing, your ideas, and your prompts stay private by default. Not because we promise it — because there are no servers involved.
        </p>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">
          What you can do with private, offline AI:
        </h3>

        <ul className="space-y-3 mb-6">
          <li className="flex gap-2.5 text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="text-purple-400 font-bold shrink-0 mt-0.5">—</span>
            <span>
              Rewrite and polish your writing with the{" "}
              <Link href="/ai-paraphrasing-tool" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Paraphrasing Tool</Link>
              {" "}or{" "}
              <Link href="/ai-paragraph-rewriter" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Paragraph Rewriter</Link>
              {" "}— great for avoiding repetitive phrasing without pasting your drafts into a third-party app.
            </span>
          </li>
          <li className="flex gap-2.5 text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="text-purple-400 font-bold shrink-0 mt-0.5">—</span>
            <span>
              Summarize long documents privately using the{" "}
              <Link href="/ai-text-summarizer" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Text Summarizer</Link>
              {" "}or{" "}
              <Link href="/ai-pdf-summarizer" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI PDF Summarizer</Link>
              {" "}— ideal for research, legal documents, or anything sensitive.
            </span>
          </li>
          <li className="flex gap-2.5 text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="text-purple-400 font-bold shrink-0 mt-0.5">—</span>
            <span>
              Generate blog posts, essays, and long-form content with the{" "}
              <Link href="/ai-blog-post-generator" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Blog Post Generator</Link>
              {" "}or{" "}
              <Link href="/ai-essay-writer" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Essay Writer</Link>
              {" "}— the model runs on your GPU, not ours.
            </span>
          </li>
          <li className="flex gap-2.5 text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="text-purple-400 font-bold shrink-0 mt-0.5">—</span>
            <span>
              Check grammar, simplify sentences, or adjust your tone with tools like the{" "}
              <Link href="/ai-grammar-checker" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Grammar Checker</Link>
              {", "}
              <Link href="/ai-sentence-simplifier" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Sentence Simplifier</Link>
              {", and "}
              <Link href="/ai-tone-converter" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">AI Tone Converter</Link>.
            </span>
          </li>
          <li className="flex gap-2.5 text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="text-purple-400 font-bold shrink-0 mt-0.5">—</span>
            <span>
              Create marketing copy — hooks, captions, cover letters, cold emails — without feeding your business ideas to a cloud AI.
            </span>
          </li>
        </ul>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">
          No login. No subscription. No catch.
        </h3>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          There's no free tier with hidden limits. You don't need to enter a credit card, verify your email, or wait for access. Open any tool, let the model load once (it caches in your browser), and start working. After that first load, the tools work even when you're offline.
        </p>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This makes BrowserAI Tools especially useful for students working in libraries, professionals handling confidential content, and developers who want to prototype ideas without an API key. It's also a practical choice for anyone who's simply tired of signing up for yet another service just to rephrase a paragraph. The full collection covers writing, summarizing, translating, coding, marketing, and productivity — all free, all private, all running in your browser.
        </p>
      </div>
    </section>
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

function ToolsCatalog({ query }: { query: string }) {
  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length > 0;
  const results = isSearching ? allTools.filter((t) => t.name.toLowerCase().includes(trimmed)) : [];

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
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
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
          <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-8">
            {toolCategories.map((category, i) => (
              <motion.div key={category.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * i }}>
                <CategorySection category={category} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Persona buttons ──────────────────────────────────────────────────────────

const PERSONAS = [
  { label: "Students",      emoji: "🎓", slug: "students"      },
  { label: "Marketers",     emoji: "📣", slug: "marketers"     },
  { label: "Professionals", emoji: "💼", slug: "professionals" },
  { label: "Developers",    emoji: "👨‍💻", slug: "developers"    },
  { label: "Writers",       emoji: "✍️", slug: "writers"       },
  { label: "Founders",      emoji: "🚀", slug: "founders"      },
];

// ─── Why Section ──────────────────────────────────────────────────────────────

function WhySection() {
  const cards = [
    {
      icon: Lock,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      title: "100% Private",
      body: "The AI model runs directly on your device. Nothing you type is ever sent to a server.",
    },
    {
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/30",
      title: "Always Free",
      body: "No subscriptions, no hidden credits, no paywalled features. Every tool is free forever.",
    },
    {
      icon: Cpu,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      title: "Works Offline",
      body: "After the model loads once, every tool keeps working without an internet connection.",
    },
    {
      icon: UserX,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/30",
      title: "No Login",
      body: "No accounts, no emails, no passwords. Open any tool and start instantly.",
    },
  ];

  return (
    <section className="mb-14 md:mb-18">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">
          Why BrowserAI Tools?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
          The only AI toolkit that puts your privacy first — no cloud, no cost, no catch.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ icon: Icon, color, bg, title, body }) => (
          <div
            key={title}
            data-testid={`card-why-${title.toLowerCase().replace(/\s+/g, "-")}`}
            className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Featured Tools ───────────────────────────────────────────────────────────

function FeaturedTools() {
  return (
    <section className="mb-14 md:mb-18">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-display">Featured Tools</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Most popular picks to get you started</p>
        </div>
        <a
          href="#tools"
          data-testid="link-view-all-tools"
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          View all <ChevronRight className="w-4 h-4" />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {featuredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.slug}
              data-testid={`link-featured-tool-${tool.id}`}
              className="group flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{tool.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500">{tool.categoryName}</div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-purple-500 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                Try free <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
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
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-10 md:pt-10 md:pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-start">

        {/* ── Left column ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-5 ring-1 ring-purple-200/50 dark:ring-purple-700/50 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Free AI Tools — 100% In Your Browser
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold font-display leading-tight mb-5">
            AI Tools That Run{" "}
            <span className="text-gradient">In Your Browser</span>
          </h1>

          {/* Sub */}
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-7 max-w-xl leading-relaxed">
            Private, free, and offline-ready AI for creators, marketers, and professionals. No signups. No data collection. Just powerful AI.
          </p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-lg mb-7 text-left"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
              <input
                ref={inputRef}
                data-testid="input-tool-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                placeholder="Search 99 free AI tools…"
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
            <AnimatePresence>
              {query.trim() && (
                <SearchDropdown query={query.trim().toLowerCase()} onSelect={() => setQuery("")} />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Persona buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
              Explore by Use Case
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-2 max-w-lg">
              {PERSONAS.map(({ label, emoji, slug }) => (
                <a
                  key={slug}
                  href={`/personas/${slug}.html`}
                  data-testid={`link-persona-${slug}`}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-3 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200 hover:scale-105 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right column: Chat widget (desktop) ── */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="sticky top-20 w-full max-w-[500px] ml-auto">
            <Suspense fallback={
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-[420px] flex items-center justify-center text-slate-400 text-sm">
                Loading AI Chat…
              </div>
            }>
              <AIChatWidget />
            </Suspense>
          </div>
        </motion.div>
      </div>

      {/* ── Mobile: Chat widget below columns ── */}
      <motion.div
        className="lg:hidden mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Suspense fallback={
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-64 flex items-center justify-center text-slate-400 text-sm">
            Loading AI Chat…
          </div>
        }>
          <AIChatWidget />
        </Suspense>
      </motion.div>
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
      <div className="max-w-7xl mx-auto px-4">
        <WhySection />
        <FeaturedTools />
        <AdBlock slot="home-top" format="horizontal" className="mb-10 md:mb-14" />
        <ToolsCatalog query={query} />
        <SeoSection />
        <AdBlock slot="home-mid" format="horizontal" className="mb-10 md:mb-14" />
        <PrivacySection />
        <AdBlock slot="home-bottom" format="horizontal" className="mb-10 md:mb-14" />
      </div>
    </>
  );
}
