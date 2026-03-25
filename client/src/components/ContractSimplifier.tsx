import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  Copy, Check, ShieldAlert, FileText, List, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeyClause {
  name: string;
  plain: string;
}

type Severity = "HIGH" | "MEDIUM" | "LOW";

interface RedFlag {
  severity: Severity;
  quote: string;
  risk: string;
  why: string;
}

interface AnalysisResult {
  summary: string;
  keyClauses: KeyClause[];
  redFlags: RedFlag[];
}

// ─── Prompt + parser ──────────────────────────────────────────────────────────

const MAX_WORDS = 900;

function truncateContract(text: string): { text: string; truncated: boolean } {
  const words = text.trim().split(/\s+/);
  if (words.length <= MAX_WORDS) return { text, truncated: false };
  return { text: words.slice(0, MAX_WORDS).join(" ") + " [...]", truncated: true };
}

function buildPrompt(contract: string): string {
  const { text } = truncateContract(contract);
  return `You are a plain-language legal analyst. Analyze this contract and explain it clearly for someone with no legal background.

CONTRACT:
${text}

Reply in this EXACT format — follow it precisely:

SUMMARY:
[2-3 paragraph plain English summary of what this contract does, who it's between, and what obligations it creates. No jargon.]

KEY_CLAUSES:
- CLAUSE: [clause name] | PLAIN: [one sentence plain English explanation]
- CLAUSE: [clause name] | PLAIN: [one sentence plain English explanation]
- CLAUSE: [clause name] | PLAIN: [one sentence plain English explanation]
- CLAUSE: [clause name] | PLAIN: [one sentence plain English explanation]
- CLAUSE: [clause name] | PLAIN: [one sentence plain English explanation]

RED_FLAGS:
- SEVERITY: HIGH | QUOTE: "[exact phrase from the contract, max 8 words]" | RISK: [risk name] | WHY: [1-2 sentence explanation why this is risky for the signing party]
- SEVERITY: MEDIUM | QUOTE: "[exact phrase]" | RISK: [risk name] | WHY: [explanation]
- SEVERITY: LOW | QUOTE: "[exact phrase]" | RISK: [risk name] | WHY: [explanation]
(If no red flags exist, write: RED_FLAGS: none)`;
}

function parseResult(raw: string): AnalysisResult | null {
  const getSection = (key: string): string => {
    const m = raw.match(new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, "i"));
    return m?.[1]?.trim() ?? "";
  };

  const summary = getSection("SUMMARY");
  if (!summary) return null;

  // Parse KEY_CLAUSES: lines like "- CLAUSE: X | PLAIN: Y"
  const clauseSection = getSection("KEY_CLAUSES");
  const keyClauses: KeyClause[] = clauseSection
    .split("\n")
    .map(line => {
      const m = line.match(/CLAUSE:\s*(.+?)\s*\|\s*PLAIN:\s*(.+)/i);
      return m ? { name: m[1].trim(), plain: m[2].trim() } : null;
    })
    .filter(Boolean) as KeyClause[];

  // Parse RED_FLAGS: lines like "- SEVERITY: X | QUOTE: "Y" | RISK: Z | WHY: W"
  const flagSection = getSection("RED_FLAGS");
  const redFlags: RedFlag[] = [];

  if (flagSection.toLowerCase() !== "none") {
    for (const line of flagSection.split("\n")) {
      const sevM = line.match(/SEVERITY:\s*(HIGH|MEDIUM|LOW)/i);
      const quoteM = line.match(/QUOTE:\s*"([^"]+)"/i) ?? line.match(/QUOTE:\s*([^|]+)/i);
      const riskM = line.match(/RISK:\s*([^|]+)/i);
      const whyM = line.match(/WHY:\s*(.+)/i);
      if (sevM && riskM) {
        redFlags.push({
          severity: sevM[1].toUpperCase() as Severity,
          quote: quoteM?.[1]?.trim() ?? "",
          risk: riskM[1].trim(),
          why: whyM?.[1]?.trim() ?? "",
        });
      }
    }
  }

  return { summary, keyClauses, redFlags };
}

// ─── Highlighted contract text ────────────────────────────────────────────────

function HighlightedContract({ text, redFlags }: { text: string; redFlags: RedFlag[] }) {
  const severityBg: Record<Severity, string> = {
    HIGH: "bg-red-200 dark:bg-red-800/60 text-red-900 dark:text-red-100",
    MEDIUM: "bg-amber-200 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100",
    LOW: "bg-yellow-200 dark:bg-yellow-800/50 text-yellow-900 dark:text-yellow-100",
  };

  // Normalize text: collapse all whitespace/newlines to single spaces for reliable matching
  const displayText = text.replace(/\s+/g, " ").trim();

  // Find a quote in the normalized text, tolerating whitespace differences
  function findRange(quote: string): [number, number] | null {
    const norm = displayText.toLowerCase();
    const q = quote.toLowerCase().trim().replace(/\s+/g, " ");

    // Exact match first
    const idx = norm.indexOf(q);
    if (idx !== -1) return [idx, idx + q.length];

    // Flexible: allow any whitespace between words
    const words = q.split(/\s+/).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).filter(Boolean);
    if (words.length < 2) return null;
    const regex = new RegExp(words.join("\\s+"), "i");
    const m = regex.exec(displayText);
    if (m) return [m.index, m.index + m[0].length];

    // Partial: try matching the first 4 words only
    const partial = words.slice(0, 4).join("\\s+");
    const regex2 = new RegExp(partial, "i");
    const m2 = regex2.exec(displayText);
    if (m2) return [m2.index, m2.index + m2[0].length];

    return null;
  }

  // Build highlight ranges from quotes
  type Range = { start: number; end: number; severity: Severity; risk: string };
  const ranges: Range[] = [];

  for (const flag of redFlags) {
    if (!flag.quote) continue;
    const found = findRange(flag.quote);
    if (found) {
      ranges.push({ start: found[0], end: found[1], severity: flag.severity, risk: flag.risk });
    }
  }

  // Sort by start, resolve overlaps (keep first)
  ranges.sort((a, b) => a.start - b.start);
  const resolved: Range[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start >= cursor) {
      resolved.push(r);
      cursor = r.end;
    }
  }

  // Build segments
  type Segment = { text: string; range?: Range };
  const segments: Segment[] = [];
  let pos = 0;
  for (const r of resolved) {
    if (r.start > pos) segments.push({ text: displayText.slice(pos, r.start) });
    segments.push({ text: displayText.slice(r.start, r.end), range: r });
    pos = r.end;
  }
  if (pos < displayText.length) segments.push({ text: displayText.slice(pos) });

  const hasHighlights = resolved.length > 0;

  return (
    <div>
      {!hasHighlights && (
        <p className="text-xs text-slate-400 mb-3 italic">No risk phrases were found to highlight in the provided text.</p>
      )}
      {hasHighlights && (
        <div className="flex flex-wrap gap-3 mb-4 text-xs">
          {(["HIGH", "MEDIUM", "LOW"] as Severity[]).map(s => (
            <span key={s} className={cn("px-2 py-1 rounded-full font-bold", severityBg[s])}>
              {s === "HIGH" ? "High Risk" : s === "MEDIUM" ? "Medium Risk" : "Low Risk"}
            </span>
          ))}
        </div>
      )}
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap font-mono text-xs">
        {segments.map((seg, i) =>
          seg.range ? (
            <mark
              key={i}
              title={`${seg.range.severity} risk: ${seg.range.risk}`}
              className={cn("rounded px-0.5 cursor-help not-italic font-medium", severityBg[seg.range.severity])}
            >
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
    </div>
  );
}

// ─── Severity badge ───────────────────────────────────────────────────────────

function SeverityBadge({ s }: { s: Severity }) {
  const styles: Record<Severity, string> = {
    HIGH: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    MEDIUM: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    LOW: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  };
  return (
    <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-full border", styles[s])}>
      {s === "HIGH" ? "High Risk" : s === "MEDIUM" ? "Med Risk" : "Low Risk"}
    </span>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "clauses", label: "Key Clauses", icon: List },
  { id: "risks", label: "Red Flags", icon: ShieldAlert },
  { id: "highlighted", label: "Highlighted", icon: Eye },
] as const;
type TabId = typeof TABS[number]["id"];

// ─── Main component ───────────────────────────────────────────────────────────

export function ContractSimplifier() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [contract, setContract] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const [inputError, setInputError] = useState("");
  const [wasTruncated, setWasTruncated] = useState(false);
  const [copied, setCopied] = useState(false);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;
  const wordCount = contract.trim() ? contract.trim().split(/\s+/).length : 0;

  // Count risks by severity
  const riskCounts = useMemo(() => {
    if (!result) return { HIGH: 0, MEDIUM: 0, LOW: 0 };
    return result.redFlags.reduce(
      (acc, f) => { acc[f.severity]++; return acc; },
      { HIGH: 0, MEDIUM: 0, LOW: 0 }
    );
  }, [result]);

  const handleAnalyze = useCallback(async () => {
    if (wordCount < 30) { setInputError("Please paste at least 30 words of contract text."); return; }
    setInputError("");
    setResult(null);
    setStreaming("");
    setIsDone(false);
    const { truncated } = truncateContract(contract);
    setWasTruncated(truncated);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are a plain-language legal analyst. Be precise, accurate, and always follow the exact output format requested. Never add extra commentary." },
        { role: "user", content: buildPrompt(contract) },
      ],
      temperature: 0.2,
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
  }, [contract, wordCount, generateRaw]);

  const handleReset = () => {
    setContract(""); setResult(null); setStreaming(""); setIsDone(false); setInputError(""); setWasTruncated(false);
  };

  const copyReport = () => {
    if (!result) return;
    const text = [
      "=== PLAIN ENGLISH SUMMARY ===\n" + result.summary,
      "=== KEY CLAUSES ===\n" + result.keyClauses.map(c => `• ${c.name}: ${c.plain}`).join("\n"),
      "=== RED FLAGS ===\n" + (result.redFlags.length
        ? result.redFlags.map(f => `[${f.severity}] ${f.risk}\nQuote: "${f.quote}"\n${f.why}`).join("\n\n")
        : "No significant red flags found."),
    ].join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input */}
      {!isDone && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Contract Text</p>
            <span className="text-xs text-slate-400">{wordCount > 0 ? `${wordCount} words` : ""}</span>
          </div>
          <textarea
            data-testid="input-contract"
            value={contract}
            onChange={e => { setContract(e.target.value); setInputError(""); }}
            placeholder="Paste your contract, NDA, employment agreement, terms of service, or any legal document here…"
            rows={16}
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />
          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Private — your contract text never leaves your browser</span>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />{inputError}
              </p>
            )}
            <button type="button" data-testid="button-analyze"
              onClick={handleAnalyze}
              disabled={isBusy || wordCount < 30}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                isBusy || wordCount < 30
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
              )}>
              {isBusy
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                : <><ShieldAlert className="w-4 h-4" /> Analyze Contract</>}
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
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Reading contract…</p>
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
            Contract over 900 words — the AI analyzed the first 900 words. For full analysis of longer contracts, split into sections and analyze each one.
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Analysis Complete</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {riskCounts.HIGH > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                      {riskCounts.HIGH} High Risk
                    </span>
                  )}
                  {riskCounts.MEDIUM > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {riskCounts.MEDIUM} Medium Risk
                    </span>
                  )}
                  {riskCounts.LOW > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                      {riskCounts.LOW} Low Risk
                    </span>
                  )}
                  {result.redFlags.length === 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      No Red Flags
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" data-testid="button-copy-report" onClick={copyReport}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy Report"}
                </button>
                <button type="button" data-testid="button-reset" onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <RotateCcw className="w-3 h-3" /> New Contract
                </button>
              </div>
            </div>

            {/* Tabs */}
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
                  {tab.id === "risks" && result.redFlags.length > 0 && (
                    <span className="hidden sm:inline w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                      {result.redFlags.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>

                {/* Summary */}
                {activeTab === "summary" && (
                  <div className="glass-panel rounded-2xl p-5 space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plain English Summary</p>
                    {result.summary.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{para}</p>
                    ))}
                  </div>
                )}

                {/* Key Clauses */}
                {activeTab === "clauses" && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Key Clauses Explained</p>
                    {result.keyClauses.length === 0 && (
                      <p className="text-sm text-slate-400 italic px-1">No key clauses were extracted.</p>
                    )}
                    {result.keyClauses.map((clause, i) => (
                      <div key={i} className="flex gap-3 p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{clause.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{clause.plain}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Red Flags */}
                {activeTab === "risks" && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                      Red Flags &amp; Risks — {result.redFlags.length === 0 ? "None Found" : `${result.redFlags.length} identified`}
                    </p>
                    {result.redFlags.length === 0 && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                        <span className="text-2xl">✓</span>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">No significant red flags identified in this contract.</p>
                      </div>
                    )}
                    {result.redFlags.map((flag, i) => (
                      <div key={i} className={cn(
                        "p-4 rounded-2xl border space-y-2",
                        flag.severity === "HIGH"
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : flag.severity === "MEDIUM"
                          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                          : "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800"
                      )}>
                        <div className="flex items-center gap-2">
                          <SeverityBadge s={flag.severity} />
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{flag.risk}</p>
                        </div>
                        {flag.quote && (
                          <blockquote className="text-xs text-slate-500 dark:text-slate-400 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">
                            "{flag.quote}"
                          </blockquote>
                        )}
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{flag.why}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlighted contract */}
                {activeTab === "highlighted" && (
                  <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contract with Risk Highlights</p>
                      <p className="text-[10px] text-slate-400">Hover highlights to see risk details</p>
                    </div>
                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                      <HighlightedContract text={contract} redFlags={result.redFlags} />
                    </div>
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
