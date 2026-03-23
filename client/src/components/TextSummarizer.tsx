import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Loader2, AlertTriangle, CheckCircle2,
  Copy, Download, RotateCcw, ChevronRight,
  FileText, List, AlignLeft, Briefcase, BookOpenCheck, Minus, Settings2, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

const SUMMARY_TYPES = [
  {
    id: "quick",
    label: "Quick Summary",
    desc: "3–5 sentence overview",
    icon: FileText,
    hint: "Best for: articles, emails, blog posts",
  },
  {
    id: "key-points",
    label: "Key Points",
    desc: "Scannable bullet list",
    icon: List,
    hint: "Best for: reports, meeting notes",
  },
  {
    id: "detailed",
    label: "Detailed",
    desc: "1–3 comprehensive paragraphs",
    icon: AlignLeft,
    hint: "Best for: research papers, long articles",
  },
  {
    id: "executive",
    label: "Executive",
    desc: "Professional 100–150 word brief",
    icon: Briefcase,
    hint: "Best for: business reports, proposals",
  },
  {
    id: "tldr",
    label: "TL;DR",
    desc: "One powerful sentence",
    icon: Minus,
    hint: "Best for: social media, quick sharing",
  },
  {
    id: "chapter",
    label: "By Section",
    desc: "Breakdown per major section",
    icon: BookOpenCheck,
    hint: "Best for: books, long documents",
  },
];

const SYSTEM_PROMPT = `You are an expert text summarization assistant. Your job is to condense text accurately, preserving the essential information, key points, and original meaning. Never add information that isn't in the source text. Always be objective and write in the third person, present tense.`;

function buildPrompt(
  text: string,
  typeId: string,
  focusArea: string,
): string {
  const typeDef = SUMMARY_TYPES.find((t) => t.id === typeId)!;

  const formatInstructions: Record<string, string> = {
    "quick": `Write a Quick Summary: a paragraph of 3-5 sentences capturing the essential message. Use plain paragraph form. Cover: main thesis, key points, conclusion.`,
    "key-points": `Write a Key Points summary in this format:\n**Key Points:**\n\n• [First main point - complete sentence]\n• [Second main point]\n• [Third main point]\n(Continue for 5-10 bullet points covering all major ideas)`,
    "detailed": `Write a Detailed Summary in 1-3 paragraphs (200-400 words):\n- Opening paragraph: topic and main thesis\n- Body paragraph: major arguments/findings\n- Concluding paragraph: outcomes/conclusions`,
    "executive": `Write an Executive Summary:\n\n**Executive Summary**\n\n[Single paragraph of 100-150 words. Cover: problem/topic, key findings, main conclusions/recommendations, significance]`,
    "tldr": `Write a TL;DR summary:\n\n**TL;DR:** [One powerful sentence—the absolute essence of the text]`,
    "chapter": `Write a By-Section summary. Identify the major sections or topics in the text and summarize each in 2-3 sentences:\n\n**Section 1: [Section Title]**\n[Summary]\n\n**Section 2: [Section Title]**\n[Summary]\n\n(Continue for all major sections)`,
  };

  let prompt = `Summarize the following text.\n\nSUMMARY TYPE: ${typeDef.label}\n`;

  if (focusArea.trim()) {
    prompt += `FOCUS ON: ${focusArea.trim()}\n`;
  }

  prompt += `\nFORMAT INSTRUCTIONS:\n${formatInstructions[typeId]}\n\nTEXT TO SUMMARIZE:\n${text}\n\nWrite only the summary, nothing else. Be accurate, concise, and objective.`;

  return prompt;
}

function renderOutput(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className={cn("leading-relaxed", line === "" ? "h-3" : "")}>
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j} className="font-semibold text-slate-800 dark:text-slate-100">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith("• ") || part.startsWith("- ")) {
            return <span key={j} className="flex items-start gap-2"><span className="text-purple-500 mt-0.5 shrink-0">•</span><span>{part.slice(2)}</span></span>;
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

export function TextSummarizer() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [text, setText] = useState("");
  const [summaryType, setSummaryType] = useState("quick");
  const [focusArea, setFocusArea] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [output, setOutput] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputError, setInputError] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const outputWordCount = output.trim() ? output.trim().split(/\s+/).length : 0;

  const handleGenerate = async () => {
    if (wordCount < 20) {
      setInputError("Please paste at least 20 words of text to summarize.");
      return;
    }
    setInputError("");
    setOutput("");
    setIsDone(false);
    setCopied(false);

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(text, summaryType, focusArea) },
      ],
      temperature: 0.4,
      maxTokens: 2048,
      onChunk: (chunk) => {
        setOutput(chunk);
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      },
    });

    if (result) {
      setOutput(result);
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setText("");
    setFocusArea("");
    setSummaryType("quick");
    setOutput("");
    setIsDone(false);
    setCopied(false);
    setInputError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${summaryType}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedType = SUMMARY_TYPES.find((t) => t.id === summaryType)!;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="space-y-6">

          {/* Text input */}
          <div className="space-y-2">
            <label htmlFor="ts-text" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Paste Your Text
            </label>
            <div className="relative">
              <textarea
                id="ts-text"
                data-testid="input-text"
                value={text}
                onChange={(e) => { setText(e.target.value); setInputError(""); }}
                placeholder="Paste any text here — articles, reports, research papers, emails, transcripts, meeting notes, books, legal documents, and more...

The AI will condense it into a clear, accurate summary that preserves every key point."
                maxLength={40000}
                rows={10}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y font-medium placeholder:text-slate-400 text-sm"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400 pointer-events-none">
                <span>{wordCount.toLocaleString()} words</span>
                <span>{text.length.toLocaleString()} / 40,000</span>
              </div>
            </div>
            {inputError && (
              <p className="text-xs text-red-500 ml-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {inputError}
              </p>
            )}
            <p className="text-xs text-slate-400 ml-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Your text never leaves your browser
            </p>
          </div>

          {/* Summary type selector */}
          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-3">
              Summary Type
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SUMMARY_TYPES.map((type) => {
                const TypeIcon = type.icon;
                const isActive = summaryType === type.id;
                return (
                  <button
                    key={type.id}
                    data-testid={`button-type-${type.id}`}
                    type="button"
                    onClick={() => setSummaryType(type.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all",
                      isActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-600"
                    )}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5",
                      isActive ? "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    )}>
                      <TypeIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className={cn("font-semibold text-xs", isActive ? "text-purple-800 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>
                        {type.label}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedType && (
              <p className="text-xs text-slate-400 dark:text-slate-500 ml-1 mt-2">{selectedType.hint}</p>
            )}
          </fieldset>

          {/* Advanced options */}
          <div>
            <button
              data-testid="button-toggle-advanced"
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Advanced options
              <ChevronRight className={cn("w-3 h-3 transition-transform", showAdvanced && "rotate-90")} />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-2">
                    <label htmlFor="ts-focus" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                      Focus Area <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="ts-focus"
                      data-testid="input-focus"
                      type="text"
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                      placeholder="e.g., financial data, methodology, conclusions, risks..."
                      maxLength={200}
                      className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400 text-sm"
                    />
                    <p className="text-xs text-slate-400 ml-1">Optionally tell the AI what to emphasize in the summary</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Model loading states */}
        <AnimatePresence>
          {(state === "checking-gpu" || state === "downloading") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {state === "checking-gpu" ? "Checking GPU support…" : "Loading AI model…"}
                </span>
              </div>
              {state === "downloading" && progress && (
                <>
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1.5">
                    <div
                      className="bg-purple-600 dark:bg-purple-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round(progress.percent)}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {Math.round(progress.percent)}% — {progress.text}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mt-5 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Error</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Generate / Reset buttons */}
        <div className="flex gap-3 mt-6">
          <button
            data-testid="button-generate"
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || wordCount < 3}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm",
              isGenerating || wordCount < 3
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98]"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Summarizing…
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                Summarize
              </>
            )}
          </button>

          {(output || text) && (
            <button
              data-testid="button-reset"
              type="button"
              onClick={handleReset}
              className="px-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400 font-semibold text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Output card */}
      <AnimatePresence>
        {(output || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedType.label}</h3>
                  {isDone && outputWordCount > 0 && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">{outputWordCount} words</p>
                  )}
                </div>
              </div>

              {isDone && (
                <div className="flex items-center gap-2">
                  <button
                    data-testid="button-copy"
                    type="button"
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      copied
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400"
                    )}
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    data-testid="button-download"
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    .txt
                  </button>
                </div>
              )}
            </div>

            {/* Streaming text output */}
            <div
              ref={outputRef}
              data-testid="output-summary"
              className="max-h-[520px] overflow-y-auto pr-1"
            >
              <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                {renderOutput(output)}
                {isGenerating && (
                  <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 rounded-sm" />
                )}
              </div>
            </div>

            {/* Stats bar */}
            {isDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Summary complete
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {wordCount.toLocaleString()} words → {outputWordCount.toLocaleString()} words
                  {wordCount > 0 && outputWordCount > 0 && (
                    <span className="ml-1 text-purple-500 font-medium">
                      ({Math.round((1 - outputWordCount / wordCount) * 100)}% reduction)
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
