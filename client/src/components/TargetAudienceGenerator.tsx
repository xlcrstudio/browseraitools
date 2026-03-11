import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  RotateCcw, Star, Briefcase, Target, BarChart3, TrendingUp
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useAudienceStorage } from "@/hooks/use-audience-storage";

const INDUSTRIES = [
  "Technology / Software", "Healthcare / Wellness", "Education / E-learning",
  "Finance / Fintech", "E-commerce / Retail", "Marketing / Advertising",
  "Fitness / Sports", "Food / Beverage", "Travel / Hospitality",
  "Real Estate", "Entertainment / Media", "Beauty / Fashion",
  "Home / Garden", "Automotive", "Professional Services", "Other",
];

const MARKET_TYPES = [
  { value: "b2c", label: "B2C", desc: "Business to Consumer" },
  { value: "b2b", label: "B2B", desc: "Business to Business" },
  { value: "both", label: "Both", desc: "B2B and B2C" },
];

const PRICE_POINTS = [
  { value: "budget", label: "Budget", desc: "$0 - $50" },
  { value: "mid", label: "Mid-Range", desc: "$50 - $500" },
  { value: "premium", label: "Premium", desc: "$500 - $5k" },
  { value: "enterprise", label: "Enterprise", desc: "$5k+" },
];

const STAGES = [
  { value: "new", label: "New to Market" },
  { value: "established", label: "Established" },
  { value: "scaling", label: "Scaling / Growth" },
];

const SYSTEM_PROMPT = `You are an expert market researcher specializing in customer persona development. You create specific, actionable buyer personas with demographics, psychographics, pain points, goals, buying behavior, and marketing channel recommendations. You always produce exactly 3 personas.`;

interface ParsedPersona {
  id: string;
  name: string;
  priority: string;
  content: string;
  fitScore: number;
}

function parsePersonas(raw: string): ParsedPersona[] {
  const personas: ParsedPersona[] = [];
  const PRIORITIES = ["Primary", "Secondary", "Tertiary"];

  const lines = raw.split("\n");
  const headerPattern = /^(?:#{1,3}\s*)?(?:\*{2})?(?:PERSONA\s*(?:#?\s*\d|ONE|TWO|THREE)|(?:PRIMARY|SECONDARY|TERTIARY)\s*(?:TARGET\s*)?(?:PERSONA|AUDIENCE))/i;

  const headerIndices: { lineIdx: number; rawLine: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (headerPattern.test(line)) {
      headerIndices.push({ lineIdx: i, rawLine: line });
    }
  }

  if (headerIndices.length <= 1) {
    const altPattern = /^(?:#{1,3}\s*)?(?:\*{2})?\d+[\.\)]\s+/;
    const personaKeywords = /persona|audience|customer|buyer|profile|target/i;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (altPattern.test(line) && line.length > 10 && line.length < 100 && personaKeywords.test(line)) {
        headerIndices.push({ lineIdx: i, rawLine: line });
      }
    }
  }

  if (headerIndices.length <= 1) {
    const priorityMarkers: { lineIdx: number; rawLine: string }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^(?:Priority|Type)\s*:\s*(?:Primary|Secondary|Tertiary)/i.test(line)) {
        let headerIdx = i;
        for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
          const prev = lines[j].trim();
          if (prev && (prev.length > 5 && prev.length < 80)) { headerIdx = j; break; }
        }
        priorityMarkers.push({ lineIdx: headerIdx, rawLine: lines[headerIdx].trim() });
      }
    }
    if (priorityMarkers.length > 1) {
      headerIndices.length = 0;
      headerIndices.push(...priorityMarkers);
    }
  }

  if (headerIndices.length <= 1) {
    const sepSplits = raw.split(/(?:\n---+\n|\n===+\n|\n\*\*\*+\n)/);
    const filtered = sepSplits.filter(s => s.trim().length > 50);
    for (let i = 0; i < filtered.length && personas.length < 3; i++) {
      const nameMatch = filtered[i].match(/^[^:\n]*?([A-Z][a-z]+\s+[A-Z][a-z]+)/m);
      const name = nameMatch ? nameMatch[1] : `Persona ${personas.length + 1}`;
      const scoreMatch = filtered[i].match(/(?:fit|market)\s*(?:score)?\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
      personas.push({
        id: generateId(),
        name,
        priority: PRIORITIES[personas.length] || "Tertiary",
        content: filtered[i].trim(),
        fitScore: scoreMatch ? Math.round(parseFloat(scoreMatch[1]) * 10) / 10 : 8,
      });
    }
    return personas;
  }

  for (let h = 0; h < headerIndices.length && personas.length < 3; h++) {
    const startLine = headerIndices[h].lineIdx + 1;
    const endLine = h + 1 < headerIndices.length ? headerIndices[h + 1].lineIdx : lines.length;
    const body = lines.slice(startLine, endLine).join("\n").trim();
    if (body.length < 30) continue;

    const headerLine = headerIndices[h].rawLine;
    const nameMatch = headerLine.match(/[:\-]\s*(.+?)(?:\*{2})?$/i) ||
                       body.match(/^(?:Name|Persona\s*Name)\s*[:\-]\s*(.+)/im);
    let name = "";
    if (nameMatch) {
      name = nameMatch[1].replace(/\*{2}/g, "").replace(/^[:\s\-]+/, "").trim();
    }
    if (!name || name.length > 50) {
      const firstLine = body.split("\n")[0].trim();
      if (firstLine.length > 5 && firstLine.length < 50) {
        name = firstLine.replace(/^[*#\-:\s]+/, "").trim();
      } else {
        name = `Persona ${personas.length + 1}`;
      }
    }

    let priority = PRIORITIES[personas.length] || "Tertiary";
    if (headerLine.toLowerCase().includes("primary")) priority = "Primary";
    else if (headerLine.toLowerCase().includes("secondary")) priority = "Secondary";
    else if (headerLine.toLowerCase().includes("tertiary")) priority = "Tertiary";

    const scoreMatch = body.match(/(?:fit|market)\s*(?:score)?\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    const fitScore = scoreMatch ? parseFloat(scoreMatch[1]) : [8.5, 8, 7.5][personas.length] || 7.5;

    const content = body
      .replace(/^(?:fit|market)\s*(?:score)?\s*[:\s]*\d+(?:\.\d+)?\s*\/\s*10.*$/gim, "")
      .trim();

    personas.push({
      id: generateId(),
      name,
      priority,
      content,
      fitScore: Math.round(fitScore * 10) / 10,
    });
  }

  return personas;
}

function getPriorityColor(priority: string) {
  if (priority === "Primary") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (priority === "Secondary") return "text-blue-700 bg-blue-50 border-blue-200";
  return "text-amber-700 bg-amber-50 border-amber-200";
}

function getPersonaIcon(index: number) {
  const icons = [Star, TrendingUp, Target];
  return icons[index] || Users;
}

export function TargetAudienceGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useAudienceStorage();
  const [showDrafts, setShowDrafts] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [productDescription, setProductDescription] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [marketType, setMarketType] = useState("b2c");
  const [industry, setIndustry] = useState("Technology / Software");
  const [pricePoint, setPricePoint] = useState("mid");
  const [productStage, setProductStage] = useState("new");
  const [customerInsights, setCustomerInsights] = useState("");
  const [competitors, setCompetitors] = useState("");

  const [streamedContent, setStreamedContent] = useState("");
  const [personas, setPersonas] = useState<ParsedPersona[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedPersona, setExpandedPersona] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = productDescription.trim().length > 0;

  const buildPrompt = () => {
    const mtLabel = MARKET_TYPES.find(m => m.value === marketType)?.label || marketType;
    const ppLabel = PRICE_POINTS.find(p => p.value === pricePoint)?.label || pricePoint;
    const stLabel = STAGES.find(s => s.value === productStage)?.label || productStage;

    let prompt = `Generate 3 detailed target audience personas for this product.

Product: ${productDescription}`;
    if (valueProp.trim()) prompt += `\nValue Proposition: ${valueProp}`;
    prompt += `\nMarket: ${mtLabel}\nIndustry: ${industry}\nPrice Point: ${ppLabel}\nStage: ${stLabel}`;
    if (customerInsights.trim()) prompt += `\nExisting Customers: ${customerInsights}`;
    if (competitors.trim()) prompt += `\nCompetitors: ${competitors}`;

    prompt += `

Write exactly 3 personas. For each, use this format:

PERSONA #1: (Creative Name)
Priority: Primary
Demographics: Age, gender, income, education, location
Professional: Role, industry, company size
Psychographics: Values, personality traits, lifestyle
Goals: 3-4 primary goals
Pain Points: 3-4 specific frustrations with quotes
Buying Behavior: Triggers, decision process, objections
Channels: Where to reach them, content preferences
Messaging: Value propositions that resonate, language to avoid
Fit Score: X/10

PERSONA #2: (Creative Name)
Priority: Secondary
(same structure)

PERSONA #3: (Creative Name)
Priority: Tertiary
(same structure)

Make personas specific, realistic, and actionable for marketing.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent("");
    setPersonas([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedPersona(null);

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
      console.log("Raw audience output:", finalContent);
      const parsed = parsePersonas(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse personas. Please try generating again.");
      } else {
        setPersonas(parsed);
        setExpandedPersona(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setProductDescription(""); setValueProp("");
    setMarketType("b2c"); setIndustry("Technology / Software");
    setPricePoint("mid"); setProductStage("new");
    setCustomerInsights(""); setCompetitors("");
    setStreamedContent(""); setPersonas([]);
    setIsDone(false); setExpandedPersona(null);
    setCopiedId(null); setSaved(false); setEmptyError("");
  };

  const handleCopyPersona = (p: ParsedPersona) => {
    navigator.clipboard.writeText(`${p.name} (${p.priority})\n\n${p.content}`);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = personas.map(p => `=== ${p.name.toUpperCase()} (${p.priority}) ===\nFit Score: ${p.fitScore}/10\n\n${p.content}`).join("\n\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = personas.map(p => `=== ${p.name} (${p.priority}) ===\nFit Score: ${p.fitScore}/10\n\n${p.content}`).join("\n\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `target-audience-personas.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const md = personas.map(p => `## ${p.name} (${p.priority})\n**Fit Score:** ${p.fitScore}/10\n\n${p.content}`).join("\n\n---\n\n");
    const blob = new Blob([`# Target Audience Personas\n\n${md}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `target-audience-personas.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = personas.map(p => `${p.name} (${p.priority})\nFit Score: ${p.fitScore}/10\n\n${p.content}`).join("\n\n---\n\n");
    saveDraft({
      label: productDescription.slice(0, 60),
      content,
      formData: { productDescription, valueProp, marketType, industry, pricePoint, productStage, customerInsights, competitors },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setProductDescription(fd.productDescription); setValueProp(fd.valueProp);
    setMarketType(fd.marketType); setIndustry(fd.industry);
    setPricePoint(fd.pricePoint); setProductStage(fd.productStage);
    setCustomerInsights(fd.customerInsights); setCompetitors(fd.competitors);
    setStreamedContent(draft.content);
    const parsed = parsePersonas(draft.content);
    if (parsed.length > 0) { setPersonas(parsed); setExpandedPersona(parsed[0].id); }
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved Personas ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Personas</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved personas" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.createdAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved persona" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="mb-6">
          <h3 data-testid="text-section-product" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" /> Product / Service
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="ta-product-desc" className="text-sm font-semibold text-slate-700 ml-1">Product / Service Description *</label>
              <div className="relative">
                <textarea id="ta-product-desc" data-testid="input-product-description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder={"What are you selling?\n\nExamples:\n- AI productivity app for busy entrepreneurs\n- Organic skincare line for sensitive skin\n- Online course teaching web development"} maxLength={400} rows={4} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400" />
                <span className="absolute bottom-3 right-3 text-xs text-slate-400">{productDescription.length}/400</span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="ta-value-prop" className="text-sm font-semibold text-slate-700 ml-1">Primary Value Proposition <span className="text-slate-400 font-normal">(optional)</span></label>
              <input id="ta-value-prop" data-testid="input-value-prop" type="text" value={valueProp} onChange={(e) => setValueProp(e.target.value)} placeholder="e.g., 'Save 10 hours/week', 'Clear skin in 30 days'" maxLength={100} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-business" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500" /> Business Details
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Market Type</label>
              <div className="flex flex-wrap gap-2">
                {MARKET_TYPES.map((mt) => (
                  <button key={mt.value} data-testid={`button-market-${mt.value}`} onClick={() => setMarketType(mt.value)} aria-pressed={marketType === mt.value} className={cn("px-4 py-2.5 rounded-xl border text-sm transition-all", marketType === mt.value ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-200")}>
                    <span className="font-semibold">{mt.label}</span>
                    <span className="text-[11px] opacity-70 ml-1">({mt.desc})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ta-industry" className="text-sm font-semibold text-slate-700 ml-1">Industry / Category</label>
              <select id="ta-industry" data-testid="select-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium">
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Price Point</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRICE_POINTS.map((pp) => (
                  <button key={pp.value} data-testid={`button-price-${pp.value}`} onClick={() => setPricePoint(pp.value)} aria-pressed={pricePoint === pp.value} className={cn("flex flex-col items-center py-3 px-3 rounded-xl border text-sm transition-all", pricePoint === pp.value ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-200")}>
                    <span className="font-semibold">{pp.label}</span>
                    <span className="text-[11px] opacity-70">{pp.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Product Stage</label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button key={s.value} data-testid={`button-stage-${s.value}`} onClick={() => setProductStage(s.value)} aria-pressed={productStage === s.value} className={cn("px-4 py-2 rounded-xl border text-sm font-medium transition-all", productStage === s.value ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-200")}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button data-testid="button-toggle-advanced" type="button" onClick={() => setShowAdvanced(!showAdvanced)} aria-expanded={showAdvanced} className="w-full flex items-center justify-between text-left group py-2">
            <span className="text-sm font-semibold text-slate-600 group-hover:text-purple-600 transition-colors">Advanced Options</span>
            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showAdvanced && "rotate-180")} />
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="space-y-4 pt-3">
                  <div className="space-y-2">
                    <label htmlFor="ta-insights" className="text-sm font-semibold text-slate-700 ml-1">Current Customer Insights <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea id="ta-insights" data-testid="input-customer-insights" value={customerInsights} onChange={(e) => setCustomerInsights(e.target.value)} placeholder="If you already have customers, describe them..." maxLength={200} rows={2} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ta-competitors" className="text-sm font-semibold text-slate-700 ml-1">Competitor Focus <span className="text-slate-400 font-normal">(optional)</span></label>
                    <input id="ta-competitors" data-testid="input-competitors" type="text" value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="Who are your main competitors?" maxLength={100} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Creating Personas...</>) : (<><Users className="w-5 h-5" /> Generate Target Audience Personas</>)}
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
            <span className="text-sm font-semibold text-purple-600">Building detailed personas...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && personas.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  Your Target Audience Personas
                </h3>
                <p className="text-sm text-slate-500 mt-0.5" data-testid="text-persona-count">
                  {personas.length} personas generated
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

            {personas.map((persona, index) => {
              const PersonaIcon = getPersonaIcon(index);
              return (
                <motion.div key={persona.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <button data-testid={`button-expand-persona-${index}`} type="button" onClick={() => setExpandedPersona(expandedPersona === persona.id ? null : persona.id)} aria-expanded={expandedPersona === persona.id} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 shrink-0">
                        <PersonaIcon className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{persona.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getPriorityColor(persona.priority))}>{persona.priority}</span>
                          <span className="text-xs text-slate-400">Fit: {persona.fitScore}/10</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform shrink-0 ml-3", expandedPersona === persona.id && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {expandedPersona === persona.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{persona.content}</pre>
                          </div>
                          <button data-testid={`button-copy-persona-${index}`} onClick={() => handleCopyPersona(persona)} className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                            {copiedId === persona.id ? (<><CheckCircle2 className="w-4 h-4" /> Copied!</>) : (<><Copy className="w-4 h-4" /> Copy Persona</>)}
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
