import { useState } from "react";
import {
  BookOpen, Monitor, Film, Briefcase, Gamepad2, Leaf,
  Flame, BarChart3, ListOrdered, HelpCircle,
  ChevronDown, Loader2, AlertTriangle, Copy, Check, RefreshCw, RotateCcw, Play
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useYTTitleStorage, type YTTitleResult } from "@/hooks/use-yt-title-storage";
import { Badge } from "@/components/ui/badge";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const CATEGORIES = [
  { value: "Education", label: "Education", icon: BookOpen, description: "Learning & tutorials" },
  { value: "Technology", label: "Technology", icon: Monitor, description: "Tech & software" },
  { value: "Entertainment", label: "Entertainment", icon: Film, description: "Fun & engaging" },
  { value: "Business", label: "Business", icon: Briefcase, description: "Entrepreneurship" },
  { value: "Gaming", label: "Gaming", icon: Gamepad2, description: "Games & esports" },
  { value: "Lifestyle", label: "Lifestyle", icon: Leaf, description: "Daily life & vlogs" },
] as const;

const STYLES = [
  { value: "Clickbait", label: "Clickbait", icon: Flame, description: "Maximum clicks" },
  { value: "Informational", label: "Informational", icon: BarChart3, description: "Data & facts" },
  { value: "List Style", label: "List Style", icon: ListOrdered, description: "Numbered lists" },
  { value: "Curiosity", label: "Curiosity", icon: HelpCircle, description: "Mystery & intrigue" },
] as const;

const MAX_LENGTH_OPTIONS = [
  { value: 60, label: "60 chars" },
  { value: 70, label: "70 chars" },
] as const;

const SYSTEM_PROMPT =
  "You are a YouTube growth expert and title optimizer who has helped channels grow from 0 to 1M+ subscribers. You create highly clickable, SEO-optimized titles that rank. You understand search volume, click-through rate psychology, and YouTube's algorithm perfectly. Titles must feel native to YouTube.";

interface ParsedTitle {
  text: string;
  seoScore: number;
  ctr: string;
  charCount: number;
}

function parseTitles(raw: string): ParsedTitle[] {
  const withScoreRegex = /TITLE\s*#?\s*(\d+)\s*\(SEO:\s*([\d.]+)\/10\s*\|\s*CTR:\s*(High|Medium|Low)\)\s*\n([\s\S]*?)(?=TITLE\s*#?\s*\d|$)/gi;
  let matches = Array.from(raw.matchAll(withScoreRegex));
  if (matches.length >= 3) {
    return matches.slice(0, 10).map((m) => {
      const text = m[4].trim();
      return {
        text,
        seoScore: parseFloat(m[2]) || 7.0,
        ctr: m[3],
        charCount: text.length,
      };
    });
  }

  const withoutScoreRegex = /TITLE\s*#?\s*(\d+)[:\s]*\n?([\s\S]*?)(?=TITLE\s*#?\s*\d|$)/gi;
  matches = Array.from(raw.matchAll(withoutScoreRegex));
  if (matches.length >= 3) {
    return matches.slice(0, 10).map((m) => {
      const text = m[2].trim();
      return {
        text,
        seoScore: 7.0,
        ctr: "Medium",
        charCount: text.length,
      };
    });
  }

  const lines = raw
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[\d\-\*]+[\.\):\s]*/, "").trim())
    .filter((l) => l.length > 10);
  if (lines.length >= 3) {
    return lines.slice(0, 10).map((l) => ({ text: l, seoScore: 7.0, ctr: "Medium", charCount: l.length }));
  }

  return [{ text: raw.trim(), seoScore: 7.0, ctr: "Medium", charCount: raw.trim().length }];
}

function getSeoScoreColor(score: number) {
  if (score >= 8) return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
  if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
  return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
}

function getCtrColor(ctr: string) {
  if (ctr === "High") return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
  if (ctr === "Medium") return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
  return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
}

function getCharCountColor(charCount: number, maxLength: number) {
  return charCount <= maxLength ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
}

export function YTTitleGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveTitle } = useYTTitleStorage();

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Technology");
  const [style, setStyle] = useState("Clickbait");
  const [keywords, setKeywords] = useState("");
  const [maxLength, setMaxLength] = useState<number>(60);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeEmotionalWords, setIncludeEmotionalWords] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [titles, setTitles] = useState<ParsedTitle[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setTopic("");
    setCategory("Technology");
    setStyle("Clickbait");
    setKeywords("");
    setMaxLength(60);
    setIncludeNumbers(true);
    setIncludeEmotionalWords(true);
    setAdvancedOpen(false);
    setStreamingText("");
    setTitles([]);
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
      await navigator.clipboard.writeText(titles.map((t) => t.text).join("\n\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setTitles([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const keywordsLine = keywords.trim() ? `\nTARGET KEYWORDS to incorporate: ${keywords.trim()}` : "";
    const numbersLine = includeNumbers ? "\nInclude numbers in titles where they fit naturally" : "";
    const emotionalLine = includeEmotionalWords ? "\nInclude emotional/power words (shocking, incredible, secret, ultimate, etc.)" : "";

    const userPrompt = `Generate 10 highly clickable YouTube titles for the following video.
VIDEO TOPIC: ${topic.trim()}
CATEGORY: ${category}
STYLE: ${style}${keywordsLine}
MAX LENGTH: ${maxLength} characters${numbersLine}${emotionalLine}

Rules:
- All titles MUST be under ${maxLength} characters
- Highly searchable + clickable
- Match the chosen style perfectly
- Optimized for both search ranking and click-through rate
- Rate each title's SEO strength 0.0-10.0
- Predict CTR as High, Medium, or Low
- Ready to copy-paste into YouTube

FORMAT YOUR RESPONSE EXACTLY:
TITLE #1 (SEO: X.X/10 | CTR: High)
[title text]

TITLE #2 (SEO: X.X/10 | CTR: Medium)
[title text]

TITLE #3 (SEO: X.X/10 | CTR: High)
[title text]

TITLE #4 (SEO: X.X/10 | CTR: Medium)
[title text]

TITLE #5 (SEO: X.X/10 | CTR: High)
[title text]

TITLE #6 (SEO: X.X/10 | CTR: Medium)
[title text]

TITLE #7 (SEO: X.X/10 | CTR: High)
[title text]

TITLE #8 (SEO: X.X/10 | CTR: Low)
[title text]

TITLE #9 (SEO: X.X/10 | CTR: Medium)
[title text]

TITLE #10 (SEO: X.X/10 | CTR: High)
[title text]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 800,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseTitles(result);
        setTitles(parsed);

        const record: YTTitleResult = {
          id: generateId(),
          topic: topic.trim(),
          category,
          style,
          keywords: keywords.trim(),
          maxLength,
          includeNumbers,
          includeEmotionalWords,
          titles: parsed.map((t) => t.text).join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveTitle(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && !isGenerating && topic.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-yt-title-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="yt-topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Video Topic *
            </label>
            <textarea
              id="yt-topic"
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 300))}
              placeholder="e.g., AI tools for productivity, How I made $10k last month, Best coding tutorials"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-topic-char-count" className="text-xs text-slate-400">{topic.length}/300</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Video Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2" data-testid="container-category">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.value}
                    data-testid={`toggle-category-${c.value.toLowerCase()}`}
                    aria-pressed={category === c.value}
                    onClick={() => setCategory(c.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      category === c.value
                        ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600 ring-1 ring-red-200 dark:ring-red-700"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold">{c.label}</span>
                    </div>
                    <p className="text-xs opacity-70">{c.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Title Style *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="container-style">
              {STYLES.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.value}
                    data-testid={`toggle-style-${s.value.toLowerCase().replace(/\s+/g, "-")}`}
                    aria-pressed={style === s.value}
                    onClick={() => setStyle(s.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      style === s.value
                        ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600 ring-1 ring-red-200 dark:ring-red-700"
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
            <label htmlFor="yt-keywords" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Target Keywords <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="yt-keywords"
              type="text"
              data-testid="input-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value.slice(0, 150))}
              placeholder="e.g., AI tools, productivity, 2026"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition-all"
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
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-200 mb-2">Max Length</label>
                  <div className="flex flex-wrap gap-2" data-testid="container-max-length">
                    {MAX_LENGTH_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        data-testid={`toggle-max-length-${opt.value}`}
                        aria-pressed={maxLength === opt.value}
                        onClick={() => setMaxLength(opt.value)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                          maxLength === opt.value
                            ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-numbers" className="text-sm text-slate-700 dark:text-slate-200">Include Numbers</label>
                  <button
                    id="toggle-numbers"
                    data-testid="toggle-numbers"
                    aria-pressed={includeNumbers}
                    onClick={() => setIncludeNumbers(!includeNumbers)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      includeNumbers ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      includeNumbers && "translate-x-5"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-emotional" className="text-sm text-slate-700 dark:text-slate-200">Include Emotional Words</label>
                  <button
                    id="toggle-emotional"
                    data-testid="toggle-emotional"
                    aria-pressed={includeEmotionalWords}
                    onClick={() => setIncludeEmotionalWords(!includeEmotionalWords)}
                    className={cn(
                      "relative w-10 h-5 rounded-full transition-colors",
                      includeEmotionalWords ? "bg-red-500" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      includeEmotionalWords && "translate-x-5"
                    )} />
                  </button>
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
                  ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/25"
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
                  <Play className="w-5 h-5" />
                  Generate Titles
                </>
              )}
            </button>
            {(titles.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && !titles.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating titles...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {titles.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {titles.map((title, idx) => {
                const isRed = idx % 2 === 0;
                return (
                  <div
                    key={idx}
                    data-testid={`card-title-${idx}`}
                    className={cn(
                      "relative rounded-xl border border-slate-200 dark:border-slate-700 p-4",
                      isRed
                        ? "bg-red-50 dark:bg-red-950/30"
                        : "bg-slate-50 dark:bg-slate-900"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0" data-testid={`icon-play-${idx}`}>
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <p
                        className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-relaxed flex-1"
                        data-testid={`text-title-${idx}`}
                      >
                        {title.text}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-slate-200 dark:border-slate-700/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn("text-xs font-medium", getCharCountColor(title.charCount, maxLength))}
                          data-testid={`text-char-count-${idx}`}
                        >
                          {title.charCount}/{maxLength}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn("text-xs no-default-hover-elevate no-default-active-elevate gap-1", getSeoScoreColor(title.seoScore))}
                          data-testid={`badge-seo-${idx}`}
                        >
                          SEO {title.seoScore.toFixed(1)}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn("text-xs no-default-hover-elevate no-default-active-elevate", getCtrColor(title.ctr))}
                          data-testid={`badge-ctr-${idx}`}
                        >
                          CTR: {title.ctr}
                        </Badge>
                      </div>
                      <button
                        data-testid={`button-copy-title-${idx}`}
                        onClick={() => copyToClipboard(title.text, idx)}
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
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Generate 10 New Titles
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
    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800" data-testid="container-engine-status">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
        <span className="text-sm font-semibold text-red-700 dark:text-red-300">
          {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
        </span>
      </div>
      <div className="h-2 rounded-full bg-red-100 dark:bg-red-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
          data-testid="bar-engine-progress"
        />
      </div>
      <p className="text-xs text-red-600 dark:text-red-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
    </div>
  );
}
