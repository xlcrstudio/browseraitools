import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  Copy, Check, ExternalLink, ChevronDown, ChevronUp,
  FileText, Lightbulb, Zap, Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VideoMeta {
  title: string;
  author: string;
  thumbnail: string;
  videoId: string;
}

interface SummaryResult {
  fullSummary: string;
  keyTakeaways: string[];
  actionSteps: string[];
  tweetThread: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function fetchVideoMeta(videoId: string): Promise<VideoMeta | null> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title ?? "",
      author: data.author_name ?? "",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId,
    };
  } catch {
    return null;
  }
}

function truncateTranscript(text: string, maxWords = 1200): { text: string; truncated: boolean } {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return { text, truncated: false };
  return { text: words.slice(0, maxWords).join(" ") + " [...]", truncated: true };
}

function buildPrompt(transcript: string, title: string): string {
  const { text } = truncateTranscript(transcript);
  return `Summarize this YouTube video transcript${title ? ` ("${title}")` : ""}.

TRANSCRIPT:
${text}

Reply in this exact format:

FULL_SUMMARY:
[3-4 paragraph narrative summary of the video's main content and key ideas]

KEY_TAKEAWAYS:
- [insight 1]
- [insight 2]
- [insight 3]
- [insight 4]
- [insight 5]

ACTION_STEPS:
- [specific actionable step 1]
- [specific actionable step 2]
- [specific actionable step 3]
- [specific actionable step 4]

TWEET_THREAD:
1/ [hook tweet — compelling opener about the main idea, max 240 chars]
2/ [key insight or fact from the video, max 240 chars]
3/ [another insight or surprising detail, max 240 chars]
4/ [actionable takeaway for the audience, max 240 chars]
5/ [closing tweet with call to action or summary, max 240 chars]`;
}

function parseResult(raw: string): SummaryResult | null {
  const getSection = (key: string): string => {
    const m = raw.match(new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, "i"));
    return m?.[1]?.trim() ?? "";
  };
  const getList = (key: string): string[] => {
    const section = getSection(key);
    return section
      .split("\n")
      .map(l => l.replace(/^[-•*\d./]+\s*/, "").trim())
      .filter(l => l.length > 5);
  };
  const getTweets = (): string[] => {
    const section = getSection("TWEET_THREAD");
    return section
      .split("\n")
      .map(l => l.replace(/^\d+\/\s*/, "").trim())
      .filter(l => l.length > 5);
  };

  const fullSummary = getSection("FULL_SUMMARY");
  if (!fullSummary) return null;

  return {
    fullSummary,
    keyTakeaways: getList("KEY_TAKEAWAYS"),
    actionSteps: getList("ACTION_STEPS"),
    tweetThread: getTweets(),
  };
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "summary", label: "Full Summary", icon: FileText },
  { id: "takeaways", label: "Key Takeaways", icon: Lightbulb },
  { id: "actions", label: "Action Steps", icon: Zap },
  { id: "tweets", label: "Tweet Thread", icon: Twitter },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Tweet card ───────────────────────────────────────────────────────────────

function TweetCard({ tweet, index }: { tweet: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const charCount = tweet.length;
  const isOver = charCount > 280;

  return (
    <div className="p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-xs font-black flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed flex-1">{tweet}</p>
      </div>
      <div className="flex items-center justify-between pl-10">
        <span className={cn("text-[10px] font-semibold", isOver ? "text-red-500" : "text-slate-400")}>
          {charCount}/280
        </span>
        <button type="button"
          onClick={() => { navigator.clipboard.writeText(tweet); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-sky-500 transition-colors">
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function YouTubeSummarizer() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const [copiedAll, setCopiedAll] = useState(false);
  const [inputError, setInputError] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [wasTruncated, setWasTruncated] = useState(false);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;

  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0;

  const handleUrlBlur = useCallback(async () => {
    const vid = extractVideoId(url.trim());
    if (!vid) { setMeta(null); return; }
    setMetaLoading(true);
    const m = await fetchVideoMeta(vid);
    setMeta(m);
    setMetaLoading(false);
  }, [url]);

  const handleSummarize = useCallback(async () => {
    if (wordCount < 30) { setInputError("Please paste at least 30 words of transcript text."); return; }
    setInputError("");
    setResult(null);
    setStreaming("");
    setIsDone(false);
    const { truncated } = truncateTranscript(transcript);
    setWasTruncated(truncated);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are an expert content analyst. Summarize YouTube transcripts clearly and extract maximum value. Always follow the exact output format." },
        { role: "user", content: buildPrompt(transcript, meta?.title ?? "") },
      ],
      temperature: 0.4,
      maxTokens: 1400,
      onChunk: chunk => setStreaming(chunk),
    });

    if (raw) {
      const parsed = parseResult(raw);
      if (parsed) {
        setResult(parsed);
        setIsDone(true);
        setActiveTab("summary");
      }
    }
    setStreaming("");
  }, [transcript, meta, wordCount, generateRaw]);

  const handleReset = () => {
    setUrl(""); setTranscript(""); setMeta(null); setResult(null);
    setStreaming(""); setIsDone(false); setInputError(""); setWasTruncated(false);
  };

  const copyAll = () => {
    if (!result) return;
    const text = [
      "=== FULL SUMMARY ===\n" + result.fullSummary,
      "=== KEY TAKEAWAYS ===\n" + result.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n"),
      "=== ACTION STEPS ===\n" + result.actionSteps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
      "=== TWEET THREAD ===\n" + result.tweetThread.map((t, i) => `${i + 1}/ ${t}`).join("\n\n"),
    ].join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const videoId = extractVideoId(url.trim());

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input panel */}
      {!isDone && (
        <div className="glass-panel rounded-2xl overflow-hidden space-y-0">
          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Video URL (optional)</p>
          </div>

          {/* URL input */}
          <div className="p-4 space-y-2">
            <div className="flex gap-2">
              <input type="url" data-testid="input-url"
                value={url}
                onChange={e => { setUrl(e.target.value); setMeta(null); }}
                onBlur={handleUrlBlur}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-400"
              />
              {metaLoading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin mt-2.5 shrink-0" />}
              {videoId && !metaLoading && (
                <a href={`https://youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors">
                  <ExternalLink className="w-3 h-3" /> Open
                </a>
              )}
            </div>

            {/* Video card */}
            <AnimatePresence>
              {meta && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <img src={meta.thumbnail} alt={meta.title}
                    className="w-24 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight line-clamp-2">{meta.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{meta.author}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transcript guide */}
          <div className="border-t border-slate-100 dark:border-slate-800">
            <button type="button" data-testid="button-toggle-guide"
              onClick={() => setShowGuide(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">How to copy the transcript from YouTube</span>
              {showGuide ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            <AnimatePresence initial={false}>
              {showGuide && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                  className="overflow-hidden border-t border-slate-100 dark:border-slate-800">
                  <ol className="px-4 py-4 space-y-2.5">
                    {[
                      { step: "1", text: "Open the video on YouTube in a new tab." },
                      { step: "2", text: "Click the three-dot menu (⋮) below the video, next to Save." },
                      { step: "3", text: "Click \"Show transcript\" from the menu." },
                      { step: "4", text: "Toggle off timestamps using the three-dot menu inside the transcript panel." },
                      { step: "5", text: "Click inside the transcript, press Ctrl+A (or Cmd+A on Mac) to select all, then Ctrl+C to copy." },
                      { step: "6", text: "Paste the transcript into the box below." },
                    ].map(s => (
                      <li key={s.step} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-black text-[10px] flex items-center justify-center shrink-0">{s.step}</span>
                        {s.text}
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transcript input */}
          <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Transcript <span className="text-red-400">*</span></p>
              <span className="text-xs text-slate-400">{wordCount} words</span>
            </div>
            <textarea data-testid="input-transcript"
              value={transcript}
              onChange={e => { setTranscript(e.target.value); setInputError(""); }}
              placeholder="Paste the YouTube transcript here…"
              rows={10}
              className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Private — text never leaves your browser</span>
              </div>
            </div>

            {inputError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />{inputError}
              </p>
            )}

            <button type="button" data-testid="button-summarize"
              onClick={handleSummarize}
              disabled={isBusy || wordCount < 30}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                isBusy || wordCount < 30
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
              )}>
              {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Summarizing…</> : "Summarize Video"}
            </button>
          </div>
        </div>
      )}

      {/* Model loading */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Loading AI model…</span>
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1">
              <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">{Math.round(progress?.percent ?? 0)}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streaming preview */}
      {isGenerating && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Analyzing transcript…</p>
          </div>
          {streaming && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed line-clamp-4">
              {streaming}
              <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
            </p>
          )}
        </div>
      )}

      {/* Truncation notice */}
      {wasTruncated && isDone && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Transcript over 1,200 words — the AI summarized the first 1,200 words to stay within its context limit.
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {isDone && result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Meta + actions bar */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {meta && (
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{meta.title}</p>
                )}
                <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-bold">Summary Ready</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" data-testid="button-copy-all" onClick={copyAll}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  {copiedAll ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </button>
                <button type="button" data-testid="button-reset" onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <RotateCcw className="w-3 h-3" /> New Video
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {TABS.map(tab => (
                <button key={tab.id} type="button"
                  data-testid={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all",
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}>
                  <tab.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>

                {activeTab === "summary" && (
                  <TabPanel label="Full Summary" onCopy={() => navigator.clipboard.writeText(result.fullSummary)}>
                    <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                      {result.fullSummary.split("\n\n").map((para, i) => (
                        <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3 last:mb-0">{para}</p>
                      ))}
                    </div>
                  </TabPanel>
                )}

                {activeTab === "takeaways" && (
                  <TabPanel label="Key Takeaways" onCopy={() => navigator.clipboard.writeText(result.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join("\n"))}>
                    <ul className="space-y-3">
                      {result.keyTakeaways.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </TabPanel>
                )}

                {activeTab === "actions" && (
                  <TabPanel label="Action Steps" onCopy={() => navigator.clipboard.writeText(result.actionSteps.map((s, i) => `${i + 1}. ${s}`).join("\n"))}>
                    <ul className="space-y-3">
                      {result.actionSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ul>
                  </TabPanel>
                )}

                {activeTab === "tweets" && (
                  <TabPanel
                    label="Tweet Thread"
                    onCopy={() => navigator.clipboard.writeText(result.tweetThread.map((t, i) => `${i + 1}/ ${t}`).join("\n\n"))}>
                    <div className="space-y-3">
                      {result.tweetThread.map((tweet, i) => (
                        <TweetCard key={i} tweet={tweet} index={i} />
                      ))}
                    </div>
                  </TabPanel>
                )}

              </motion.div>
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab panel wrapper ────────────────────────────────────────────────────────

function TabPanel({ label, onCopy, children }: { label: string; onCopy: () => void; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { onCopy(); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
        <button type="button" onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors">
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
