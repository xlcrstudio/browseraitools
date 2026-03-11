import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  RotateCcw, Star, Zap, FileText, ArrowRight, Layers
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useValuePropStorage } from "@/hooks/use-value-prop-storage";

const INDUSTRIES = [
  "SaaS / Software", "E-commerce", "Services", "Education",
  "Healthcare", "Finance", "Other",
];

const FORMAT_LABELS = ["Tagline", "One-Liner", "Detailed", "Problem-Solution-Outcome", "Comparison"];
const FORMAT_ICONS = [Zap, FileText, Layers, ArrowRight, Star];

const SYSTEM_PROMPT = `You are an expert marketing strategist specializing in value proposition development. You write clear, compelling value propositions that communicate benefits, differentiation, and customer outcomes. You always produce exactly 5 variations in different formats.`;

interface ParsedVariation {
  id: string;
  format: string;
  text: string;
  clarityScore: number;
  analysis: string;
  whenToUse: string;
}

function parseVariations(raw: string): ParsedVariation[] {
  const variations: ParsedVariation[] = [];

  const lines = raw.split("\n");
  const headerPattern = /^(?:#{1,3}\s*)?(?:\*{2})?(?:(?:VARIATION|FORMAT|OPTION)\s*#?\s*\d|(?:\d+[\.\)\:]\s*)?(?:TAGLINE|ONE[- ]?LINER|DETAILED|PROBLEM[- ]?SOLUTION|COMPARISON)(?:\s*(?:FORMAT|VARIATION|VERSION))?)/i;

  const headerIndices: { lineIdx: number; rawLine: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (headerPattern.test(line)) {
      headerIndices.push({ lineIdx: i, rawLine: line });
    }
  }

  if (headerIndices.length <= 1) {
    const numberedHeaders: { lineIdx: number; rawLine: string }[] = [];
    const numPattern = /^(?:#{1,3}\s*)?(?:\*{2})?\d+[\.\)]\s+/;
    const vpKeywords = /tagline|one.?liner|detailed|problem|solution|comparison|format|variation|proposition/i;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (numPattern.test(line) && line.length > 8 && line.length < 120 && vpKeywords.test(line)) {
        numberedHeaders.push({ lineIdx: i, rawLine: line });
      }
    }
    if (numberedHeaders.length > 1) {
      headerIndices.length = 0;
      headerIndices.push(...numberedHeaders);
    }
  }

  if (headerIndices.length <= 1) {
    const sepSplits = raw.split(/(?:\n---+\n|\n===+\n|\n\*\*\*+\n)/);
    const filtered = sepSplits.filter(s => s.trim().length > 20);
    for (let i = 0; i < filtered.length && variations.length < 5; i++) {
      const format = FORMAT_LABELS[variations.length] || `Variation ${variations.length + 1}`;
      const scoreMatch = filtered[i].match(/(?:clarity\s*)?score\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
      const text = filtered[i]
        .replace(/(?:clarity\s*)?score\s*[:\s]*\d+(?:\.\d+)?\s*\/\s*10/gi, "")
        .trim();
      if (text.length > 10) {
        variations.push({
          id: generateId(),
          format,
          text,
          clarityScore: scoreMatch ? Math.round(parseFloat(scoreMatch[1]) * 10) / 10 : 8,
          analysis: "",
          whenToUse: "",
        });
      }
    }
    return variations;
  }

  for (let h = 0; h < headerIndices.length && variations.length < 5; h++) {
    const startLine = headerIndices[h].lineIdx + 1;
    const endLine = h + 1 < headerIndices.length ? headerIndices[h + 1].lineIdx : lines.length;
    const body = lines.slice(startLine, endLine).join("\n").trim();
    if (body.length < 10) continue;

    const headerLine = headerIndices[h].rawLine.toLowerCase();
    let format = FORMAT_LABELS[variations.length] || `Variation ${variations.length + 1}`;
    if (headerLine.includes("tagline")) format = "Tagline";
    else if (headerLine.includes("one") && headerLine.includes("liner")) format = "One-Liner";
    else if (headerLine.includes("detail")) format = "Detailed";
    else if (headerLine.includes("problem") || headerLine.includes("solution")) format = "Problem-Solution-Outcome";
    else if (headerLine.includes("comparison") || headerLine.includes("unlike")) format = "Comparison";

    const scoreMatch = body.match(/(?:clarity\s*)?score\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    const clarityScore = scoreMatch ? parseFloat(scoreMatch[1]) : [8.5, 9, 9.5, 8, 8.5][variations.length] || 8;

    const whenMatch = body.match(/(?:when\s*to\s*use|best\s*for|use\s*(?:this\s*)?(?:for|in))\s*[:\s]*(.+?)(?:\n|$)/i);
    const whenToUse = whenMatch ? whenMatch[1].trim() : "";

    const analysisLines: string[] = [];
    const bodyLines = body.split("\n");
    for (const bl of bodyLines) {
      const trimmed = bl.trim();
      if (trimmed.match(/^[✓✅•\-]\s+/) || trimmed.match(/^⚠️/) || trimmed.match(/^what\s*works/i)) {
        analysisLines.push(trimmed);
      }
    }
    const analysis = analysisLines.join("\n");

    let text = body
      .replace(/(?:clarity\s*)?score\s*[:\s]*\d+(?:\.\d+)?\s*\/\s*10/gi, "")
      .replace(/(?:when\s*to\s*use|best\s*for|use\s*(?:this\s*)?(?:for|in))\s*[:\s]*.+/gi, "")
      .trim();

    for (const al of analysisLines) {
      text = text.replace(al, "");
    }
    text = text.replace(/\n{3,}/g, "\n\n").trim();

    if (text.length > 5) {
      variations.push({
        id: generateId(),
        format,
        text,
        clarityScore: Math.round(clarityScore * 10) / 10,
        analysis,
        whenToUse,
      });
    }
  }

  return variations;
}

function getScoreColor(score: number) {
  if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 8) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 7) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

export function ValuePropGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useValuePropStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [benefit, setBenefit] = useState("");
  const [differentiator, setDifferentiator] = useState("");
  const [industry, setIndustry] = useState("SaaS / Software");

  const [streamedContent, setStreamedContent] = useState("");
  const [variations, setVariations] = useState<ParsedVariation[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = product.trim() && audience.trim() && benefit.trim();

  const buildPrompt = () => {
    let prompt = `Generate 5 value proposition variations for this product.

Product: ${product}
Target Audience: ${audience}
Main Benefit: ${benefit}`;
    if (differentiator.trim()) prompt += `\nKey Differentiator: ${differentiator}`;
    prompt += `\nIndustry: ${industry}`;

    prompt += `

Write exactly 5 variations in these formats:

TAGLINE FORMAT
"(5-8 word tagline here)"
Clarity Score: X/10
When to Use: (where this works best)

ONE-LINER FORMAT
"(15-25 word one-liner here)"
Clarity Score: X/10
When to Use: (where this works best)

DETAILED FORMAT
"(2-3 sentence detailed value prop here)"
Clarity Score: X/10
When to Use: (where this works best)

PROBLEM-SOLUTION-OUTCOME FORMAT
Problem: (customer pain)
Solution: (your answer)
Outcome: (result they get)
Clarity Score: X/10
When to Use: (where this works best)

COMPARISON FORMAT
"Unlike (alternative), we (unique value)"
Clarity Score: X/10
When to Use: (where this works best)

Make each customer-centric with specific outcomes. No jargon.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent("");
    setVariations([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedId(null);

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.7,
      maxTokens: 4096,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw value prop output:", finalContent);
      const parsed = parseVariations(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse value propositions. Please try generating again.");
      } else {
        setVariations(parsed);
        setExpandedId(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setProduct(""); setAudience(""); setBenefit("");
    setDifferentiator(""); setIndustry("SaaS / Software");
    setStreamedContent(""); setVariations([]);
    setIsDone(false); setExpandedId(null);
    setCopiedId(null); setSaved(false); setEmptyError("");
  };

  const handleCopyVariation = (v: ParsedVariation) => {
    navigator.clipboard.writeText(`${v.format}\n\n${v.text}`);
    setCopiedId(v.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = variations.map(v => `=== ${v.format.toUpperCase()} ===\nClarity: ${v.clarityScore}/10\n\n${v.text}`).join("\n\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = variations.map(v => `=== ${v.format.toUpperCase()} ===\nClarity Score: ${v.clarityScore}/10\n\n${v.text}${v.whenToUse ? `\n\nWhen to Use: ${v.whenToUse}` : ""}`).join("\n\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `value-propositions.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const md = variations.map(v => `## ${v.format}\n**Clarity Score:** ${v.clarityScore}/10\n\n${v.text}${v.whenToUse ? `\n\n*When to Use: ${v.whenToUse}*` : ""}`).join("\n\n---\n\n");
    const blob = new Blob([`# Value Propositions\n\n${md}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `value-propositions.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = variations.map(v => `${v.format}\nClarity: ${v.clarityScore}/10\n\n${v.text}`).join("\n\n---\n\n");
    saveDraft({
      label: product.slice(0, 60),
      content,
      formData: { product, audience, benefit, differentiator, industry },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setProduct(fd.product); setAudience(fd.audience);
    setBenefit(fd.benefit); setDifferentiator(fd.differentiator);
    setIndustry(fd.industry);
    setStreamedContent(draft.content);
    const parsed = parseVariations(draft.content);
    if (parsed.length > 0) { setVariations(parsed); setExpandedId(parsed[0].id); }
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bestIdx = variations.length > 0 ? variations.reduce((best, v, i) => v.clarityScore > variations[best].clarityScore ? i : best, 0) : -1;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="vp-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="vp-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Value Props</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved value propositions" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved value proposition" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="space-y-4 mb-6">
          <h3 data-testid="text-section-product" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" /> Your Product & Audience
          </h3>

          <div className="space-y-2">
            <label htmlFor="vp-product" className="text-sm font-semibold text-slate-700 ml-1">Product / Service *</label>
            <div className="relative">
              <textarea id="vp-product" data-testid="input-product" value={product} onChange={(e) => setProduct(e.target.value)} placeholder={"What do you offer?\n\nExamples:\n- AI productivity app for busy entrepreneurs\n- Organic skincare line for sensitive skin\n- Online course teaching web development"} maxLength={300} rows={4} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400" />
              <span className="absolute bottom-3 right-3 text-xs text-slate-400">{product.length}/300</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="vp-audience" className="text-sm font-semibold text-slate-700 ml-1">Target Audience *</label>
            <input id="vp-audience" data-testid="input-audience" type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Small business owners, Fitness enthusiasts, SaaS founders" maxLength={100} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
          </div>

          <div className="space-y-2">
            <label htmlFor="vp-benefit" className="text-sm font-semibold text-slate-700 ml-1">Main Benefit / Outcome *</label>
            <input id="vp-benefit" data-testid="input-benefit" type="text" value={benefit} onChange={(e) => setBenefit(e.target.value)} placeholder="e.g., Save 10 hours/week, Clear skin in 30 days, Get hired in 90 days" maxLength={150} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
          </div>

          <div className="space-y-2">
            <label htmlFor="vp-differentiator" className="text-sm font-semibold text-slate-700 ml-1">Key Differentiator <span className="text-slate-400 font-normal">(optional)</span></label>
            <input id="vp-differentiator" data-testid="input-differentiator" type="text" value={differentiator} onChange={(e) => setDifferentiator(e.target.value)} placeholder="What makes you different or unique?" maxLength={150} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
          </div>

          <div className="space-y-2">
            <label htmlFor="vp-industry" className="text-sm font-semibold text-slate-700 ml-1">Industry / Category</label>
            <select id="vp-industry" data-testid="select-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium">
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Crafting Value Props...</>) : (<><Target className="w-5 h-5" /> Generate Value Propositions</>)}
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
            <span className="text-sm font-semibold text-purple-600">Writing value propositions...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && variations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  Your Value Propositions
                </h3>
                <p className="text-sm text-slate-500 mt-0.5" data-testid="text-variation-count">
                  {variations.length} variations generated
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <button data-testid="button-save-all" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button data-testid="button-download-txt" onClick={handleDownloadTxt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> TXT
                </button>
                <button data-testid="button-download-md" onClick={handleDownloadMd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> Markdown
                </button>
                <button data-testid="button-regenerate" onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            {variations.map((v, index) => {
              const FormatIcon = FORMAT_ICONS[index] || Target;
              const isBest = index === bestIdx && variations.length > 1;
              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden", isBest ? "border-purple-300 ring-2 ring-purple-100" : "border-slate-200")}>
                  <button data-testid={`button-expand-variation-${index}`} type="button" onClick={() => setExpandedId(expandedId === v.id ? null : v.id)} aria-expanded={expandedId === v.id} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn("flex items-center justify-center w-8 h-8 rounded-full shrink-0", isBest ? "bg-purple-200 text-purple-800" : "bg-purple-100 text-purple-700")}>
                        <FormatIcon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800 text-sm">{v.format}</p>
                          {isBest && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                              <Star className="w-3 h-3" /> Best
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Variation {index + 1} of {variations.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getScoreColor(v.clarityScore))}>{v.clarityScore}/10</span>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedId === v.id && "rotate-180")} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedId === v.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{v.text}</pre>
                          </div>
                          {v.whenToUse && (
                            <div className="flex items-start gap-2 text-sm">
                              <span className="font-semibold text-slate-600 shrink-0">When to Use:</span>
                              <span className="text-slate-500">{v.whenToUse}</span>
                            </div>
                          )}
                          {v.analysis && (
                            <div className="bg-emerald-50 rounded-lg border border-emerald-100 p-3">
                              <pre className="text-xs text-emerald-700 leading-relaxed whitespace-pre-wrap font-sans">{v.analysis}</pre>
                            </div>
                          )}
                          <button data-testid={`button-copy-variation-${index}`} onClick={() => handleCopyVariation(v)} className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                            {copiedId === v.id ? (<><CheckCircle2 className="w-4 h-4" /> Copied!</>) : (<><Copy className="w-4 h-4" /> Copy Variation</>)}
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
