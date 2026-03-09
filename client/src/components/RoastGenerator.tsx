import { useState } from "react";
import { Flame, Smile, Zap, Loader2, AlertTriangle, Copy, CheckCircle2, RefreshCw, RotateCcw } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useRoastStorage, type RoastResult } from "@/hooks/use-roast-storage";

const ROAST_LEVELS = [
  { value: "light", label: "Light", icon: Smile, description: "Playful & safe" },
  { value: "medium", label: "Medium", icon: Flame, description: "Witty & cheeky" },
  { value: "savage", label: "Savage", icon: Zap, description: "No mercy -- still clean" },
] as const;

const SYSTEM_PROMPT =
  "You are a world-class stand-up comedian and roast master. Your roasts are clever, creative, playful, and never mean-spirited or offensive. You use wordplay, exaggeration, and relatable humor. Keep every roast short (1-2 sentences), punchy, and extremely shareable.";

function parseRoasts(raw: string): string[] {
  const markerMatch = raw.match(/ROAST\s*#?\s*1[:\s]*([\s\S]*?)ROAST\s*#?\s*2[:\s]*([\s\S]*?)ROAST\s*#?\s*3[:\s]*([\s\S]*)/i);
  if (markerMatch) {
    return [markerMatch[1].trim(), markerMatch[2].trim(), markerMatch[3].trim()].filter(Boolean);
  }

  const numberedMatch = raw.match(/(?:^|\n)\s*1[\.\):\s]+([\s\S]*?)(?:\n\s*2[\.\):\s]+)([\s\S]*?)(?:\n\s*3[\.\):\s]+)([\s\S]*)/m);
  if (numberedMatch) {
    return [numberedMatch[1].trim(), numberedMatch[2].trim(), numberedMatch[3].trim()].filter(Boolean);
  }

  const lines = raw
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[\d\-\*]+[\.\):\s]*/, "").trim())
    .filter((l) => l.length > 10);
  if (lines.length >= 3) return lines.slice(0, 3);
  if (lines.length > 0) return lines;

  return [raw.trim()];
}

const CARD_COLORS = [
  "bg-orange-50 dark:bg-orange-950/30",
  "bg-red-50 dark:bg-red-950/30",
  "bg-amber-50 dark:bg-amber-950/30",
];

export function RoastGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveRoast } = useRoastStorage();

  const [name, setName] = useState("");
  const [level, setLevel] = useState("medium");
  const [context, setContext] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [roasts, setRoasts] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setName("");
    setLevel("medium");
    setContext("");
    setStreamingText("");
    setRoasts([]);
    setCopiedIdx(null);
    setCopiedAll(false);
  };

  const copyToClipboard = async (text: string, idx?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (idx !== undefined) {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
      }
    } catch {}
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(roasts.join("\n\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setRoasts([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const levelLabel = ROAST_LEVELS.find((l) => l.value === level)?.label || "Medium";

    const contextBlock = context.trim()
      ? `\nIMPORTANT CONTEXT — every roast MUST directly reference this: "${context.trim()}"\nDo NOT write generic roasts. Each one must specifically use the context above for targeted humor.`
      : "";

    const userPrompt = `Write exactly 3 roasts about "${name.trim()}".
Roast Level: ${levelLabel}${contextBlock}

Rules:
- Each roast must be 1-2 sentences, punchy, and shareable.
- ${level === "light" ? "Keep it playful and safe for all audiences." : level === "savage" ? "Go hard but stay clean -- no profanity, slurs, or truly hurtful content." : "Be witty and cheeky, but not cruel."}${context.trim() ? "\n- Every roast MUST specifically reference the context provided. Generic roasts that ignore the context are NOT acceptable." : ""}
- Format your response EXACTLY like this:

ROAST #1: [roast text here]

ROAST #2: [roast text here]

ROAST #3: [roast text here]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 400,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseRoasts(result);
        setRoasts(parsed);

        const record: RoastResult = {
          id: generateId(),
          nameOrTopic: name.trim(),
          roastLevel: level,
          context: context.trim(),
          roasts: parsed.join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveRoast(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && name.trim().length > 0 && !isGenerating;
  const levelIdx = ROAST_LEVELS.findIndex((l) => l.value === level);
  const flameCount = levelIdx + 1;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-roast-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="roast-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Name or Topic *
            </label>
            <input
              id="roast-name"
              data-testid="input-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 100))}
              placeholder="e.g., Alex, my boss, my dating profile"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-name-char-count" className="text-xs text-slate-400">{name.length}/100</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Roast Level *
            </label>
            <div className="grid grid-cols-3 gap-2" data-testid="container-roast-level">
              {ROAST_LEVELS.map((rl) => {
                const Icon = rl.icon;
                return (
                  <button
                    key={rl.value}
                    data-testid={`toggle-level-${rl.value}`}
                    onClick={() => setLevel(rl.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      level === rl.value
                        ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600 ring-1 ring-orange-200 dark:ring-orange-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">{rl.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{rl.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="roast-context" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Add Context <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="roast-context"
              data-testid="input-context"
              value={context}
              onChange={(e) => setContext(e.target.value.slice(0, 300))}
              placeholder="e.g., He's a software engineer who always misses deadlines"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-context-char-count" className="text-xs text-slate-400">{context.length}/300</span>
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
                  ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/25"
                  : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Roasting...
                </>
              ) : (
                <>
                  <Flame className="w-5 h-5" />
                  Generate Roasts
                </>
              )}
            </button>
            {(roasts.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && !roasts.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating roasts...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {roasts.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div data-testid="container-roast-meter">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Roast Meter</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <Flame
                      key={i}
                      className={cn(
                        "w-5 h-5 transition-colors",
                        i <= flameCount
                          ? "text-orange-500 fill-orange-500"
                          : "text-slate-300 dark:text-slate-600"
                      )}
                      data-testid={`icon-flame-${i}`}
                    />
                  ))}
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500"
                  style={{ width: `${(flameCount / 3) * 100}%` }}
                  data-testid="bar-roast-meter"
                />
              </div>
            </div>

            <div className="space-y-4">
              {roasts.map((roast, idx) => (
                <div
                  key={idx}
                  data-testid={`card-roast-${idx}`}
                  className={cn(
                    "relative p-5 rounded-2xl border border-slate-200 dark:border-slate-700",
                    CARD_COLORS[idx] || CARD_COLORS[0]
                  )}
                >
                  <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 border-l border-t border-slate-200 dark:border-slate-700"
                    style={{ backgroundColor: "inherit" }}
                  />
                  <p
                    className="text-slate-800 dark:text-slate-100 text-base leading-relaxed"
                    style={{ whiteSpace: "pre-wrap" }}
                    data-testid={`text-roast-${idx}`}
                  >
                    {roast}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      data-testid={`button-copy-roast-${idx}`}
                      onClick={() => copyToClipboard(roast, idx)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-start">
              <button
                data-testid="button-roast-again"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center gap-2",
                  canGenerate
                    ? "bg-gradient-to-r from-orange-500 to-red-500"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Roast Again
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
    <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
        <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-orange-100 dark:bg-orange-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
