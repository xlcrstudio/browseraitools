import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Download, RotateCcw,
  Lock, Check, RefreshCw, ChevronRight, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

const MODES = [
  {
    id: "standard",
    label: "Standard",
    desc: "Balanced rewrite with synonym swaps and restructured sentences",
    target: "60–80% words changed",
  },
  {
    id: "fluency",
    label: "Fluency",
    desc: "Smooths awkward phrasing and improves natural flow",
    target: "Reads like a native speaker",
  },
  {
    id: "creative",
    label: "Creative",
    desc: "Maximum variation — new structure, examples, and phrasing",
    target: "80–95% words changed",
  },
  {
    id: "formal",
    label: "Formal",
    desc: "Elevates to professional or academic register",
    target: "Sophisticated vocabulary",
  },
  {
    id: "simple",
    label: "Simple",
    desc: "Plain language, shorter sentences, easy to understand",
    target: "Middle-school reading level",
  },
  {
    id: "academic",
    label: "Academic",
    desc: "Scholarly tone with complex structure and precision",
    target: "Research & essay ready",
  },
];

const MODE_INSTRUCTIONS: Record<string, string> = {
  standard: "Rewrite with synonyms and restructured sentences. Maintain similar complexity. Aim for 60–80% different wording. Keep the same tone and formality.",
  fluency: "Rewrite to maximize natural flow and readability. Fix any awkward phrasing. Make it sound like a native speaker wrote it from scratch.",
  creative: "Rewrite with maximum variation — aim for 80–95% different wording. Restructure paragraphs, use different examples, reorganize ideas while preserving meaning.",
  formal: "Elevate to professional/academic register. Use sophisticated vocabulary, complex sentence structures, and remove any casual language, contractions, or colloquialisms.",
  simple: "Simplify to plain language. Use shorter sentences and common words. Break down complex ideas. Target a middle-school reading level while preserving all meaning.",
  academic: "Rewrite in scholarly language. Use formal tone, academic vocabulary, transition words, and complex sentence structures appropriate for research papers or essays.",
};

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function wordChangePct(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().match(/\b\w+\b/g) ?? []);
  const wordsB = new Set(b.toLowerCase().match(/\b\w+\b/g) ?? []);
  if (wordsA.size === 0) return 0;
  const shared = [...wordsA].filter(w => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return Math.min(99, Math.round((1 - shared / union) * 100));
}

export function ParaphrasingTool() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [mode, setMode] = useState("standard");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputError, setInputError] = useState("");
  const [changePercent, setChangePercent] = useState<number | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const inputWords = countWords(input);
  const outputWords = countWords(output);

  const handleParaphrase = useCallback(async () => {
    const trimmed = input.trim();
    if (trimmed.length < 10) { setInputError("Please enter at least a sentence to paraphrase."); return; }
    setInputError("");
    setOutput("");
    setIsDone(false);
    setCopied(false);
    setChangePercent(null);

    const result = await generateRaw({
      messages: [
        {
          role: "system",
          content: "You are an expert paraphrasing assistant. Rewrite text while preserving 100% of the original meaning, facts, and key information. Output ONLY the paraphrased text — no preamble, no explanations, no commentary. Match the paragraph structure of the original exactly. Preserve proper nouns, technical terms, numbers, dates, and quoted material.",
        },
        {
          role: "user",
          content: `Paraphrase the following text using ${MODES.find(m => m.id === mode)?.label} mode.\n\nMode instructions: ${MODE_INSTRUCTIONS[mode]}\n\nText to paraphrase:\n${trimmed}\n\nOutput ONLY the paraphrased text. No preamble.`,
        },
      ],
      temperature: mode === "creative" ? 0.85 : mode === "fluency" ? 0.5 : 0.65,
      maxTokens: 2048,
      onChunk: (chunk) => {
        setOutput(chunk);
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
      },
    });

    if (result) {
      setOutput(result);
      setChangePercent(wordChangePct(trimmed, result));
      setIsDone(true);
    }
  }, [input, mode, generateRaw]);

  const handleTryAgain = useCallback(() => {
    setOutput("");
    setIsDone(false);
    setCopied(false);
    setChangePercent(null);
    setTimeout(handleParaphrase, 50);
  }, [handleParaphrase]);

  const handleReset = () => {
    setInput(""); setOutput(""); setIsDone(false); setCopied(false);
    setInputError(""); setChangePercent(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `=== ORIGINAL ===\n\n${input}\n\n=== PARAPHRASED (${MODES.find(m => m.id === mode)?.label} mode) ===\n\n${output}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paraphrased.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">

      {/* Mode selector */}
      <div className="glass-panel rounded-2xl p-4 md:p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-1">
          Paraphrasing Mode
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {MODES.map(m => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                data-testid={`button-mode-${m.id}`}
                onClick={() => setMode(m.id)}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                  active
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-600"
                )}
              >
                <span className={cn("text-xs font-bold leading-none", active ? "text-purple-800 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>
                  {m.label}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight line-clamp-2">{m.target}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-panel editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Input panel */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 340 }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Original Text</p>
            {input && (
              <button
                type="button"
                data-testid="button-clear-input"
                onClick={() => { setInput(""); setOutput(""); setIsDone(false); setChangePercent(null); setInputError(""); }}
                className="text-xs text-slate-400 hover:text-red-400 dark:hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            data-testid="input-text"
            value={input}
            onChange={e => { setInput(e.target.value); setInputError(""); }}
            placeholder={"Type or paste your text here…\n\nSupports sentences, paragraphs, essays, emails, articles — any content you want to rewrite."}
            maxLength={20000}
            className="flex-1 w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-2 text-sm leading-relaxed resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            style={{ minHeight: 260 }}
          />
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Private — never leaves your browser</span>
            </div>
            <span className="text-xs text-slate-400">{inputWords.toLocaleString()} words</span>
          </div>
          {inputError && (
            <div className="px-4 pb-3 -mt-1">
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> {inputError}
              </p>
            </div>
          )}
        </div>

        {/* Output panel */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 340 }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                {MODES.find(m => m.id === mode)?.label} Paraphrase
              </p>
              {changePercent !== null && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                  {changePercent}% changed
                </span>
              )}
            </div>
            {isDone && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  data-testid="button-try-again"
                  onClick={handleTryAgain}
                  disabled={isGenerating}
                  title="Generate another version"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-40"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  data-testid="button-copy"
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                    copied
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200 dark:border-emerald-700"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600"
                  )}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  type="button"
                  data-testid="button-download"
                  onClick={handleDownload}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all"
                >
                  <Download className="w-3 h-3" />
                  .txt
                </button>
              </div>
            )}
          </div>

          <div
            ref={outputRef}
            data-testid="output-paraphrase"
            className="flex-1 px-4 py-2 overflow-y-auto"
            style={{ minHeight: 260 }}
          >
            {!output && !isGenerating && !isLoading && (
              <p className="text-sm text-slate-300 dark:text-slate-600 leading-relaxed select-none">
                Your paraphrased text will appear here…
              </p>
            )}
            {(isLoading) && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                {state === "checking-gpu" ? "Checking GPU…" : `Loading model… ${Math.round(progress?.percent ?? 0)}%`}
              </div>
            )}
            {output && (
              <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                {output}
                {isGenerating && (
                  <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 rounded-sm align-middle" />
                )}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-400">
              {isDone && changePercent !== null && (
                <span className="text-purple-500 font-semibold">{changePercent}% of words changed</span>
              )}
            </div>
            <span className="text-xs text-slate-400">{outputWords.toLocaleString()} words</span>
          </div>
        </div>
      </div>

      {/* Model loading bar */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Loading AI model…</span>
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1">
              <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">{Math.round(progress?.percent ?? 0)}% — {progress?.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Action row */}
      <div className="flex gap-3">
        <button
          type="button"
          data-testid="button-paraphrase"
          onClick={handleParaphrase}
          disabled={isGenerating || isLoading || input.trim().length < 10}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm",
            isGenerating || isLoading || input.trim().length < 10
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-purple-500/20"
          )}
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Paraphrasing…</>
          ) : (
            <><ArrowRight className="w-4 h-4" /> Paraphrase</>
          )}
        </button>

        {(input || output) && (
          <button
            type="button"
            data-testid="button-reset"
            onClick={handleReset}
            className="px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-300 hover:text-red-500 font-semibold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mode description */}
      <div className="flex items-start gap-2 px-1">
        <ChevronRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
          <strong className="text-slate-500 dark:text-slate-400">{MODES.find(m => m.id === mode)?.label}:</strong>{" "}
          {MODES.find(m => m.id === mode)?.desc}
        </p>
      </div>
    </div>
  );
}
