import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, CheckCircle2, Copy, Download,
  RotateCcw, ChevronRight, Lock, Settings2, CheckCheck,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const MODES = [
  { id: "standard", label: "Standard", desc: "Errors + explanations", default: true },
  { id: "detailed", label: "Detailed", desc: "Errors + style tips", default: false },
  { id: "quickfix", label: "Quick Fix", desc: "Corrected text only", default: false },
];

const VARIANTS = [
  { id: "us", label: "US English" },
  { id: "uk", label: "UK English" },
  { id: "ca", label: "Canadian" },
  { id: "au", label: "Australian" },
];

const FORMALITY = [
  { id: "casual", label: "Casual" },
  { id: "professional", label: "Professional" },
  { id: "academic", label: "Academic" },
];

const SYSTEM_PROMPT = `You are an expert grammar checker and writing assistant. Check text for grammatical errors, spelling mistakes, punctuation issues, and style problems. Always explain errors clearly and educationally. Preserve the author's voice — only fix errors, never rewrite. Be encouraging, not condescending.`;

function buildPrompt(
  text: string,
  mode: string,
  variant: string,
  formality: string,
): string {
  const variantMap: Record<string, string> = { us: "US English", uk: "UK English", ca: "Canadian English", au: "Australian English" };
  const formalityMap: Record<string, string> = { casual: "Casual", professional: "Professional", academic: "Academic" };

  let prompt = `Check the following text for errors.\n\nENGLISH VARIANT: ${variantMap[variant]}\nFORMALITY: ${formalityMap[formality]}\n`;

  if (mode === "quickfix") {
    prompt += `MODE: Quick Fix — return ONLY the corrected text with no explanations, labels, or commentary.\n`;
  } else if (mode === "detailed") {
    prompt += `MODE: Detailed — include comprehensive style suggestions, tone feedback, and word choice improvements in addition to error corrections.\n`;
    prompt += `\nOutput format:\n✅ CORRECTED TEXT:\n[corrected version]\n\n---\n\n📝 ERRORS FOUND: [number]\n\n[For each error:]\n❌ Error [N]: [Type]\n**Original:** "[wrong text]"\n**Correction:** "[fixed text]"\n**Explanation:** [concise explanation]\n\n---\n\n✨ STYLE SUGGESTIONS: [number]\n\n[For each:]\n💡 Suggestion [N]: [Type]\n**Original:** "[text]"\n**Suggested:** "[improved]"\n**Reason:** [why better]\n\n---\n\n📊 SUMMARY:\n- Grammar errors: [N]\n- Spelling errors: [N]\n- Punctuation errors: [N]\n- Style suggestions: [N]\n- Overall quality: [Excellent/Good/Needs Improvement]\n`;
  } else {
    prompt += `MODE: Standard — list all errors with explanations, then a summary.\n`;
    prompt += `\nOutput format:\n✅ CORRECTED TEXT:\n[corrected version]\n\n---\n\n📝 ERRORS FOUND: [number]\n\n[For each error:]\n❌ Error [N]: [Type]\n**Original:** "[wrong text]"\n**Correction:** "[fixed text]"\n**Explanation:** [concise 1-2 sentence explanation]\n\n---\n\n📊 SUMMARY:\n- Grammar errors: [N]\n- Spelling errors: [N]\n- Punctuation errors: [N]\n- Overall quality: [Excellent/Good/Needs Improvement]\n`;
  }

  prompt += `\nTEXT TO CHECK:\n${text}\n\nIf the text is already correct, say so clearly with "No errors found." and give an Excellent quality rating.`;

  return prompt;
}

function extractCorrectedText(raw: string): string {
  const match = raw.match(/✅\s*CORRECTED TEXT:\s*\n([\s\S]*?)(?:\n---|\n📝|\n📊|$)/i);
  if (match) return match[1].trim();
  if (raw.match(/^[^✅❌📝📊✨💡]/)) return raw.trim();
  return "";
}

function renderAnalysis(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("✅") && trimmed.toUpperCase().includes("CORRECTED TEXT")) {
      return <p key={i} className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mt-3 mb-1">{trimmed}</p>;
    }
    if (trimmed.startsWith("📝") || trimmed.startsWith("✨") || trimmed.startsWith("📊")) {
      return <p key={i} className="font-bold text-slate-700 dark:text-slate-300 text-sm mt-4 mb-1">{trimmed}</p>;
    }
    if (trimmed.startsWith("❌")) {
      return <p key={i} className="font-semibold text-red-600 dark:text-red-400 text-sm mt-3">{trimmed}</p>;
    }
    if (trimmed.startsWith("💡")) {
      return <p key={i} className="font-semibold text-amber-600 dark:text-amber-400 text-sm mt-3">{trimmed}</p>;
    }
    if (trimmed === "---") {
      return <hr key={i} className="border-slate-200 dark:border-slate-700 my-3" />;
    }
    if (trimmed === "") {
      return <div key={i} className="h-1" />;
    }

    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j} className="font-semibold text-slate-800 dark:text-slate-200">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

export function GrammarChecker() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [text, setText] = useState("");
  const [mode, setMode] = useState("standard");
  const [variant, setVariant] = useState("us");
  const [formality, setFormality] = useState("professional");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [output, setOutput] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);
  const [copiedCorrected, setCopiedCorrected] = useState(false);
  const [inputError, setInputError] = useState("");

  const outputRef = useRef<HTMLDivElement>(null);

  const isGenerating = state === "generating";
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleCheck = async () => {
    if (text.trim().length < 2) {
      setInputError("Please enter some text to check.");
      return;
    }
    setInputError("");
    setOutput("");
    setCorrectedText("");
    setIsDone(false);
    setCopiedAnalysis(false);
    setCopiedCorrected(false);

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(text, mode, variant, formality) },
      ],
      temperature: 0.2,
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
      const extracted = extractCorrectedText(result);
      setCorrectedText(extracted);
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setText("");
    setOutput("");
    setCorrectedText("");
    setIsDone(false);
    setCopiedAnalysis(false);
    setCopiedCorrected(false);
    setInputError("");
  };

  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(output);
    setCopiedAnalysis(true);
    setTimeout(() => setCopiedAnalysis(false), 2000);
  };

  const handleCopyCorrected = () => {
    navigator.clipboard.writeText(correctedText);
    setCopiedCorrected(true);
    setTimeout(() => setCopiedCorrected(false), 2000);
  };

  const handleDownload = () => {
    const content = correctedText
      ? `=== ORIGINAL ===\n\n${text}\n\n=== CORRECTED ===\n\n${correctedText}\n\n=== FULL ANALYSIS ===\n\n${output}`
      : output;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grammar-check.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Input card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="space-y-6">

          {/* Text input */}
          <div className="space-y-2">
            <label htmlFor="gc-text" className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Text to Check
            </label>
            <div className="relative">
              <textarea
                id="gc-text"
                data-testid="input-text"
                value={text}
                onChange={(e) => { setText(e.target.value); setInputError(""); }}
                placeholder={"Paste or type any text here — emails, essays, social media posts, business documents, creative writing...\n\nExample:\n\"Me and john went to the store, we bought milk eggs and bread. Its expensive their.\""}
                maxLength={20000}
                rows={9}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-y font-medium placeholder:text-slate-400 text-sm"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400 pointer-events-none">
                <span>{wordCount.toLocaleString()} words</span>
                <span>{text.length.toLocaleString()} / 20,000</span>
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

          {/* Mode */}
          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-3">
              Checking Mode
            </legend>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => {
                const isActive = mode === m.id;
                return (
                  <button
                    key={m.id}
                    data-testid={`button-mode-${m.id}`}
                    type="button"
                    onClick={() => setMode(m.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex flex-col items-start px-4 py-2.5 rounded-xl border-2 text-left transition-all",
                      isActive
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-600"
                    )}
                  >
                    <span className={cn("text-xs font-semibold", isActive ? "text-purple-800 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>
                      {m.label}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{m.desc}</span>
                  </button>
                );
              })}
            </div>
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
              Language options
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
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <fieldset>
                      <legend className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1 mb-2">English Variant</legend>
                      <div className="flex flex-wrap gap-2">
                        {VARIANTS.map((v) => {
                          const isActive = variant === v.id;
                          return (
                            <button
                              key={v.id}
                              data-testid={`button-variant-${v.id}`}
                              type="button"
                              onClick={() => setVariant(v.id)}
                              aria-pressed={isActive}
                              className={cn(
                                "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                                isActive
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-purple-300"
                              )}
                            >
                              {v.label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1 mb-2">Formality Level</legend>
                      <div className="flex flex-wrap gap-2">
                        {FORMALITY.map((f) => {
                          const isActive = formality === f.id;
                          return (
                            <button
                              key={f.id}
                              data-testid={`button-formality-${f.id}`}
                              type="button"
                              onClick={() => setFormality(f.id)}
                              aria-pressed={isActive}
                              className={cn(
                                "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                                isActive
                                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-purple-300"
                              )}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Model loading */}
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

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            data-testid="button-check"
            type="button"
            onClick={handleCheck}
            disabled={isGenerating || text.trim().length < 2}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm",
              isGenerating || text.trim().length < 2
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98]"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking…
              </>
            ) : (
              <>
                <CheckCheck className="w-4 h-4" />
                Check Grammar
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

      {/* Corrected text highlight — shown when done and corrected text extracted */}
      <AnimatePresence>
        {isDone && correctedText && mode !== "quickfix" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Corrected Text</span>
              </div>
              <button
                data-testid="button-copy-corrected"
                type="button"
                onClick={handleCopyCorrected}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                  copiedCorrected
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600"
                )}
              >
                {copiedCorrected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCorrected ? "Copied!" : "Copy text"}
              </button>
            </div>

            {/* Before → After comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-start">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-3">
                <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wide mb-1.5">Original</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>
              </div>
              <div className="flex items-center justify-center py-2 sm:py-0">
                <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-3">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1.5">Corrected</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{correctedText}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full analysis output */}
      <AnimatePresence>
        {(output || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                  <CheckCheck className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {mode === "quickfix" ? "Corrected Text" : mode === "detailed" ? "Detailed Analysis" : "Grammar Analysis"}
                </h3>
              </div>

              {isDone && (
                <div className="flex items-center gap-2">
                  <button
                    data-testid="button-copy-analysis"
                    type="button"
                    onClick={handleCopyAnalysis}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                      copiedAnalysis
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600"
                    )}
                  >
                    {copiedAnalysis ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedAnalysis ? "Copied!" : "Copy all"}
                  </button>
                  <InlineShareButtons />
                  <button
                    data-testid="button-download"
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    .txt
                  </button>
                </div>
              )}
            </div>

            <div
              ref={outputRef}
              data-testid="output-analysis"
              className="max-h-[600px] overflow-y-auto pr-1 space-y-0.5"
            >
              {renderAnalysis(output)}
              {isGenerating && (
                <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 rounded-sm" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
