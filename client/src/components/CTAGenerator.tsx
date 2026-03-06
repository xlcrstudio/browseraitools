import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2, AlertTriangle, CheckCircle2, ChevronDown, RefreshCw, Download, Filter, Flame, Target, Magnet, ShieldCheck, Zap } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useCTAStorage, categorizeCTA, type GeneratedCTA } from "@/hooks/use-cta-storage";

const GOALS = [
  "Get sign-ups",
  "Book a demo/call",
  "Make a purchase",
  "Download a resource",
  "Start a free trial",
  "Get email subscribers",
  "Click a link",
];

const PLATFORMS = ["All Platforms", "Landing Page", "Email", "Social Media Ad", "Website Banner", "Sales Email"];
const TONES = ["Persuasive", "Professional", "Urgent", "Friendly", "Casual"];
const LENGTH_OPTIONS = ["Short (3-4 words)", "Medium (5-7 words)", "Long (8-10 words)", "Mixed (all lengths)"];

const CATEGORY_ICONS: Record<string, typeof Flame> = {
  urgency: Flame,
  benefit: Target,
  curiosity: Magnet,
  "risk-free": ShieldCheck,
  action: Zap,
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  urgency: { label: "Urgency", color: "bg-orange-100 text-orange-700 border-orange-200" },
  benefit: { label: "Benefit", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  curiosity: { label: "Curiosity", color: "bg-purple-100 text-purple-700 border-purple-200" },
  "risk-free": { label: "Risk-Free", color: "bg-blue-100 text-blue-700 border-blue-200" },
  action: { label: "Action", color: "bg-amber-100 text-amber-700 border-amber-200" },
};

const SYSTEM_PROMPT = `You are an expert conversion copywriter and direct response marketing specialist with 15+ years of experience.

Your expertise includes:
- Writing CTAs that convert at 10%+ rates
- Deep understanding of marketing psychology (urgency, scarcity, FOMO, social proof, reciprocity)
- Platform-specific CTA optimization (email, landing pages, ads, social media)
- Copywriting frameworks (AIDA, PAS, FAB)

You write CTAs that are:
- Clear and specific (no vague "learn more")
- Action-oriented (start with strong verbs)
- Benefit-focused (answer "what's in it for me?")
- Psychologically optimized (use proven triggers)
- Platform-appropriate`;

export function CTAGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveGeneration } = useCTAStorage();

  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState(GOALS[0]);
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [lengthPref, setLengthPref] = useState(LENGTH_OPTIONS[1]);
  const [valueProp, setValueProp] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [streamedContent, setStreamedContent] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [generatedCTAs, setGeneratedCTAs] = useState<GeneratedCTA[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const buildPrompt = () => {
    const lengthMap: Record<string, string> = {
      "Short (3-4 words)": "Keep each CTA to 3-4 words maximum. Be ultra-concise.",
      "Medium (5-7 words)": "Keep each CTA to 5-7 words. Balance clarity with brevity.",
      "Long (8-10 words)": "Each CTA can be 8-10 words. Include value propositions.",
      "Mixed (all lengths)": "Generate a mix: 30% short (3-4 words), 40% medium (5-7 words), 30% long (8-10 words).",
    };

    return `Generate 20 high-converting call-to-action phrases for this marketing campaign.

CAMPAIGN DETAILS:
Product/Service: ${product}
Target Audience: ${audience}
Campaign Goal: ${goal}
Platform/Channel: ${platform}
Desired Tone: ${tone}
${valueProp ? `Unique Value Prop: ${valueProp}` : ""}

CTA REQUIREMENTS:

1. CONVERSION PSYCHOLOGY - Apply these triggers:
   - Urgency & Scarcity (40%): "Today," "Now," "Limited," "Last chance"
   - Benefit Clarity (30%): Clear outcome, specific results
   - Risk Removal (20%): "Free," "No credit card," "Risk-free"
   - Curiosity Gap (10%): "Discover," "See how," "Find out"

2. COPYWRITING BEST PRACTICES:
   - Start with STRONG action verbs: Start, Get, Claim, Unlock, Grab, Join, Discover, Access
   - Avoid weak verbs: Click, Submit, Continue, Proceed
   - Be specific and concrete
   - Include the benefit or outcome

3. FORMAT:
   ${lengthMap[lengthPref]}
   - Use title case (capitalize main words)
   - No periods at the end
   - Start with action verbs

OUTPUT FORMAT:
Return ONLY a numbered list of CTAs, nothing else:

1. [CTA]
2. [CTA]
...
20. [CTA]

NO explanations, NO categories, NO extra text. Just the CTAs.`;
  };

  const handleGenerate = async () => {
    if (!product.trim() || !audience.trim()) return;

    setStreamedContent("");
    setIsDone(false);
    setGeneratedCTAs([]);
    setActiveFilter("all");

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.8,
      maxTokens: 800,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      setIsDone(true);
      const parsed = finalContent
        .split("\n")
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").replace(/^[-*•\s]+/, "").replace(/^["']|["']$/g, "").trim())
        .filter((line) => line.length > 5);

      const ctas: GeneratedCTA[] = parsed.map((text) => ({
        id: generateId(),
        text,
        category: categorizeCTA(text),
        charCount: text.length,
        wordCount: text.split(/\s+/).length,
      }));

      setGeneratedCTAs(ctas);

      saveGeneration({
        id: generateId(),
        product,
        audience,
        goal,
        platform,
        tone,
        ctas,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleExport = () => {
    const text = generatedCTAs.map((c, i) => `${i + 1}. ${c.text}`).join("\n");
    const blob = new Blob([`CTAs for: ${product}\nAudience: ${audience}\nGoal: ${goal}\n\n${text}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ctas-${product.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCTAs = activeFilter === "all" ? generatedCTAs : generatedCTAs.filter((c) => c.category === activeFilter);

  const parsedStreamLines = streamedContent
    .split("\n")
    .map((l) => l.replace(/^\d+[\.\)]\s*/, "").replace(/^[-*•\s]+/, "").trim())
    .filter((l) => l.length > 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Product / Service *</label>
            <input
              data-testid="input-product"
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g., AI Marketing Software, Online Course"
              maxLength={100}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Target Audience *</label>
            <input
              data-testid="input-audience"
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., small business owners, fitness enthusiasts"
              maxLength={100}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Campaign Goal *</label>
            <div className="relative">
              <select
                data-testid="select-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Platform / Channel</label>
            <div className="relative">
              <select
                data-testid="select-platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <button
          data-testid="button-toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 mb-4 transition-colors"
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
          {showAdvanced ? "Hide" : "Show"} Advanced Options
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        data-testid={`button-tone-${t.toLowerCase()}`}
                        onClick={() => setTone(t)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                          tone === t
                            ? "bg-purple-100 border-purple-300 text-purple-700"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">CTA Length</label>
                  <div className="relative">
                    <select
                      data-testid="select-length"
                      value={lengthPref}
                      onChange={(e) => setLengthPref(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                    >
                      {LENGTH_OPTIONS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-slate-700 ml-1">Value Proposition (Optional)</label>
                <textarea
                  data-testid="input-value-prop"
                  value={valueProp}
                  onChange={(e) => setValueProp(e.target.value)}
                  placeholder="What makes your offer unique? (e.g., '30-day money-back guarantee', 'No credit card required')"
                  maxLength={200}
                  rows={2}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full text-sm font-medium">
            {state === "checking-gpu" && (
              <span className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying hardware...
              </span>
            )}
            {state === "downloading" && (
              <div className="space-y-1.5 w-full max-w-xs">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-600 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading AI Engine (First time only)
                  </span>
                  <span className="text-purple-700 font-bold">{progress.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}
            {state === "error" && (
              <span className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> {error}
              </span>
            )}
            {state === "ready" && !error && (
              <span className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI ready to generate
              </span>
            )}
          </div>

          <button
            data-testid="button-generate-ctas"
            onClick={handleGenerate}
            disabled={!product.trim() || !audience.trim() || state === "generating" || state === "downloading" || state === "checking-gpu"}
            className={cn(
              "w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2",
              !product.trim() || !audience.trim() || ["generating", "downloading", "checking-gpu"].includes(state)
                ? "bg-slate-300 text-slate-500 shadow-none cursor-not-allowed"
                : "bg-gradient-primary hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 animate-pulse-glow"
            )}
          >
            {state === "generating" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" /> Generate CTAs
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(streamedContent || isDone) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pt-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
              <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
                <TargetIcon className="w-5 h-5 text-purple-500" /> Your CTAs
                {isDone && generatedCTAs.length > 0 && (
                  <span className="text-sm font-normal text-slate-500 ml-1">({filteredCTAs.length} shown)</span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {state === "generating" && <span className="text-xs font-semibold text-purple-600 animate-pulse">Thinking...</span>}
                {isDone && generatedCTAs.length > 0 && (
                  <button
                    data-testid="button-export"
                    onClick={handleExport}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Export All
                  </button>
                )}
              </div>
            </div>

            {isDone && generatedCTAs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 px-2">
                <Filter className="w-4 h-4 text-slate-400" />
                {["all", "urgency", "benefit", "curiosity", "risk-free", "action"].map((cat) => {
                  const count = cat === "all" ? generatedCTAs.length : generatedCTAs.filter((c) => c.category === cat).length;
                  if (cat !== "all" && count === 0) return null;
                  const config = cat === "all" ? null : CATEGORY_CONFIG[cat];
                  return (
                    <button
                      key={cat}
                      data-testid={`filter-${cat}`}
                      onClick={() => setActiveFilter(cat)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                        activeFilter === cat
                          ? cat === "all"
                            ? "bg-slate-800 text-white border-slate-800"
                            : config!.color + " border-current"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {cat === "all" ? "All" : (<span className="inline-flex items-center gap-1">{(() => { const Icon = CATEGORY_ICONS[cat]; return <Icon className="w-3 h-3" />; })()} {config!.label}</span>)} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            <div className="grid gap-3">
              {isDone
                ? filteredCTAs.map((cta, idx) => (
                    <CTACard key={cta.id} cta={cta} index={idx + 1} />
                  ))
                : parsedStreamLines.map((line, idx) => (
                    <StreamingLine key={idx} text={line} index={idx + 1} />
                  ))}
            </div>

            {isDone && (
              <div className="flex justify-center pt-6">
                <button
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
                >
                  <RefreshCw className="w-4 h-4" /> Generate More CTAs
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CTACard({ cta, index }: { cta: GeneratedCTA; index: number }) {
  const [copied, setCopied] = useState(false);
  const config = CATEGORY_CONFIG[cta.category];

  const handleCopy = () => {
    navigator.clipboard.writeText(cta.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-primary rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <p data-testid={`text-cta-${index}`} className="text-slate-800 font-medium text-lg leading-relaxed">
            {cta.text}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border inline-flex items-center gap-1", config.color)}>
              {(() => { const Icon = CATEGORY_ICONS[cta.category]; return <Icon className="w-3 h-3" />; })()} {config.label}
            </span>
            <span className="text-[11px] text-slate-400">{cta.charCount} chars &middot; {cta.wordCount} words</span>
          </div>
        </div>

        <button
          data-testid={`button-copy-cta-${index}`}
          onClick={handleCopy}
          className={cn(
            "shrink-0 p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-2 group/btn",
            copied
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
          )}
          title="Copy to clipboard"
        >
          {copied ? <CheckCircle2 className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
          <span className={cn("text-sm font-semibold hidden md:block", copied ? "block" : "hidden group-hover/btn:block")}>
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>
      </div>
    </motion.div>
  );
}

function StreamingLine({ text, index }: { text: string; index: number }) {
  if (text.length < 5) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm"
    >
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
          {index}
        </div>
        <p className="flex-1 text-slate-800 font-medium text-lg leading-relaxed pt-0.5">{text}</p>
      </div>
    </motion.div>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
