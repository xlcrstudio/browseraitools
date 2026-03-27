import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  RotateCcw, Star, Zap, Briefcase, Palette, Globe, Hash
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useBusinessNameStorage } from "@/hooks/use-business-name-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const NAMING_STYLES = [
  { id: "modern", label: "Modern / Tech", desc: "Stripe, Uber, Slack style", icon: Zap },
  { id: "creative", label: "Creative / Playful", desc: "Snapchat, TikTok style", icon: Palette },
  { id: "professional", label: "Professional / Corporate", desc: "McKinsey, Deloitte style", icon: Briefcase },
  { id: "descriptive", label: "Descriptive", desc: "Facebook, Salesforce style", icon: Globe },
  { id: "invented", label: "Invented / Unique", desc: "Google, Xerox style", icon: Hash },
];

const LENGTH_OPTIONS = [
  { id: "short", label: "Short", desc: "1 word, 4-8 letters" },
  { id: "medium", label: "Medium", desc: "1-2 words, 8-15 letters" },
  { id: "flexible", label: "Flexible", desc: "Any length" },
];

const DOMAIN_EXTS = [".com", ".io", ".ai", ".co"];

const SYSTEM_PROMPT = `You are an expert brand naming consultant with 20 years creating memorable business names. You generate creative, brandable names with clear analysis.`;

interface ParsedName {
  id: string;
  name: string;
  brandabilityScore: number;
  pronunciation: string;
  whyItWorks: string;
  domains: string;
  industryFit: string;
  category: string;
}

function parseNames(raw: string): ParsedName[] {
  const names: ParsedName[] = [];
  const lines = raw.split("\n");

  const namePattern = /^(?:#{1,3}\s*)?(?:\*{2})?(?:\d+[\.\)\:]\s*)?([A-Z][A-Za-z0-9\s\-\.&+]+?)(?:\*{2})?$/;
  const scorePattern = /brandability|score/i;
  const pronPattern = /pronunc|how\s*to\s*say/i;
  const whyPattern = /why\s*it\s*works|strengths?|what\s*works/i;
  const domainPattern = /domain|\.com|\.io|\.ai/i;
  const fitPattern = /industry\s*fit|fit\s*(?:for|assessment)|market\s*fit/i;
  const categoryPattern = /(?:type|style|category|approach)\s*[:\-]/i;

  const headerIndices: { lineIdx: number; name: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cleaned = line.replace(/\*{2}/g, "").replace(/^#{1,3}\s*/, "").replace(/^\d+[\.\)\:]\s*/, "").trim();

    const fieldLabelPattern = /^(?:brandability|score|pronunciation|how\s*to\s*say|why\s*it\s*works|domain|industry\s*fit|market\s*fit|strengths?|what\s*works|type|style|category|approach)/i;
    if (cleaned.length >= 3 && cleaned.length <= 40 && !fieldLabelPattern.test(cleaned)) {
      const nextFew = lines.slice(i + 1, i + 6).join(" ").toLowerCase();
      if (scorePattern.test(nextFew) || pronPattern.test(nextFew) || whyPattern.test(nextFew) || domainPattern.test(nextFew)) {
        headerIndices.push({ lineIdx: i, name: cleaned });
      }
    }
  }

  if (headerIndices.length < 3) {
    const altPattern = /^(?:\d+[\.\)\:])\s+(.{3,40})$/;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const m = altPattern.exec(line);
      if (m) {
        const cand = m[1].replace(/\*{2}/g, "").trim();
        if (cand.length >= 3 && cand.length <= 40 && !headerIndices.some(h => h.lineIdx === i)) {
          headerIndices.push({ lineIdx: i, name: cand });
        }
      }
    }
  }

  for (let h = 0; h < headerIndices.length && names.length < 25; h++) {
    const startLine = headerIndices[h].lineIdx + 1;
    const endLine = h + 1 < headerIndices.length ? headerIndices[h + 1].lineIdx : lines.length;
    const body = lines.slice(startLine, endLine).join("\n").trim();
    if (body.length < 5) continue;

    const sMatch = body.match(/(?:brandability|score)\s*[:\s]*(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/i);
    const brandabilityScore = sMatch ? parseFloat(sMatch[1]) : [8.5, 8, 7.5, 7, 8.2, 7.8, 8.3, 7.2, 8.7, 7.6, 8.1, 7.4, 8.4, 7.9, 8.6, 7.3, 8.8, 7.7, 8.9, 7.1][names.length % 20];

    let pronunciation = "";
    const pronLine = body.split("\n").find(l => pronPattern.test(l));
    if (pronLine) {
      pronunciation = pronLine.replace(/.*(?:pronunc[a-z]*|how\s*to\s*say)\s*[:\-]\s*/i, "").replace(/\*{2}/g, "").trim();
    }

    let whyItWorks = "";
    const whyIdx = body.split("\n").findIndex(l => whyPattern.test(l));
    if (whyIdx >= 0) {
      const whyLines: string[] = [];
      const bodyLines = body.split("\n");
      for (let w = whyIdx; w < bodyLines.length; w++) {
        const wl = bodyLines[w].trim();
        if (w > whyIdx && (scorePattern.test(wl) || domainPattern.test(wl) || fitPattern.test(wl) || categoryPattern.test(wl))) break;
        if (wl.match(/^[•\-\*]\s+/) || (w === whyIdx && wl.includes(":"))) {
          whyLines.push(wl.replace(/^[•\-\*]\s+/, "").replace(/.*[:\-]\s*/, "").trim());
        } else if (w > whyIdx && wl.length > 5) {
          whyLines.push(wl);
        }
      }
      whyItWorks = whyLines.filter(Boolean).join("\n");
    }

    let domains = "";
    const domIdx = body.split("\n").findIndex(l => domainPattern.test(l) && !pronPattern.test(l));
    if (domIdx >= 0) {
      const domLines: string[] = [];
      const bodyLines = body.split("\n");
      for (let d = domIdx; d < Math.min(domIdx + 5, bodyLines.length); d++) {
        const dl = bodyLines[d].trim();
        if (d > domIdx && (fitPattern.test(dl) || whyPattern.test(dl) || scorePattern.test(dl))) break;
        if (dl.match(/\.\w{2,3}/) || d === domIdx) domLines.push(dl);
      }
      domains = domLines.map(d => d.replace(/.*(?:domain[s]?)\s*[:\-]\s*/i, "").trim()).join("\n");
    }

    let industryFit = "";
    const fitLine = body.split("\n").find(l => fitPattern.test(l));
    if (fitLine) {
      industryFit = fitLine.replace(/.*(?:industry|market)\s*fit\s*[:\-]\s*/i, "").replace(/\*{2}/g, "").trim();
    }

    let category = "";
    const catLine = body.split("\n").find(l => categoryPattern.test(l));
    if (catLine) {
      category = catLine.replace(/.*(?:type|style|category|approach)\s*[:\-]\s*/i, "").replace(/\*{2}/g, "").trim();
    }

    names.push({
      id: generateId(),
      name: headerIndices[h].name,
      brandabilityScore: Math.round(Math.min(10, Math.max(0, brandabilityScore)) * 10) / 10,
      pronunciation,
      whyItWorks,
      domains,
      industryFit,
      category,
    });
  }

  return names;
}

function getScoreColor(score: number) {
  if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 8) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 7) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

function getScoreStars(score: number) {
  const full = Math.floor(score / 2);
  return Array.from({ length: 5 }, (_, i) => i < full);
}

export function BusinessNameGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useBusinessNameStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [businessType, setBusinessType] = useState("");
  const [namingStyle, setNamingStyle] = useState("modern");
  const [keywords, setKeywords] = useState("");
  const [lengthPref, setLengthPref] = useState("medium");
  const [domainExts, setDomainExts] = useState<string[]>([".com"]);

  const [streamedContent, setStreamedContent] = useState("");
  const [nameResults, setNameResults] = useState<ParsedName[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = businessType.trim().length > 0;

  const toggleDomainExt = (ext: string) => {
    setDomainExts(prev => prev.includes(ext) ? prev.filter(e => e !== ext) : [...prev, ext]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectedStyle = NAMING_STYLES.find(s => s.id === namingStyle) || NAMING_STYLES[0];

  const buildPrompt = () => {
    let prompt = `Generate 20 creative business name options.

Business: ${businessType}
Naming Style: ${selectedStyle.label}
Length: ${LENGTH_OPTIONS.find(l => l.id === lengthPref)?.label || "Medium"} (${LENGTH_OPTIONS.find(l => l.id === lengthPref)?.desc || ""})`;
    if (keywords.trim()) prompt += `\nKeywords to inspire: ${keywords}`;
    if (domainExts.length > 0) prompt += `\nPreferred domains: ${domainExts.join(", ")}`;

    prompt += `

Generate exactly 20 business names using these approaches:
- 5 compound word names (combining two relevant words)
- 5 modified/invented word names (twisting existing words, adding suffixes like -ly, -ify, -hub)
- 3 descriptive names (clearly describe what the business does)
- 3 Latin/Greek root inspired names
- 4 modern tech-style short names

For EACH name, write on separate lines:
[Name]
Brandability: X/10
Pronunciation: "how-to-say-it"
Why It Works: bullet points of strengths
Domain: suggestions for ${domainExts.length > 0 ? domainExts.join(", ") : ".com"} domains
Industry Fit: one line assessment

Make names memorable, easy to spell, professional for the industry, and unique. No trademark conflicts with well-known brands.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent("");
    setNameResults([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedId(null);
    setFavorites(new Set());

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.8,
      maxTokens: 4096,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw business name output:", finalContent);
      const parsed = parseNames(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse business names. Please try generating again.");
      } else {
        setNameResults(parsed);
        setExpandedId(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setBusinessType(""); setKeywords("");
    setNamingStyle("modern"); setLengthPref("medium"); setDomainExts([".com"]);
    setStreamedContent(""); setNameResults([]);
    setIsDone(false); setExpandedId(null);
    setCopiedId(null); setSaved(false); setEmptyError("");
    setFavorites(new Set());
  };

  const handleCopyName = (n: ParsedName) => {
    const text = `${n.name}\nBrandability: ${n.brandabilityScore}/10${n.pronunciation ? `\nPronunciation: ${n.pronunciation}` : ""}${n.whyItWorks ? `\nWhy It Works: ${n.whyItWorks}` : ""}${n.domains ? `\nDomains: ${n.domains}` : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedId(n.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = nameResults.map(n => `${n.name} (${n.brandabilityScore}/10)${n.pronunciation ? ` - ${n.pronunciation}` : ""}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyFavorites = () => {
    const favNames = nameResults.filter(n => favorites.has(n.id));
    const text = favNames.map(n => `${n.name} (${n.brandabilityScore}/10)${n.pronunciation ? ` - ${n.pronunciation}` : ""}\n${n.whyItWorks || ""}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("favs");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = nameResults.map(n => `${n.name}\nBrandability: ${n.brandabilityScore}/10${n.pronunciation ? `\nPronunciation: ${n.pronunciation}` : ""}${n.whyItWorks ? `\nWhy It Works:\n${n.whyItWorks}` : ""}${n.domains ? `\nDomains: ${n.domains}` : ""}${n.industryFit ? `\nIndustry Fit: ${n.industryFit}` : ""}`).join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "business-names.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const md = nameResults.map(n => `## ${n.name}\n**Brandability:** ${n.brandabilityScore}/10${n.pronunciation ? `\n**Pronunciation:** ${n.pronunciation}` : ""}${n.whyItWorks ? `\n\n${n.whyItWorks}` : ""}${n.domains ? `\n\n**Domains:** ${n.domains}` : ""}${n.industryFit ? `\n\n*Industry Fit: ${n.industryFit}*` : ""}`).join("\n\n---\n\n");
    const blob = new Blob([`# Business Name Ideas\n\n${md}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "business-names.md"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = JSON.stringify(nameResults);
    saveDraft({
      label: businessType.slice(0, 60),
      content,
      formData: { businessType, namingStyle, keywords, lengthPref, domainExts },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setBusinessType(fd.businessType); setNamingStyle(fd.namingStyle);
    setKeywords(fd.keywords); setLengthPref(fd.lengthPref);
    setDomainExts(fd.domainExts);
    try {
      const restored: ParsedName[] = JSON.parse(draft.content);
      if (Array.isArray(restored) && restored.length > 0) {
        setNameResults(restored);
        setExpandedId(restored[0].id);
      }
    } catch {
      const parsed = parseNames(draft.content);
      if (parsed.length > 0) { setNameResults(parsed); setExpandedId(parsed[0].id); }
    }
    setStreamedContent("");
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bestIdx = nameResults.length > 0 ? nameResults.reduce((best, n, i) => n.brandabilityScore > nameResults[best].brandabilityScore ? i : best, 0) : -1;
  const favCount = favorites.size;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} aria-expanded={showDrafts} aria-controls="bn-drafts-panel" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id="bn-drafts-panel" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Names</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved names" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved names" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="space-y-6 mb-6">
          <div className="space-y-2">
            <label htmlFor="bn-business-type" className="text-sm font-semibold text-slate-700 ml-1">What does your business do? *</label>
            <div className="relative">
              <textarea id="bn-business-type" data-testid="input-business-type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder={"Describe your business in a few words\n\nExamples:\n- AI marketing agency\n- Organic skincare line\n- Web development studio\n- Cloud-based accounting software"} maxLength={200} rows={3} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400" />
              <span className="absolute bottom-3 right-3 text-xs text-slate-400">{businessType.length}/200</span>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Naming Style *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {NAMING_STYLES.map((style) => {
                const StyleIcon = style.icon;
                const isActive = namingStyle === style.id;
                return (
                  <button key={style.id} data-testid={`button-style-${style.id}`} type="button" onClick={() => setNamingStyle(style.id)} aria-pressed={isActive} className={cn("flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all", isActive ? "border-purple-500 bg-purple-50 shadow-sm" : "border-slate-200 bg-white hover:border-purple-300")}>
                    <span className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5", isActive ? "bg-purple-200 text-purple-800" : "bg-slate-100 text-slate-500")}>
                      <StyleIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <p className={cn("font-semibold text-sm", isActive ? "text-purple-800" : "text-slate-700")}>{style.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{style.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="bn-keywords" className="text-sm font-semibold text-slate-700 ml-1">Keywords <span className="text-slate-400 font-normal">(optional)</span></label>
            <input id="bn-keywords" data-testid="input-keywords" type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Words to include or inspire, e.g., AI, market, growth" maxLength={100} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Name Length</legend>
            <div className="flex flex-wrap gap-2">
              {LENGTH_OPTIONS.map((opt) => {
                const isActive = lengthPref === opt.id;
                return (
                  <button key={opt.id} data-testid={`button-length-${opt.id}`} type="button" onClick={() => setLengthPref(opt.id)} aria-pressed={isActive} className={cn("px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all", isActive ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-300")}>
                    {opt.label} <span className="text-xs font-normal text-slate-400 ml-1">({opt.desc})</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-700 ml-1 mb-3">Domain Preference</legend>
            <div className="flex flex-wrap gap-2">
              {DOMAIN_EXTS.map((ext) => {
                const isActive = domainExts.includes(ext);
                return (
                  <button key={ext} data-testid={`button-domain-${ext.replace(".", "")}`} type="button" onClick={() => toggleDomainExt(ext)} aria-pressed={isActive} className={cn("px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all", isActive ? "border-purple-500 bg-purple-50 text-purple-800" : "border-slate-200 bg-white text-slate-600 hover:border-purple-300")}>
                    {ext}
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Brainstorming Names...</>) : (<><Building2 className="w-5 h-5" /> Generate Business Names</>)}
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
            <span className="text-sm font-semibold text-purple-600">Brainstorming names...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && nameResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">Your Business Name Ideas</h3>
                <p className="text-sm text-slate-500 mt-0.5" data-testid="text-name-count">
                  {nameResults.length} names generated{favCount > 0 ? ` | ${favCount} favorited` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <InlineShareButtons />
                {favCount > 0 && (
                  <button data-testid="button-copy-favorites" onClick={handleCopyFavorites} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 transition-all">
                    {copiedId === "favs" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Star className="w-4 h-4" />}
                    {copiedId === "favs" ? "Copied!" : `Copy Favorites (${favCount})`}
                  </button>
                )}
                <button data-testid="button-save-all" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button data-testid="button-download-txt" onClick={handleDownloadTxt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> TXT
                </button>
                <button data-testid="button-download-md" onClick={handleDownloadMd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <Download className="w-4 h-4" /> MD
                </button>
                <button data-testid="button-regenerate" onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nameResults.map((n, index) => {
                const isBest = index === bestIdx && nameResults.length > 1;
                const isFav = favorites.has(n.id);
                const stars = getScoreStars(n.brandabilityScore);
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden", isBest ? "border-purple-300 ring-2 ring-purple-100" : isFav ? "border-amber-300 ring-1 ring-amber-100" : "border-slate-200")}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-base truncate" data-testid={`text-name-${index}`}>{n.name}</h4>
                            {isBest && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-0.5 shrink-0">
                                <Star className="w-3 h-3" /> Top
                              </span>
                            )}
                          </div>
                          {n.category && <p className="text-[11px] text-slate-400 mt-0.5">{n.category}</p>}
                        </div>
                        <button data-testid={`button-favorite-${index}`} type="button" onClick={() => toggleFavorite(n.id)} aria-pressed={isFav} aria-label={isFav ? "Remove from favorites" : "Add to favorites"} className={cn("p-1.5 rounded-lg transition-colors shrink-0", isFav ? "text-amber-500 bg-amber-50" : "text-slate-300 hover:text-amber-400 hover:bg-amber-50")}>
                          <Star className={cn("w-4 h-4", isFav && "fill-amber-500")} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getScoreColor(n.brandabilityScore))}>{n.brandabilityScore}/10</span>
                        <div className="flex gap-0.5">
                          {stars.map((filled, i) => (
                            <Star key={i} className={cn("w-3 h-3", filled ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                          ))}
                        </div>
                        {n.pronunciation && <span className="text-xs text-slate-400 italic truncate">{n.pronunciation}</span>}
                      </div>

                      <button data-testid={`button-expand-name-${index}`} type="button" onClick={() => setExpandedId(expandedId === n.id ? null : n.id)} aria-expanded={expandedId === n.id} aria-controls={`bn-detail-${n.id}`} className="w-full flex items-center justify-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
                        {expandedId === n.id ? "Less details" : "More details"}
                        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expandedId === n.id && "rotate-180")} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {expandedId === n.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div id={`bn-detail-${n.id}`} className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                            {n.whyItWorks && (
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Why It Works</p>
                                <pre className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 rounded-lg p-2.5 border border-slate-100">{n.whyItWorks}</pre>
                              </div>
                            )}
                            {n.domains && (
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Domain Suggestions</p>
                                <pre className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans bg-blue-50 rounded-lg p-2.5 border border-blue-100">{n.domains}</pre>
                              </div>
                            )}
                            {n.industryFit && (
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Industry Fit</p>
                                <p className="text-xs text-slate-600 bg-emerald-50 rounded-lg p-2.5 border border-emerald-100">{n.industryFit}</p>
                              </div>
                            )}
                            <button data-testid={`button-copy-name-${index}`} onClick={() => handleCopyName(n)} className="w-full py-2 rounded-xl font-semibold text-xs border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                              {copiedId === n.id ? (<><CheckCircle2 className="w-3.5 h-3.5" /> Copied!</>) : (<><Copy className="w-3.5 h-3.5" /> Copy Name</>)}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
