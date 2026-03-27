import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  Upload, FileText, ExternalLink, ChevronDown, ChevronUp,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Types ────────────────────────────────────────────────────────────────────

type Sensitivity = "low" | "medium" | "strict";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

interface RepeatedPhrase {
  phrase: string;
  count: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

interface AiPattern {
  location: string;
  issue: string;
}

interface CheckResult {
  originalityScore: number;
  riskLevel: RiskLevel;
  summary: string;
  repeatedPhrases: RepeatedPhrase[];
  aiPatterns: AiPattern[];
  suggestions: string[];
}

// ─── Client-side repeated phrase detection ────────────────────────────────────

function detectRepeatedPhrases(text: string, minCount: number): RepeatedPhrase[] {
  const words = text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(w => w.length > 3);
  const phraseCounts: Record<string, number> = {};

  for (let len = 3; len <= 5; len++) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(" ");
      if (phrase.trim().length > 10) phraseCounts[phrase] = (phraseCounts[phrase] ?? 0) + 1;
    }
  }

  return Object.entries(phraseCounts)
    .filter(([, count]) => count >= minCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([phrase, count]) => ({
      phrase,
      count,
      severity: count >= 5 ? "HIGH" : count >= 3 ? "MEDIUM" : "LOW",
    }));
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

const MAX_WORDS = 900;

function truncate(text: string): { text: string; truncated: boolean } {
  const words = text.trim().split(/\s+/);
  if (words.length <= MAX_WORDS) return { text, truncated: false };
  return { text: words.slice(0, MAX_WORDS).join(" ") + " [...]", truncated: true };
}

function buildPrompt(text: string, sensitivity: Sensitivity, checkAi: boolean): string {
  const { text: t } = truncate(text);
  const sensitivityInstructions = {
    low:    "Flag only very obvious repetitions (same phrase 4+ times) and strong AI-writing markers.",
    medium: "Flag repetitions (same phrase 3+ times) and moderate AI-like predictable phrasing.",
    strict: "Flag all repetitions (same phrase 2+ times) and any AI-like generic phrasing or overused sentence structures.",
  }[sensitivity];

  return `You are a private plagiarism and originality analyzer. Analyze this text for internal repetition, generic phrasing, and ${checkAi ? "AI-generated writing patterns" : "overused or clichéd language"}.

Sensitivity: ${sensitivity.toUpperCase()} — ${sensitivityInstructions}

TEXT TO ANALYZE:
${t}

Provide an originality score based on internal repetition and writing quality (NOT based on web sources — this is an internal analysis):
- 85–100: Highly original, varied language, natural writing
- 70–84: Good, minor repetition or occasional generic phrasing
- 50–69: Noticeable repetition or formulaic patterns
- 0–49: Heavy repetition, very generic or formulaic writing

Reply in this EXACT format:

ORIGINALITY_SCORE: [0-100]
RISK_LEVEL: [LOW|MEDIUM|HIGH]
SUMMARY: [1-2 sentence assessment of the writing's originality and main issues]

REPEATED_PHRASES:
- PHRASE: [repeated phrase] | COUNT: [number] | SEVERITY: [LOW|MEDIUM|HIGH]
(list up to 5 most repeated phrases; write "none" if none found)

${checkAi ? `AI_PATTERNS:
- LOCATION: [Paragraph N or Introduction/Conclusion] | ISSUE: [specific AI-like pattern observed]
(list up to 4 AI-pattern observations; write "none" if none found)` : "AI_PATTERNS: none"}

SUGGESTIONS:
- [specific actionable suggestion to improve originality]
- [another suggestion]
(2-4 specific suggestions)`;
}

function parseResult(raw: string): CheckResult | null {
  const numMatch = raw.match(/ORIGINALITY_SCORE:\s*(\d+)/i);
  const score = numMatch ? Math.min(100, Math.max(0, parseInt(numMatch[1]))) : null;
  if (score === null) return null;

  const riskMatch = raw.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i);
  const riskLevel = (riskMatch?.[1]?.toUpperCase() ?? "MEDIUM") as RiskLevel;
  const summary = raw.match(/SUMMARY:\s*(.+)/i)?.[1]?.trim() ?? "";

  const phrasesSection = raw.match(/REPEATED_PHRASES:\s*\n([\s\S]*?)(?=\n[A-Z_]+:|$)/i)?.[1] ?? "";
  const repeatedPhrases: RepeatedPhrase[] = [];
  for (const line of phrasesSection.split("\n")) {
    if (!line.trim().startsWith("-")) continue;
    const phraseM = line.match(/PHRASE:\s*(.+?)\s*\|/i);
    const countM  = line.match(/COUNT:\s*(\d+)/i);
    const sevM    = line.match(/SEVERITY:\s*(LOW|MEDIUM|HIGH)/i);
    if (phraseM && phraseM[1].toLowerCase() !== "none") {
      repeatedPhrases.push({
        phrase: phraseM[1].trim(),
        count: countM ? parseInt(countM[1]) : 2,
        severity: (sevM?.[1]?.toUpperCase() ?? "LOW") as "LOW" | "MEDIUM" | "HIGH",
      });
    }
  }

  const patternsSection = raw.match(/AI_PATTERNS:\s*\n?([\s\S]*?)(?=\n[A-Z_]+:|$)/i)?.[1] ?? "";
  const aiPatterns: AiPattern[] = [];
  for (const line of patternsSection.split("\n")) {
    if (!line.trim().startsWith("-")) continue;
    const locM   = line.match(/LOCATION:\s*(.+?)\s*\|/i);
    const issueM = line.match(/ISSUE:\s*(.+)/i);
    if (locM && issueM && locM[1].toLowerCase() !== "none") {
      aiPatterns.push({ location: locM[1].trim(), issue: issueM[1].trim() });
    }
  }

  const suggestionsSection = raw.match(/SUGGESTIONS:\s*\n([\s\S]*?)(?=$)/i)?.[1] ?? "";
  const suggestions = suggestionsSection
    .split("\n")
    .filter(l => l.trim().startsWith("-"))
    .map(l => l.replace(/^-\s*/, "").trim())
    .filter(l => l.length > 5);

  return { originalityScore: score, riskLevel, summary, repeatedPhrases, aiPatterns, suggestions };
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const color = score >= 85 ? "#10b981" : score >= 70 ? "#84cc16" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 85 ? "High Originality" : score >= 70 ? "Good" : score >= 50 ? "Some Concerns" : "Major Concerns";
  const labelColor = score >= 85 ? "text-emerald-600 dark:text-emerald-400" : score >= 70 ? "text-lime-600 dark:text-lime-400" : score >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-700" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (circ * score) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            className="text-3xl font-black text-slate-900 dark:text-slate-50 tabular-nums"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {score}%
          </motion.p>
        </div>
      </div>
      <p className={cn("text-sm font-black", labelColor)}>{label}</p>
    </div>
  );
}

// ─── Severity badge ───────────────────────────────────────────────────────────

const SEV_STYLES = {
  HIGH:   "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  MEDIUM: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  LOW:    "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700",
};

// ─── Main component ───────────────────────────────────────────────────────────

export function PlagiarismChecker() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [text, setText] = useState("");
  const [sensitivity, setSensitivity] = useState<Sensitivity>("medium");
  const [checkAiPatterns, setCheckAiPatterns] = useState(true);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [wasTruncated, setWasTruncated] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isGenerating = state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isModelLoading;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleFile = (file: File) => {
    if (!file) return;
    if (file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = e => setText(e.target?.result as string ?? "");
      reader.readAsText(file);
    } else {
      setInputError("Only .txt files are supported for upload. Paste PDF or Word content directly.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleCheck = useCallback(async () => {
    if (wordCount < 30) { setInputError("Please paste at least 30 words to analyze."); return; }
    setInputError("");
    setResult(null); setStreaming(""); setIsDone(false);
    const { truncated } = truncate(text);
    setWasTruncated(truncated);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are a precise originality and writing pattern analyzer. Always follow the exact output format. Be objective and specific in your findings." },
        { role: "user", content: buildPrompt(text, sensitivity, checkAiPatterns) },
      ],
      temperature: 0.1,
      maxTokens: 1000,
      onChunk: chunk => setStreaming(chunk),
    });

    setStreaming("");
    if (raw) {
      const parsed = parseResult(raw);
      if (parsed) {
        setResult(parsed);
        setIsDone(true);
        setShowSuggestions(false);
      } else {
        setInputError("Couldn't parse the AI response — please try again.");
      }
    }
  }, [text, sensitivity, checkAiPatterns, wordCount, generateRaw]);

  const handleReset = () => {
    setText(""); setResult(null); setStreaming(""); setIsDone(false);
    setInputError(""); setWasTruncated(false);
  };

  const riskColors: Record<RiskLevel, string> = {
    LOW:    "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    MEDIUM: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    HIGH:   "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input */}
      {!isDone && (
        <div className="glass-panel rounded-2xl overflow-hidden">

          {/* Settings row */}
          <div className="flex flex-wrap items-center gap-4 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            {/* Sensitivity */}
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest shrink-0">Sensitivity</p>
              <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                {(["low", "medium", "strict"] as Sensitivity[]).map(s => (
                  <button key={s} type="button" data-testid={`sensitivity-${s}`}
                    onClick={() => setSensitivity(s)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold capitalize transition-all",
                      sensitivity === s
                        ? "bg-purple-600 text-white"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* AI pattern toggle */}
            <button type="button" data-testid="toggle-ai-patterns"
              onClick={() => setCheckAiPatterns(p => !p)}
              className={cn(
                "flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all",
                checkAiPatterns
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
              )}>
              <span>AI Pattern Detection</span>
            </button>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea data-testid="input-text"
              value={text}
              onChange={e => { setText(e.target.value); setInputError(""); }}
              placeholder="Paste your essay, article, blog post, or any written text here…"
              rows={11}
              className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
            />
            {wordCount > 0 && (
              <span className="absolute bottom-3 right-4 text-xs text-slate-400 pointer-events-none">{wordCount} words</span>
            )}
          </div>

          {/* File drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="mx-4 mb-3 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition-colors"
            onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 text-slate-400 shrink-0" />
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-purple-600 dark:text-purple-400">Upload .txt file</span>
              {" "} or drag and drop here
            </p>
            <input ref={fileRef} type="file" accept=".txt" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>

          {/* Disclaimer */}
          <div className="mx-4 mb-3 flex items-start gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
              <span className="font-bold">Private analysis:</span> Checks for internal repetition and AI-like writing patterns within your text. Does not compare against web sources or external databases.
            </p>
          </div>

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
            <button type="button" data-testid="button-check"
              onClick={handleCheck}
              disabled={isBusy || wordCount < 30}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                isBusy || wordCount < 30
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
              )}>
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking originality…</>
                : isModelLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Model loading…</>
                : "Check Originality"}
            </button>
          </div>
        </div>
      )}

      {/* Streaming */}
      {isGenerating && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Analyzing originality…</p>
          </div>
          {streaming && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed line-clamp-3">
              {streaming}
              <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
            </p>
          )}
        </div>
      )}

      {wasTruncated && isDone && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-300">Text over 900 words — analysis based on first 900 words.</p>
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

            {/* Score + summary row */}
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <ScoreRing score={result.originalityScore} />
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={cn("text-xs font-black px-2.5 py-1 rounded-full border", riskColors[result.riskLevel])}>
                      {result.riskLevel} RISK
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {sensitivity.charAt(0).toUpperCase() + sensitivity.slice(1)} sensitivity
                    </span>
                    {checkAiPatterns && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        AI patterns checked
                      </span>
                    )}
                  </div>
                  {result.summary && (
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{result.summary}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <InlineShareButtons />
                    <button type="button" data-testid="button-reset" onClick={handleReset}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <RotateCcw className="w-3 h-3" /> New Check
                    </button>
                    <Link href="/ai-paragraph-rewriter"
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors px-3 py-1.5 rounded-xl">
                      Rewrite with AI <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Repeated phrases */}
            {result.repeatedPhrases.length > 0 && (
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Repeated Phrases ({result.repeatedPhrases.length})
                  </p>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800/80">
                  {result.repeatedPhrases.map((rp, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <p className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-200">"{rp.phrase}"</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-500">{rp.count}×</span>
                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full border", SEV_STYLES[rp.severity])}>
                          {rp.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI patterns */}
            {result.aiPatterns.length > 0 && (
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    AI-Like Patterns Detected ({result.aiPatterns.length})
                  </p>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800/80">
                  {result.aiPatterns.map((ap, i) => (
                    <div key={i} className="px-4 py-3 space-y-0.5">
                      <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">{ap.location}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{ap.issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="glass-panel rounded-2xl overflow-hidden">
                <button type="button" data-testid="button-toggle-suggestions"
                  onClick={() => setShowSuggestions(s => !s)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Improvement Suggestions ({result.suggestions.length})
                  </p>
                  {showSuggestions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <div className="divide-y divide-slate-50 dark:divide-slate-800/80 border-t border-slate-100 dark:border-slate-800">
                        {result.suggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-3 px-4 py-3">
                            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                        <Link href="/ai-paragraph-rewriter"
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors">
                          Rewrite Flagged Sections with AI <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
