import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  Download, Copy, Save, FolderOpen, Trash2, X, RotateCcw,
  FileText, Palette, GraduationCap, Sparkles, Briefcase, Star,
  PenLine
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useRewriterStorage } from "@/hooks/use-rewriter-storage";

const STYLES = [
  { id: "formal", label: "Formal", desc: "Professional, polished", best: "Business, official docs", icon: FileText },
  { id: "casual", label: "Casual", desc: "Friendly, conversational", best: "Blogs, social media", icon: Palette },
  { id: "academic", label: "Academic", desc: "Scholarly, precise", best: "Essays, research", icon: GraduationCap },
  { id: "creative", label: "Creative", desc: "Engaging, vivid", best: "Stories, marketing", icon: Sparkles },
  { id: "professional", label: "Professional", desc: "Clear, direct", best: "Emails, reports", icon: Briefcase },
];

const STRENGTHS = [
  { id: "light", label: "Light", desc: "Minor improvements, keep structure" },
  { id: "moderate", label: "Moderate", desc: "Noticeable changes, new phrasing" },
  { id: "complete", label: "Complete", desc: "Totally rewritten, same meaning" },
];

const STYLE_PROMPTS: Record<string, string> = {
  formal: "Professional language, complete sentences, sophisticated vocabulary, objective tone, polished presentation. Avoid contractions.",
  casual: "Conversational language, friendly tone, simple words, relatable phrasing, natural flow. Contractions welcome.",
  academic: "Scholarly vocabulary, precise language, formal structure, evidence-based tone, technical accuracy.",
  creative: "Engaging language, vivid descriptions, varied sentence structure, compelling flow, personality.",
  professional: "Clear and direct, business appropriate, active voice preferred, confident tone, efficient phrasing.",
};

const STRENGTH_PROMPTS: Record<string, string> = {
  light: "Minor improvements only. Keep most original phrasing. Fix obvious issues. Maintain structure. Keep about 70% of original words.",
  moderate: "Significant rephrasing. New sentence structures. Better word choices. Improved flow. Keep about 40-50% of original words.",
  complete: "Total rewrite. All new phrasing. Same meaning but expressed completely differently. Fresh perspective. Keep only 10-20% of original words.",
};

const EXAMPLE_TEXT = "Artificial intelligence is transforming industries by enabling machines to learn from data and automate complex tasks. Companies are investing heavily in AI to improve efficiency and gain competitive advantages.";

const SYSTEM_PROMPT = `You are an expert writing coach and editor specializing in paragraph rewriting and style improvement. You preserve meaning completely while improving clarity, flow, tone, and readability. You produce natural, human-sounding text that matches the requested style perfectly.`;

interface ParsedVersion {
  id: string;
  number: number;
  label: string;
  text: string;
  analysis: string;
}

function parseVersions(raw: string): ParsedVersion[] {
  const versions: ParsedVersion[] = [];
  const versionLabels = ["Recommended", "Alternative", "Different Angle"];

  const headerPattern = /^(?:#{1,3}\s*)?(?:\*{2})?(?:VERSION|VARIATION|REWRITE)\s*#?\s*(\d)(?:\*{2})?[:\s]*(.*)/i;

  const headerIndices: { idx: number; num: number; labelHint: string; inlineContent: string }[] = [];
  const lines = raw.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const m = headerPattern.exec(line);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num >= 1 && num <= 5 && !headerIndices.some(h => h.num === num)) {
        const rest = (m[2] || "").replace(/^\(([^)]*)\)\s*/, (_, lbl) => { return ""; }).trim();
        const labelMatch = (m[2] || "").match(/\(([^)]*)\)/);
        headerIndices.push({ idx: i, num, labelHint: labelMatch ? labelMatch[1] : "", inlineContent: rest });
      }
    }
  }

  if (headerIndices.length === 0) {
    const delimiterSplit = raw.split(/\n---+\n|\n\*{3,}\n|\n={3,}\n/);
    if (delimiterSplit.length >= 2) {
      for (let d = 0; d < Math.min(delimiterSplit.length, 3); d++) {
        const chunk = delimiterSplit[d].trim();
        if (chunk.length < 10) continue;
        versions.push({
          id: generateId(),
          number: d + 1,
          label: versionLabels[d] || `Version ${d + 1}`,
          text: chunk,
          analysis: "",
        });
      }
      return versions;
    }

    if (raw.trim().length > 20) {
      versions.push({ id: generateId(), number: 1, label: "Rewrite", text: raw.trim(), analysis: "" });
    }
    return versions;
  }

  for (let h = 0; h < headerIndices.length; h++) {
    const startLine = headerIndices[h].idx + 1;
    const endLine = h + 1 < headerIndices.length ? headerIndices[h + 1].idx : lines.length;
    let body = lines.slice(startLine, endLine).join("\n").trim();

    if (headerIndices[h].inlineContent && headerIndices[h].inlineContent.length > 10) {
      body = headerIndices[h].inlineContent + (body ? "\n" + body : "");
    }

    if (body.length < 10) continue;

    const analysisMatch = body.match(/(?:^|\n)(?:#{1,3}\s*)?(?:\*{2})?(?:ANALYSIS|KEY CHANGES|WHY THIS|TONE SHIFT|READABILITY|CHANGES MADE)[:\s*]/im);
    let text = body;
    let analysis = "";
    if (analysisMatch && analysisMatch.index !== undefined) {
      text = body.slice(0, analysisMatch.index).trim();
      analysis = body.slice(analysisMatch.index).trim();
    }

    text = text.replace(/^["']|["']$/g, "").replace(/^\*{2}|\*{2}$/g, "").trim();

    const num = headerIndices[h].num;
    versions.push({
      id: generateId(),
      number: num,
      label: headerIndices[h].labelHint || versionLabels[num - 1] || `Version ${num}`,
      text,
      analysis,
    });
  }

  return versions;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function ParagraphRewriterGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useRewriterStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [originalText, setOriginalText] = useState("");
  const [rewriteStyle, setRewriteStyle] = useState("professional");
  const [rewriteStrength, setRewriteStrength] = useState("moderate");

  const [streamedContent, setStreamedContent] = useState("");
  const [versions, setVersions] = useState<ParsedVersion[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = originalText.trim().length >= 20;

  const origWordCount = wordCount(originalText);

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent(""); setVersions([]); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError(""); setExpandedId(null);

    const styleDesc = STYLE_PROMPTS[rewriteStyle] || STYLE_PROMPTS.professional;
    const strengthDesc = STRENGTH_PROMPTS[rewriteStrength] || STRENGTH_PROMPTS.moderate;
    const styleName = STYLES.find(s => s.id === rewriteStyle)?.label || "Professional";

    const prompt = `Rewrite the following paragraph.

ORIGINAL PARAGRAPH:
${originalText}

REWRITE REQUIREMENTS:

Style: ${styleName}
${styleDesc}

Strength: ${rewriteStrength}
${strengthDesc}

GENERATE 3 VERSIONS:

VERSION #1 (Optimal rewrite - best overall):
VERSION #2 (Alternative approach):
VERSION #3 (Different angle/emphasis):

For EACH version provide the full rewritten paragraph. Then add a brief analysis section noting key changes, tone shift, and why this version works.

IMPORTANT:
- Do NOT add new information
- Do NOT remove key points
- Do NOT change meaning
- Do maintain all facts
- Do sound human, not robotic

Format each version clearly starting with VERSION #1:, VERSION #2:, VERSION #3: headers.`;

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 3072,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw paragraph rewriter output:", finalContent);
      const parsed = parseVersions(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse rewritten versions. Please try again.");
      } else {
        setVersions(parsed);
        setExpandedId(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setOriginalText(""); setRewriteStyle("professional"); setRewriteStrength("moderate");
    setStreamedContent(""); setVersions([]); setIsDone(false);
    setExpandedId(null); setCopiedId(null); setSaved(false); setEmptyError("");
  };

  const handleCopyVersion = (v: ParsedVersion) => {
    navigator.clipboard.writeText(v.text);
    setCopiedId(v.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = versions.map(v => `=== VERSION ${v.number}: ${v.label} ===\n\n${v.text}${v.analysis ? `\n\n${v.analysis}` : ""}`).join("\n\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    const header = `Original:\n${originalText}\n\nStyle: ${STYLES.find(s => s.id === rewriteStyle)?.label}\nStrength: ${rewriteStrength}\n\n`;
    const text = header + versions.map(v => `=== VERSION ${v.number}: ${v.label} ===\n\n${v.text}${v.analysis ? `\n\n${v.analysis}` : ""}`).join("\n\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "paragraph-rewrite.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = JSON.stringify(versions);
    saveDraft({
      label: originalText.slice(0, 60),
      content,
      formData: { originalText, rewriteStyle, rewriteStrength },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setOriginalText(fd.originalText || "");
    setRewriteStyle(fd.rewriteStyle); setRewriteStrength(fd.rewriteStrength);
    try {
      const restored: ParsedVersion[] = JSON.parse(draft.content);
      if (Array.isArray(restored) && restored.length > 0) {
        setVersions(restored);
        setExpandedId(restored[0].id);
      }
    } catch {
      const parsed = parseVersions(draft.content);
      if (parsed.length > 0) { setVersions(parsed); setExpandedId(parsed[0].id); }
    }
    setStreamedContent("");
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadExample = () => {
    setOriginalText(EXAMPLE_TEXT);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="pr-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="pr-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Rewrites</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved rewrites" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved rewrite" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
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
              <label htmlFor="pr-original" className="text-sm font-semibold text-slate-700 ml-1">Paragraph to Rewrite *</label>
              <button data-testid="button-load-example" type="button" onClick={handleLoadExample} className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Load Example</button>
            </div>
            <div className="relative">
              <textarea id="pr-original" data-testid="input-original" value={originalText} onChange={(e) => setOriginalText(e.target.value)} placeholder={"Paste your paragraph here...\n\nExample:\nArtificial intelligence is transforming industries by enabling machines to learn from data and automate complex tasks."} maxLength={2000} rows={6} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400 text-sm" />
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-slate-400">
                <span data-testid="text-word-count">{origWordCount} words</span>
                <span>{originalText.length}/2,000</span>
              </div>
            </div>
            {originalText.length > 0 && originalText.trim().length < 20 && (
              <p className="text-xs text-amber-600 ml-1 mt-1" data-testid="text-min-length-hint">Minimum 20 characters required ({20 - originalText.trim().length} more needed)</p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Rewrite Style *</legend>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {STYLES.map((style) => {
                const StyleIcon = style.icon;
                const isActive = rewriteStyle === style.id;
                return (
                  <button key={style.id} data-testid={`button-style-${style.id}`} type="button" onClick={() => setRewriteStyle(style.id)} aria-pressed={isActive} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <StyleIcon className={cn("w-4 h-4", isActive ? "text-purple-600" : "text-slate-400")} />
                    <span className={cn("font-semibold text-xs", isActive ? "text-purple-800" : "text-slate-700")}>{style.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{style.desc}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Rewrite Strength</legend>
            <div className="flex gap-2">
              {STRENGTHS.map((strength) => {
                const isActive = rewriteStrength === strength.id;
                return (
                  <button key={strength.id} data-testid={`button-strength-${strength.id}`} type="button" onClick={() => setRewriteStrength(strength.id)} aria-pressed={isActive} className={cn("flex-1 px-4 py-3 rounded-xl border-2 text-center transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <p className={cn("font-semibold text-sm", isActive ? "text-purple-800" : "text-slate-700")}>{strength.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{strength.desc}</p>
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Rewriting...</>) : (<><PenLine className="w-5 h-5" /> Rewrite Paragraph</>)}
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
            <span className="text-sm font-semibold text-purple-600">Rewriting your paragraph...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && versions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                {versions.length} {versions.length === 1 ? "Version" : "Versions"} Generated
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <button data-testid="button-save" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button data-testid="button-download" onClick={handleDownloadTxt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> TXT
                </button>
                <button data-testid="button-regenerate" onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            {originalText && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold text-slate-500 mb-2">Original ({origWordCount} words)</p>
                <p className="text-sm text-slate-600 leading-relaxed">{originalText}</p>
              </div>
            )}

            {versions.map((v, index) => {
              const vWordCount = wordCount(v.text);
              const diff = vWordCount - origWordCount;
              const diffPct = origWordCount > 0 ? Math.round((diff / origWordCount) * 100) : 0;
              const isFirst = index === 0;
              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden", isFirst ? "border-purple-300 ring-1 ring-purple-100" : "border-slate-200")}>
                  <button data-testid={`button-expand-version-${index}`} type="button" onClick={() => setExpandedId(expandedId === v.id ? null : v.id)} aria-expanded={expandedId === v.id} aria-controls={`pr-version-${v.id}`} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn("flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-bold text-sm", isFirst ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600")}>
                        {isFirst ? <Star className="w-4 h-4" /> : v.number}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800 text-sm">Version {v.number}</p>
                          {isFirst && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">Recommended</span>}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{v.label} &middot; {vWordCount} words ({diff >= 0 ? `+${diffPct}%` : `${diffPct}%`})</p>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0 ml-3", expandedId === v.id && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {expandedId === v.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div id={`pr-version-${v.id}`} className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans" data-testid={`text-version-${index}`}>{v.text}</pre>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{vWordCount} words</span>
                            <span className={cn(diff > 0 ? "text-blue-600" : diff < 0 ? "text-amber-600" : "text-slate-500")}>
                              {diff === 0 ? "Same length" : diff > 0 ? `+${diff} words (+${diffPct}%)` : `${diff} words (${diffPct}%)`}
                            </span>
                          </div>

                          {v.analysis && (
                            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
                              <p className="text-xs font-semibold text-purple-700 mb-2">Analysis</p>
                              <pre className="text-xs text-purple-900/80 leading-relaxed whitespace-pre-wrap font-sans">{v.analysis}</pre>
                            </div>
                          )}

                          <button data-testid={`button-copy-version-${index}`} onClick={() => handleCopyVersion(v)} className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                            {copiedId === v.id ? (<><CheckCircle2 className="w-4 h-4" /> Copied!</>) : (<><Copy className="w-4 h-4" /> Copy Version {v.number}</>)}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
