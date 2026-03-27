import { useState } from "react";
import {
  Scale,
  BarChart3,
  Target,
  Plus,
  X,
  Loader2,
  AlertTriangle,
  Copy,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useDecisionStorage, type DecisionResult } from "@/hooks/use-decision-storage";
import { Badge } from "@/components/ui/badge";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const SYSTEM_PROMPT =
  "You are a rational, objective decision advisor and analyst. You evaluate options logically, fairly, and without bias. You provide clear pros and cons for each option, assign balanced scores based on typical real-world priorities, and give a final recommendation with transparent reasoning. You always remain neutral until the final recommendation step.";

interface ParsedOption {
  name: string;
  score: number;
  pros: string[];
  cons: string[];
}

interface ParsedDecision {
  confidence: number;
  options: ParsedOption[];
  recommendation: string;
  reasoning: string;
}

function parseDecision(raw: string): ParsedDecision | null {
  let confidence = 50;
  const confidenceMatch = raw.match(/CONFIDENCE(?:\s*SCORE)?\s*:\s*(\d+)/i);
  if (confidenceMatch) {
    confidence = Math.min(100, Math.max(0, parseInt(confidenceMatch[1], 10)));
  }

  const options: ParsedOption[] = [];
  const optionBlocks = raw.split(/OPTION\s*(?:\d+\s*)?:\s*/i).slice(1);

  for (const block of optionBlocks) {
    const lines = block.trim();
    const nameMatch = lines.match(/^(.+?)(?:\n|$)/);
    let name = nameMatch ? nameMatch[1].trim() : "Unknown";
    name = name.replace(/^\*+|\*+$/g, "").trim();

    let score = 50;
    const scoreMatch = lines.match(/(?:OVERALL\s*)?SCORE\s*:\s*(\d+)/i);
    if (scoreMatch) {
      score = Math.min(100, Math.max(0, parseInt(scoreMatch[1], 10)));
    }

    let pros: string[] = [];
    const prosMatch = lines.match(/PROS\s*:\s*([\s\S]*?)(?=CONS\s*:|$)/i);
    if (prosMatch) {
      pros = prosMatch[1]
        .split(/\n/)
        .map((l) => l.replace(/^\s*[-\*\+\d.)\]]\s*/, "").trim())
        .filter((l) => l.length > 2);
    }

    let cons: string[] = [];
    const consMatch = lines.match(/CONS\s*:\s*([\s\S]*?)(?=OPTION\s*(?:\d+\s*)?:|(?:FINAL\s*)?RECOMMENDATION\s*:|$)/i);
    if (consMatch) {
      cons = consMatch[1]
        .split(/\n/)
        .map((l) => l.replace(/^\s*[-\*\+\d.)\]]\s*/, "").trim())
        .filter((l) => l.length > 2);
    }

    options.push({ name, score, pros, cons });
  }

  let recommendation = "";
  const recMatch = raw.match(/(?:FINAL\s*)?RECOMMENDATION\s*:\s*(.+?)(?:\n|$)/i);
  if (recMatch) {
    recommendation = recMatch[1].trim();
  }

  let reasoning = "";
  const reasonMatch = raw.match(/REASONING\s*:\s*([\s\S]*?)$/i);
  if (reasonMatch) {
    reasoning = reasonMatch[1].trim();
  }

  if (options.length === 0) return null;

  return { confidence, options, recommendation, reasoning };
}

function getScoreColor(score: number) {
  if (score >= 75) return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300";
  if (score >= 50) return "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300";
  if (score >= 25) return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
  return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 75) return "bg-emerald-500";
  if (confidence >= 50) return "bg-amber-500";
  if (confidence >= 25) return "bg-orange-500";
  return "bg-red-500";
}

function getConfidenceBorderColor(confidence: number) {
  if (confidence >= 75) return "border-emerald-300 dark:border-emerald-700";
  if (confidence >= 50) return "border-amber-300 dark:border-amber-700";
  if (confidence >= 25) return "border-orange-300 dark:border-orange-700";
  return "border-red-300 dark:border-red-700";
}

function getConfidenceBgColor(confidence: number) {
  if (confidence >= 75) return "bg-emerald-50 dark:bg-emerald-950/30";
  if (confidence >= 50) return "bg-amber-50 dark:bg-amber-950/30";
  if (confidence >= 25) return "bg-orange-50 dark:bg-orange-950/30";
  return "bg-red-50 dark:bg-red-950/30";
}

function getConfidenceTextColor(confidence: number) {
  if (confidence >= 75) return "text-emerald-700 dark:text-emerald-300";
  if (confidence >= 50) return "text-amber-700 dark:text-amber-300";
  if (confidence >= 25) return "text-orange-700 dark:text-orange-300";
  return "text-red-700 dark:text-red-300";
}

export function DecisionGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveDecision } = useDecisionStorage();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [extraContext, setExtraContext] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [result, setResult] = useState<ParsedDecision | null>(null);
  const [rawFallback, setRawFallback] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setQuestion("");
    setOptions(["", ""]);
    setExtraContext("");
    setStreamingText("");
    setResult(null);
    setRawFallback(null);
    setCopiedAll(false);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const updateOption = (idx: number, value: string) => {
    const updated = [...options];
    updated[idx] = value.slice(0, 100);
    setOptions(updated);
  };

  const copyAll = async () => {
    if (!result) return;
    const lines: string[] = [];
    lines.push(`Decision Confidence: ${result.confidence}%`);
    lines.push("");
    for (const opt of result.options) {
      lines.push(`${opt.name} (Score: ${opt.score}/100)`);
      lines.push("Pros:");
      opt.pros.forEach((p) => lines.push(`  + ${p}`));
      lines.push("Cons:");
      opt.cons.forEach((c) => lines.push(`  - ${c}`));
      lines.push("");
    }
    if (result.recommendation) {
      lines.push(`Recommendation: ${result.recommendation}`);
    }
    if (result.reasoning) {
      lines.push(`Reasoning: ${result.reasoning}`);
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    if (!question.trim()) return;
    const filledOptions = options.filter((o) => o.trim().length > 0);
    if (filledOptions.length < 2) return;

    setIsGenerating(true);
    setStreamingText("");
    setResult(null);
    setRawFallback(null);
    setCopiedAll(false);

    const numberedOptions = filledOptions.map((o, i) => `${i + 1}. ${o.trim()}`).join("\n");

    const contextBlock = extraContext.trim()
      ? `\nIMPORTANT CONTEXT that MUST influence your analysis: ${extraContext.trim()}`
      : "";

    const userPrompt = `Analyze this decision objectively.
DECISION: ${question.trim()}
OPTIONS:
${numberedOptions}${contextBlock}

Rules:
- Give 3-4 pros and 3-4 cons for EACH option (1 short sentence each)
- Consider the context provided when scoring
- Score each option 0-100 based on overall merit
- Give a final confidence percentage (0-100) for how clear the recommendation is
- Higher confidence = one option clearly stands out; lower = close call

FORMAT YOUR RESPONSE EXACTLY:
CONFIDENCE: [number]

OPTION: [option name]
SCORE: [number]
PROS:
- [pro 1]
- [pro 2]
- [pro 3]
CONS:
- [con 1]
- [con 2]
- [con 3]

[repeat for each option]

RECOMMENDATION: [option name]
REASONING: [2-3 sentences explaining why]`;

    try {
      const rawResult = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        maxTokens: 800,
        onChunk: (text) => setStreamingText(text),
      });

      if (rawResult) {
        const parsed = parseDecision(rawResult);
        if (parsed) {
          setResult(parsed);

          const record: DecisionResult = {
            id: generateId(),
            question: question.trim(),
            options: JSON.stringify(filledOptions),
            extraContext: extraContext.trim(),
            confidenceScore: parsed.confidence,
            optionAnalyses: JSON.stringify(parsed.options),
            recommendation: parsed.recommendation + (parsed.reasoning ? `\n${parsed.reasoning}` : ""),
            rawText: rawResult,
            createdAt: new Date().toISOString(),
          };
          saveDecision(record);
        } else {
          setRawFallback(rawResult);
        }
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const filledCount = options.filter((o) => o.trim().length > 0).length;
  const canGenerate = state === "ready" && question.trim().length > 0 && filledCount >= 2 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-decision-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="decision-question" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Decision Question *
            </label>
            <input
              id="decision-question"
              data-testid="input-question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 200))}
              placeholder="e.g., Should I buy an electric car? Which job offer should I accept?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-question-char-count" className="text-xs text-slate-400">{question.length}/200</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Options *
            </label>
            <div className="space-y-2" data-testid="container-options">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    data-testid={`input-option-${idx}`}
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    maxLength={100}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  />
                  {options.length > 2 && (
                    <button
                      data-testid={`button-remove-option-${idx}`}
                      onClick={() => removeOption(idx)}
                      className="p-2 rounded-xl text-slate-400 dark:text-slate-500 transition-colors"
                      aria-label={`Remove option ${idx + 1}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 5 && (
              <button
                data-testid="button-add-option"
                onClick={addOption}
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            )}
          </div>

          <div>
            <label htmlFor="decision-context" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Extra Context <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="decision-context"
              data-testid="input-extra-context"
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value.slice(0, 400))}
              placeholder="e.g., Budget $45k max, daily commute 40 miles, family of 4"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-context-char-count" className="text-xs text-slate-400">{extraContext.length}/400</span>
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
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25"
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
                  Analyze Decision
                </>
              )}
            </button>
            {(result || rawFallback || streamingText) && (
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
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Analyzing decision...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {rawFallback && !result && (
          <div className="mt-8" data-testid="container-fallback">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Analysis Result</h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed" style={{ whiteSpace: "pre-wrap" }} data-testid="text-fallback">
                {rawFallback}
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <ConfidenceGauge confidence={result.confidence} />

            <div className="space-y-4" data-testid="container-option-cards">
              {result.options.map((opt, idx) => {
                const isRecommended = result.recommendation.toLowerCase().includes(opt.name.toLowerCase());
                return (
                  <div
                    key={idx}
                    data-testid={`card-option-${idx}`}
                    className={cn(
                      "p-5 rounded-2xl border transition-all",
                      isRecommended
                        ? "border-indigo-300 dark:border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100" data-testid={`text-option-name-${idx}`}>
                        {opt.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs no-default-hover-elevate no-default-active-elevate", getScoreColor(opt.score))}
                        data-testid={`badge-score-${idx}`}
                      >
                        <Target className="w-3 h-3 mr-1" />
                        {opt.score}/100
                      </Badge>
                      {isRecommended && (
                        <Badge
                          variant="secondary"
                          className="text-xs no-default-hover-elevate no-default-active-elevate bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                          data-testid={`badge-recommended-${idx}`}
                        >
                          <Trophy className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800" data-testid={`container-pros-${idx}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Pros</span>
                        </div>
                        <ul className="space-y-2">
                          {opt.pros.map((pro, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2" data-testid={`item-pro-${idx}-${pIdx}`}>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-emerald-900 dark:text-emerald-100" style={{ whiteSpace: "pre-wrap" }}>
                                {pro}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800" data-testid={`container-cons-${idx}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          <span className="text-sm font-semibold text-rose-800 dark:text-rose-200">Cons</span>
                        </div>
                        <ul className="space-y-2">
                          {opt.cons.map((con, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2" data-testid={`item-con-${idx}-${cIdx}`}>
                              <XCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                              <p className="text-sm text-rose-900 dark:text-rose-100" style={{ whiteSpace: "pre-wrap" }}>
                                {con}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {result.recommendation && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800" data-testid="container-recommendation">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
                    Recommended: {result.recommendation}
                  </h3>
                </div>
                {result.reasoning && (
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed" style={{ whiteSpace: "pre-wrap" }} data-testid="text-reasoning">
                    {result.reasoning}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-start">
              <button
                data-testid="button-regenerate"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center gap-2",
                  canGenerate
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Re-analyze
              </button>
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

function ConfidenceGauge({ confidence }: { confidence: number }) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl border text-center",
        getConfidenceBgColor(confidence),
        getConfidenceBorderColor(confidence)
      )}
      data-testid="container-confidence-gauge"
    >
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Decision Confidence</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">How clear-cut this decision is</p>
      <div className="flex items-center justify-center">
        <div className={cn("w-24 h-24 rounded-full flex items-center justify-center border-4", getConfidenceBorderColor(confidence))}>
          <span className={cn("text-3xl font-bold", getConfidenceTextColor(confidence))} data-testid="text-confidence-score">
            {confidence}
          </span>
        </div>
      </div>
      <div className="mt-4 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden max-w-xs mx-auto">
        <div
          className={cn("h-full rounded-full transition-all duration-700", getConfidenceColor(confidence))}
          style={{ width: `${confidence}%` }}
          data-testid="bar-confidence"
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
    <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-indigo-100 dark:bg-indigo-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
