import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minimize2, Loader2, AlertTriangle, CheckCircle2,
  Download, Copy, Save, FolderOpen, Trash2, X, RotateCcw,
  RefreshCw, ArrowDown, TrendingDown, Scissors, MessageSquare, Heading
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useShortenerStorage } from "@/hooks/use-shortener-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const LEVELS = [
  { id: "slight", label: "Slightly Shorter", desc: "Minor reduction", target: "20-30%" },
  { id: "concise", label: "Concise", desc: "50% shorter", target: "40-60%" },
  { id: "ultra", label: "Ultra Concise", desc: "Minimum words", target: "60-80%" },
];

const FORMATS = [
  { id: "includeStandard", label: "Standard Short", desc: "Primary shortened version", icon: Scissors },
  { id: "includeTweet", label: "Tweet-Length", desc: "280 chars max", icon: MessageSquare },
  { id: "includeHeadline", label: "Headline", desc: "10 words max", icon: Heading },
];

const EXAMPLE_TEXT = "Due to the fact that modern businesses increasingly rely on digital systems, cybersecurity has become an essential priority for organizations.";

const SYSTEM_PROMPT = `You are an expert editor specializing in concise writing, wordiness elimination, and clarity improvement. You make sentences shorter while preserving their core meaning.`;

const LEVEL_INSTRUCTIONS: Record<string, string> = {
  slight: "Remove obvious wordiness. Keep structure mostly intact. Target 20-30% reduction.",
  concise: "Significant reduction. Rephrase for brevity. Target 40-60% reduction.",
  ultra: "Minimum essential words only. Maximum impact. Target 60-80% reduction.",
};

interface ShortenedVersion {
  id: string;
  label: string;
  text: string;
  wordCount: number;
  charCount: number;
}

interface RemovalItem {
  original: string;
  replacement: string;
  category: string;
}

interface ShortenerResult {
  id: string;
  versions: ShortenedVersion[];
  removals: RemovalItem[];
  improvements: string[];
  originalWords: number;
  originalChars: number;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function parseShortened(raw: string, origWords: number, origChars: number, wantStd: boolean, wantTweet: boolean, wantHeadline: boolean): ShortenerResult | null {
  const versions: ShortenedVersion[] = [];
  const removals: RemovalItem[] = [];
  const improvements: string[] = [];

  const lines = raw.split("\n");
  let currentSection = "";
  let currentLabel = "";
  let currentLines: string[] = [];

  let altCounter = 0;

  const SECTION_RE: Array<{ re: RegExp; section: string; label: string | (() => string) }> = [
    { re: /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:STANDARD\s*SHORT|SHORTENED?\s*VERSION|PRIMARY)/i, section: "version", label: "Standard Short" },
    { re: /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:TWEET|280\s*CHAR|TWITTER)/i, section: "version", label: "Tweet-Length" },
    { re: /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:HEADLINE|10\s*WORD)/i, section: "version", label: "Headline" },
    { re: /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:ALTERNATIVE\s*(?:VERSION)?\s*\d?|VERSION\s*[2-5]|DIFFERENT\s*(?:VERSION|APPROACH))/i, section: "version", label: () => `Alternative ${++altCounter}` },
    { re: /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:WHAT\s*WAS\s*REMOVED|REMOVAL|CHANGES\s*MADE)/i, section: "removals", label: "" },
    { re: /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:IMPROVEMENT|NOTES|WHY\s*(?:THIS|IT)\s*WORKS)/i, section: "improvements", label: "" },
    { re: /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:REDUCTION|ANALYSIS|STATISTICS|STATS|WORDINESS\s*PATTERN|COMMON\s*PROBLEM)/i, section: "skip", label: "" },
  ];

  const STOP_RE = /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:LEARN\s*MORE|WORDINESS\s*PATTERN|COMMON\s*PROBLEM)/i;

  const flushVersion = () => {
    if (currentLabel && currentLines.length > 0) {
      let text = currentLines.join(" ").replace(/\s+/g, " ").replace(/^["*]+|["*]+$/g, "").trim();
      if (text.length > 5) {
        const existing = versions.find(v => v.label === currentLabel);
        if (!existing) {
          versions.push({
            id: generateId(),
            label: currentLabel,
            text,
            wordCount: wordCount(text),
            charCount: text.length,
          });
        }
      }
    }
    currentLabel = "";
    currentLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (STOP_RE.test(trimmed)) { flushVersion(); break; }

    let matched = false;
    for (const sr of SECTION_RE) {
      if (sr.re.test(trimmed)) {
        flushVersion();
        currentSection = sr.section;
        if (sr.section === "version") currentLabel = typeof sr.label === "function" ? sr.label() : sr.label;

        const colonIdx = trimmed.indexOf(":");
        if (colonIdx !== -1 && sr.section === "version") {
          const after = trimmed.slice(colonIdx + 1).replace(/^[\s*"]+|[\s*"]+$/g, "").trim();
          if (after.length > 5) currentLines.push(after);
        }
        matched = true;
        break;
      }
    }
    if (matched) continue;

    if (currentSection === "version" && currentLabel) {
      const cleaned = trimmed.replace(/^["*]+|["*]+$/g, "").trim();
      if (cleaned.length > 5
        && !cleaned.match(/^(?:character|word|char)\s*(?:count|:)/i)
        && !cleaned.match(/^(?:perfect|ideal)\s*for/i)
        && !cleaned.match(/^\d+\s*\/\s*\d+/)
        && !cleaned.match(/^(?:CHANGES?\s*MADE|REMOVED|TYPE|CATEGORY|SAVED?|REDUCTION)/i)
        && !cleaned.match(/^[-*]\s*[""]/)
      ) {
        currentLines.push(cleaned);
      }
    } else if (currentSection === "removals") {
      const removalMatch = trimmed.match(/[""]([^""]+)[""].*?(?:→|->|=>|becomes?|→)\s*[""]?([^"""\n]+)[""]?/i);
      if (removalMatch) {
        const orig = removalMatch[1].trim();
        const repl = removalMatch[2].replace(/["*]+$/g, "").trim();
        const catMatch = trimmed.match(/(?:type|category)[:\s]*([^\n,]+)/i);
        removals.push({ original: orig, replacement: repl || "(removed)", category: catMatch?.[1]?.trim() || "Wordiness" });
      } else {
        const simpleMatch = trimmed.match(/^[-*\u2717\u2718\u274c\u2022]\s*[""]?([^""]+)[""]?\s*(?:→|->|=>)\s*[""]?([^"""\n]+)[""]?/);
        if (simpleMatch) {
          removals.push({ original: simpleMatch[1].trim(), replacement: simpleMatch[2].replace(/["*]+$/g, "").trim(), category: "Wordiness" });
        }
      }
    } else if (currentSection === "improvements") {
      const item = trimmed.replace(/^[-*\u2022\u2713\u2714\d.)\s]+/, "").replace(/\*{2}/g, "").trim();
      if (item.length > 5) improvements.push(item);
    }
  }
  flushVersion();

  if (versions.length === 0) {
    const allText = raw.replace(/^(#{1,3}.*|\*{2}.*\*{2}|STANDARD.*|TWEET.*|HEADLINE.*|WHAT.*|IMPROVEMENT.*|REDUCTION.*)\n/gim, "").trim();
    const cleaned = allText.replace(/\s+/g, " ").replace(/^["*]+|["*]+$/g, "").trim();
    if (cleaned.length > 5) {
      versions.push({
        id: generateId(),
        label: "Shortened Version",
        text: cleaned.slice(0, 500),
        wordCount: wordCount(cleaned.slice(0, 500)),
        charCount: cleaned.slice(0, 500).length,
      });
    }
  }

  if (versions.length === 0) return null;

  const filteredVersions = versions.filter(v => {
    if (v.label === "Standard Short" && !wantStd) return false;
    if (v.label === "Tweet-Length" && !wantTweet) return false;
    if (v.label === "Headline" && !wantHeadline) return false;
    return true;
  });

  const seen = new Set<string>();
  const deduped = filteredVersions.filter(v => {
    const key = v.text.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  for (const v of deduped) {
    if (v.label === "Tweet-Length" && v.charCount > 280) {
      v.text = v.text.slice(0, 277) + "...";
      v.charCount = v.text.length;
      v.wordCount = wordCount(v.text);
    }
    if (v.label === "Headline" && v.wordCount > 10) {
      const words = v.text.split(/\s+/).slice(0, 10);
      v.text = words.join(" ");
      v.wordCount = words.length;
      v.charCount = v.text.length;
    }
  }

  return { id: generateId(), versions: deduped.length > 0 ? deduped : versions, removals, improvements, originalWords: origWords, originalChars: origChars };
}

export function ShortenerGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useShortenerStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [sourceText, setSourceText] = useState("");
  const [level, setLevel] = useState("concise");
  const [includeStandard, setIncludeStandard] = useState(true);
  const [includeTweet, setIncludeTweet] = useState(true);
  const [includeHeadline, setIncludeHeadline] = useState(true);

  const formatState: Record<string, [boolean, (v: boolean) => void]> = {
    includeStandard: [includeStandard, setIncludeStandard],
    includeTweet: [includeTweet, setIncludeTweet],
    includeHeadline: [includeHeadline, setIncludeHeadline],
  };

  const [streamedContent, setStreamedContent] = useState("");
  const [result, setResult] = useState<ShortenerResult | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const hasFormat = includeStandard || includeTweet || includeHeadline;
  const isFormValid = sourceText.trim().length >= 10 && hasFormat;
  const srcWords = wordCount(sourceText);

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");

    const levelInst = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.concise;

    const prompt = `Shorten this sentence. ${levelInst}

SENTENCE: "${sourceText}"

Write EXACTLY this output, filling in the quotes:

${includeStandard ? `STANDARD SHORT:
"[write a shortened version here]"

` : ""}${includeTweet ? `TWEET-LENGTH:
"[write a version under 280 characters here]"

` : ""}${includeHeadline ? `HEADLINE:
"[write a version of 10 words or fewer here]"

` : ""}ALTERNATIVE VERSION 1:
"[write a different shortened version using different word choices]"

ALTERNATIVE VERSION 2:
"[write yet another shortened version with a different structure]"

REMOVALS:
- "[original phrase]" -> "[replacement]" ([category])
- "[original phrase]" -> "[replacement]" ([category])
- "[original phrase]" -> "[replacement]" ([category])

NOTES:
- [improvement note 1]
- [improvement note 2]

Do NOT add any other sections. Do NOT repeat the original sentence. Just fill in the template above.`;

    const origW = wordCount(sourceText);
    const origC = sourceText.trim().length;

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      maxTokens: 3000,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw shortener output:", finalContent);
      const parsed = parseShortened(finalContent, origW, origC, includeStandard, includeTweet, includeHeadline);
      if (!parsed || parsed.versions.length === 0) {
        setEmptyError("Could not parse the shortened output. Please try again.");
      } else {
        setResult(parsed);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setSourceText(""); setLevel("concise");
    setIncludeStandard(true); setIncludeTweet(true); setIncludeHeadline(true);
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = result.versions.map(v => `${v.label}:\n${v.text}`).join("\n\n");
    handleCopy(text, "all");
  };

  const handleDownload = () => {
    if (!result) return;
    let text = `ORIGINAL: ${sourceText}\n(${result.originalWords} words, ${result.originalChars} chars)\n\n`;
    result.versions.forEach(v => {
      const reduction = Math.round((1 - v.wordCount / Math.max(result.originalWords, 1)) * 100);
      text += `--- ${v.label} (${v.wordCount} words, ${v.charCount} chars, ${reduction}% shorter) ---\n${v.text}\n\n`;
    });
    if (result.removals.length > 0) {
      text += `WHAT WAS REMOVED:\n${result.removals.map(r => `- "${r.original}" -> "${r.replacement}" (${r.category})`).join("\n")}\n\n`;
    }
    if (result.improvements.length > 0) {
      text += `IMPROVEMENTS:\n${result.improvements.map(i => `- ${i}`).join("\n")}`;
    }
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "shortened-sentence.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!result) return;
    saveDraft({
      label: sourceText.slice(0, 60),
      content: JSON.stringify(result),
      formData: { sourceText, level, includeStandard, includeTweet, includeHeadline },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setSourceText(fd.sourceText || "");
    setLevel(fd.level); setIncludeStandard(fd.includeStandard);
    setIncludeTweet(fd.includeTweet); setIncludeHeadline(fd.includeHeadline);
    try {
      const restored: ShortenerResult = JSON.parse(draft.content);
      if (restored && restored.versions?.length > 0) setResult(restored);
    } catch { setResult(null); }
    setStreamedContent(""); setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="shr-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="shr-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Shortenings</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved shortenings" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map(draft => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved shortening" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="shr-source" className="text-sm font-semibold text-slate-700 ml-1">Long Sentence *</label>
              <button data-testid="button-load-example" type="button" onClick={() => setSourceText(EXAMPLE_TEXT)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Load Example</button>
            </div>
            <div className="relative">
              <textarea id="shr-source" data-testid="input-source" value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder={'Paste a long sentence to shorten...\n\nExample: "Due to the fact that modern businesses increasingly rely on digital systems, cybersecurity has become an essential priority for organizations."'} maxLength={1000} rows={4} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400">
                <span data-testid="text-word-count">{srcWords} words</span>
                <span>{sourceText.length}/1000</span>
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Shortening Level *</legend>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(lv => {
                const isActive = level === lv.id;
                return (
                  <button key={lv.id} data-testid={`button-level-${lv.id}`} type="button" onClick={() => setLevel(lv.id)} aria-pressed={isActive} className={cn("flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <span className={cn("font-semibold text-sm", isActive ? "text-purple-800" : "text-slate-700")}>{lv.label}</span>
                    <span className="text-[10px] text-slate-400">{lv.desc}</span>
                    <span className={cn("text-xs font-bold mt-0.5", isActive ? "text-purple-600" : "text-slate-300")}>{lv.target}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Output Formats</legend>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map(fmt => {
                const [val, setVal] = formatState[fmt.id];
                const Icon = fmt.icon;
                return (
                  <button key={fmt.id} data-testid={`button-format-${fmt.id}`} type="button" onClick={() => setVal(!val)} aria-pressed={val} className={cn("flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all", val ? "border-purple-500 bg-purple-50" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <Icon className={cn("w-4 h-4", val ? "text-purple-600" : "text-slate-400")} />
                    <span className={cn("font-semibold text-xs", val ? "text-purple-800" : "text-slate-700")}>{fmt.label}</span>
                    <span className="text-[10px] text-slate-400">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
            {!hasFormat && (
              <p className="text-xs text-red-500 mt-2 ml-1" data-testid="text-format-error">Select at least one output format.</p>
            )}
          </fieldset>
        </div>

        {(state === "checking-gpu" || state === "downloading") && (
          <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700">
                {state === "checking-gpu" && "Verifying hardware..."}
                {state === "downloading" && "Loading AI Engine..."}
              </span>
            </div>
            {state === "downloading" && (
              <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button data-testid="button-generate" onClick={handleGenerate} disabled={!isFormValid || isGenerating || !isReady} className={cn("flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3", isFormValid && !isGenerating && isReady ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Shortening...</>) : (<><Scissors className="w-5 h-5" /> Shorten Sentence</>)}
          </button>
          <button data-testid="button-reset" type="button" onClick={handleReset} disabled={isGenerating} className={cn("px-4 py-4 rounded-2xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2", isGenerating ? "border-slate-200 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50")}>
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {emptyError && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3" data-testid="alert-empty-result">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{emptyError}</p>
        </div>
      )}

      {isGenerating && streamedContent && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-sm font-semibold text-purple-600">Shortening sentence...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && result && result.versions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <h4 className="font-bold text-slate-700 text-sm">Reduction Analysis</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Original</p>
                  <p className="font-bold text-slate-800 text-lg" data-testid="text-original-words">{result.originalWords}</p>
                  <p className="text-[10px] text-slate-400">words</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center flex flex-col items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-emerald-500 mb-1" />
                  <p className="font-bold text-emerald-600 text-sm" data-testid="text-reduction">
                    {result.versions[0] ? `${Math.round((1 - result.versions[0].wordCount / Math.max(result.originalWords, 1)) * 100)}% shorter` : ""}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Shortened</p>
                  <p className="font-bold text-emerald-700 text-lg" data-testid="text-shortened-words">{result.versions[0]?.wordCount || 0}</p>
                  <p className="text-[10px] text-slate-400">words</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {result.versions.map((version, idx) => {
                const reduction = Math.round((1 - version.wordCount / Math.max(result.originalWords, 1)) * 100);
                return (
                  <div key={version.id} className={cn("bg-white rounded-xl border shadow-sm p-4", idx === 0 ? "border-purple-200" : "border-slate-200")} data-testid={`card-version-${idx}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">Best</span>}
                        <span className="font-semibold text-slate-800 text-sm">{version.label}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-bold">{reduction}% shorter</span>
                    </div>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed" data-testid={`text-version-${idx}`}>"{version.text}"</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{version.wordCount} words</span>
                        <span>{version.charCount} chars</span>
                        {version.label.includes("Tweet") && version.charCount <= 280 && <span className="text-emerald-600 font-medium">Fits Twitter/X</span>}
                        {version.label.includes("Headline") && version.wordCount <= 10 && <span className="text-emerald-600 font-medium">Under 10 words</span>}
                      </div>
                      <button data-testid={`button-copy-version-${idx}`} onClick={() => handleCopy(version.text, `v-${idx}`)} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
                        {copiedId === `v-${idx}` ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedId === `v-${idx}` ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {result.removals.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" /> What Was Removed
                </h4>
                <div className="space-y-2">
                  {result.removals.map((removal, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100 text-sm">
                      <X className="w-3 h-3 text-red-400 shrink-0 mt-1" />
                      <div>
                        <span className="text-red-500 line-through">"{removal.original}"</span>
                        <span className="text-slate-400 mx-2">{"-->"}</span>
                        <span className="text-emerald-600 font-medium">"{removal.replacement}"</span>
                        <span className="text-xs text-slate-400 ml-2">({removal.category})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.improvements.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Improvement Notes
                </h4>
                <div className="space-y-1">
                  {result.improvements.map((imp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      {imp}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
              <InlineShareButtons />
              <button data-testid="button-download" onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
              <button data-testid="button-save" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved" : "Save"}
              </button>
              <button data-testid="button-regenerate" onClick={handleGenerate} disabled={!isFormValid || isGenerating || !isReady} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <RefreshCw className="w-4 h-4" /> Shorten Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
