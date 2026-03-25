import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  Copy, Check, EyeOff, ShieldCheck, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ────────────────────────────────────────────────────────────────────

type PiiCategory =
  | "NAME" | "EMAIL" | "PHONE" | "ADDRESS" | "SSN"
  | "CREDIT_CARD" | "DOB" | "IP" | "URL" | "ORGANIZATION"
  | "MEDICAL" | "ACCOUNT_NUMBER" | "ID_NUMBER" | "OTHER";

interface PiiItem {
  id: string;
  type: PiiCategory;
  value: string;
  placeholder: string;
  masked: boolean;
}

// ─── Category metadata ────────────────────────────────────────────────────────

const CAT_META: Record<PiiCategory, { label: string; color: string; badge: string }> = {
  NAME:           { label: "Name",           color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",     badge: "[NAME]" },
  EMAIL:          { label: "Email",          color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800", badge: "[EMAIL]" },
  PHONE:          { label: "Phone",          color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",   badge: "[PHONE]" },
  ADDRESS:        { label: "Address",        color: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800", badge: "[ADDRESS]" },
  SSN:            { label: "SSN",            color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",         badge: "[SSN]" },
  CREDIT_CARD:    { label: "Credit Card",    color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",         badge: "[CREDIT_CARD]" },
  DOB:            { label: "Date of Birth",  color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800", badge: "[DOB]" },
  IP:             { label: "IP Address",     color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",  badge: "[IP]" },
  URL:            { label: "URL / Domain",   color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",     badge: "[URL]" },
  ORGANIZATION:   { label: "Organization",   color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800", badge: "[ORGANIZATION]" },
  MEDICAL:        { label: "Medical",        color: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",     badge: "[MEDICAL]" },
  ACCOUNT_NUMBER: { label: "Account No.",    color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",         badge: "[ACCOUNT]" },
  ID_NUMBER:      { label: "ID / Passport",  color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",         badge: "[ID]" },
  OTHER:          { label: "Other PII",      color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",  badge: "[PII]" },
};

const HIGH_SENSITIVITY: PiiCategory[] = ["SSN", "CREDIT_CARD", "ACCOUNT_NUMBER", "ID_NUMBER", "MEDICAL"];

// ─── Prompt ───────────────────────────────────────────────────────────────────

const MAX_WORDS = 600;

function truncate(text: string): { text: string; truncated: boolean } {
  const words = text.trim().split(/\s+/);
  if (words.length <= MAX_WORDS) return { text, truncated: false };
  return { text: words.slice(0, MAX_WORDS).join(" ") + " [...]", truncated: true };
}

function buildPrompt(text: string): string {
  const { text: t } = truncate(text);
  return `You are a privacy expert. Find ALL personally identifiable information (PII) in this text and replace each item with a labeled placeholder.

TEXT:
${t}

Use these placeholder labels:
- Full names of people → [NAME]
- Email addresses → [EMAIL]
- Phone numbers → [PHONE]
- Physical / mailing addresses → [ADDRESS]
- Social Security Numbers → [SSN]
- Credit or debit card numbers → [CREDIT_CARD]
- Dates of birth → [DOB]
- IP addresses → [IP]
- Website URLs or domains → [URL]
- Company or organization names → [ORGANIZATION]
- Medical conditions, diagnoses, medications → [MEDICAL]
- Bank account or routing numbers → [ACCOUNT_NUMBER]
- Passport or government ID numbers → [ID_NUMBER]
- Any other personal identifiers → [OTHER]

Reply in this EXACT format:

REDACTED_TEXT:
[copy the full original text, replacing every PII value with its placeholder]

PII_DETECTED:
- TYPE: NAME | VALUE: John Doe
- TYPE: EMAIL | VALUE: john@example.com
(one line per unique PII item; write "PII_DETECTED: none" if no PII found)`;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseResponse(raw: string, originalText: string): { redacted: string; items: PiiItem[] } | null {
  const redactedMatch = raw.match(/REDACTED_TEXT:\s*\n([\s\S]*?)(?=\nPII_DETECTED:|$)/i);
  const redacted = redactedMatch?.[1]?.trim() ?? "";

  if (!redacted) return null;

  const piiSection = raw.match(/PII_DETECTED:\s*\n?([\s\S]*?)(?=$)/i)?.[1]?.trim() ?? "";

  const items: PiiItem[] = [];

  if (piiSection && piiSection.toLowerCase() !== "none") {
    const lines = piiSection.split("\n").filter(l => l.trim().startsWith("-"));
    for (const line of lines) {
      const typeMatch = line.match(/TYPE:\s*([A-Z_]+)/i);
      const valueMatch = line.match(/VALUE:\s*(.+)/i);
      if (typeMatch && valueMatch) {
        const type = typeMatch[1].toUpperCase() as PiiCategory;
        const value = valueMatch[1].trim().replace(/^["']|["']$/g, "");
        const meta = CAT_META[type] ?? CAT_META.OTHER;
        if (value && value.toLowerCase() !== "none") {
          items.push({
            id: `${type}-${items.length}`,
            type: (type in CAT_META ? type : "OTHER") as PiiCategory,
            value,
            placeholder: meta.badge,
            masked: true,
          });
        }
      }
    }
  }

  // Fallback: if AI gave no list but did redact, infer items from placeholders
  if (items.length === 0 && redacted !== originalText) {
    const placeholderRe = /\[(NAME|EMAIL|PHONE|ADDRESS|SSN|CREDIT_CARD|DOB|IP|URL|ORGANIZATION|MEDICAL|ACCOUNT_NUMBER|ID_NUMBER|OTHER|ACCOUNT|PII)\]/g;
    const seen = new Set<string>();
    let m: RegExpExecArray | null;
    while ((m = placeholderRe.exec(redacted)) !== null) {
      const key = m[1] === "ACCOUNT" ? "ACCOUNT_NUMBER" : m[1] === "PII" ? "OTHER" : m[1] as PiiCategory;
      if (!seen.has(key)) {
        seen.add(key);
        items.push({ id: key, type: key as PiiCategory, value: "(detected)", placeholder: CAT_META[key as PiiCategory]?.badge ?? `[${key}]`, masked: true });
      }
    }
  }

  return { redacted, items };
}

// ─── Redacted text renderer ───────────────────────────────────────────────────

function RedactedView({ text, items }: { text: string; items: PiiItem[] }) {
  // Segment the redacted text to colorize placeholders
  const segments: Array<{ text: string; type?: PiiCategory }> = [];
  const placeholderRe = /(\[(?:NAME|EMAIL|PHONE|ADDRESS|SSN|CREDIT_CARD|DOB|IP|URL|ORGANIZATION|MEDICAL|ACCOUNT(?:_NUMBER)?|ID_NUMBER|OTHER|ACCOUNT|PII)\])/g;

  let last = 0, m: RegExpExecArray | null;
  while ((m = placeholderRe.exec(text)) !== null) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index) });
    const tag = m[1].replace(/[\[\]]/g, "");
    const type = tag === "ACCOUNT" ? "ACCOUNT_NUMBER" : tag === "PII" ? "OTHER" : tag as PiiCategory;
    segments.push({ text: m[1], type });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });

  return (
    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
      {segments.map((seg, i) =>
        seg.type ? (
          <mark key={i} className={cn("rounded px-1 py-0.5 text-xs font-bold not-italic border", CAT_META[seg.type]?.color ?? CAT_META.OTHER.color)}>
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PiiRedactor() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [input, setInput] = useState("");
  const [redacted, setRedacted] = useState("");
  const [items, setItems] = useState<PiiItem[]>([]);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [activeTab, setActiveTab] = useState<"redacted" | "detected">("redacted");
  const [inputError, setInputError] = useState("");
  const [wasTruncated, setWasTruncated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [allMasked, setAllMasked] = useState(true);

  const isGenerating = state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isModelLoading;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  // Build current redacted text based on masked/unmasked toggles
  const displayText = useMemo(() => {
    if (!redacted) return "";
    let text = redacted;
    // For unmasked items, replace placeholder back with original value
    for (const item of items) {
      if (!item.masked) {
        text = text.replaceAll(item.placeholder, item.value);
      }
    }
    return text;
  }, [redacted, items]);

  const handleAnalyze = useCallback(async () => {
    if (wordCount < 5) { setInputError("Please paste at least 5 words of text."); return; }
    setInputError("");
    setRedacted("");
    setItems([]);
    setStreaming("");
    setIsDone(false);
    const { truncated } = truncate(input);
    setWasTruncated(truncated);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are a precise privacy compliance tool. Detect all PII accurately. Never miss sensitive data. Always follow the exact output format." },
        { role: "user", content: buildPrompt(input) },
      ],
      temperature: 0.05,
      maxTokens: 1200,
      onChunk: chunk => setStreaming(chunk),
    });

    if (raw) {
      const parsed = parseResponse(raw, input);
      if (parsed) {
        setRedacted(parsed.redacted);
        setItems(parsed.items);
        setIsDone(true);
        setActiveTab("redacted");
        setAllMasked(true);
      } else {
        setInputError("Couldn't parse the AI response — try again or rephrase your text.");
      }
    }
    setStreaming("");
  }, [input, wordCount, generateRaw]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, masked: !it.masked } : it));
  };

  const toggleAll = () => {
    const next = !allMasked;
    setItems(prev => prev.map(it => ({ ...it, masked: next })));
    setAllMasked(next);
  };

  const handleReset = () => {
    setInput(""); setRedacted(""); setItems([]); setStreaming("");
    setIsDone(false); setInputError(""); setWasTruncated(false);
  };

  const highCount = items.filter(i => HIGH_SENSITIVITY.includes(i.type)).length;
  const maskedCount = items.filter(i => i.masked).length;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input */}
      {!isDone && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Text to Scan</p>
            {wordCount > 0 && <span className="text-xs text-slate-400">{wordCount} words</span>}
          </div>
          <textarea
            data-testid="input-text"
            value={input}
            onChange={e => { setInput(e.target.value); setInputError(""); }}
            placeholder="Paste any text containing personal data — emails, names, phone numbers, addresses, medical records, contracts, support tickets…"
            rows={12}
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />

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
              <span>Private — text never leaves your browser</span>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />{inputError}
              </p>
            )}
            <button type="button" data-testid="button-scan"
              onClick={handleAnalyze}
              disabled={isBusy || wordCount < 5}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                isBusy || wordCount < 5
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
              )}>
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning for PII…</>
                : isModelLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Model loading…</>
                : <><EyeOff className="w-4 h-4" /> Detect &amp; Redact PII</>}
            </button>
          </div>
        </div>
      )}

      {/* Streaming */}
      {isGenerating && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Scanning for personal data…</p>
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
            Text over 600 words — only the first 600 words were scanned. Split longer documents into sections.
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
        {isDone && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Summary bar */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Scan Complete</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {items.length === 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" /> No PII detected
                    </span>
                  ) : (
                    <>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {items.length} item{items.length !== 1 ? "s" : ""} found
                      </span>
                      {highCount > 0 && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                          {highCount} high-sensitivity
                        </span>
                      )}
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        {maskedCount} masked
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {items.length > 0 && (
                  <button type="button" data-testid="button-toggle-all" onClick={toggleAll}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 transition-colors">
                    {allMasked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {allMasked ? "Reveal All" : "Mask All"}
                  </button>
                )}
                <button type="button" data-testid="button-reset" onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <RotateCcw className="w-3 h-3" /> New Scan
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {[
                { id: "redacted" as const, label: "Redacted Text" },
                { id: "detected" as const, label: `Detected PII${items.length > 0 ? ` (${items.length})` : ""}` },
              ].map(tab => (
                <button key={tab.id} type="button" data-testid={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all",
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}>
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>

                {/* Redacted text tab */}
                {activeTab === "redacted" && (
                  <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {maskedCount > 0 ? `Redacted — ${maskedCount} item${maskedCount !== 1 ? "s" : ""} masked` : "No items masked"}
                      </p>
                      <button type="button" data-testid="button-copy-redacted"
                        onClick={() => { navigator.clipboard.writeText(displayText); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors">
                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="p-4 max-h-[50vh] overflow-y-auto">
                      <RedactedView text={displayText} items={items} />
                    </div>
                  </div>
                )}

                {/* Detected PII tab */}
                {activeTab === "detected" && (
                  <div className="space-y-3">
                    {items.length === 0 ? (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">No PII was detected in this text.</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 px-1">Toggle individual items to mask or reveal them in the redacted text.</p>
                        {items.map(item => {
                          const meta = CAT_META[item.type] ?? CAT_META.OTHER;
                          const isHigh = HIGH_SENSITIVITY.includes(item.type);
                          return (
                            <div key={item.id}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border transition-all",
                                item.masked
                                  ? "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                                  : "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-60"
                              )}>
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", meta.color)}>
                                    {meta.label}
                                  </span>
                                  {isHigh && (
                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                                      HIGH SENSITIVITY
                                    </span>
                                  )}
                                </div>
                                <p className={cn(
                                  "text-sm font-mono truncate",
                                  item.masked ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-500 line-through"
                                )}>
                                  {item.value === "(detected)" ? meta.badge : item.value}
                                </p>
                                <p className="text-[10px] text-slate-400">→ redacted as <span className="font-bold">{meta.badge}</span></p>
                              </div>
                              <button type="button"
                                data-testid={`toggle-item-${item.id}`}
                                onClick={() => toggleItem(item.id)}
                                className={cn(
                                  "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border shrink-0 transition-all",
                                  item.masked
                                    ? "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 hover:text-red-500"
                                    : "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300"
                                )}>
                                {item.masked ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {item.masked ? "Masked" : "Revealed"}
                              </button>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
