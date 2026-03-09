import { useState } from "react";
import { Smile, Briefcase, Sparkles, Loader2, AlertTriangle, Copy, RefreshCw, RotateCcw, ShieldAlert } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useExcuseStorage, type ExcuseResult } from "@/hooks/use-excuse-storage";
import { Badge } from "@/components/ui/badge";

const STYLES = [
  { value: "Funny", label: "Funny", icon: Smile, description: "Playful & witty" },
  { value: "Professional", label: "Professional", icon: Briefcase, description: "Polished & believable" },
  { value: "Dramatic", label: "Dramatic", icon: Sparkles, description: "Over-the-top & theatrical" },
] as const;

const STYLE_COLORS: Record<string, { selected: string; cards: string[]; badge: string }> = {
  Funny: {
    selected: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600 ring-1 ring-amber-200 dark:ring-amber-700",
    cards: [
      "bg-amber-50 dark:bg-amber-950/30",
      "bg-orange-50 dark:bg-orange-950/30",
    ],
    badge: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
  },
  Professional: {
    selected: "bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 ring-1 ring-slate-200 dark:ring-slate-700",
    cards: [
      "bg-slate-50 dark:bg-slate-950/30",
      "bg-blue-50 dark:bg-blue-950/30",
    ],
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
  },
  Dramatic: {
    selected: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 ring-1 ring-purple-200 dark:ring-purple-700",
    cards: [
      "bg-purple-50 dark:bg-purple-950/30",
      "bg-violet-50 dark:bg-violet-950/30",
    ],
    badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
  },
};

const SYSTEM_PROMPT =
  "You are a creative comedy writer and professional excuse engineer. You create short, believable, and clever excuses that sound natural and human. You adapt perfectly to the requested style (Funny, Professional, or Dramatic) while keeping everything light-hearted and non-offensive. Your excuses are always concise, witty when appropriate, and ready to copy-paste.";

function parseExcuses(raw: string): string[] {
  const markerMatch = raw.match(
    /EXCUSE\s*#?\s*1[:\s]*([\s\S]*?)EXCUSE\s*#?\s*2[:\s]*([\s\S]*?)EXCUSE\s*#?\s*3[:\s]*([\s\S]*?)EXCUSE\s*#?\s*4[:\s]*([\s\S]*?)EXCUSE\s*#?\s*5[:\s]*([\s\S]*)/i
  );
  if (markerMatch) {
    return [
      markerMatch[1].trim(),
      markerMatch[2].trim(),
      markerMatch[3].trim(),
      markerMatch[4].trim(),
      markerMatch[5].trim(),
    ].filter(Boolean);
  }

  const numberedMatch = raw.match(
    /(?:^|\n)\s*1[\.\):\s]+([\s\S]*?)(?:\n\s*2[\.\):\s]+)([\s\S]*?)(?:\n\s*3[\.\):\s]+)([\s\S]*?)(?:\n\s*4[\.\):\s]+)([\s\S]*?)(?:\n\s*5[\.\):\s]+)([\s\S]*)/m
  );
  if (numberedMatch) {
    return [
      numberedMatch[1].trim(),
      numberedMatch[2].trim(),
      numberedMatch[3].trim(),
      numberedMatch[4].trim(),
      numberedMatch[5].trim(),
    ].filter(Boolean);
  }

  const lines = raw
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[\d\-\*]+[\.\):\s]*/, "").trim())
    .filter((l) => l.length > 10);
  if (lines.length >= 5) return lines.slice(0, 5);
  if (lines.length > 0) return lines;

  return [raw.trim()];
}

export function ExcuseGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveExcuse } = useExcuseStorage();

  const [situation, setSituation] = useState("");
  const [style, setStyle] = useState("Funny");
  const [details, setDetails] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [excuses, setExcuses] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setSituation("");
    setStyle("Funny");
    setDetails("");
    setStreamingText("");
    setExcuses([]);
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
      await navigator.clipboard.writeText(excuses.join("\n\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setExcuses([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const detailsBlock = details.trim()
      ? `\nIMPORTANT CONTEXT — every excuse MUST directly reference this: "${details.trim()}"\nDo NOT write generic excuses. Each one must specifically mention or relate to the context above.`
      : "";

    const userPrompt = `Write exactly 5 excuses for this situation: "${situation.trim()}"
Style: ${style}${detailsBlock}

Rules:
- Each excuse must be 1-2 sentences, natural, and clever.
- Adapt the language to suit the ${style} style perfectly.${details.trim() ? "\n- Every excuse MUST specifically reference the context provided. Generic excuses that ignore the context are NOT acceptable." : ""}
- Format your response EXACTLY like this:

EXCUSE #1: [excuse text here]

EXCUSE #2: [excuse text here]

EXCUSE #3: [excuse text here]

EXCUSE #4: [excuse text here]

EXCUSE #5: [excuse text here]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 500,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseExcuses(result);
        setExcuses(parsed);

        const record: ExcuseResult = {
          id: generateId(),
          situation: situation.trim(),
          style,
          extraDetails: details.trim(),
          excuses: parsed.join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveExcuse(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && !isGenerating && situation.trim().length > 0;
  const colors = STYLE_COLORS[style] || STYLE_COLORS.Funny;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-excuse-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="excuse-situation" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              What happened? *
            </label>
            <input
              id="excuse-situation"
              type="text"
              data-testid="input-situation"
              value={situation}
              onChange={(e) => setSituation(e.target.value.slice(0, 200))}
              placeholder="e.g., Missed the team meeting, Forgot my partner's birthday, Late on assignment"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-situation-char-count" className="text-xs text-slate-400">{situation.length}/200</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Excuse Style *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" data-testid="container-style">
              {STYLES.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.value}
                    data-testid={`toggle-style-${s.value.toLowerCase()}`}
                    onClick={() => setStyle(s.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      style === s.value
                        ? colors.selected
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">{s.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{s.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="excuse-details" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Extra Details <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="excuse-details"
              data-testid="input-details"
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, 300))}
              placeholder="e.g., It's my boss's meeting, I was supposed to bring cake"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-details-char-count" className="text-xs text-slate-400">{details.length}/300</span>
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
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25"
                  : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  Generate Excuses
                </>
              )}
            </button>
            {(excuses.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && !excuses.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating excuses...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {excuses.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="space-y-4">
              {excuses.map((excuse, idx) => (
                <div
                  key={idx}
                  data-testid={`card-excuse-${idx}`}
                  className={cn(
                    "relative p-5 rounded-2xl border border-slate-200 dark:border-slate-700",
                    colors.cards[idx % colors.cards.length]
                  )}
                >
                  <div className="mb-2">
                    <Badge variant="secondary" className={cn("text-xs no-default-hover-elevate no-default-active-elevate", colors.badge)} data-testid={`badge-style-${idx}`}>
                      {style}
                    </Badge>
                  </div>
                  <p
                    className="text-slate-800 dark:text-slate-100 text-base leading-relaxed"
                    style={{ whiteSpace: "pre-wrap" }}
                    data-testid={`text-excuse-${idx}`}
                  >
                    {excuse}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      data-testid={`button-copy-excuse-${idx}`}
                      onClick={() => copyToClipboard(excuse, idx)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Copy className="w-3.5 h-3.5 text-green-500" />
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
                data-testid="button-generate-more"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center gap-2",
                  canGenerate
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Generate More
              </button>
              <button
                data-testid="button-copy-all"
                onClick={copyAll}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
              >
                {copiedAll ? (
                  <>
                    <Copy className="w-4 h-4 text-green-500" />
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
    <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-amber-100 dark:bg-amber-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
