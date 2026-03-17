import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlignLeft, Loader2, AlertTriangle, CheckCircle2,
  Download, Copy, Save, FolderOpen, Trash2, X, RotateCcw,
  RefreshCw, ChevronDown, BookOpen, ArrowRight, BarChart3
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useSimplifierStorage } from "@/hooks/use-simplifier-storage";

const LEVELS = [
  { id: "slight", label: "Slightly Simpler", desc: "Keep some sophistication", example: "Advanced algorithms help analyze data efficiently" },
  { id: "moderate", label: "Moderately Simpler", desc: "Balanced simplification", example: "Smart programs help study information quickly" },
  { id: "eli5", label: "ELI5", desc: "Explain like I'm 5", example: "Special computer helpers find answers fast" },
];

const EXAMPLE_TEXT = "The utilization of sophisticated algorithms facilitates the efficient processing and analysis of voluminous datasets, thereby enabling organizations to derive actionable insights and make data-driven decisions with unprecedented accuracy.";

const SYSTEM_PROMPT = `You are an expert language simplifier specializing in making complex text accessible to all readers. You simplify sentences while preserving their complete meaning. You also explain what changed and why, and identify complex vocabulary words with simple definitions.`;

interface WordEntry {
  word: string;
  definition: string;
  simpleForm: string;
}

interface ChangeEntry {
  original: string;
  simplified: string;
  reason: string;
}

interface SimplifierResult {
  id: string;
  simplified: string;
  originalGrade: string;
  simplifiedGrade: string;
  improvement: string;
  changes: ChangeEntry[];
  vocabulary: WordEntry[];
  whyItWorks: string[];
}

function parseResult(raw: string): SimplifierResult | null {
  const sections: Record<string, string> = {};
  let currentKey = "";
  let currentLines: string[] = [];

  for (const line of raw.split("\n")) {
    const headerMatch = line.trim().match(/^(?:#{1,3}\s*)?(?:\*{2})?(SIMPLIFIED|READABILITY|STEP.BY.STEP|CHANGES|VOCABULARY|WHY|WHAT CHANGED)(?:\s*\w*)*(?:\*{2})?:?\s*$/i);
    if (headerMatch) {
      if (currentKey) sections[currentKey] = currentLines.join("\n").trim();
      currentKey = headerMatch[1].toUpperCase();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentKey) sections[currentKey] = currentLines.join("\n").trim();

  let simplified = "";
  if (sections["SIMPLIFIED"]) {
    simplified = sections["SIMPLIFIED"].replace(/^\*{2}|^\"|\"$/gm, "").trim();
  }

  if (!simplified) {
    const lines = raw.trim().split("\n").filter(l => l.trim());
    for (const line of lines) {
      const cleaned = line.trim().replace(/^["*]+|["*]+$/g, "").trim();
      if (cleaned.length > 15 && !cleaned.match(/^(#{1,3}|SIMPLIFIED|READABILITY|STEP|CHANGES|VOCABULARY|WHY|WHAT|\d+\.|[-*])/i)) {
        simplified = cleaned;
        break;
      }
    }
  }

  if (!simplified) return null;

  let originalGrade = "College Level";
  let simplifiedGrade = "Middle School";
  let improvement = "Easier to read";

  const readSection = sections["READABILITY"] || "";
  const origMatch = readSection.match(/Original.*?(?:Grade\s*)?(\d+|College|High School|Middle|Elementary)/i);
  const simpMatch = readSection.match(/Simplified.*?(?:Grade\s*)?(\d+|College|High School|Middle|Elementary)/i);
  const impMatch = readSection.match(/Improvement.*?(\d+%.*)/i);
  if (origMatch) originalGrade = origMatch[1].includes("Grade") ? origMatch[1] : `Grade ${origMatch[1]}`;
  if (simpMatch) simplifiedGrade = simpMatch[1].includes("Grade") ? simpMatch[1] : `Grade ${simpMatch[1]}`;
  if (impMatch) improvement = impMatch[1].trim();

  const changes: ChangeEntry[] = [];
  const changesText = sections["STEP-BY-STEP"] || sections["CHANGES"] || sections["WHAT CHANGED"] || "";
  const changeBlocks = changesText.split(/\n(?=\d+[\.\)]|\s*[-*]\s*")/);
  for (const block of changeBlocks) {
    const arrowMatch = block.match(/["\u201C](.+?)["\u201D]\s*(?:\u2192|->|-->|to)\s*["\u201C](.+?)["\u201D]/);
    if (arrowMatch) {
      const reasonMatch = block.match(/(?:Reason|Why|Because):\s*(.+)/i);
      changes.push({
        original: arrowMatch[1].trim(),
        simplified: arrowMatch[2].trim(),
        reason: reasonMatch ? reasonMatch[1].trim() : "Simpler, more common word",
      });
    }
  }

  const vocabulary: WordEntry[] = [];
  const vocabText = sections["VOCABULARY"] || "";
  const vocabBlocks = vocabText.split(/\n(?=["\u201C]|\d+[\.\)]|\s*[-*]\s*["\u201C])/);
  for (const block of vocabBlocks) {
    const wordMatch = block.match(/["\u201C]?(\w+)["\u201D]?\s*(?:\(.*?\))?\s*/);
    const defMatch = block.match(/(?:Definition|Meaning):\s*(.+)/i);
    const simpleMatch = block.match(/(?:Simple form|Simpler?|Alternative):\s*(.+)/i);
    if (wordMatch && defMatch) {
      vocabulary.push({
        word: wordMatch[1].trim(),
        definition: defMatch[1].trim(),
        simpleForm: simpleMatch ? simpleMatch[1].trim() : "",
      });
    }
  }

  const whyItWorks: string[] = [];
  const whyText = sections["WHY"] || "";
  for (const line of whyText.split("\n")) {
    const item = line.trim().replace(/^[-*\u2713\u2714\u2705]\s*/, "").trim();
    if (item.length > 5) whyItWorks.push(item);
  }

  return {
    id: generateId(),
    simplified,
    originalGrade,
    simplifiedGrade,
    improvement,
    changes,
    vocabulary,
    whyItWorks,
  };
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function SimplifierGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useSimplifierStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [sourceText, setSourceText] = useState("");
  const [level, setLevel] = useState("moderate");
  const [showExplanations, setShowExplanations] = useState(true);

  const [streamedContent, setStreamedContent] = useState("");
  const [result, setResult] = useState<SimplifierResult | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [showChanges, setShowChanges] = useState(true);
  const [showVocab, setShowVocab] = useState(false);

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = sourceText.trim().length >= 10;
  const srcWordCount = wordCount(sourceText);

  const selectedLevel = LEVELS.find(l => l.id === level) || LEVELS[1];

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setShowChanges(true); setShowVocab(false);

    const levelInstruction = level === "slight"
      ? "Make it slightly simpler. Replace uncommon words with common alternatives but keep the sentence structure mostly intact. Keep some formality."
      : level === "eli5"
        ? "Explain like I'm 5 years old. Use the simplest possible words, short sentences, and everyday language a young child would understand."
        : "Make it moderately simpler. Replace jargon and complex words with everyday language. Simplify sentence structure. Use active voice.";

    const prompt = `Simplify the following sentence.

ORIGINAL SENTENCE:
"${sourceText}"

SIMPLIFICATION LEVEL: ${selectedLevel.label}
${levelInstruction}

Provide your response in these exact sections:

SIMPLIFIED:
[Write the simplified version of the sentence here]

READABILITY:
Original: [estimated grade level, e.g. "Grade 14 (College Level)"]
Simplified: [estimated grade level, e.g. "Grade 8 (Middle School)"]
Improvement: [percentage easier, e.g. "43% easier to read"]

WHAT CHANGED:
[List each word/phrase change with arrows and reasons]
1. "original word" -> "simpler word"
   Reason: [why this change was made]

VOCABULARY:
[List complex words with definitions]
"word" (part of speech)
Definition: [what it means]
Simple form: [simpler alternatives]

WHY:
[List reasons why the simplification works, one per line starting with a dash]
- Uses common, everyday words
- Active voice for clearer action
- Shorter, more direct phrasing
- Preserves complete meaning`;

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      maxTokens: 2048,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw simplifier output:", finalContent);
      const parsed = parseResult(finalContent);
      if (!parsed) {
        setEmptyError("Could not parse the simplified output. Please try again.");
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
    setSourceText(""); setLevel("moderate"); setShowExplanations(true);
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setShowChanges(true); setShowVocab(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    let text = `ORIGINAL:\n${sourceText}\n\nSIMPLIFIED:\n${result.simplified}\n\nREADABILITY:\nOriginal: ${result.originalGrade}\nSimplified: ${result.simplifiedGrade}\nImprovement: ${result.improvement}`;
    if (result.changes.length > 0) {
      text += "\n\nCHANGES:";
      result.changes.forEach((c, i) => {
        text += `\n${i + 1}. "${c.original}" -> "${c.simplified}"\n   Reason: ${c.reason}`;
      });
    }
    if (result.vocabulary.length > 0) {
      text += "\n\nVOCABULARY:";
      result.vocabulary.forEach(v => {
        text += `\n- ${v.word}: ${v.definition}${v.simpleForm ? ` (Simple: ${v.simpleForm})` : ""}`;
      });
    }
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "simplified-sentence.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!result) return;
    saveDraft({
      label: sourceText.slice(0, 60),
      content: JSON.stringify(result),
      formData: { sourceText, level, showExplanations },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setSourceText(fd.sourceText || "");
    setLevel(fd.level); setShowExplanations(fd.showExplanations);
    try {
      const restored: SimplifierResult = JSON.parse(draft.content);
      if (restored && restored.simplified) setResult(restored);
    } catch {
      setResult(null);
    }
    setStreamedContent("");
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="simp-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="simp-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Simplifications</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved simplifications" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved simplification" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
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
              <label htmlFor="simp-source" className="text-sm font-semibold text-slate-700 ml-1">Complex Sentence *</label>
              <button data-testid="button-load-example" type="button" onClick={() => setSourceText(EXAMPLE_TEXT)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Load Example</button>
            </div>
            <div className="relative">
              <textarea id="simp-source" data-testid="input-source" value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder={"Paste a complex sentence here...\n\nExamples:\n- 'The utilization of sophisticated algorithms facilitates efficient data analysis.'\n- 'Notwithstanding the aforementioned considerations, subsequent developments necessitate reevaluation.'"} maxLength={500} rows={4} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400">
                <span data-testid="text-word-count">{srcWordCount} words</span>
                <span>{sourceText.length}/500</span>
              </div>
            </div>
            {sourceText.length > 0 && sourceText.trim().length < 10 && (
              <p className="text-xs text-amber-600 ml-1 mt-1" data-testid="text-min-length-hint">Minimum 10 characters required ({10 - sourceText.trim().length} more needed)</p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Simplification Level *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {LEVELS.map((lv) => {
                const isActive = level === lv.id;
                return (
                  <button key={lv.id} data-testid={`button-level-${lv.id}`} type="button" onClick={() => setLevel(lv.id)} aria-pressed={isActive} className={cn("flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 text-left transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <span className={cn("font-semibold text-sm", isActive ? "text-purple-800" : "text-slate-700")}>{lv.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{lv.desc}</span>
                    <span className={cn("text-[11px] italic leading-snug mt-1", isActive ? "text-purple-600" : "text-slate-400")}>"{lv.example}"</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-sm font-semibold text-slate-700">Show Explanations</p>
              <p className="text-xs text-slate-400 mt-0.5">Display step-by-step breakdown and vocabulary</p>
            </div>
            <button data-testid="button-toggle-explanations" type="button" onClick={() => setShowExplanations(!showExplanations)} role="switch" aria-checked={showExplanations} aria-label="Show explanations" className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors", showExplanations ? "bg-purple-500" : "bg-slate-300")}>
              <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform", showExplanations ? "translate-x-[22px]" : "translate-x-[2px]")} />
            </button>
          </div>
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Simplifying...</>) : (<><AlignLeft className="w-5 h-5" /> Simplify Sentence</>)}
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
            <span className="text-sm font-semibold text-purple-600">Simplifying...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-800" data-testid="text-results-heading">Simplified Sentence</h3>
                </div>
                <p className="text-slate-700 text-[15px] leading-relaxed" data-testid="text-simplified-output">{result.simplified}</p>
              </div>

              <div className="p-5 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <h4 className="font-bold text-slate-700 text-sm">Readability Analysis</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Original</p>
                    <p className="font-bold text-slate-800 text-sm" data-testid="text-original-grade">{result.originalGrade}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-center flex flex-col items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-purple-500 mb-1" />
                    <p className="font-bold text-emerald-600 text-xs" data-testid="text-improvement">{result.improvement}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Simplified</p>
                    <p className="font-bold text-emerald-700 text-sm" data-testid="text-simplified-grade">{result.simplifiedGrade}</p>
                  </div>
                </div>
              </div>

              {showExplanations && result.changes.length > 0 && (
                <div className="border-b border-slate-100">
                  <button type="button" onClick={() => setShowChanges(!showChanges)} data-testid="button-toggle-changes" aria-expanded={showChanges} aria-controls="simp-changes-panel" className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      <h4 className="font-bold text-slate-700 text-sm">What Changed ({result.changes.length})</h4>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showChanges && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showChanges && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div id="simp-changes-panel" className="px-5 pb-5 space-y-3">
                          {result.changes.map((change, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100" data-testid={`card-change-${idx}`}>
                              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap text-sm">
                                  <span className="font-medium text-red-600 line-through">"{change.original}"</span>
                                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="font-medium text-emerald-600">"{change.simplified}"</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{change.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {showExplanations && result.vocabulary.length > 0 && (
                <div className="border-b border-slate-100">
                  <button type="button" onClick={() => setShowVocab(!showVocab)} data-testid="button-toggle-vocab" aria-expanded={showVocab} aria-controls="simp-vocab-panel" className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      <h4 className="font-bold text-slate-700 text-sm">Vocabulary Learned ({result.vocabulary.length})</h4>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showVocab && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showVocab && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div id="simp-vocab-panel" className="px-5 pb-5 space-y-3">
                          {result.vocabulary.map((v, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-purple-50 border border-purple-100" data-testid={`card-vocab-${idx}`}>
                              <p className="font-bold text-purple-800 text-sm">{v.word}</p>
                              <p className="text-xs text-slate-600 mt-1">{v.definition}</p>
                              {v.simpleForm && <p className="text-xs text-emerald-600 mt-1 font-medium">Simpler: {v.simpleForm}</p>}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {showExplanations && result.whyItWorks.length > 0 && (
                <div className="p-5">
                  <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Why This Simplification Works
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.whyItWorks.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button data-testid="button-copy-simplified" onClick={() => handleCopy(result.simplified, "simplified")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                {copiedId === "simplified" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copiedId === "simplified" ? "Copied!" : "Copy"}
              </button>
              <button data-testid="button-download" onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
              <button data-testid="button-save" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved" : "Save"}
              </button>
              <button data-testid="button-regenerate" onClick={handleGenerate} disabled={!isFormValid || isGenerating || !isReady} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <RefreshCw className="w-4 h-4" /> Simplify Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
