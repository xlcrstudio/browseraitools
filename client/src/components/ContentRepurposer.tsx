import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  Copy, Check, Twitter, Linkedin, Mail, Megaphone, Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Format config ────────────────────────────────────────────────────────────

type FormatId = "tweets" | "linkedin" | "email" | "hooks" | "instagram";

const FORMATS: Array<{ id: FormatId; label: string; desc: string; icon: React.ElementType }> = [
  { id: "tweets",    label: "Tweets",          desc: "5 ready-to-post tweets",           icon: Twitter },
  { id: "linkedin",  label: "LinkedIn",         desc: "Professional post",                icon: Linkedin },
  { id: "email",     label: "Email Newsletter", desc: "Subject line + body",              icon: Mail },
  { id: "hooks",     label: "Ad Hooks",         desc: "3 short ad headlines",             icon: Megaphone },
  { id: "instagram", label: "Instagram",        desc: "Caption + hashtags",               icon: Instagram },
];

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

const FORMAT_INSTRUCTIONS: Record<FormatId, string> = {
  tweets: `TWEETS:
1. [tweet 1 — compelling hook, max 240 chars, no hashtags]
2. [tweet 2 — different angle, max 240 chars]
3. [tweet 3 — stat or insight, max 240 chars]
4. [tweet 4 — question or provocative take, max 240 chars]
5. [tweet 5 — actionable tip, max 240 chars]`,

  linkedin: `LINKEDIN:
[Professional LinkedIn post, 120-180 words. Strong opening hook. Short paragraphs. End with a question to drive comments. No hashtags.]`,

  email: `EMAIL_SUBJECT:
[Compelling email subject line, under 60 chars]

EMAIL_BODY:
[Email newsletter, 120-180 words. Start with "Hey [First Name],". Include main insight, a tip, and a soft CTA.]`,

  hooks: `AD_HOOKS:
1. [punchy ad hook, 10-15 words, curiosity or urgency]
2. [problem-focused hook, 10-15 words]
3. [result or social-proof hook, 10-15 words]`,

  instagram: `INSTAGRAM:
[Instagram caption, 80-120 words. Attention-grabbing opener. Line breaks between thoughts. End with 8-10 relevant hashtags.]`,
};

function buildPrompt(content: string, contentType: string, formats: Set<FormatId>): string {
  const { text } = truncate(content);
  const selected = FORMATS.filter(f => formats.has(f.id));
  const instructions = selected.map(f => FORMAT_INSTRUCTIONS[f.id]).join("\n\n");

  return `Repurpose this ${contentType} into the requested content formats. Be creative, punchy, and platform-appropriate.

ORIGINAL CONTENT:
${text}

Reply in this EXACT format (only include the sections listed below):

${instructions}`;
}

function parseResult(raw: string, formats: Set<FormatId>): RepurposeResult | null {
  const getSection = (key: string): string => {
    const m = raw.match(new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, "i"));
    return m?.[1]?.trim() ?? "";
  };
  const getList = (section: string): string[] =>
    section
      .split("\n")
      .map(l => l.replace(/^\d+[.)]\s*/, "").trim())
      .filter(l => l.length > 5);

  const tweets = formats.has("tweets") ? getList(getSection("TWEETS")) : [];
  const linkedin = formats.has("linkedin") ? getSection("LINKEDIN") : "";
  const emailSubject = formats.has("email") ? (raw.match(/EMAIL_SUBJECT:\s*\n(.+)/i)?.[1]?.trim() ?? "") : "";
  const emailBody = formats.has("email") ? getSection("EMAIL_BODY") : "";
  const adHooks = formats.has("hooks") ? getList(getSection("AD_HOOKS")) : [];
  const instagram = formats.has("instagram") ? getSection("INSTAGRAM") : "";

  // Return if at least one selected format has content
  const hasContent =
    (formats.has("tweets") && tweets.length > 0) ||
    (formats.has("linkedin") && linkedin) ||
    (formats.has("email") && (emailSubject || emailBody)) ||
    (formats.has("hooks") && adHooks.length > 0) ||
    (formats.has("instagram") && instagram);

  return hasContent ? { tweets, linkedin, emailSubject, emailBody, adHooks, instagram } : null;
}

// ─── Copy helpers ─────────────────────────────────────────────────────────────

function CopyBtn({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={cn("flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors", className)}>
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CopyIconBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-slate-400 hover:text-purple-600 transition-colors shrink-0">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── Tweet card ───────────────────────────────────────────────────────────────

function TweetCard({ tweet, index }: { tweet: string; index: number }) {
  const isOver = tweet.length > 280;
  return (
    <div className="p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 text-xs font-black flex items-center justify-center shrink-0">{index + 1}</span>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed flex-1">{tweet}</p>
      </div>
      <div className="flex items-center justify-between pl-10">
        <span className={cn("text-[10px] font-semibold", isOver ? "text-red-500" : "text-slate-400")}>{tweet.length}/280</span>
        <CopyBtn text={tweet} />
      </div>
    </div>
  );
}

// ─── Ad hook card ─────────────────────────────────────────────────────────────

function AdHookCard({ hook, index }: { hook: string; index: number }) {
  const colors = [
    "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300",
    "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300",
  ];
  return (
    <div className={cn("p-4 rounded-2xl border", colors[index % 3])}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-relaxed flex-1">{hook}</p>
        <CopyIconBtn text={hook} />
      </div>
      <p className="text-[10px] opacity-50 mt-2 font-semibold uppercase tracking-wider">Hook {index + 1}</p>
    </div>
  );
}

// ─── Section panel ────────────────────────────────────────────────────────────

function SectionPanel({ label, onCopy, children }: { label: string; onCopy: () => string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
        <CopyBtn text={onCopy()} />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Content types ────────────────────────────────────────────────────────────

const CONTENT_TYPES = [
  "blog post", "podcast transcript", "YouTube transcript",
  "article", "essay", "newsletter", "speech", "report",
];

// ─── Main component ───────────────────────────────────────────────────────────

export function ContentRepurposer() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("blog post");
  const [selectedFormats, setSelectedFormats] = useState<Set<FormatId>>(
    new Set(["tweets", "linkedin", "email", "hooks", "instagram"])
  );
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [activeFormats, setActiveFormats] = useState<Set<FormatId>>(new Set());
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [activeTab, setActiveTab] = useState<FormatId>("tweets");
  const [inputError, setInputError] = useState("");
  const [wasTruncated, setWasTruncated] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);

  const isGenerating = state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isModelLoading;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const toggleFormat = (id: FormatId) => {
    setSelectedFormats(prev => {
      const next = new Set(prev);
      if (next.has(id) && next.size === 1) return prev; // keep at least one
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRepurpose = useCallback(async () => {
    if (wordCount < 30) { setInputError("Please paste at least 30 words of content."); return; }
    if (selectedFormats.size === 0) { setInputError("Please select at least one output format."); return; }
    setInputError("");
    setParseError(null);
    setRawOutput(null);
    setResult(null);
    setStreaming("");
    setIsDone(false);
    const { truncated } = truncate(content);
    setWasTruncated(truncated);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are an expert content strategist and copywriter. Repurpose content for multiple platforms with platform-native tone and style. Always follow the exact output format. Only include the sections that are requested." },
        { role: "user", content: buildPrompt(content, contentType, selectedFormats) },
      ],
      temperature: 0.45,
      maxTokens: selectedFormats.size <= 2 ? 700 : selectedFormats.size <= 3 ? 900 : 1200,
      onChunk: chunk => setStreaming(chunk),
    });

    if (raw) {
      const parsed = parseResult(raw, selectedFormats);
      if (parsed) {
        setResult(parsed);
        setActiveFormats(new Set(selectedFormats));
        setIsDone(true);
        // Default to first selected tab
        const firstSelected = FORMATS.find(f => selectedFormats.has(f.id));
        if (firstSelected) setActiveTab(firstSelected.id);
      } else {
        setRawOutput(raw);
        setParseError("The AI responded but in an unexpected format. Raw output shown below — you can still copy and use it.");
      }
    }
    setStreaming("");
  }, [content, contentType, wordCount, selectedFormats, generateRaw]);

  const handleReset = () => {
    setContent(""); setResult(null); setStreaming(""); setIsDone(false);
    setInputError(""); setWasTruncated(false); setParseError(null); setRawOutput(null);
  };

  const copyAll = () => {
    if (!result) return;
    const parts: string[] = [];
    if (activeFormats.has("tweets") && result.tweets.length)
      parts.push("=== TWEETS ===\n" + result.tweets.map((t, i) => `${i + 1}. ${t}`).join("\n\n"));
    if (activeFormats.has("linkedin") && result.linkedin)
      parts.push("=== LINKEDIN ===\n" + result.linkedin);
    if (activeFormats.has("email") && (result.emailSubject || result.emailBody))
      parts.push(`=== EMAIL ===\nSubject: ${result.emailSubject}\n\n${result.emailBody}`);
    if (activeFormats.has("hooks") && result.adHooks.length)
      parts.push("=== AD HOOKS ===\n" + result.adHooks.map((h, i) => `${i + 1}. ${h}`).join("\n"));
    if (activeFormats.has("instagram") && result.instagram)
      parts.push("=== INSTAGRAM ===\n" + result.instagram);
    navigator.clipboard.writeText(parts.join("\n\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const visibleTabs = FORMATS.filter(f => activeFormats.has(f.id));

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input panel */}
      {!isDone && (
        <div className="glass-panel rounded-2xl overflow-hidden">

          {/* Content type */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest shrink-0">Type</p>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value)}
              data-testid="select-content-type"
              className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-400">
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>

          {/* Format selector */}
          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Output Formats</p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(fmt => {
                const selected = selectedFormats.has(fmt.id);
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    data-testid={`toggle-format-${fmt.id}`}
                    onClick={() => toggleFormat(fmt.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                      selected
                        ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-700"
                    )}>
                    <fmt.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{fmt.label}</span>
                    {selected && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400">
              {selectedFormats.size === 5
                ? "All 5 formats selected"
                : `${selectedFormats.size} format${selectedFormats.size !== 1 ? "s" : ""} selected · fewer = faster generation`}
            </p>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              data-testid="input-content"
              value={content}
              onChange={e => { setContent(e.target.value); setInputError(""); }}
              placeholder="Paste your blog post, article, podcast transcript, or any long-form content here…"
              rows={12}
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
            />
            {wordCount > 0 && (
              <span className="absolute bottom-3 right-4 text-xs text-slate-400 pointer-events-none">{wordCount} words</span>
            )}
          </div>

          {/* Model loading inline */}
          {isModelLoading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800">
              <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  {state === "checking-gpu" ? "Checking GPU…" : `Loading AI model — ${Math.round(progress?.percent ?? 0)}%`}
                </p>
                {state === "downloading" && (
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1 mt-1.5">
                    <div className="bg-purple-600 h-1 rounded-full transition-all" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
                  </div>
                )}
              </div>
            </div>
          )}

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
              disabled={isBusy || wordCount < 30 || selectedFormats.size === 0}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                isBusy || wordCount < 30 || selectedFormats.size === 0
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
              )}>
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Repurposing…</>
                : isModelLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Model loading…</>
                : `Repurpose into ${selectedFormats.size} format${selectedFormats.size !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}

      {/* Parse error fallback */}
      {parseError && rawOutput && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">{parseError}</p>
          </div>
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Raw Output</p>
              <CopyBtn text={rawOutput} />
            </div>
            <pre className="p-4 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">{rawOutput}</pre>
          </div>
        </div>
      )}

      {/* Streaming */}
      {isGenerating && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Generating {selectedFormats.size} format{selectedFormats.size !== 1 ? "s" : ""}…
            </p>
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
            Content over 800 words — the AI repurposed the first 800 words.
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
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {visibleTabs.map(f => (
                    <span key={f.id} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                      <f.icon className="w-2.5 h-2.5" />{f.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" data-testid="button-copy-all" onClick={copyAll}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  {copiedAll ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </button>
                <button type="button" data-testid="button-reset" onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <RotateCcw className="w-3 h-3" /> New
                </button>
              </div>
            </div>

            {/* Dynamic tabs — only show selected formats */}
            {visibleTabs.length > 1 && (
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {visibleTabs.map(tab => (
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
            )}

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>

                {activeTab === "tweets" && activeFormats.has("tweets") && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">5 Ready-to-Post Tweets</p>
                    {result.tweets.map((t, i) => <TweetCard key={i} tweet={t} index={i} />)}
                  </div>
                )}

                {activeTab === "linkedin" && activeFormats.has("linkedin") && (
                  <SectionPanel label="LinkedIn Post" onCopy={() => result.linkedin}>
                    {result.linkedin.split("\n\n").map((p, i) => (
                      <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3 last:mb-0">{p}</p>
                    ))}
                  </SectionPanel>
                )}

                {activeTab === "email" && activeFormats.has("email") && (
                  <div className="space-y-3">
                    {result.emailSubject && (
                      <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">Subject</span>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 flex-1">{result.emailSubject}</p>
                        <CopyIconBtn text={result.emailSubject} />
                      </div>
                    )}
                    <SectionPanel label="Email Newsletter Body" onCopy={() => result.emailBody}>
                      {result.emailBody.split("\n\n").map((p, i) => (
                        <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3 last:mb-0">{p}</p>
                      ))}
                    </SectionPanel>
                  </div>
                )}

                {activeTab === "hooks" && activeFormats.has("hooks") && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">3 Ad Hooks — Facebook / Google / LinkedIn Ads</p>
                    {result.adHooks.map((h, i) => <AdHookCard key={i} hook={h} index={i} />)}
                  </div>
                )}

                {activeTab === "instagram" && activeFormats.has("instagram") && (
                  <SectionPanel label="Instagram Caption + Hashtags" onCopy={() => result.instagram}>
                    {result.instagram.split("\n").map((line, i) =>
                      line.startsWith("#") ? (
                        <p key={i} className="text-xs text-purple-500 dark:text-purple-400 font-semibold mt-3 leading-loose">{line}</p>
                      ) : line.trim() === "" ? (
                        <br key={i} />
                      ) : (
                        <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{line}</p>
                      )
                    )}
                  </SectionPanel>
                )}

              </motion.div>
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
