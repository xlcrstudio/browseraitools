import { useState } from "react";
import {
  Megaphone, Code, PenTool, Palette, Target, Search, Sparkles,
  Loader2, AlertTriangle, Copy, CheckCircle2, RefreshCw, RotateCcw, Zap, FileText, Layers
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { usePromptStorage, type PromptResult } from "@/hooks/use-prompt-storage";

const PURPOSES = [
  { value: "Marketing", icon: Megaphone },
  { value: "Coding", icon: Code },
  { value: "Writing", icon: PenTool },
  { value: "Art/Image", icon: Palette },
  { value: "Strategy", icon: Target },
  { value: "Research", icon: Search },
  { value: "General", icon: Sparkles },
] as const;

const OUTPUT_TYPES = [
  "Blog post", "Code", "Image prompt", "Strategy document", "Content plan",
  "Email", "Script", "Social media post", "Report", "Other",
] as const;

const SYSTEM_PROMPT =
  "You are an expert prompt engineer who has created thousands of high-performance prompts for ChatGPT, Claude, and Midjourney. You understand role-playing, chain-of-thought, structured output, few-shot examples, and all advanced techniques that get 10x better results.";

interface ParsedPrompt {
  label: string;
  text: string;
}

function parsePrompts(raw: string): ParsedPrompt[] {
  const markerMatch = raw.match(
    /SHORT\s*PROMPT[:\s]*([\s\S]*?)DETAILED\s*PROMPT[:\s]*([\s\S]*?)EXPERT\s*PROMPT[:\s]*([\s\S]*)/i
  );
  if (markerMatch) {
    return [
      { label: "Short", text: markerMatch[1].trim() },
      { label: "Detailed", text: markerMatch[2].trim() },
      { label: "Expert", text: markerMatch[3].trim() },
    ].filter((p) => p.text.length > 0);
  }

  const numberedMatch = raw.match(
    /(?:^|\n)\s*1[\.\):\s]+([\s\S]*?)(?:\n\s*2[\.\):\s]+)([\s\S]*?)(?:\n\s*3[\.\):\s]+)([\s\S]*)/m
  );
  if (numberedMatch) {
    return [
      { label: "Short", text: numberedMatch[1].trim() },
      { label: "Detailed", text: numberedMatch[2].trim() },
      { label: "Expert", text: numberedMatch[3].trim() },
    ].filter((p) => p.text.length > 0);
  }

  const lines = raw
    .split(/\n\n+/)
    .map((l) => l.replace(/^\s*[\d\-\*]+[\.\):\s]*/, "").trim())
    .filter((l) => l.length > 10);
  if (lines.length >= 3) {
    return [
      { label: "Short", text: lines[0] },
      { label: "Detailed", text: lines[1] },
      { label: "Expert", text: lines[2] },
    ];
  }

  return [{ label: "Short", text: raw.trim() }];
}

const CARD_STYLES: Record<string, { bg: string; badge: string; icon: typeof Zap }> = {
  Short: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    badge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    icon: Zap,
  },
  Detailed: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    icon: FileText,
  },
  Expert: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
    icon: Layers,
  },
};

const STRENGTH: Record<string, { label: string; percent: number }> = {
  Short: { label: "Basic", percent: 33 },
  Detailed: { label: "Strong", percent: 66 },
  Expert: { label: "Maximum", percent: 100 },
};

export function PromptGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { savePrompt } = usePromptStorage();

  const [purpose, setPurpose] = useState("General");
  const [topic, setTopic] = useState("");
  const [outputType, setOutputType] = useState("Blog post");
  const [extraDetails, setExtraDetails] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [prompts, setPrompts] = useState<ParsedPrompt[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setPurpose("General");
    setTopic("");
    setOutputType("Blog post");
    setExtraDetails("");
    setStreamingText("");
    setPrompts([]);
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
      const allText = prompts.map((p) => `[${p.label}]\n${p.text}`).join("\n\n---\n\n");
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setPrompts([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const userPrompt = `Create exactly 3 prompts for the following request.

Purpose: ${purpose}
Topic: ${topic.trim()}
Desired Output Type: ${outputType}${extraDetails.trim() ? `\nExtra Details: ${extraDetails.trim()}` : ""}

Generate three versions of a prompt that a user can copy-paste into any AI chatbot:

SHORT PROMPT: A concise, direct prompt (2-3 sentences max).

DETAILED PROMPT: A thorough prompt with context, constraints, and structure (1-2 paragraphs).

EXPERT PROMPT: An advanced prompt using role-playing, chain-of-thought, structured output, and expert techniques for maximum quality.

Format your response EXACTLY like this:

SHORT PROMPT: [prompt text here]

DETAILED PROMPT: [prompt text here]

EXPERT PROMPT: [prompt text here]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 1000,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parsePrompts(result);
        setPrompts(parsed);

        const record: PromptResult = {
          id: generateId(),
          purpose,
          topic: topic.trim(),
          outputType,
          extraDetails: extraDetails.trim(),
          prompts: parsed.map((p) => `[${p.label}] ${p.text}`).join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        savePrompt(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && topic.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-prompt-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Prompt Purpose *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2" data-testid="container-purpose">
              {PURPOSES.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.value}
                    data-testid={`toggle-purpose-${p.value.toLowerCase().replace("/", "-")}`}
                    onClick={() => setPurpose(p.value)}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all flex flex-col items-center gap-1.5",
                      purpose === p.value
                        ? "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-600 ring-1 ring-violet-200 dark:ring-violet-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-semibold">{p.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="prompt-topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Topic *
            </label>
            <input
              id="prompt-topic"
              data-testid="input-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 200))}
              placeholder="e.g., Write a landing page for a SaaS product, Build a REST API in Python"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-topic-char-count" className="text-xs text-slate-400">{topic.length}/200</span>
            </div>
          </div>

          <div>
            <label htmlFor="prompt-output-type" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Desired Output Type *
            </label>
            <select
              id="prompt-output-type"
              data-testid="select-output-type"
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            >
              {OUTPUT_TYPES.map((ot) => (
                <option key={ot} value={ot}>{ot}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prompt-extra-details" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Extra Details <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="prompt-extra-details"
              data-testid="input-extra-details"
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value.slice(0, 500))}
              placeholder="e.g., tone, length, examples, constraints, target audience"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-details-char-count" className="text-xs text-slate-400">{extraDetails.length}/500</span>
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
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25"
                  : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Prompts...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Prompts
                </>
              )}
            </button>
            {(prompts.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && !prompts.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating prompts...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {prompts.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {prompts.map((prompt, idx) => {
                const style = CARD_STYLES[prompt.label] || CARD_STYLES["Short"];
                const strength = STRENGTH[prompt.label] || STRENGTH["Short"];
                const CardIcon = style.icon;
                return (
                  <div
                    key={idx}
                    data-testid={`card-prompt-${idx}`}
                    className={cn(
                      "relative p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col",
                      style.bg
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <span
                        data-testid={`badge-prompt-${idx}`}
                        className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold", style.badge)}
                      >
                        <CardIcon className="w-3.5 h-3.5" />
                        {prompt.label}
                      </span>
                      <div className="flex items-center gap-1.5" data-testid={`strength-prompt-${idx}`}>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{strength.label}</span>
                        <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all duration-500"
                            style={{ width: `${strength.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p
                      className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed flex-1"
                      style={{ whiteSpace: "pre-wrap" }}
                      data-testid={`text-prompt-${idx}`}
                    >
                      {prompt.text}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        data-testid={`button-copy-prompt-${idx}`}
                        onClick={() => copyToClipboard(prompt.text, idx)}
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
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 justify-start">
              <button
                data-testid="button-regenerate"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all flex items-center gap-2",
                  canGenerate
                    ? "bg-gradient-to-r from-violet-500 to-purple-600"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
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
    <div className="mb-6 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
        <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-violet-100 dark:bg-violet-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-violet-600 dark:text-violet-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
