import { useState } from "react";
import {
  Scale,
  CheckCircle,
  XCircle,
  ShoppingCart,
  BookOpen,
  Briefcase,
  MessageSquare,
  Heart,
  TrendingUp,
  HelpCircle,
  Loader2,
  AlertTriangle,
  Copy,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useProsConsStorage, type ProsConsResult } from "@/hooks/use-pros-cons-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const CONTEXT_OPTIONS = [
  { value: "Buying Decision", label: "Buying Decision", icon: ShoppingCart },
  { value: "Research/Essay", label: "Research/Essay", icon: BookOpen },
  { value: "Career Move", label: "Career Move", icon: Briefcase },
  { value: "Debate/Argument", label: "Debate/Argument", icon: MessageSquare },
  { value: "Personal Life", label: "Personal Life", icon: Heart },
  { value: "Business Strategy", label: "Business Strategy", icon: TrendingUp },
  { value: "Other", label: "Other", icon: HelpCircle },
] as const;

const NUM_ITEMS_OPTIONS = [
  { value: 5, label: "5 Pros & 5 Cons" },
  { value: 7, label: "7 Pros & 7 Cons" },
  { value: 10, label: "10 Pros & 10 Cons" },
] as const;

const SYSTEM_PROMPT =
  "You are an objective, unbiased decision analyst and researcher. You excel at providing perfectly balanced pros and cons lists with clear, concise, factual explanations. You never lean toward one side. You consider real-world context and always remain neutral and helpful for genuine decision-making.";

interface ParsedItem {
  item: string;
  explanation: string;
}

interface ParsedAnalysis {
  score: number;
  pros: ParsedItem[];
  cons: ParsedItem[];
  recommendation: string;
}

function parseBulletItem(line: string): ParsedItem {
  const cleaned = line.replace(/^\s*[\d\-\*\+]+[\.\):\s]*/, "").trim();

  const parenMatch = cleaned.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (parenMatch) {
    return { item: parenMatch[1].trim(), explanation: parenMatch[2].trim() };
  }

  const dashMatch = cleaned.match(/^(.+?)\s*[-\u2013\u2014]\s+(.+)$/);
  if (dashMatch) {
    return { item: dashMatch[1].trim(), explanation: dashMatch[2].trim() };
  }

  const colonMatch = cleaned.match(/^(.+?):\s+(.+)$/);
  if (colonMatch) {
    return { item: colonMatch[1].trim(), explanation: colonMatch[2].trim() };
  }

  return { item: cleaned, explanation: "" };
}

function parseAnalysis(raw: string): ParsedAnalysis {
  let score = 50;
  const scoreMatch = raw.match(/(?:DECISION\s+SCORE|SCORE)\s*:\s*(\d+)/i);
  if (scoreMatch) {
    score = Math.min(100, Math.max(0, parseInt(scoreMatch[1], 10)));
  }

  let pros: ParsedItem[] = [];
  let cons: ParsedItem[] = [];
  let recommendation = "";

  const prosMatch = raw.match(/PROS\s*:\s*([\s\S]*?)(?=CONS\s*:)/i);
  const consMatch = raw.match(/CONS\s*:\s*([\s\S]*?)(?=(?:FINAL\s+RECOMMENDATION|RECOMMENDATION)\s*:|$)/i);
  const recMatch = raw.match(/(?:FINAL\s+RECOMMENDATION|RECOMMENDATION)\s*:\s*([\s\S]*?)$/i);

  if (prosMatch) {
    pros = prosMatch[1]
      .split(/\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 2 && /[\w]/.test(l))
      .map(parseBulletItem);
  }

  if (consMatch) {
    cons = consMatch[1]
      .split(/\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 2 && /[\w]/.test(l))
      .map(parseBulletItem);
  }

  if (recMatch) {
    recommendation = recMatch[1].trim();
  }

  if (pros.length === 0 && cons.length === 0) {
    const lines = raw
      .split(/\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 5 && /[\w]/.test(l));
    const half = Math.ceil(lines.length / 2);
    pros = lines.slice(0, half).map(parseBulletItem);
    cons = lines.slice(half).map(parseBulletItem);
  }

  return { score, pros, cons, recommendation };
}

function getScoreColor(score: number) {
  if (score >= 70) return { bg: "bg-emerald-100 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", label: "Go for it", border: "border-emerald-200 dark:border-emerald-800" };
  if (score >= 40) return { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", label: "Think carefully", border: "border-amber-200 dark:border-amber-800" };
  return { bg: "bg-red-100 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", label: "Proceed with caution", border: "border-red-200 dark:border-red-800" };
}

export function ProsConsGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveAnalysis } = useProsConsStorage();

  const [topic, setTopic] = useState("");
  const [contextPurpose, setContextPurpose] = useState("Other");
  const [extraContext, setExtraContext] = useState("");
  const [numItems, setNumItems] = useState(5);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [result, setResult] = useState<ParsedAnalysis | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setTopic("");
    setContextPurpose("Other");
    setExtraContext("");
    setNumItems(5);
    setStreamingText("");
    setResult(null);
    setCopiedAll(false);
  };

  const copyAll = async () => {
    if (!result) return;
    const prosText = result.pros.map((p, i) => `${i + 1}. ${p.item}${p.explanation ? ` - ${p.explanation}` : ""}`).join("\n");
    const consText = result.cons.map((c, i) => `${i + 1}. ${c.item}${c.explanation ? ` - ${c.explanation}` : ""}`).join("\n");
    const text = `Decision Score: ${result.score}/100\n\nPROS:\n${prosText}\n\nCONS:\n${consText}${result.recommendation ? `\n\nRecommendation: ${result.recommendation}` : ""}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setResult(null);
    setCopiedAll(false);

    const maxTokens = numItems === 5 ? 1000 : numItems === 7 ? 1200 : 1500;

    const userPrompt = `Analyze the following topic and provide a balanced pros and cons analysis.

Topic: "${topic.trim()}"
Context/Purpose: ${contextPurpose}${extraContext.trim() ? `\nAdditional Details: ${extraContext.trim()}` : ""}
Number of items: ${numItems} pros and ${numItems} cons

Format your response EXACTLY like this:

DECISION SCORE: [number from 0-100, where 100 means strongly favorable]

PROS:
1. [Pro item] - [Brief explanation]
2. [Pro item] - [Brief explanation]
... (exactly ${numItems} pros)

CONS:
1. [Con item] - [Brief explanation]
2. [Con item] - [Brief explanation]
... (exactly ${numItems} cons)

FINAL RECOMMENDATION: [A brief, balanced recommendation paragraph]`;

    try {
      const rawResult = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        maxTokens,
        onChunk: (text) => setStreamingText(text),
      });

      if (rawResult) {
        const parsed = parseAnalysis(rawResult);
        setResult(parsed);

        const record: ProsConsResult = {
          id: generateId(),
          topic: topic.trim(),
          contextPurpose,
          extraContext: extraContext.trim(),
          numberOfItems: numItems,
          decisionScore: parsed.score,
          pros: JSON.stringify(parsed.pros),
          cons: JSON.stringify(parsed.cons),
          recommendation: parsed.recommendation,
          rawText: rawResult,
          createdAt: new Date().toISOString(),
        };
        saveAnalysis(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && topic.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-pros-cons-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="pros-cons-topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Topic / Decision *
            </label>
            <input
              id="pros-cons-topic"
              data-testid="input-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 200))}
              placeholder="e.g., Electric cars, Switching careers to AI, Buying a new laptop"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-topic-char-count" className="text-xs text-slate-400">{topic.length}/200</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Context / Purpose *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" data-testid="container-context-options">
              {CONTEXT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`toggle-context-${opt.value.toLowerCase().replace(/[\/\s]/g, "-")}`}
                    onClick={() => setContextPurpose(opt.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      contextPurpose === opt.value
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 ring-1 ring-blue-200 dark:ring-blue-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="pros-cons-extra" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Extra Context <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="pros-cons-extra"
              data-testid="input-extra-context"
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value.slice(0, 500))}
              placeholder="e.g., Budget under $50k, family of 4, living in cold climate"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-extra-char-count" className="text-xs text-slate-400">{extraContext.length}/500</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Number of Items
            </label>
            <div className="flex flex-wrap gap-3" data-testid="container-num-items">
              {NUM_ITEMS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`radio-num-items-${opt.value}`}
                  onClick={() => setNumItems(opt.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    numItems === opt.value
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 ring-1 ring-blue-200 dark:ring-blue-700"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25"
                  : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Scale className="w-5 h-5" />
                  Analyze Pros & Cons
                </>
              )}
            </button>
            {(result || streamingText) && (
              <button
                data-testid="button-reset"
                onClick={handleReset}
                className="px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {isGenerating && streamingText && !result && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Analyzing topic...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <DecisionScoreGauge score={result.score} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="container-pros-cons-columns">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800" data-testid="container-pros">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">PROS</h3>
                </div>
                <ul className="space-y-3">
                  {result.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2.5" data-testid={`item-pro-${idx}`}>
                      <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100" style={{ whiteSpace: "pre-wrap" }}>
                          <span className="font-semibold">{pro.item}</span>
                          {pro.explanation && (
                            <span className="text-emerald-700 dark:text-emerald-300"> - {pro.explanation}</span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800" data-testid="container-cons">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-lg font-bold text-rose-800 dark:text-rose-200">CONS</h3>
                </div>
                <ul className="space-y-3">
                  {result.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2.5" data-testid={`item-con-${idx}`}>
                      <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-100" style={{ whiteSpace: "pre-wrap" }}>
                          <span className="font-semibold">{con.item}</span>
                          {con.explanation && (
                            <span className="text-rose-700 dark:text-rose-300"> - {con.explanation}</span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.recommendation && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" data-testid="container-recommendation">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Recommendation</h3>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed" style={{ whiteSpace: "pre-wrap" }} data-testid="text-recommendation">
                  {result.recommendation}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-start">
              <button
                data-testid="button-copy-all"
                onClick={copyAll}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
              >
                {copiedAll ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Copied All
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy All
                  </>
                )}
              </button>
              <InlineShareButtons />
              <button
                data-testid="button-regenerate"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center gap-2",
                  canGenerate
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <button
                data-testid="button-reset-bottom"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DecisionScoreGauge({ score }: { score: number }) {
  const colors = getScoreColor(score);

  return (
    <div className={cn("p-6 rounded-2xl border text-center", colors.bg, colors.border)} data-testid="container-decision-score">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Decision Score</p>
      <div className="flex items-center justify-center">
        <div className={cn("w-24 h-24 rounded-full flex items-center justify-center border-4", colors.border)}>
          <span className={cn("text-3xl font-bold", colors.text)} data-testid="text-decision-score">
            {score}
          </span>
        </div>
      </div>
      <p className={cn("text-sm font-semibold mt-3", colors.text)} data-testid="text-score-label">
        {colors.label}
      </p>
      <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden max-w-xs mx-auto">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${score}%` }}
          data-testid="bar-decision-score"
        />
      </div>
    </div>
  );
}

function EngineStatus({
  state,
  progress,
  error,
}: {
  state: string;
  progress: { text: string; percent: number };
  error: string | null;
}) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800" data-testid="container-engine-error">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">AI Engine Error</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
