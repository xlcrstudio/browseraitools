import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, Bot, User, Copy, Check,
  BarChart2, Zap, Search, Palette, ChevronDown, ChevronUp,
  RotateCcw, FileText, Loader2, History, Trash2, Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

// ─── Detection Algorithm ──────────────────────────────────────────────────────

const AI_PHRASES = [
  "it's important to note that", "it is important to note that",
  "it's worth noting that", "it is worth noting that",
  "in conclusion", "to summarize", "to sum up",
  "moreover", "furthermore", "additionally",
  "in other words", "that being said", "it should be noted",
  "generally speaking", "in most cases", "tends to",
  "in summary", "to conclude", "ultimately",
  "very important", "extremely significant", "highly relevant",
  "particularly noteworthy", "it is crucial", "it's crucial",
  "needless to say", "as previously mentioned", "as mentioned above",
  "first and foremost", "last but not least", "without a doubt",
  "in the realm of", "at the end of the day", "all in all",
  "plays a crucial role", "plays an important role",
  "delve into", "dive into", "shed light on",
  "in today's world", "in today's society", "in this day and age",
];

const GENERIC_STARTS = [
  "it is", "there are", "there is", "this is", "these are",
  "one of the", "in order to", "when it comes to", "the fact that",
];

function variance(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  return nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length;
}

function splitSentences(text: string): string[] {
  return (text.match(/[^.!?]+[.!?]+/g) || [text])
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 2);
}

function calcPerplexityScore(text: string): number {
  const words = text.toLowerCase().split(/\s+/);
  if (words.length < 4) return 50;
  const bigrams: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const b = `${words[i]} ${words[i + 1]}`;
    bigrams[b] = (bigrams[b] || 0) + 1;
  }
  const uniqueRatio = Object.keys(bigrams).length / (words.length - 1);
  // Higher uniqueRatio → more human → lower AI score
  if (uniqueRatio > 0.85) return 10;
  if (uniqueRatio > 0.75) return 25;
  if (uniqueRatio > 0.65) return 45;
  if (uniqueRatio > 0.50) return 60;
  if (uniqueRatio > 0.35) return 75;
  return 90;
}

function calcBurstinessScore(sentences: string[]): number {
  if (sentences.length < 3) return 50;
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const comps = sentences.map((s) => {
    const words = s.split(/\s+/);
    const avgLen = words.reduce((a, w) => a + w.length, 0) / words.length;
    const commas = (s.match(/,/g) || []).length;
    const clauses = commas + (s.match(/;|:|—/g) || []).length;
    return avgLen + clauses * 4;
  });
  const lv = variance(lengths);
  const cv = variance(comps);
  const burstiness = Math.min(100, (lv * 1.2 + cv * 1.0));
  // High burstiness → human → lower AI score. Return AI score = 100 - burstiness.
  return Math.max(0, Math.min(100, 100 - burstiness));
}

interface PatternResult {
  score: number;
  found: { phrase: string; count: number }[];
}

function detectPatterns(text: string): PatternResult {
  const lower = text.toLowerCase();
  const found: { phrase: string; count: number }[] = [];
  AI_PHRASES.forEach((phrase) => {
    const count = (lower.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
    if (count > 0) found.push({ phrase, count });
  });
  const total = found.reduce((s, p) => s + p.count, 0);
  return { score: Math.min(100, total * 12), found };
}

function analyzeStructure(s: string): string {
  const wc = s.split(/\s+/).length;
  const hasComma = s.includes(",");
  const startsTransition = /^(however|moreover|furthermore|additionally|therefore|meanwhile)/i.test(s.trim());
  if (wc < 7) return "short-simple";
  if (wc > 24 && hasComma) return "long-complex";
  if (startsTransition) return "transitional";
  return "medium-standard";
}

function calcConsistencyScore(sentences: string[]): number {
  if (sentences.length < 3) return 40;
  const structs = sentences.map(analyzeStructure);
  const counts: Record<string, number> = {};
  structs.forEach((s) => (counts[s] = (counts[s] || 0) + 1));
  const maxRep = Math.max(...Object.values(counts));
  return Math.round((maxRep / sentences.length) * 100);
}

function sentenceAIScore(s: string): number {
  const wc = s.split(/\s+/).length;
  const lower = s.toLowerCase().trim();
  const hasPattern = AI_PHRASES.some((p) => lower.includes(p));
  const isGeneric = GENERIC_STARTS.some((g) => lower.startsWith(g));
  let score = 35;
  if (wc > 25) score += 12;
  if (wc > 35) score += 8;
  if (hasPattern) score += 25;
  if (isGeneric) score += 15;
  if (wc < 5) score -= 20;
  return Math.min(100, Math.max(0, score));
}

interface DetectionResult {
  aiProbability: number;
  perplexityAI: number;
  burstinessAI: number;
  patternScore: number;
  consistencyScore: number;
  patternsFound: { phrase: string; count: number }[];
  sentences: { text: string; ai: number }[];
  confidence: "low" | "medium" | "high";
  wordCount: number;
  sentenceCount: number;
}

function analyze(text: string): DetectionResult {
  const sentences = splitSentences(text);
  const wordCount = text.trim().split(/\s+/).length;
  const perplexityAI = calcPerplexityScore(text);
  const burstinessAI = calcBurstinessScore(sentences);
  const patterns = detectPatterns(text);
  const consistencyScore = calcConsistencyScore(sentences);

  const aiProbability = Math.round(
    perplexityAI * 0.35 +
    burstinessAI * 0.30 +
    patterns.score * 0.20 +
    consistencyScore * 0.15
  );

  const confidence: "low" | "medium" | "high" =
    wordCount > 500 && sentences.length > 10
      ? "high"
      : wordCount > 150 && sentences.length > 4
      ? "medium"
      : "low";

  return {
    aiProbability: Math.min(100, Math.max(0, aiProbability)),
    perplexityAI,
    burstinessAI,
    patternScore: patterns.score,
    consistencyScore,
    patternsFound: patterns.found,
    sentences: sentences.map((s) => ({ text: s, ai: sentenceAIScore(s) })),
    confidence,
    wordCount,
    sentenceCount: sentences.length,
  };
}

// ─── Sample texts ─────────────────────────────────────────────────────────────

const SAMPLES = [
  {
    label: "AI-generated article",
    text: `Artificial intelligence is revolutionizing the way we approach modern challenges. It is important to note that the integration of AI into various sectors has led to unprecedented advancements. Furthermore, these technologies have the potential to transform industries across the board. That being said, it is crucial to consider the ethical implications of widespread AI adoption. In conclusion, while AI presents numerous opportunities, it is essential to approach its development with careful consideration. Ultimately, the future of AI depends on how we collectively choose to harness its capabilities. Moreover, collaboration between stakeholders will play a crucial role in shaping these outcomes.`,
  },
  {
    label: "Human-written blog post",
    text: `So I've been thinking about this a lot lately. My dog knocked over my coffee this morning—third time this week—and somehow that got me reflecting on how badly I handle unexpected stuff. Weird, right? But here's the thing: I actually used to be way worse. Back in 2019 I quit a job over an email tone. Imagine doing that! The barista at the corner shop knows my name now. Not sure if that's a sign I'm thriving or that I need to leave the house less.`,
  },
  {
    label: "Mixed content",
    text: `I've been doing a lot of research on productivity lately. It is worth noting that many successful people wake up early, and furthermore, they tend to follow strict routines. Personally, I find this hard—I'm a disaster before 8am. That being said, I did try the 5am club thing for two weeks. The research suggests that morning routines play a crucial role in overall wellbeing. Anyway, it didn't stick. My cat screams at 3am and my sleep is basically a myth at this point.`,
  },
  {
    label: "Academic paper",
    text: `This study examines the relationship between social media usage and academic performance among university students. The findings indicate that excessive social media consumption negatively correlates with GPA outcomes. Moreover, the data suggests that students who actively limit their screen time demonstrate higher levels of academic engagement. Furthermore, it is important to note that self-regulation strategies play a particularly noteworthy role in mediating this relationship. In conclusion, the results underscore the need for evidence-based digital wellness interventions in higher education settings.`,
  },
];

// ─── Gauge Component ──────────────────────────────────────────────────────────

function Gauge({ value, animated }: { value: number; animated: boolean }) {
  const radius = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = 180;
  const endAngle = 0;
  const toRad = (d: number) => (d * Math.PI) / 180;

  function arcPath(fromDeg: number, toDeg: number) {
    const x1 = cx + radius * Math.cos(toRad(fromDeg));
    const y1 = cy + radius * Math.sin(toRad(fromDeg));
    const x2 = cx + radius * Math.cos(toRad(toDeg));
    const y2 = cy + radius * Math.sin(toRad(toDeg));
    const la = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${la} 1 ${x2} ${y2}`;
  }

  const arcLen = Math.PI * radius;
  const fillFraction = animated ? value / 100 : 0;
  const dashOffset = arcLen * (1 - fillFraction);

  const color =
    value < 30 ? "#22c55e" : value < 60 ? "#f59e0b" : "#ef4444";

  const label =
    value < 30 ? "Likely Human" : value < 60 ? "Mixed / Uncertain" : "Likely AI-Generated";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 200 110" className="w-52 h-28">
        {/* Background arc */}
        <path
          d={arcPath(180, 0)}
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Filled arc */}
        <path
          d={arcPath(180, 0)}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
        />
        {/* Percentage text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill={color}
          style={{ transition: "fill 0.5s ease" }}
        >
          {animated ? value : 0}%
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          fontSize="10"
          fill="currentColor"
          className="text-slate-500 dark:text-slate-400"
        >
          AI Probability
        </text>
      </svg>
      <span
        className="text-sm font-semibold"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function MetricBar({
  label, value, inverted = false, icon: Icon, description,
}: {
  label: string; value: number; inverted?: boolean; icon: React.ElementType; description: string;
}) {
  const display = inverted ? 100 - value : value;
  const color =
    display < 30 ? "bg-green-500" : display < 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{label}</span>
        <span className="ml-auto text-sm font-bold text-slate-700 dark:text-slate-200">{display}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${display}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

// ─── Highlighted sentence ─────────────────────────────────────────────────────

function SentenceChip({ text, ai }: { text: string; ai: number }) {
  const [open, setOpen] = useState(false);
  const bg =
    ai < 30
      ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
      : ai < 60
      ? "bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700"
      : "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700";
  const label = ai < 30 ? "Human-like" : ai < 60 ? "Uncertain" : "AI-like";
  const labelColor = ai < 30 ? "text-green-700 dark:text-green-400" : ai < 60 ? "text-amber-700 dark:text-amber-400" : "text-red-700 dark:text-red-400";
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setOpen((o) => !o)}
      onKeyDown={(e) => e.key === "Enter" && setOpen((o) => !o)}
      className={cn(
        "inline cursor-pointer border rounded px-0.5 leading-relaxed text-slate-800 dark:text-slate-100 transition-colors",
        bg
      )}
      title={`AI probability: ${ai}%`}
    >
      {text}{" "}
      {open && (
        <span className={cn("text-xs font-semibold", labelColor)}>
          [{label} — {ai}%]
        </span>
      )}
    </span>
  );
}

// ─── History types ────────────────────────────────────────────────────────────

interface HistoryEntry {
  id: string;
  snippet: string;
  aiProbability: number;
  wordCount: number;
  ts: number;
}

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem("aitd_history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem("aitd_history", JSON.stringify(entries.slice(0, 20)));
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AITextDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const canAnalyze = charCount >= 50;

  const runAnalysis = useCallback(async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setAnimated(false);
    setResult(null);
    await new Promise((r) => setTimeout(r, 400));
    const r = analyze(text);
    setResult(r);
    setAnalyzing(false);
    setTimeout(() => setAnimated(true), 80);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      snippet: text.slice(0, 80) + (text.length > 80 ? "…" : ""),
      aiProbability: r.aiProbability,
      wordCount: r.wordCount,
      ts: Date.now(),
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    saveHistory(updated);
  }, [canAnalyze, text, history]);

  const handleSample = (s: typeof SAMPLES[0]) => {
    setText(s.text);
    setResult(null);
    setAnimated(false);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setAnimated(false);
  };

  const handleCopy = () => {
    if (!result) return;
    const verdict = result.aiProbability < 30 ? "Likely Human" : result.aiProbability < 60 ? "Mixed" : "Likely AI";
    navigator.clipboard.writeText(
      `AI Text Detection Result\n\nVerdict: ${verdict}\nAI Probability: ${result.aiProbability}%\nConfidence: ${result.confidence}\nWords: ${result.wordCount}\n\nMetrics:\n- Perplexity: ${result.perplexityAI}% AI\n- Burstiness: ${100 - result.burstinessAI}% (human-like)\n- Pattern Score: ${result.patternScore}%\n- Style Consistency: ${result.consistencyScore}%`
    );
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };

  const verdictColor =
    !result ? "" :
    result.aiProbability < 30 ? "text-green-600 dark:text-green-400" :
    result.aiProbability < 60 ? "text-amber-600 dark:text-amber-400" :
    "text-red-600 dark:text-red-400";

  const verdictBg =
    !result ? "" :
    result.aiProbability < 30 ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" :
    result.aiProbability < 60 ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" :
    "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";

  const verdictText =
    !result ? "" :
    result.aiProbability < 30 ? "This text appears to be HUMAN-WRITTEN" :
    result.aiProbability < 60 ? "This text shows MIXED indicators" :
    "This text appears to be AI-GENERATED";

  const VerdictIcon = !result ? ShieldCheck :
    result.aiProbability < 30 ? User :
    result.aiProbability < 60 ? AlertTriangle : Bot;

  return (
    <div className="space-y-6">
      {/* ── Input Card ── */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="font-semibold text-slate-800 dark:text-slate-100">
            Paste your text below
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sample dropdown */}
            <div className="relative group">
              <button
                data-testid="button-sample"
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Try a sample
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 hidden group-hover:block">
                {SAMPLES.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSample(s)}
                    data-testid={`button-sample-${s.label.replace(/\s+/g, "-").toLowerCase()}`}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            {/* History */}
            <button
              data-testid="button-history"
              onClick={() => setShowHistory((h) => !h)}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              History ({history.length})
            </button>
          </div>
        </div>

        {/* History panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-100 dark:divide-slate-700 max-h-60 overflow-y-auto">
                {history.length === 0 && (
                  <p className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500">No history yet.</p>
                )}
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <button
                      data-testid={`button-history-load-${h.id}`}
                      onClick={() => {
                        setText(h.snippet.replace("…", ""));
                        setShowHistory(false);
                        setResult(null);
                      }}
                      className="flex-1 text-left"
                    >
                      <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{h.snippet}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">
                          {new Date(h.ts).toLocaleDateString()} · {h.wordCount}w ·{" "}
                          <span
                            className={
                              h.aiProbability < 30 ? "text-green-600" :
                              h.aiProbability < 60 ? "text-amber-600" : "text-red-600"
                            }
                          >
                            {h.aiProbability}% AI
                          </span>
                        </span>
                      </div>
                    </button>
                    <button
                      data-testid={`button-history-delete-${h.id}`}
                      onClick={() => deleteHistory(h.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <textarea
            ref={textareaRef}
            data-testid="input-text"
            value={text}
            onChange={(e) => {
              setText(e.target.value.slice(0, 5000));
              setResult(null);
              setAnimated(false);
            }}
            placeholder="Paste text here to check if it's AI-generated..."
            rows={9}
            className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <span className="absolute bottom-3 right-3 text-xs text-slate-400 select-none">
            {wordCount}w · {charCount}/5000
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            data-testid="button-analyze"
            onClick={runAnalysis}
            disabled={!canAnalyze || analyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            {analyzing ? "Analyzing…" : "Analyze Text"}
          </button>
          <button
            data-testid="button-clear"
            onClick={handleClear}
            disabled={!text}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 text-sm font-medium rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>
        {!canAnalyze && text.length > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Please enter at least 50 characters for analysis ({50 - charCount} more needed).
          </p>
        )}
      </div>

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Gauge + Verdict */}
            <div className={cn("border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6", verdictBg)}>
              <Gauge value={result.aiProbability} animated={animated} />
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className={cn("flex items-center gap-2 justify-center sm:justify-start", verdictColor)}>
                  <VerdictIcon className="w-5 h-5" />
                  <span className="font-bold text-lg">{verdictText}</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="text-xs px-2.5 py-1 bg-white/60 dark:bg-black/20 rounded-full border border-current/20 text-slate-600 dark:text-slate-300 font-medium">
                    {result.wordCount} words
                  </span>
                  <span className="text-xs px-2.5 py-1 bg-white/60 dark:bg-black/20 rounded-full border border-current/20 text-slate-600 dark:text-slate-300 font-medium">
                    {result.sentenceCount} sentences
                  </span>
                  <span className={cn("text-xs px-2.5 py-1 bg-white/60 dark:bg-black/20 rounded-full font-semibold border border-current/20",
                    result.confidence === "high" ? "text-green-700 dark:text-green-400" :
                    result.confidence === "medium" ? "text-amber-700 dark:text-amber-400" :
                    "text-slate-500 dark:text-slate-400"
                  )}>
                    {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} confidence
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {result.confidence === "low" && "More text (200+ words) improves accuracy."}
                  {result.confidence === "medium" && "Decent sample size. 500+ words gives higher confidence."}
                  {result.confidence === "high" && "Good sample size for reliable analysis."}
                </p>
                <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                  <button
                    data-testid="button-copy-result"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Report"}
                  </button>
                </div>
              </div>
            </div>

            {/* CTA — only shows when AI score is high */}
            {result.aiProbability >= 60 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 dark:text-blue-200 text-sm">High AI content detected</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                    Make this text sound more human with our AI Humanizer tool.
                  </p>
                </div>
                <button
                  data-testid="button-goto-humanizer"
                  onClick={() => navigate("/ai-humanizer")}
                  className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Make It Human
                </button>
              </motion.div>
            )}

            {/* Sentence Breakdown */}
            {result.sentences.length > 0 && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Sentence-Level Breakdown</h3>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Click any sentence to see its score.</p>
                <div className="flex flex-wrap gap-x-0.5 text-sm leading-8">
                  {result.sentences.map((s, i) => (
                    <SentenceChip key={i} text={s.text} ai={s.ai} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  {[
                    { color: "bg-green-400", label: "Human-like (0–30%)" },
                    { color: "bg-amber-400", label: "Uncertain (30–60%)" },
                    { color: "bg-red-400", label: "AI-like (60–100%)" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <span className={cn("inline-block w-3 h-3 rounded-sm", l.color)} />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricBar
                icon={BarChart2}
                label="Perplexity (Text Predictability)"
                value={result.perplexityAI}
                description="How predictable are word choices? AI tends to pick statistically common sequences. Higher = more AI-like."
              />
              <MetricBar
                icon={Zap}
                label="Burstiness (Sentence Variation)"
                value={result.burstinessAI}
                inverted
                description="Humans mix short punchy sentences with long complex ones. High variation = more human-like."
              />
              <MetricBar
                icon={Search}
                label="AI Pattern Phrases"
                value={result.patternScore}
                description='Frequency of phrases statistically overused by AI (e.g., "it is important to note", "moreover").'
              />
              <MetricBar
                icon={Palette}
                label="Style Consistency"
                value={result.consistencyScore}
                description="How uniform is the sentence structure? AI text is often unnaturally consistent throughout."
              />
            </div>

            {/* AI Phrases found */}
            {result.patternsFound.length > 0 && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                <button
                  data-testid="button-toggle-patterns"
                  onClick={() => setShowPatterns((p) => !p)}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                      AI Phrases Found ({result.patternsFound.length})
                    </span>
                  </div>
                  {showPatterns ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                  {showPatterns && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 pt-1">
                        {result.patternsFound.map((p) => (
                          <span
                            key={p.phrase}
                            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-full"
                          >
                            <span>"{p.phrase}"</span>
                            {p.count > 1 && (
                              <span className="font-bold bg-red-200 dark:bg-red-800 px-1 rounded-full">×{p.count}</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Accuracy disclaimer */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-2">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                Accuracy Notice
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No AI detector is 100% accurate. This tool uses statistical analysis — perplexity, burstiness, phrase patterns, and style consistency — not a trained neural network. Results indicate probability, not certainty. Well-edited human writing may score higher; heavily edited AI text may score lower. Use this alongside other evaluation methods.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
