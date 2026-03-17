import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heading, Loader2, AlertTriangle, CheckCircle2,
  Download, Copy, Save, FolderOpen, Trash2, X, RotateCcw,
  RefreshCw, ChevronDown, Star, Zap, Target, TrendingUp
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useHeadlineStorage } from "@/hooks/use-headline-storage";

const STYLES = [
  { id: "clickbait", label: "Clickbait", desc: "Attention-grabbing" },
  { id: "seo", label: "SEO Optimized", desc: "Keyword-rich" },
  { id: "professional", label: "Professional", desc: "Credible" },
  { id: "list", label: "List Style", desc: "Numbered" },
  { id: "curiosity", label: "Curiosity Gap", desc: "Compelling" },
  { id: "question", label: "Question", desc: "Engaging" },
];

const PLATFORMS = [
  { id: "blog", label: "Blog Post" },
  { id: "social", label: "Social Media" },
  { id: "youtube", label: "YouTube Video" },
  { id: "email", label: "Email Subject" },
  { id: "ad", label: "Ad Copy" },
];

const EXAMPLE_HEADLINE = "Tips for saving money";

const SYSTEM_PROMPT = `You are an expert headline writer and conversion copywriter specializing in click psychology, engagement optimization, and SEO. You transform weak, generic headlines into compelling, high-performing titles.`;

interface HeadlineVariation {
  id: string;
  headline: string;
  style: string;
  clickScore: number;
  charCount: number;
  wordCount: number;
  whyItWorks: string[];
  emotionalTriggers: string[];
  bestFor: string[];
}

interface OriginalAnalysis {
  score: number;
  issues: string[];
}

interface HeadlineResult {
  id: string;
  variations: HeadlineVariation[];
  originalAnalysis: OriginalAnalysis;
  bestIndex: number;
}

function parseHeadlines(raw: string): HeadlineResult | null {
  const variations: HeadlineVariation[] = [];
  let originalAnalysis: OriginalAnalysis = { score: 0, issues: [] };

  const lines = raw.split("\n");
  let currentVariation: Partial<HeadlineVariation> | null = null;
  let currentSection = "";
  let inOriginalAnalysis = false;

  const HEADLINE_START = /^(?:#{1,3}\s*)?(?:\*{2})?\s*HEADLINE\s*#?\s*(\d)/i;
  const ORIGINAL_RE = /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:ORIGINAL|ANALYSIS|ORIGINAL\s*(?:VS|HEADLINE|SCORE|ANALYSIS))/i;
  const CLICK_SCORE_RE = /click\s*(?:score|potential|rating)[:\s]*(\d+(?:\.\d+)?)\s*\/?\s*10/i;
  const STYLE_RE = /(?:style|type|format)[:\s]*([A-Za-z\s-]+)/i;

  const STOP_RE = /^(?:#{1,3}\s*)?(?:\*{2})?\s*(?:A\/B\s*TEST|RECOMMENDATION|WINNER|COMPARE|SET UP)/i;

  const flushVariation = () => {
    if (currentVariation && currentVariation.headline && currentVariation.headline.length > 5) {
      const headline = currentVariation.headline.replace(/^["']+|["']+$/g, "").trim();
      variations.push({
        id: generateId(),
        headline,
        style: currentVariation.style || "General",
        clickScore: currentVariation.clickScore || 7,
        charCount: headline.length,
        wordCount: headline.split(/\s+/).length,
        whyItWorks: currentVariation.whyItWorks || [],
        emotionalTriggers: currentVariation.emotionalTriggers || [],
        bestFor: currentVariation.bestFor || [],
      });
    }
    currentVariation = null;
    currentSection = "";
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (STOP_RE.test(trimmed)) {
      flushVariation();
      break;
    }

    const headlineMatch = trimmed.match(HEADLINE_START);
    if (headlineMatch) {
      flushVariation();
      inOriginalAnalysis = false;
      currentVariation = { whyItWorks: [], emotionalTriggers: [], bestFor: [] };

      const styleMatch = trimmed.match(/:\s*(.+?)(?:\s*\*{2})?$/);
      if (styleMatch) {
        const styleName = styleMatch[1].replace(/\*{2}/g, "").trim();
        if (styleName.length > 2 && styleName.length < 40) {
          currentVariation.style = styleName;
        }
      }
      continue;
    }

    if (ORIGINAL_RE.test(trimmed)) {
      flushVariation();
      inOriginalAnalysis = true;
      continue;
    }

    if (inOriginalAnalysis) {
      const scoreMatch = trimmed.match(/(?:score|rating)[:\s]*(\d+(?:\.\d+)?)\s*\/?\s*10/i);
      if (scoreMatch) {
        originalAnalysis.score = parseFloat(scoreMatch[1]);
        continue;
      }
      const issueItem = trimmed.match(/^[-*\u2717\u2718\u274c\u2022]\s*(.+)/);
      if (issueItem) {
        const issue = issueItem[1].replace(/\*{2}/g, "").trim();
        if (issue.length > 3) originalAnalysis.issues.push(issue);
      }
      continue;
    }

    if (!currentVariation) continue;

    const clickMatch = trimmed.match(CLICK_SCORE_RE);
    if (clickMatch) {
      currentVariation.clickScore = parseFloat(clickMatch[1]);
      continue;
    }

    if (/^(?:#{1,4}\s*)?(?:\*{2})?\s*(?:WHY\s*IT\s*WORKS|WHY\s*THIS\s*WORKS)/i.test(trimmed)) {
      currentSection = "why";
      continue;
    }
    if (/^(?:#{1,4}\s*)?(?:\*{2})?\s*(?:EMOTIONAL\s*TRIGGER)/i.test(trimmed)) {
      currentSection = "emotion";
      continue;
    }
    if (/^(?:#{1,4}\s*)?(?:\*{2})?\s*(?:BEST\s*FOR|BEST\s*USE|IDEAL\s*FOR)/i.test(trimmed)) {
      currentSection = "bestfor";
      continue;
    }

    if (currentSection === "why") {
      const item = trimmed.replace(/^[-*\u2022\u2713\u2714\d.)\s]+/, "").replace(/\*{2}/g, "").trim();
      if (item.length > 3 && currentVariation.whyItWorks) currentVariation.whyItWorks.push(item);
      continue;
    }
    if (currentSection === "emotion") {
      const item = trimmed.replace(/^[-*\u2022\u2713\u2714\d.)\s]+/, "").replace(/\*{2}/g, "").trim();
      if (item.length > 3 && currentVariation.emotionalTriggers) currentVariation.emotionalTriggers.push(item);
      continue;
    }
    if (currentSection === "bestfor") {
      const item = trimmed.replace(/^[-*\u2022\u2713\u2714\d.)\s]+/, "").replace(/\*{2}/g, "").trim();
      if (item.length > 3 && currentVariation.bestFor) currentVariation.bestFor.push(item);
      continue;
    }

    const styleInLine = trimmed.match(STYLE_RE);
    if (styleInLine && !currentVariation.style) {
      const s = styleInLine[1].trim();
      if (s.length > 2 && s.length < 40) currentVariation.style = s;
    }

    if (!currentVariation.headline) {
      const candidate = trimmed
        .replace(/^(?:#{1,3}\s*)?(?:\*{2})?/, "")
        .replace(/(?:\*{2})?$/, "")
        .replace(/^["']+|["']+$/g, "")
        .trim();
      if (candidate.length > 8 && !candidate.match(/^(?:click|score|char|word|style|type|format|why|emotional|best|seo|headline\s*#)/i)) {
        currentVariation.headline = candidate;
        currentSection = "";
      }
    }
  }
  flushVariation();

  if (variations.length === 0) return null;

  let bestIndex = 0;
  let bestScore = 0;
  variations.forEach((v, i) => {
    if (v.clickScore > bestScore) { bestScore = v.clickScore; bestIndex = i; }
  });

  return { id: generateId(), variations, originalAnalysis, bestIndex };
}

export function HeadlineGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useHeadlineStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [originalHeadline, setOriginalHeadline] = useState("");
  const [style, setStyle] = useState("curiosity");
  const [platform, setPlatform] = useState("blog");

  const [streamedContent, setStreamedContent] = useState("");
  const [result, setResult] = useState<HeadlineResult | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = originalHeadline.trim().length >= 5;

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setExpandedCards(new Set());

    const styleName = STYLES.find(s => s.id === style)?.label || "Curiosity Gap";
    const platformName = PLATFORMS.find(p => p.id === platform)?.label || "Blog Post";

    const prompt = `Improve this headline: "${originalHeadline}"

Preferred Style: ${styleName}
Target Platform: ${platformName}

Generate exactly 5 improved headline variations. For each one, use this exact format:

HEADLINE #1: [Style Name]
Click Score: [X.X]/10
"[The improved headline text]"

Why It Works:
- [point 1]
- [point 2]
- [point 3]

Emotional Triggers:
- [trigger 1]
- [trigger 2]

Best For:
- [use case 1]
- [use case 2]

HEADLINE #2: [Style Name]
Click Score: [X.X]/10
"[headline text]"
...continue same format...

HEADLINE #3: [Style Name]
...

HEADLINE #4: [Style Name]
...

HEADLINE #5: [Style Name]
...

After all 5 headlines, analyze the original:

ORIGINAL ANALYSIS:
Score: [X.X]/10
Issues:
- [issue 1]
- [issue 2]
- [issue 3]

Make each headline dramatically better than the original. Use different styles: list format, curiosity gap, question, SEO-optimized, and professional. Score honestly.`;

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 3500,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw headline output:", finalContent);
      const parsed = parseHeadlines(finalContent);
      if (!parsed || parsed.variations.length === 0) {
        setEmptyError("Could not parse headline variations. Please try again.");
      } else {
        setResult(parsed);
        setExpandedCards(new Set([parsed.variations[parsed.bestIndex]?.id]));
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setOriginalHeadline(""); setStyle("curiosity"); setPlatform("blog");
    setStreamedContent(""); setResult(null); setIsDone(false);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setExpandedCards(new Set());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = result.variations.map((v, i) => `${i + 1}. ${v.headline} (${v.clickScore}/10 - ${v.style})`).join("\n");
    handleCopy(text, "all");
  };

  const handleDownload = () => {
    if (!result) return;
    let text = `ORIGINAL: ${originalHeadline}\n\n`;
    result.variations.forEach((v, i) => {
      text += `--- Headline #${i + 1}: ${v.style} (${v.clickScore}/10) ---\n${v.headline}\n`;
      text += `Characters: ${v.charCount} | Words: ${v.wordCount}\n`;
      if (v.whyItWorks.length > 0) text += `Why It Works:\n${v.whyItWorks.map(w => `  - ${w}`).join("\n")}\n`;
      if (v.emotionalTriggers.length > 0) text += `Emotional Triggers:\n${v.emotionalTriggers.map(e => `  - ${e}`).join("\n")}\n`;
      if (v.bestFor.length > 0) text += `Best For:\n${v.bestFor.map(b => `  - ${b}`).join("\n")}\n`;
      text += "\n";
    });
    if (result.originalAnalysis.score > 0) {
      text += `ORIGINAL ANALYSIS: ${result.originalAnalysis.score}/10\n`;
      text += result.originalAnalysis.issues.map(i => `  - ${i}`).join("\n");
    }
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "improved-headlines.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!result) return;
    saveDraft({
      label: originalHeadline.slice(0, 60),
      content: JSON.stringify(result),
      formData: { originalHeadline, style, platform },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setOriginalHeadline(fd.originalHeadline || "");
    setStyle(fd.style); setPlatform(fd.platform);
    try {
      const restored: HeadlineResult = JSON.parse(draft.content);
      if (restored && restored.variations?.length > 0) {
        setResult(restored);
        setExpandedCards(new Set([restored.variations[restored.bestIndex]?.id]));
      }
    } catch { setResult(null); }
    setStreamedContent(""); setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const scoreColor = (score: number) => {
    if (score >= 8.5) return "text-emerald-600";
    if (score >= 7) return "text-amber-600";
    return "text-red-500";
  };

  const scoreBg = (score: number) => {
    if (score >= 8.5) return "bg-emerald-50 border-emerald-200";
    if (score >= 7) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="hdl-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="hdl-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Headlines</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved headlines" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map(draft => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved headline" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
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
              <label htmlFor="hdl-input" className="text-sm font-semibold text-slate-700 ml-1">Original Headline *</label>
              <button data-testid="button-load-example" type="button" onClick={() => setOriginalHeadline(EXAMPLE_HEADLINE)} className="text-xs font-semibold text-purple-600 hover:text-purple-800 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">Load Example</button>
            </div>
            <div className="relative">
              <input id="hdl-input" data-testid="input-headline" type="text" value={originalHeadline} onChange={(e) => setOriginalHeadline(e.target.value)} placeholder="Tips for saving money" maxLength={200} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400 text-sm" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{originalHeadline.length}/200</span>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Headline Style *</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLES.map(s => {
                const isActive = style === s.id;
                return (
                  <button key={s.id} data-testid={`button-style-${s.id}`} type="button" onClick={() => setStyle(s.id)} aria-pressed={isActive} className={cn("flex flex-col items-center gap-0.5 p-3 rounded-xl border-2 text-center transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <span className={cn("font-semibold text-sm", isActive ? "text-purple-800" : "text-slate-700")}>{s.label}</span>
                    <span className="text-[10px] text-slate-400">{s.desc}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="hdl-platform" className="text-sm font-semibold text-slate-700 ml-1">Target Platform</label>
            <select id="hdl-platform" data-testid="select-platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm font-medium">
              {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Improving...</>) : (<><Zap className="w-5 h-5" /> Improve Headline</>)}
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
            <span className="text-sm font-semibold text-purple-600">Crafting headlines...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && result && result.variations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {result.originalAnalysis.score > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-red-400" />
                  <h4 className="font-bold text-slate-700 text-sm">Original Headline Analysis</h4>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className={cn("px-3 py-1.5 rounded-lg border text-sm font-bold", scoreBg(result.originalAnalysis.score))}>
                    <span className={scoreColor(result.originalAnalysis.score)}>{result.originalAnalysis.score}/10</span>
                  </div>
                  <p className="text-sm text-slate-500 italic" data-testid="text-original-headline">"{originalHeadline}"</p>
                </div>
                {result.originalAnalysis.issues.length > 0 && (
                  <div className="space-y-1">
                    {result.originalAnalysis.issues.map((issue, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                        <X className="w-3 h-3 text-red-400 shrink-0" />
                        {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              {result.variations.map((variation, idx) => {
                const isBest = idx === result.bestIndex;
                const isOpen = expandedCards.has(variation.id);
                const panelId = `hdl-variation-${variation.id}`;
                return (
                  <div key={variation.id} className={cn("bg-white rounded-xl border shadow-sm overflow-hidden", isBest ? "border-purple-200 ring-1 ring-purple-100" : "border-slate-200")} data-testid={`card-headline-${idx}`}>
                    <button type="button" onClick={() => toggleCard(variation.id)} data-testid={`button-toggle-headline-${idx}`} aria-expanded={isOpen} aria-controls={panelId} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {isBest && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold uppercase shrink-0 flex items-center gap-1"><Star className="w-3 h-3" /> Best</span>}
                        <span className="font-semibold text-slate-800 text-sm truncate">{variation.headline}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <span className={cn("font-bold text-sm", scoreColor(variation.clickScore))}>{variation.clickScore}/10</span>
                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div id={panelId} className="px-4 pb-4 space-y-3">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                              <span className="px-2 py-1 bg-slate-100 rounded-md">{variation.style}</span>
                              <span>{variation.charCount} chars</span>
                              <span>{variation.wordCount} words</span>
                              {variation.charCount <= 60 && <span className="text-emerald-600 font-medium">SEO-safe length</span>}
                            </div>

                            <p className="text-base font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100" data-testid={`text-headline-${idx}`}>"{variation.headline}"</p>

                            {variation.whyItWorks.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-purple-500" /> Why It Works</h5>
                                <div className="space-y-1">
                                  {variation.whyItWorks.map((w, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />{w}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {variation.emotionalTriggers.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> Emotional Triggers</h5>
                                <div className="flex flex-wrap gap-1">
                                  {variation.emotionalTriggers.map((t, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-medium rounded-full border border-amber-200">{t}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {variation.bestFor.length > 0 && (
                              <div>
                                <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Best For</h5>
                                <div className="flex flex-wrap gap-1">
                                  {variation.bestFor.map((b, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">{b}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-1">
                              <button data-testid={`button-copy-headline-${idx}`} onClick={() => handleCopy(variation.headline, `h-${idx}`)} className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
                                {copiedId === `h-${idx}` ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {copiedId === `h-${idx}` ? "Copied" : "Copy"}
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
                <RefreshCw className="w-4 h-4" /> Improve Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
