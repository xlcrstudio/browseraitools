import { useState } from "react";
import { Heart, Users, Briefcase, UserPlus, Sparkles, Smile, TrendingUp, Loader2, AlertTriangle, Copy, RefreshCw, RotateCcw } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useComplimentStorage, type ComplimentResult } from "@/hooks/use-compliment-storage";

const RECIPIENTS = [
  { value: "Friend", label: "Friend", icon: Users },
  { value: "Partner/Loved One", label: "Partner/Loved One", icon: Heart },
  { value: "Coworker/Boss", label: "Coworker/Boss", icon: Briefcase },
  { value: "Stranger/New Friend", label: "Stranger/New Friend", icon: UserPlus },
  { value: "Yourself", label: "Yourself", icon: Sparkles },
] as const;

const TONES = [
  { value: "Heartfelt", label: "Heartfelt", icon: Heart, description: "Warm & sincere" },
  { value: "Funny", label: "Funny", icon: Smile, description: "Playful & light" },
  { value: "Professional", label: "Professional", icon: Briefcase, description: "Polished & respectful" },
  { value: "Flirty", label: "Flirty", icon: Sparkles, description: "Fun & charming" },
  { value: "Motivational", label: "Motivational", icon: TrendingUp, description: "Uplifting & empowering" },
] as const;

const SYSTEM_PROMPT =
  "You are a warm, positive, and highly skilled communicator who specializes in genuine compliments. Your compliments feel natural, sincere, and uplifting. You never sound cheesy or over-the-top. You adapt perfectly to the recipient and tone while keeping everything respectful and heartfelt.";

const CARD_COLORS = [
  "bg-pink-50 dark:bg-pink-950/30",
  "bg-rose-50 dark:bg-rose-950/30",
  "bg-purple-50 dark:bg-purple-950/30",
  "bg-violet-50 dark:bg-violet-950/30",
  "bg-fuchsia-50 dark:bg-fuchsia-950/30",
];

function parseCompliments(raw: string): string[] {
  const markerMatch = raw.match(
    /COMPLIMENT\s*#?\s*1[:\s]*([\s\S]*?)COMPLIMENT\s*#?\s*2[:\s]*([\s\S]*?)COMPLIMENT\s*#?\s*3[:\s]*([\s\S]*?)COMPLIMENT\s*#?\s*4[:\s]*([\s\S]*?)COMPLIMENT\s*#?\s*5[:\s]*([\s\S]*)/i
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

export function ComplimentGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveCompliment } = useComplimentStorage();

  const [recipient, setRecipient] = useState("Friend");
  const [tone, setTone] = useState("Heartfelt");
  const [context, setContext] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [compliments, setCompliments] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setRecipient("Friend");
    setTone("Heartfelt");
    setContext("");
    setStreamingText("");
    setCompliments([]);
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
      await navigator.clipboard.writeText(compliments.join("\n\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setCompliments([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const userPrompt = `Write exactly 5 compliments for a ${recipient}.
Tone: ${tone}${context.trim() ? `\nContext: ${context.trim()}` : ""}

Rules:
- Each compliment must be 1-2 sentences, natural, and uplifting.
- Adapt the language to suit the recipient and tone perfectly.
- Format your response EXACTLY like this:

COMPLIMENT #1: [compliment text here]

COMPLIMENT #2: [compliment text here]

COMPLIMENT #3: [compliment text here]

COMPLIMENT #4: [compliment text here]

COMPLIMENT #5: [compliment text here]`;

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
        const parsed = parseCompliments(result);
        setCompliments(parsed);

        const record: ComplimentResult = {
          id: generateId(),
          recipient,
          tone,
          context: context.trim(),
          compliments: parsed.join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveCompliment(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-compliment-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Who is this compliment for? *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" data-testid="container-recipient">
              {RECIPIENTS.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    data-testid={`toggle-recipient-${r.value.toLowerCase().replace(/[\s\/]+/g, "-")}`}
                    onClick={() => setRecipient(r.value)}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      recipient === r.value
                        ? "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-600 ring-1 ring-pink-200 dark:ring-pink-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-semibold leading-tight">{r.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Tone *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" data-testid="container-tone">
              {TONES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    data-testid={`toggle-tone-${t.value.toLowerCase()}`}
                    onClick={() => setTone(t.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      tone === t.value
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 ring-1 ring-purple-200 dark:ring-purple-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">{t.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{t.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="compliment-context" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Specific Context <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="compliment-context"
              data-testid="input-context"
              value={context}
              onChange={(e) => setContext(e.target.value.slice(0, 300))}
              placeholder="e.g., They just finished a big project, They always make me laugh, It's their birthday"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all resize-none"
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
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/25"
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
                  <Heart className="w-5 h-5" />
                  Generate Compliments
                </>
              )}
            </button>
            {(compliments.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && !compliments.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating compliments...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {compliments.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="space-y-4">
              {compliments.map((compliment, idx) => (
                <div
                  key={idx}
                  data-testid={`card-compliment-${idx}`}
                  className={cn(
                    "relative p-5 rounded-2xl border border-slate-200 dark:border-slate-700",
                    CARD_COLORS[idx % CARD_COLORS.length]
                  )}
                >
                  <p
                    className="text-slate-800 dark:text-slate-100 text-base leading-relaxed"
                    style={{ whiteSpace: "pre-wrap" }}
                    data-testid={`text-compliment-${idx}`}
                  >
                    {compliment}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button
                      data-testid={`button-copy-compliment-${idx}`}
                      onClick={() => copyToClipboard(compliment, idx)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
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
                    ? "bg-gradient-to-r from-pink-500 to-purple-500"
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
                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
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
    <div className="mb-6 p-4 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
        <span className="text-sm font-semibold text-pink-700 dark:text-pink-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-pink-100 dark:bg-pink-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-pink-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-pink-600 dark:text-pink-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
