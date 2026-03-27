import { useState } from "react";
import { Lightbulb, Smile, BarChart3, Flame, Loader2, AlertTriangle, Copy, Check, RefreshCw, RotateCcw, Twitter } from "lucide-react";
import { SiX, SiFacebook, SiWhatsapp, SiLinkedin } from "react-icons/si";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useTweetStorage, type TweetResult } from "@/hooks/use-tweet-storage";
import { Badge } from "@/components/ui/badge";

const STYLES = [
  { value: "Thought Leadership", label: "Thought Leadership", icon: Lightbulb, description: "Insightful & authoritative" },
  { value: "Funny", label: "Funny", icon: Smile, description: "Witty & entertaining" },
  { value: "Informational", label: "Informational", icon: BarChart3, description: "Data-driven & useful" },
  { value: "Motivational", label: "Motivational", icon: Flame, description: "Inspiring & energizing" },
] as const;

const MAX_LENGTH_OPTIONS = [
  { value: 120, label: "120 characters", description: "Short & punchy" },
  { value: 240, label: "240 characters", description: "Room for hooks" },
] as const;

const SYSTEM_PROMPT =
  "You are an expert X/Twitter strategist who has written viral tweets for founders, influencers, and brands. You create concise, engaging, high-impact tweets that feel native to the platform. You understand thread structure, hook writing, and character limits perfectly.";

interface ParsedTweet {
  text: string;
  viralityScore: number;
  charCount: number;
}

function parseTweets(raw: string): ParsedTweet[] {
  const withScoreRegex = /TWEET\s*#?\s*(\d)\s*\(Virality:\s*([\d.]+)\/10\)\s*\n([\s\S]*?)(?=TWEET\s*#?\s*\d|$)/gi;
  let matches = Array.from(raw.matchAll(withScoreRegex));
  if (matches.length >= 3) {
    return matches.slice(0, 5).map((m) => {
      const text = m[3].trim();
      return {
        text,
        viralityScore: parseFloat(m[2]) || 7.0,
        charCount: text.length,
      };
    });
  }

  const withoutScoreRegex = /TWEET\s*#?\s*(\d)[:\s]*\n?([\s\S]*?)(?=TWEET\s*#?\s*\d|$)/gi;
  matches = Array.from(raw.matchAll(withoutScoreRegex));
  if (matches.length >= 3) {
    return matches.slice(0, 5).map((m) => {
      const text = m[2].trim();
      return {
        text,
        viralityScore: 7.0,
        charCount: text.length,
      };
    });
  }

  const lines = raw
    .split(/\n+/)
    .map((l) => l.replace(/^\s*[\d\-\*]+[\.\):\s]*/, "").trim())
    .filter((l) => l.length > 10);
  if (lines.length >= 3) {
    return lines.slice(0, 5).map((l) => ({ text: l, viralityScore: 7.0, charCount: l.length }));
  }

  return [{ text: raw.trim(), viralityScore: 7.0, charCount: raw.trim().length }];
}

function getScoreColor(score: number) {
  if (score >= 8) return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
  if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
  if (score >= 4) return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
  return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
}

function getCharCountColor(charCount: number, maxLength: number) {
  return charCount <= maxLength ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
}

export function TweetGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveTweet } = useTweetStorage();

  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Thought Leadership");
  const [maxLength, setMaxLength] = useState<number>(120);
  const [keywords, setKeywords] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [tweets, setTweets] = useState<ParsedTweet[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleReset = () => {
    setTopic("");
    setStyle("Thought Leadership");
    setMaxLength(120);
    setKeywords("");
    setStreamingText("");
    setTweets([]);
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
      await navigator.clipboard.writeText(tweets.map((t) => t.text).join("\n\n"));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setTweets([]);
    setCopiedIdx(null);
    setCopiedAll(false);

    const keywordsLine = keywords.trim() ? `\nKEYWORDS/HASHTAGS to incorporate: ${keywords.trim()}` : "";
    const keywordsRule = keywords.trim() ? "\n- Incorporate the provided keywords/hashtags naturally" : "";

    const userPrompt = `Generate 5 engaging tweets for the following topic.
TOPIC: ${topic.trim()}
STYLE: ${style}
MAX LENGTH: ${maxLength} characters${keywordsLine}

Rules:
- Each tweet MUST be under ${maxLength} characters
- Strong hook in first line
- Natural, conversational tone — feel like real X posts
- Include 1-3 relevant hashtags when it fits naturally
- Ready to copy-paste directly to X/Twitter
- Rate each tweet's virality potential from 0.0 to 10.0${keywordsRule}

FORMAT YOUR RESPONSE EXACTLY:
TWEET #1 (Virality: X.X/10)
[full tweet text]

TWEET #2 (Virality: X.X/10)
[full tweet text]

TWEET #3 (Virality: X.X/10)
[full tweet text]

TWEET #4 (Virality: X.X/10)
[full tweet text]

TWEET #5 (Virality: X.X/10)
[full tweet text]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 600,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseTweets(result);
        setTweets(parsed);

        const record: TweetResult = {
          id: generateId(),
          topic: topic.trim(),
          style,
          maxLength,
          keywords: keywords.trim(),
          tweets: parsed.map((t) => t.text).join("\n---\n"),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveTweet(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && !isGenerating && topic.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-tweet-generator">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="tweet-topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Topic *
            </label>
            <textarea
              id="tweet-topic"
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 300))}
              placeholder="e.g., AI productivity tips, New product launch, Hot take on remote work"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-topic-char-count" className="text-xs text-slate-400">{topic.length}/300</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Tweet Style *
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
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 ring-1 ring-blue-200 dark:ring-blue-700"
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
              Max Length *
            </label>
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
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                  )}
                >
                  {opt.label} ({opt.description})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="tweet-keywords" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Keywords / Hashtags <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="tweet-keywords"
              type="text"
              data-testid="input-keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value.slice(0, 150))}
              placeholder="e.g., #AI, #productivity, startup"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-keywords-char-count" className="text-xs text-slate-400">{keywords.length}/150</span>
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
                  ? "bg-gradient-to-r from-blue-500 to-sky-500 shadow-lg shadow-blue-500/25"
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
                  <Twitter className="w-5 h-5" />
                  Generate Tweets
                </>
              )}
            </button>
            {(tweets.length > 0 || streamingText) && (
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

        {isGenerating && streamingText && !tweets.length && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Generating tweets...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200" style={{ whiteSpace: "pre-wrap" }} data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {tweets.length > 0 && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="space-y-4">
              {tweets.map((tweet, idx) => (
                <div
                  key={idx}
                  data-testid={`card-tweet-${idx}`}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0" data-testid={`avatar-tweet-${idx}`}>
                      <Twitter className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100" data-testid={`text-tweet-author-${idx}`}>AI Tweet Generator</p>
                      <p className="text-xs text-slate-400" data-testid={`text-tweet-handle-${idx}`}>@browseraitools</p>
                    </div>
                  </div>
                  <p
                    className="text-slate-800 dark:text-slate-100 text-base leading-relaxed mb-3"
                    style={{ whiteSpace: "pre-wrap" }}
                    data-testid={`text-tweet-${idx}`}
                  >
                    {tweet.text}
                  </p>
                  <div className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={cn("text-xs font-medium", getCharCountColor(tweet.charCount, maxLength))}
                        data-testid={`text-char-count-${idx}`}
                      >
                        {tweet.charCount}/{maxLength}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs no-default-hover-elevate no-default-active-elevate gap-1", getScoreColor(tweet.viralityScore))}
                        data-testid={`badge-virality-${idx}`}
                      >
                        <Flame className="w-3 h-3" />
                        {tweet.viralityScore.toFixed(1)}/10
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.text)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-share-x-${idx}`}
                        title="Post on X / Twitter"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <SiX className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? `https://browseraitools.com${window.location.pathname}` : "https://browseraitools.com")}&quote=${encodeURIComponent(tweet.text)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-share-facebook-${idx}`}
                        title="Share on Facebook"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#1877F2] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <SiFacebook className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? `https://browseraitools.com${window.location.pathname}` : "https://browseraitools.com")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-share-linkedin-${idx}`}
                        title="Share on LinkedIn"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#0A66C2] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <SiLinkedin className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(tweet.text + "\n" + (typeof window !== "undefined" ? `https://browseraitools.com${window.location.pathname}` : "https://browseraitools.com"))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-share-whatsapp-${idx}`}
                        title="Share on WhatsApp"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-[#25D366] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <SiWhatsapp className="w-3.5 h-3.5" />
                      </a>
                      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                      <button
                        data-testid={`button-copy-tweet-${idx}`}
                        onClick={() => copyToClipboard(tweet.text, idx)}
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
                    ? "bg-gradient-to-r from-blue-500 to-sky-500"
                    : "bg-slate-300 dark:bg-slate-600 cursor-not-allowed"
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Generate 5 New Tweets
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
