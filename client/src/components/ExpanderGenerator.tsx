import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2, Loader2, AlertTriangle, CheckCircle2,
  Download, Copy, Save, FolderOpen, Trash2, X, RotateCcw,
  RefreshCw, ChevronDown, ArrowRight, BarChart3
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useExpanderStorage } from "@/hooks/use-expander-storage";

const LEVELS = [
  { id: "slight", label: "Slightly Longer", desc: "2-3x length", multiplier: "2-3x" },
  { id: "paragraph", label: "Paragraph", desc: "Full paragraph", multiplier: "4-6x" },
  { id: "detailed", label: "Detailed", desc: "Comprehensive", multiplier: "8-12x" },
];

const ENHANCEMENTS = [
  { id: "includeExamples", label: "Include Examples", desc: "Add concrete examples" },
  { id: "addContext", label: "Add Context", desc: "Background and circumstances" },
  { id: "includeStats", label: "Include Statistics", desc: "Data and numbers" },
  { id: "addExpertPerspective", label: "Expert Perspective", desc: "Professional insight" },
];

const EXAMPLE_TEXT = "AI improves productivity.";

const SYSTEM_PROMPT = `You are an expert writing coach specializing in sentence expansion, elaboration, and detailed explanation. You transform short sentences into comprehensive, detailed writing that adds real value through context, examples, and depth.`;

const LEVEL_INSTRUCTIONS: Record<string, string> = {
  slight: "Make it 2-3x longer. Add one or two supporting details. Keep it concise and focused.",
  paragraph: "Expand into a full paragraph (50-80 words). Add context, examples, and explanation. Be comprehensive but focused.",
  detailed: "Create a thorough explanation (100+ words). Include multiple examples, thorough analysis, and full context.",
};

interface ExpandedVersion {
  id: string;
  label: string;
  text: string;
  wordCount: number;
}

interface ExpanderResult {
  id: string;
  versions: ExpandedVersion[];
  originalWords: number;
  originalChars: number;
  techniques: string[];
}

function isHeaderLine(line: string): boolean {
  return /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:VERSION\s*#?\s*\d|PRIMARY|EXPANDED|MAIN|ALTERNATIVE|DIFFERENT\s*ANGLE|THIRD|WITH\s*STATISTICS|STATISTICAL)/i.test(line);
}

function stripHeaderPrefix(text: string): string {
  return text
    .replace(/^(?:#{1,3}\s*)?(?:\*{2})?\s*VERSION\s*#?\s*\d[^:]*:\s*(?:\*{2})?\s*/i, "")
    .replace(/^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:PRIMARY|EXPANDED|MAIN|ALTERNATIVE|DIFFERENT\s*ANGLE|THIRD|WITH\s*STATISTICS|STATISTICAL)[^:]*:\s*(?:\*{2})?\s*/i, "")
    .replace(/^["*]+|["*]+$/g, "")
    .trim();
}

function parseExpansions(raw: string, originalWords: number, originalChars: number): ExpanderResult | null {
  const versions: ExpandedVersion[] = [];
  const techniques: string[] = [];

  const VERSION_PATTERNS: Array<{ re: RegExp; label: string }> = [
    { re: /(?:VERSION\s*(?:#?\s*)?1|PRIMARY\s*EXPAN|EXPANDED\s*VERSION|MAIN\s*EXPAN)/i, label: "Primary Expansion" },
    { re: /(?:VERSION\s*(?:#?\s*)?2|ALTERNATIVE|DIFFERENT\s*ANGLE)/i, label: "Alternative Angle" },
    { re: /(?:VERSION\s*(?:#?\s*)?3|THIRD|WITH\s*STATISTICS|STATISTICAL)/i, label: "Third Variation" },
  ];

  const STOP_RE = /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:BREAKDOWN|TECHNIQUE|ANALYSIS|WHAT WAS ADDED|EXPANSION TECHNIQUE)/i;

  const lines = raw.split("\n");
  let currentLabel = "";
  let currentLines: string[] = [];
  let inTechniques = false;

  const flushVersion = () => {
    if (currentLabel && currentLines.length > 0) {
      let text = currentLines.join(" ").replace(/\s+/g, " ").replace(/^["*]+|["*]+$/g, "").trim();
      text = stripHeaderPrefix(text);
      if (text.length > 30 && !isHeaderLine(text)) {
        const existing = versions.find(v => v.label === currentLabel);
        if (existing) {
          existing.text = text;
          existing.wordCount = text.split(/\s+/).length;
        } else {
          versions.push({
            id: generateId(),
            label: currentLabel,
            text,
            wordCount: text.split(/\s+/).length,
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

    if (STOP_RE.test(trimmed)) {
      flushVersion();
      inTechniques = true;
      continue;
    }

    if (inTechniques) {
      const item = trimmed.replace(/^[-*\d.)\u2713\u2714\u2705]+\s*/, "").trim();
      if (item.length > 5) techniques.push(item);
      continue;
    }

    let matched = false;
    for (const vp of VERSION_PATTERNS) {
      if (vp.re.test(trimmed)) {
        flushVersion();
        currentLabel = vp.label;
        const colonIdx = trimmed.indexOf(":");
        if (colonIdx !== -1) {
          const after = trimmed.slice(colonIdx + 1).replace(/^[\s*"]+|[\s*"]+$/g, "").trim();
          if (after.length > 30 && !isHeaderLine(after)) {
            currentLines.push(after);
          }
        }
        matched = true;
        break;
      }
    }
    if (matched) continue;

    if (currentLabel) {
      const cleaned = trimmed.replace(/^["*]+|["*]+$/g, "").trim();
      if (!isHeaderLine(cleaned)) {
        currentLines.push(cleaned);
      }
    } else if (versions.length === 0 && !currentLabel) {
      const cleaned = trimmed.replace(/^["*]+|["*]+$/g, "").trim();
      if (cleaned.length > 30 && !isHeaderLine(cleaned) && !cleaned.match(/^(#{1,3}|EXPAND|ORIGINAL)/i)) {
        currentLabel = "Primary Expansion";
        currentLines.push(cleaned);
      }
    }
  }
  flushVersion();

  if (versions.length === 0) {
    const allText = raw.replace(/^(#{1,3}.*|VERSION.*|\*{2}.*\*{2})\n/gim, "").trim();
    const cleaned = allText.replace(/\s+/g, " ").replace(/^["*]+|["*]+$/g, "").trim();
    if (cleaned.length > 30) {
      versions.push({
        id: generateId(),
        label: "Expanded Version",
        text: cleaned.slice(0, 800),
        wordCount: cleaned.slice(0, 800).split(/\s+/).length,
      });
    }
  }

  if (versions.length === 0) return null;

  return { id: generateId(), versions, originalWords, originalChars, techniques };
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function ExpanderGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useExpanderStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [sourceText, setSourceText] = useState("");
  const [level, setLevel] = useState("paragraph");
  const [includeExamples, setIncludeExamples] = useState(true);
  const [addContext, setAddContext] = useState(true);
  const [includeStats, setIncludeStats] = useState(false);
  const [addExpertPerspective, setAddExpertPerspective] = useState(false);

  const enhancementState: Record<string, [boolean, (v: boolean) => void]> = {
    includeExamples: [includeExamples, setIncludeExamples],
    addContext: [addContext, setAddContext],
    includeStats: [includeStats, setIncludeStats],
    addExpertPerspective: [addExpertPerspective, setAddExpertPerspective],
  };

  const [streamedContent, setStreamedContent] = useState("");
  const [result, setResult] = useState<ExpanderResult | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [expandedVersion, setExpandedVersion] = useState<Set<string>>(new Set());

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = sourceText.trim().length >= 5;
  const srcWordCount = wordCount(sourceText);

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setExpandedVersion(new Set());

    const levelInst = LEVEL_INSTRUCTIONS[level] || LEVEL_INSTRUCTIONS.paragraph;
    const enhancements: string[] = [];
    if (includeExamples) enhancements.push("Include concrete, specific examples");
    if (addContext) enhancements.push("Add relevant background context and circumstances");
    if (includeStats) enhancements.push("Include relevant statistics or quantifiable data");
    if (addExpertPerspective) enhancements.push("Add expert or professional perspective");

    const prompt = `Expand the following short sentence into detailed writing.

ORIGINAL SENTENCE:
"${sourceText}"

EXPANSION LEVEL: ${LEVELS.find(l => l.id === level)?.label || "Paragraph"}
${levelInst}

${enhancements.length > 0 ? `ENHANCEMENTS TO INCLUDE:\n${enhancements.map(e => `- ${e}`).join("\n")}` : ""}

Provide your response in these sections:

VERSION #1 (Primary Expansion):
[Write the main expanded version here]

VERSION #2 (Different Angle):
[Write an alternative expansion from a different perspective]

VERSION #3 (With Statistics):
[Write a third variation incorporating data or quantifiable claims]

TECHNIQUES USED:
[List each expansion technique used, one per line with a dash]
- Method explanation
- Concrete examples
- etc.

Write naturally and ensure each version adds real value, not filler words.`;

    const origWords = wordCount(sourceText);
    const origChars = sourceText.trim().length;

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      maxTokens: level === "detailed" ? 3500 : level === "paragraph" ? 2500 : 1500,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw expander output:", finalContent);
      const parsed = parseExpansions(finalContent, origWords, origChars);
      if (!parsed || parsed.versions.length === 0) {
        setEmptyError("Could not parse the expanded output. Please try again.");
      } else {
        setResult(parsed);
        setExpandedVersion(new Set([parsed.versions[0].id]));
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setSourceText(""); setLevel("paragraph");
    setIncludeExamples(true); setAddContext(true);
    setIncludeStats(false); setAddExpertPerspective(false);
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setExpandedVersion(new Set());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = result.versions.map((v, i) => `--- Version ${i + 1}: ${v.label} ---\n${v.text}`).join("\n\n");
    handleCopy(text, "all");
  };

  const handleDownload = () => {
    if (!result) return;
    let text = `ORIGINAL: ${sourceText}\n\n`;
    result.versions.forEach((v, i) => {
      text += `--- Version ${i + 1}: ${v.label} (${v.wordCount} words, ${Math.round(v.wordCount / result.originalWords)}x) ---\n${v.text}\n\n`;
    });
    if (result.techniques.length > 0) {
      text += `TECHNIQUES USED:\n${result.techniques.map(t => `- ${t}`).join("\n")}`;
    }
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "expanded-sentence.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!result) return;
    saveDraft({
      label: sourceText.slice(0, 60),
      content: JSON.stringify(result),
      formData: { sourceText, level, includeExamples, addContext, includeStats, addExpertPerspective },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setSourceText(fd.sourceText || "");
    setLevel(fd.level); setIncludeExamples(fd.includeExamples);
    setAddContext(fd.addContext); setIncludeStats(fd.includeStats);
    setAddExpertPerspective(fd.addExpertPerspective);
    try {
      const restored: ExpanderResult = JSON.parse(draft.content);
      if (restored && restored.versions?.length > 0) {
        setResult(restored);
        setExpandedVersion(new Set([restored.versions[0].id]));
      }
    } catch {
      setResult(null);
    }
    setStreamedContent("");
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleVersion = (id: string) => {
    setExpandedVersion(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="exp-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="exp-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Expansions</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved expansions" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved expansion" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
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
              <label htmlFor="exp-source" className="text-sm font-semibold text-slate-700 ml-1">Short Sentence *</label>
              <button data-testid="button-load-example" type="button" onClick={() => setSourceText(EXAMPLE_TEXT)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Load Example</button>
            </div>
            <div className="relative">
              <textarea id="exp-source" data-testid="input-source" value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder={'Type a short sentence to expand...\n\nExample: "AI improves productivity."'} maxLength={200} rows={3} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400">
                <span data-testid="text-word-count">{srcWordCount} words</span>
                <span>{sourceText.length}/200</span>
              </div>
            </div>
            {sourceText.length > 0 && sourceText.trim().length < 5 && (
              <p className="text-xs text-amber-600 ml-1 mt-1" data-testid="text-min-length-hint">Minimum 5 characters required ({5 - sourceText.trim().length} more needed)</p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Expansion Level *</legend>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((lv) => {
                const isActive = level === lv.id;
                return (
                  <button key={lv.id} data-testid={`button-level-${lv.id}`} type="button" onClick={() => setLevel(lv.id)} aria-pressed={isActive} className={cn("flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <span className={cn("font-semibold text-sm", isActive ? "text-purple-800" : "text-slate-700")}>{lv.label}</span>
                    <span className="text-[10px] text-slate-400">{lv.desc}</span>
                    <span className={cn("text-xs font-bold mt-0.5", isActive ? "text-purple-600" : "text-slate-300")}>{lv.multiplier}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Enhancement Options</legend>
            <div className="grid grid-cols-2 gap-2">
              {ENHANCEMENTS.map((enh) => {
                const [val, setVal] = enhancementState[enh.id];
                return (
                  <button key={enh.id} data-testid={`button-enh-${enh.id}`} type="button" onClick={() => setVal(!val)} aria-pressed={val} className={cn("flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all", val ? "border-purple-500 bg-purple-50" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors", val ? "bg-purple-500 border-purple-500" : "border-slate-300")}>
                      {val && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <span className={cn("font-semibold text-xs block", val ? "text-purple-800" : "text-slate-700")}>{enh.label}</span>
                      <span className="text-[10px] text-slate-400 leading-tight">{enh.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Expanding...</>) : (<><Maximize2 className="w-5 h-5" /> Expand Sentence</>)}
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
            <span className="text-sm font-semibold text-purple-600">Expanding sentence...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && result && result.versions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <h4 className="font-bold text-slate-700 text-sm">Expansion Analysis</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Original</p>
                  <p className="font-bold text-slate-800 text-lg" data-testid="text-original-words">{result.originalWords}</p>
                  <p className="text-[10px] text-slate-400">words</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center flex flex-col items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-purple-500 mb-1" />
                  <p className="font-bold text-purple-600 text-sm" data-testid="text-multiplier">{result.versions[0] ? `${Math.round(result.versions[0].wordCount / Math.max(result.originalWords, 1))}x longer` : ""}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Expanded</p>
                  <p className="font-bold text-emerald-700 text-lg" data-testid="text-expanded-words">{result.versions[0]?.wordCount || 0}</p>
                  <p className="text-[10px] text-slate-400">words</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {result.versions.map((version, idx) => {
                const isOpen = expandedVersion.has(version.id);
                const panelId = `exp-version-${version.id}`;
                const multiplier = Math.round(version.wordCount / Math.max(result.originalWords, 1));
                return (
                  <div key={version.id} className={cn("bg-white rounded-xl border shadow-sm overflow-hidden", idx === 0 ? "border-purple-200" : "border-slate-200")} data-testid={`card-version-${idx}`}>
                    <button type="button" onClick={() => toggleVersion(version.id)} data-testid={`button-toggle-version-${idx}`} aria-expanded={isOpen} aria-controls={panelId} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {idx === 0 && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase">Best</span>}
                        <span className="font-semibold text-slate-800 text-sm">{version.label}</span>
                        <span className="text-xs text-slate-400">{version.wordCount} words ({multiplier}x)</span>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div id={panelId} className="px-4 pb-4">
                            <p className="text-sm text-slate-700 leading-relaxed" data-testid={`text-version-${idx}`}>{version.text}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <button data-testid={`button-copy-version-${idx}`} onClick={() => handleCopy(version.text, `v-${idx}`)} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
                                {copiedId === `v-${idx}` ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {copiedId === `v-${idx}` ? "Copied" : "Copy"}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {result.techniques.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Expansion Techniques Used
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.techniques.map((tech, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      {tech}
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
              <button data-testid="button-download" onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
              <button data-testid="button-save" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                {saved ? "Saved" : "Save"}
              </button>
              <button data-testid="button-regenerate" onClick={handleGenerate} disabled={!isFormValid || isGenerating || !isReady} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <RefreshCw className="w-4 h-4" /> Expand Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
