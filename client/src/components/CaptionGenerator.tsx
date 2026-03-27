import { useState } from "react";
import { Smile, Sparkles, Flame, Coffee, Palette, Users, ShoppingBag, Globe, Hash, ChevronDown, Loader2, AlertTriangle, Copy, Check, RefreshCw, RotateCcw } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useCaptionStorage, type CaptionResult } from "@/hooks/use-caption-storage";
import { Badge } from "@/components/ui/badge";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const STYLES = [
  { value: "Funny", label: "Funny", icon: Smile, description: "Playful & witty" },
  { value: "Inspirational", label: "Inspirational", icon: Sparkles, description: "Uplifting & motivating" },
  { value: "Promotional", label: "Promotional", icon: Flame, description: "Sales & marketing" },
  { value: "Casual", label: "Casual", icon: Coffee, description: "Relaxed & authentic" },
  { value: "Aesthetic", label: "Aesthetic", icon: Palette, description: "Artsy & visual" },
] as const;

const AUDIENCES = [
  { value: "Friends & Followers", label: "Friends & Followers", icon: Users },
  { value: "Customers / Buyers", label: "Customers / Buyers", icon: ShoppingBag },
  { value: "General Audience", label: "General Audience", icon: Globe },
  { value: "Niche Community", label: "Niche Community", icon: Hash },
] as const;

const LENGTH_OPTIONS = [
  { value: "Short", label: "Short (1-2 lines)" },
  { value: "Medium", label: "Medium" },
  { value: "Long", label: "Long (storytelling)" },
] as const;

const CARD_STYLES = [
  { border: "border-l-pink-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  { border: "border-l-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { border: "border-l-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { border: "border-l-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
  { border: "border-l-fuchsia-500", bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30" },
];

const SYSTEM_PROMPT =
  "You are a professional Instagram content strategist and viral caption writer who has created captions for millions of followers. You write natural, engaging, scroll-stopping captions that feel human and authentic. You perfectly match tone, audience, and post type while adding the right emojis and strategic hashtags.";

interface ParsedCaption {
  text: string;
  viralityScore: number;
}

function parseCaptions(raw: string): ParsedCaption[] {
  const withScoreRegex = /CAPTION\s*#?\s*(\d)\s*\(Virality:\s*([\d.]+)\/10\)\s*\n([\s\S]*?)(?=CAPTION\s*#?\s*\d|$)/gi;
  let matches = Array.from(raw.matchAll(withScoreRegex));
  if (matches.length >= 3) {
    return matches.slice(0, 5).map((m) => ({
      text: m[3].trim(),
      viralityScore: parseFloat(m[2]) || 7.0,
    }));
  }

  const withoutScoreRegex = /CAPTION\s*#?\s*(\d)[:\s]*\n?([\s\S]*?)(?=CAPTION\s*#?\s*\d|$)/gi;
  matches = Array.from(raw.matchAll(withoutScoreRegex));
  if (matches.length >= 3) {
    return matches.slice(0, 5).map((m) => ({
      text: m[2].trim(),
      viralityScore: 7.0,
    }));
  }

  const lines = raw
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[\d\-\*]+[\.\):\s]*/, "").trim())
    .filter((l) => l.length > 10);
  if (lines.length >= 3) {
    return lines.slice(0, 5).map((l) => ({ text: l, viralityScore: 7.0 }));
  }

  return [{ text: raw.trim(), viralityScore: 7.0 }];
}

function getScoreColor(score: number) {
  if (score >= 8) return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
  if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
  if (score >= 4) return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
  return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
}

export function CaptionGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveCaption } = useCaptionStorage();

  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Casual");
  const [audience, setAudience] = useState("General Audience");
  const [keywords, setKeywords] = useState("");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [captionLength, setCaptionLength] = useState("Medium");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [captions, setCaptions] = useState<ParsedCaption[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setTopic("");
    setStyle("Casual");
    setAudience("General Audience");
    setKeywords("");
    setIncludeEmojis(true);
    setIncludeHashtags(true);
    setCaptionLength("Medium");
    setAdvancedOpen(false);
    setStreamingText("");
    setCaptions([]);
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
      await navigator.clipboard.writeText(captions.map((c) => c.text).join("\n\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setCaptions([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const keywordsLine = keywords.trim() ? `\nKEYWORDS to incorporate: ${keywords.trim()}` : "";
    const keywordsRule = keywords.trim() ? "\n- Incorporate the provided keywords naturally" : "";

    const userPrompt = `Generate 5 highly engaging Instagram captions for the following post.
POST TOPIC: ${topic.trim()}
STYLE: ${style}
AUDIENCE: ${audience}${keywordsLine}
EMOJIS: ${includeEmojis ? "Yes, include relevant emojis" : "No emojis"}
HASHTAGS: ${includeHashtags ? "Yes, add 3-5 strategic hashtags at end" : "No hashtags"}
LENGTH: ${captionLength}

Rules:
- Natural and conversational tone
- Strong hook in the first line
- Include a call-to-action (question, prompt, or engagement driver)
- Match the chosen style and audience perfectly
- Rate each caption's virality potential from 0.0 to 10.0${keywordsRule}

FORMAT YOUR RESPONSE EXACTLY:
CAPTION #1 (Virality: X.X/10)
[full caption text]

CAPTION #2 (Virality: X.X/10)
[full caption text]

CAPTION #3 (Virality: X.X/10)
[full caption text]

CAPTION #4 (Virality: X.X/10)
[full caption text]

CAPTION #5 (Virality: X.X/10)
[full caption text]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 700,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseCaptions(result);
        setCaptions(parsed);

        const record: CaptionResult = {
          id: generateId(),
          topic: topic.trim(),
          style,
          audience,
          keywords: keywords.trim(),
          includeEmojis,
          includeHashtags,
          captionLength,
          captions: parsed.map((c) => c.text).join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveCaption(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && !isGenerating && topic.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-caption-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="caption-topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Post Topic *
            </label>
            <textarea
              id="caption-topic"
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 300))}
              placeholder="e.g., Sunset beach photo, New product launch, Coffee shop aesthetic"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-topic-char-count" className="text-xs text-slate-400">{topic.length}/300</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Caption Style *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" data-testid="container-style">
              {STYLES.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.value}
                    data-testid={`toggle-style-${s.value.toLowerCase()}`}
                    aria-pressed={style === s.value}
                    onClick={() => setStyle(s.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      style === s.value
                        ? "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-600 ring-1 ring-pink-200 dark:ring-pink-700"
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
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Target Audience *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="container-audience">
              {AUDIENCES.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.value}
                    data-testid={`toggle-audience-${a.value.toLowerCase().replace(/[\s\/]+/g, "-")}`}
                    aria-pressed={audience === a.value}
                    onClick={() => setAudience(a.value)}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      audience === a.value
                        ? "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 ring-1 ring-purple-200 dark:ring-purple-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-semibold leading-tight">{a.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="caption-keywords" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Keywords <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="caption-keywords"
              type="text"
              data-testid="input-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value.slice(0, 150))}
              placeholder="e.g., travel, sunset, beach vibes, summer"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-keywords-char-count" className="text-xs text-slate-400">{keywords.length}/150</span>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              data-testid="button-advanced-toggle"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="w-full px-4 py-3 flex items-center justify-between gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/50"
            >
              Advanced Options
              <ChevronDown className={cn("w-4 h-4 transition-transform", advancedOpen && "rotate-180")} />
            </button>
            {advancedOpen && (
              <div className="px-4 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700" data-testid="container-advanced-options">
                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-emojis" className="text-sm text-slate-700 dark:text-slate-200">Include Emojis</label>
                  <button
                    id="toggle-emojis"
                    data-testid="toggle-emojis"
                    onClick={() => setIncludeEmojis(!includeEmojis)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      includeEmojis ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      includeEmojis && "translate-x-5"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-hashtags" className="text-sm text-slate-700 dark:text-slate-200">Include Hashtags</label>
                  <button
                    id="toggle-hashtags"
                    data-testid="toggle-hashtags"
                    onClick={() => setIncludeHashtags(!includeHashtags)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      includeHashtags ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      includeHashtags && "translate-x-5"
                    )} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-200 mb-2">Caption Length</label>
                  <div className="flex flex-wrap gap-2" data-testid="container-caption-length">
                    {LENGTH_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        data-testid={`toggle-length-${opt.value.toLowerCase()}`}
                        onClick={() => setCaptionLength(opt.value)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                          captionLength === opt.value
                            ? "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-600"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                  <Sparkles className="w-5 h-5" />
                  Generate Captions
                </>
              )}
            </button>
            {(captions.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && !captions.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating captions...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {captions.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="space-y-4">
              {captions.map((caption, idx) => {
                const cardStyle = CARD_STYLES[idx % CARD_STYLES.length];
                return (
                  <div
                    key={idx}
                    data-testid={`card-caption-${idx}`}
                    className={cn(
                      "relative p-5 border-l-4 border border-slate-200 dark:border-slate-700",
                      cardStyle.border,
                      cardStyle.bg
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200" data-testid={`text-caption-label-${idx}`}>
                        Caption #{idx + 1}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs no-default-hover-elevate no-default-active-elevate gap-1", getScoreColor(caption.viralityScore))}
                        data-testid={`badge-virality-${idx}`}
                      >
                        <Flame className="w-3 h-3" />
                        {caption.viralityScore.toFixed(1)}/10
                      </Badge>
                    </div>
                    <p
                      className="text-slate-800 dark:text-slate-100 text-base leading-relaxed"
                      style={{ whiteSpace: "pre-wrap" }}
                      data-testid={`text-caption-${idx}`}
                    >
                      {caption.text}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        data-testid={`button-copy-caption-${idx}`}
                        onClick={() => copyToClipboard(caption.text, idx)}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
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
                Generate 5 New Captions
              </button>
              <button
                data-testid="button-copy-all"
                onClick={copyAll}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
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
