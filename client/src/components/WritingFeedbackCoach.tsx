import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  Copy, Check, ChevronDown, ChevronUp, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "HIGH" | "MEDIUM" | "LOW";
type SuggestionCategory = "Clarity" | "Engagement" | "Conciseness" | "Structure" | "Tone" | "Grammar" | "Other";

interface Suggestion {
  id: string;
  category: SuggestionCategory;
  severity: Severity;
  quote: string;
  issue: string;
  fix: string;
  expanded: boolean;
}

interface FeedbackResult {
  clarity: number;
  engagement: number;
  conciseness: number;
  structure: number;
  tone: string;
  summary: string;
  suggestions: Suggestion[];
}

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreColor(n: number) {
  if (n >= 85) return { ring: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", bar: "bg-emerald-500", label: "Excellent" };
  if (n >= 70) return { ring: "text-lime-600 dark:text-lime-400",    bg: "bg-lime-50 dark:bg-lime-900/30",    bar: "bg-lime-500",    label: "Good" };
  if (n >= 50) return { ring: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/30",  bar: "bg-amber-500",  label: "Needs work" };
  return           { ring: "text-red-600 dark:text-red-400",         bg: "bg-red-50 dark:bg-red-900/30",      bar: "bg-red-500",    label: "Weak" };
}

const SEVERITY_STYLES: Record<Severity, string> = {
  HIGH:   "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  MEDIUM: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  LOW:    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

const CATEGORY_STYLES: Record<SuggestionCategory, string> = {
  Clarity:     "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  Engagement:  "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  Conciseness: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300",
  Structure:   "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
  Tone:        "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300",
  Grammar:     "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
  Other:       "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
};

// ─── Prompt + parser ──────────────────────────────────────────────────────────

const MAX_WORDS = 1200;

function truncate(text: string): { text: string; truncated: boolean } {
  const words = text.trim().split(/\s+/);
  if (words.length <= MAX_WORDS) return { text, truncated: false };
  return { text: words.slice(0, MAX_WORDS).join(" ") + " [...]", truncated: true };
}

const WRITING_TYPES = [
  "blog post", "email", "essay", "cover letter",
  "newsletter", "report", "social media post", "speech", "article",
];

function buildPrompt(text: string, writingType: string): string {
  const { text: t } = truncate(text);
  return `You are an expert writing coach. Analyze this ${writingType} and give detailed, actionable feedback.

WRITING:
${t}

Score each dimension from 0–100:
- CLARITY: How easy is it to read and understand?
- ENGAGEMENT: How compelling and interesting is it?
- CONCISENESS: Is it tight with no filler words or padding?
- STRUCTURE: Does it flow logically with good organization?

Then give 4–6 specific, actionable suggestions for the most impactful improvements.

Reply in this EXACT format:

CLARITY: [0-100]
ENGAGEMENT: [0-100]
CONCISENESS: [0-100]
STRUCTURE: [0-100]
TONE: [2–5 word tone description, e.g. "Professional but dry"]
SUMMARY: [1–2 sentence overall assessment]

SUGGESTIONS:
---
CATEGORY: [Clarity|Engagement|Conciseness|Structure|Tone|Grammar]
SEVERITY: [HIGH|MEDIUM|LOW]
QUOTE: [exact short phrase from the text, max 15 words, that illustrates the issue — or "N/A" if structural]
ISSUE: [one sentence explaining the specific problem]
FIX: [one sentence concrete improvement or rewrite of the quoted phrase]
---
[repeat for each suggestion]`;
}

function parseResponse(raw: string): FeedbackResult | null {
  const num = (key: string) => {
    const m = raw.match(new RegExp(`${key}:\\s*(\\d+)`, "i"));
    return m ? Math.min(100, Math.max(0, parseInt(m[1]))) : null;
  };
  const str = (key: string) => {
    const m = raw.match(new RegExp(`${key}:\\s*(.+)`, "i"));
    return m?.[1]?.trim() ?? "";
  };

  const clarity    = num("CLARITY");
  const engagement = num("ENGAGEMENT");
  const conciseness = num("CONCISENESS");
  const structure  = num("STRUCTURE");
  if (clarity === null || engagement === null) return null;

  const tone    = str("TONE");
  const summary = str("SUMMARY");

  const blocks = raw.split("---").slice(1);
  const suggestions: Suggestion[] = [];

  for (const block of blocks) {
    const cat  = (str.call(null, "CATEGORY") || block.match(/CATEGORY:\s*(.+)/i)?.[1]?.trim()) ?? "Other";
    const sev  = (block.match(/SEVERITY:\s*(HIGH|MEDIUM|LOW)/i)?.[1]?.toUpperCase() ?? "MEDIUM") as Severity;
    const quote = block.match(/QUOTE:\s*(.+)/i)?.[1]?.trim() ?? "";
    const issue = block.match(/ISSUE:\s*(.+)/i)?.[1]?.trim() ?? "";
    const fix   = block.match(/FIX:\s*(.+)/i)?.[1]?.trim() ?? "";

    if (issue || fix) {
      const validCat: SuggestionCategory = ["Clarity","Engagement","Conciseness","Structure","Tone","Grammar"].includes(cat)
        ? cat as SuggestionCategory : "Other";
      suggestions.push({ id: `s-${suggestions.length}`, category: validCat, severity: sev, quote, issue, fix, expanded: false });
    }
  }

  return { clarity: clarity ?? 70, engagement: engagement ?? 70, conciseness: conciseness ?? 70, structure: structure ?? 70, tone, summary, suggestions };
}

// ─── Score card ───────────────────────────────────────────────────────────────

function ScoreCard({ label, score }: { label: string; score: number }) {
  const c = scoreColor(score);
  return (
    <div className={cn("rounded-2xl p-4 space-y-2 border border-transparent", c.bg)}>
      <div className="flex items-end justify-between">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={cn("text-2xl font-black", c.ring)}>{score}</p>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn("h-1.5 rounded-full", c.bar)}
        />
      </div>
      <p className={cn("text-[10px] font-black uppercase tracking-wider", c.ring)}>{c.label}</p>
    </div>
  );
}

// ─── Suggestion card ──────────────────────────────────────────────────────────

function SuggestionCard({ s, onToggle }: { s: Suggestion; onToggle: () => void }) {
  const [copiedFix, setCopiedFix] = useState(false);

  return (
    <div className={cn(
      "rounded-2xl border overflow-hidden transition-all",
      s.severity === "HIGH"
        ? "border-red-200 dark:border-red-800 bg-white dark:bg-slate-800/60"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60"
    )}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", CATEGORY_STYLES[s.category])}>
              {s.category}
            </span>
            <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", SEVERITY_STYLES[s.severity])}>
              {s.severity}
            </span>
          </div>
          {s.quote && s.quote.toLowerCase() !== "n/a" && s.quote !== "" && (
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-2.5 py-1.5 leading-relaxed line-clamp-2 border border-slate-200 dark:border-slate-700">
              "{s.quote}"
            </p>
          )}
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{s.issue}</p>
        </div>
      </div>

      {/* Expand button */}
      <button type="button" data-testid={`btn-expand-${s.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
        <span className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5" />
          {s.expanded ? "Hide suggestion" : "Show suggestion"}
        </span>
        {s.expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Suggestion panel */}
      <AnimatePresence>
        {s.expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="px-4 pb-4 pt-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800 space-y-2">
              <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">Suggested fix</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{s.fix}</p>
              <button type="button"
                onClick={() => { navigator.clipboard.writeText(s.fix); setCopiedFix(true); setTimeout(() => setCopiedFix(false), 2000); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                {copiedFix ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copiedFix ? "Copied!" : "Copy fix"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WritingFeedbackCoach() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [text, setText] = useState("");
  const [writingType, setWritingType] = useState("blog post");
  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [wasTruncated, setWasTruncated] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const isGenerating = state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isModelLoading;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = useCallback(async () => {
    if (wordCount < 30) { setInputError("Please paste at least 30 words of writing."); return; }
    setInputError(""); setParseError(null); setRawOutput(null);
    setResult(null); setSuggestions([]); setStreaming(""); setIsDone(false);
    const { truncated } = truncate(text);
    setWasTruncated(truncated);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are an expert writing coach and editor. Give specific, actionable feedback with exact quotes from the text. Always follow the exact output format." },
        { role: "user", content: buildPrompt(text, writingType) },
      ],
      temperature: 0.3,
      maxTokens: 1400,
      onChunk: chunk => setStreaming(chunk),
    });

    setStreaming("");
    if (raw) {
      const parsed = parseResponse(raw);
      if (parsed) {
        setResult(parsed);
        setSuggestions(parsed.suggestions);
        setIsDone(true);
      } else {
        setRawOutput(raw);
        setParseError("The AI responded but in an unexpected format. Raw output shown below.");
      }
    }
  }, [text, writingType, wordCount, generateRaw]);

  const toggleSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  };

  const expandAll = () => setSuggestions(prev => prev.map(s => ({ ...s, expanded: true })));
  const collapseAll = () => setSuggestions(prev => prev.map(s => ({ ...s, expanded: false })));

  const handleReset = () => {
    setText(""); setResult(null); setSuggestions([]); setStreaming(""); setIsDone(false);
    setInputError(""); setWasTruncated(false); setParseError(null); setRawOutput(null);
  };

  const highCount = suggestions.filter(s => s.severity === "HIGH").length;
  const avgScore = result
    ? Math.round((result.clarity + result.engagement + result.conciseness + result.structure) / 4)
    : 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input */}
      {!isDone && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest shrink-0">Type</p>
            <select value={writingType} onChange={e => setWritingType(e.target.value)}
              data-testid="select-writing-type"
              className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-400">
              {WRITING_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          <div className="relative">
            <textarea data-testid="input-writing"
              value={text}
              onChange={e => { setText(e.target.value); setInputError(""); }}
              placeholder="Paste your writing here — blog post draft, email, essay, cover letter, or any text you want feedback on…"
              rows={13}
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
            />
            {wordCount > 0 && (
              <span className="absolute bottom-3 right-4 text-xs text-slate-400 pointer-events-none">{wordCount} words</span>
            )}
          </div>

          {isModelLoading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800">
              <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  {state === "checking-gpu" ? "Checking GPU…" : `Loading AI model — ${Math.round(progress?.percent ?? 0)}%`}
                </p>
                {state === "downloading" && (
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1 mt-1.5">
                    <div className="bg-purple-600 h-1 rounded-full transition-all" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Private — writing never leaves your browser</span>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />{inputError}
              </p>
            )}
            <button type="button" data-testid="button-analyze"
              onClick={handleAnalyze}
              disabled={isBusy || wordCount < 30}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                isBusy || wordCount < 30
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
              )}>
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing writing…</>
                : isModelLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Model loading…</>
                : "Get Writing Feedback"}
            </button>
          </div>
        </div>
      )}

      {/* Streaming */}
      {isGenerating && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Analyzing your writing…</p>
          </div>
          {streaming && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed line-clamp-4">
              {streaming}
              <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
            </p>
          )}
        </div>
      )}

      {wasTruncated && isDone && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300">Text over 1,200 words — feedback based on first 1,200 words.</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {parseError && rawOutput && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">{parseError}</p>
          </div>
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Raw Output</p>
              <button type="button" onClick={() => { navigator.clipboard.writeText(rawOutput); setCopiedRaw(true); setTimeout(() => setCopiedRaw(false), 2000); }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors">
                {copiedRaw ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copiedRaw ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-4 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">{rawOutput}</pre>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {isDone && result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Feedback Ready</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={cn("text-xs font-black px-3 py-1 rounded-full", scoreColor(avgScore).bg, scoreColor(avgScore).ring)}>
                    Overall {avgScore}/100
                  </span>
                  {result.tone && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                      Tone: {result.tone}
                    </span>
                  )}
                  {highCount > 0 && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                      {highCount} priority issue{highCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
              <button type="button" data-testid="button-reset" onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                <RotateCcw className="w-3 h-3" /> New
              </button>
            </div>

            {/* Scores grid */}
            <div className="grid grid-cols-2 gap-3">
              <ScoreCard label="Clarity" score={result.clarity} />
              <ScoreCard label="Engagement" score={result.engagement} />
              <ScoreCard label="Conciseness" score={result.conciseness} />
              <ScoreCard label="Structure" score={result.structure} />
            </div>

            {/* Summary */}
            {result.summary && (
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Assessment</p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {suggestions.length} Suggestion{suggestions.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <button type="button" data-testid="button-expand-all" onClick={expandAll}
                      className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline">Expand all</button>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <button type="button" data-testid="button-collapse-all" onClick={collapseAll}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 hover:underline">Collapse all</button>
                  </div>
                </div>
                {suggestions.map(s => (
                  <SuggestionCard key={s.id} s={s} onToggle={() => toggleSuggestion(s.id)} />
                ))}
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
