import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  Copy, Check, Twitter, Linkedin, Mail, Megaphone, Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RepurposeResult {
  tweets: string[];
  linkedin: string;
  emailSubject: string;
  emailBody: string;
  adHooks: string[];
  instagram: string;
}

// ─── Prompt + parser ──────────────────────────────────────────────────────────

const MAX_WORDS = 800;

function truncate(text: string): { text: string; truncated: boolean } {
  const words = text.trim().split(/\s+/);
  if (words.length <= MAX_WORDS) return { text, truncated: false };
  return { text: words.slice(0, MAX_WORDS).join(" ") + " [...]", truncated: true };
}

function buildPrompt(content: string, contentType: string): string {
  const { text } = truncate(content);
  return `Repurpose this ${contentType} into multiple content formats. Be creative, punchy, and platform-appropriate.

ORIGINAL CONTENT:
${text}

Reply in this EXACT format:

TWEETS:
1. [tweet 1 — compelling, max 240 chars, no hashtags]
2. [tweet 2 — different angle, max 240 chars]
3. [tweet 3 — stat or insight, max 240 chars]
4. [tweet 4 — question or controversial take, max 240 chars]
5. [tweet 5 — actionable tip, max 240 chars]

LINKEDIN:
[Professional LinkedIn post, 150-200 words. Start with a strong hook line. Use short paragraphs. End with a question to drive comments. No hashtags.]

EMAIL_SUBJECT:
[One compelling email subject line, under 60 chars]

EMAIL_BODY:
[Email newsletter version, 150-200 words. Conversational tone. Start with "Hey [First Name]," — include main insight, a key tip, and a soft CTA.]

AD_HOOKS:
1. [punchy ad hook, 10-15 words, creates urgency or curiosity]
2. [different hook angle — problem-focused, 10-15 words]
3. [social proof or result-focused hook, 10-15 words]

INSTAGRAM:
[Instagram caption, 100-150 words. Start with an attention-grabbing opener. Line breaks between thoughts. End with 8-10 relevant hashtags.]`;
}

function parseResult(raw: string): RepurposeResult | null {
  const getSection = (key: string): string => {
    const m = raw.match(new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, "i"));
    return m?.[1]?.trim() ?? "";
  };

  const getList = (section: string): string[] =>
    section
      .split("\n")
      .map(l => l.replace(/^\d+[.)]\s*/, "").trim())
      .filter(l => l.length > 5);

  const tweetSection = getSection("TWEETS");
  const tweets = getList(tweetSection);
  const linkedin = getSection("LINKEDIN");
  if (!tweets.length && !linkedin) return null;

  const emailSubject = raw.match(/EMAIL_SUBJECT:\s*\n(.+)/i)?.[1]?.trim() ?? "";
  const emailBody = getSection("EMAIL_BODY");
  const adHooks = getList(getSection("AD_HOOKS"));
  const instagram = getSection("INSTAGRAM");

  return { tweets, linkedin, emailSubject, emailBody, adHooks, instagram };
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "tweets", label: "Tweets", icon: Twitter },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "email", label: "Email", icon: Mail },
  { id: "hooks", label: "Ad Hooks", icon: Megaphone },
  { id: "instagram", label: "Instagram", icon: Instagram },
] as const;
type TabId = typeof TABS[number]["id"];

const CONTENT_TYPES = [
  "blog post",
  "podcast transcript",
  "YouTube transcript",
  "article",
  "essay",
  "newsletter",
  "speech",
  "report",
];

// ─── Tweet card ───────────────────────────────────────────────────────────────

function TweetCard({ tweet, index }: { tweet: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const isOver = tweet.length > 280;
  return (
    <div className="p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-xs font-black flex items-center justify-center shrink-0">{index + 1}</span>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed flex-1">{tweet}</p>
      </div>
      <div className="flex items-center justify-between pl-10">
        <span className={cn("text-[10px] font-semibold", isOver ? "text-red-500" : "text-slate-400")}>{tweet.length}/280</span>
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

// ─── Ad hook card ─────────────────────────────────────────────────────────────

function AdHookCard({ hook, index }: { hook: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const colors = [
    "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300",
    "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300",
  ];
  return (
    <div className={cn("p-4 rounded-2xl border", colors[index % 3])}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-relaxed flex-1">{hook}</p>
        <button type="button"
          onClick={() => { navigator.clipboard.writeText(hook); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity shrink-0">
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <p className="text-[10px] opacity-50 mt-2 font-semibold uppercase tracking-wider">Hook {index + 1}</p>
    </div>
  );
}

// ─── Copy block ───────────────────────────────────────────────────────────────

function CopyBlock({ label, children, onCopy }: { label: string; children: React.ReactNode; onCopy: () => string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
        <button type="button"
          onClick={() => { navigator.clipboard.writeText(onCopy()); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors">
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ContentRepurposer() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("blog post");
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("tweets");
  const [inputError, setInputError] = useState("");
  const [wasTruncated, setWasTruncated] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleRepurpose = useCallback(async () => {
    if (wordCount < 30) { setInputError("Please paste at least 30 words of content."); return; }
    setInputError("");
    setResult(null);
    setStreaming("");
    setIsDone(false);
    const { truncated } = truncate(content);
    setWasTruncated(truncated);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are an expert content strategist and copywriter. Repurpose content for multiple platforms with platform-native tone and style. Always follow the exact output format." },
        { role: "user", content: buildPrompt(content, contentType) },
      ],
      temperature: 0.55,
      maxTokens: 1500,
      onChunk: chunk => setStreaming(chunk),
    });

    if (raw) {
      const parsed = parseResult(raw);
      if (parsed) { setResult(parsed); setIsDone(true); setActiveTab("tweets"); }
    }
    setStreaming("");
  }, [content, contentType, wordCount, generateRaw]);

  const handleReset = () => {
    setContent(""); setResult(null); setStreaming(""); setIsDone(false); setInputError(""); setWasTruncated(false);
  };

  const copyAll = () => {
    if (!result) return;
    const text = [
      "=== TWEETS ===\n" + result.tweets.map((t, i) => `${i + 1}. ${t}`).join("\n\n"),
      "=== LINKEDIN ===\n" + result.linkedin,
      `=== EMAIL ===\nSubject: ${result.emailSubject}\n\n${result.emailBody}`,
      "=== AD HOOKS ===\n" + result.adHooks.map((h, i) => `${i + 1}. ${h}`).join("\n"),
      "=== INSTAGRAM ===\n" + result.instagram,
    ].join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input */}
      {!isDone && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          {/* Type selector */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest shrink-0">Content Type</p>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value)}
              data-testid="select-content-type"
              className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-400">
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              data-testid="input-content"
              value={content}
              onChange={e => { setContent(e.target.value); setInputError(""); }}
              placeholder="Paste your blog post, article, podcast transcript, or any long-form content here…"
              rows={14}
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
            />
            {wordCount > 0 && (
              <span className="absolute bottom-3 right-4 text-xs text-slate-400 pointer-events-none">{wordCount} words</span>
            )}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Private — content never leaves your browser</span>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />{inputError}
              </p>
            )}
            <button type="button" data-testid="button-repurpose"
              onClick={handleRepurpose}
              disabled={isBusy || wordCount < 30}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                isBusy || wordCount < 30
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
              )}>
              {isBusy
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Repurposing…</>
                : "Repurpose Content"}
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

      {/* Streaming */}
      {isGenerating && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Generating 5 formats…</p>
          </div>
          {streaming && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed line-clamp-4">
              {streaming}
              <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
            </p>
          )}
        </div>
      )}

      {wasTruncated && isDone && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Content over 800 words — the AI repurposed the first 800 words to stay within its context limit.
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

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Content Repurposed</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                  {result.tweets.length} tweets · 1 LinkedIn · Email · {result.adHooks.length} ad hooks · Instagram
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" data-testid="button-copy-all" onClick={copyAll}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  {copiedAll ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </button>
                <button type="button" data-testid="button-reset" onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <RotateCcw className="w-3 h-3" /> New Content
                </button>
              </div>
            </div>

            {/* Platform tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {TABS.map(tab => (
                <button key={tab.id} type="button" data-testid={`tab-${tab.id}`}
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

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>

                {activeTab === "tweets" && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">5 Ready-to-Post Tweets</p>
                    {result.tweets.map((t, i) => <TweetCard key={i} tweet={t} index={i} />)}
                  </div>
                )}

                {activeTab === "linkedin" && (
                  <CopyBlock label="LinkedIn Post" onCopy={() => result.linkedin}>
                    {result.linkedin.split("\n\n").map((p, i) => (
                      <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3 last:mb-0">{p}</p>
                    ))}
                  </CopyBlock>
                )}

                {activeTab === "email" && (
                  <div className="space-y-3">
                    {result.emailSubject && (
                      <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">Subject</span>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 flex-1">{result.emailSubject}</p>
                        <CopyIconButton text={result.emailSubject} />
                      </div>
                    )}
                    <CopyBlock label="Email Newsletter Body" onCopy={() => result.emailBody}>
                      {result.emailBody.split("\n\n").map((p, i) => (
                        <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3 last:mb-0">{p}</p>
                      ))}
                    </CopyBlock>
                  </div>
                )}

                {activeTab === "hooks" && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">3 Ad Hooks — Facebook / Google / LinkedIn Ads</p>
                    {result.adHooks.map((h, i) => <AdHookCard key={i} hook={h} index={i} />)}
                  </div>
                )}

                {activeTab === "instagram" && (
                  <CopyBlock label="Instagram Caption + Hashtags" onCopy={() => result.instagram}>
                    {result.instagram.split("\n").map((line, i) =>
                      line.startsWith("#") ? (
                        <p key={i} className="text-xs text-purple-500 dark:text-purple-400 font-semibold mt-3 leading-loose">{line}</p>
                      ) : line.trim() === "" ? (
                        <br key={i} />
                      ) : (
                        <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{line}</p>
                      )
                    )}
                  </CopyBlock>
                )}

              </motion.div>
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tiny inline copy icon ────────────────────────────────────────────────────

function CopyIconButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-slate-400 hover:text-purple-600 transition-colors shrink-0">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
