import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  Target, Sparkles, RotateCcw, Star, Monitor, ShoppingBag,
  GraduationCap, Handshake, Smartphone, Gift, TrendingUp,
  Users, MessageSquare, HelpCircle, Zap, Award
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useLandingPageStorage } from "@/hooks/use-landing-page-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const AUDIENCE_PRESETS = [
  "Entrepreneurs", "Marketing Professionals", "Software Developers",
  "Students / Learners", "Fitness Enthusiasts", "Parents",
  "Content Creators", "E-commerce Sellers",
];

const PAGE_TYPES = [
  { value: "saas", label: "SaaS / Software", desc: "App, platform, software tool", icon: Monitor },
  { value: "ecommerce", label: "E-commerce / Product", desc: "Products to purchase online", icon: ShoppingBag },
  { value: "course", label: "Online Course / Digital", desc: "Educational content, ebooks", icon: GraduationCap },
  { value: "service", label: "Service / Agency", desc: "Consulting, done-for-you", icon: Handshake },
  { value: "app", label: "Mobile App", desc: "iOS/Android application", icon: Smartphone },
  { value: "leadgen", label: "Lead Generation", desc: "Free trial, demo, consultation", icon: Gift },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional / Authoritative" },
  { value: "friendly", label: "Friendly / Conversational" },
  { value: "bold", label: "Bold / Confident" },
  { value: "luxury", label: "Luxury / Premium" },
  { value: "fun", label: "Fun / Playful" },
];

const SYSTEM_PROMPT = `You are an expert conversion copywriter specializing in landing page optimization. You write landing page copy that leads with clear benefits, translates features into outcomes, addresses objections, builds trust with social proof, and guides visitors to conversion. You always produce complete, structured sections.`;

interface ParsedSection {
  id: string;
  title: string;
  content: string;
  score: number;
}

function parseSections(raw: string): ParsedSection[] {
  const SECTION_NAMES = ["Hero Section", "Features", "Benefits", "Social Proof", "FAQ", "Final CTA"];

  const headerPattern = /^(?:#{1,3}\s*)?(?:SECTION\s*#?\s*\d\s*[:\-]?\s*)?(?:\d+[\.\)]\s*)?(?:\*{2})?(HERO\s*SECTION|FEATURES|BENEFITS|SOCIAL\s*PROOF|FAQ(?:S)?|FINAL\s*(?:CTA|CALL[- ]?TO[- ]?ACTION))(?:\*{2})?/im;

  const lines = raw.split("\n");
  const headerIndices: { lineIdx: number; name: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const match = line.match(headerPattern);
    if (match) {
      const rawName = match[1].toUpperCase().trim();
      let name = "";
      if (rawName.includes("HERO")) name = "Hero Section";
      else if (rawName === "FEATURES") name = "Features";
      else if (rawName === "BENEFITS") name = "Benefits";
      else if (rawName.includes("SOCIAL")) name = "Social Proof";
      else if (rawName.startsWith("FAQ")) name = "FAQ";
      else if (rawName.includes("CTA") || rawName.includes("CALL")) name = "Final CTA";

      if (name && !headerIndices.some(h => h.name === name)) {
        headerIndices.push({ lineIdx: i, name });
      }
    }
  }

  if (headerIndices.length <= 1) {
    const altSplits = raw.split(/(?:\n---+\n|\n===+\n|\n\*\*\*+\n)/);
    if (altSplits.length > 1) {
      const sections: ParsedSection[] = [];
      const filtered = altSplits.filter(s => s.trim().length > 30);
      for (let i = 0; i < filtered.length && sections.length < 6; i++) {
        const content = filtered[i].replace(/(?:conversion\s*)?score\s*[:\s]*\d+(?:\.\d+)?\s*\/\s*10/gi, "").trim();
        const scoreMatch = filtered[i].match(/(?:conversion\s*)?score\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
        if (content.length > 20) {
          sections.push({
            id: generateId(),
            title: SECTION_NAMES[sections.length] || `Section ${sections.length + 1}`,
            content,
            score: scoreMatch ? Math.round(parseFloat(scoreMatch[1]) * 10) / 10 : 8,
          });
        }
      }
      return sections;
    }
  }

  const sections: ParsedSection[] = [];
  for (let h = 0; h < headerIndices.length && sections.length < 6; h++) {
    const startLine = headerIndices[h].lineIdx + 1;
    const endLine = h + 1 < headerIndices.length ? headerIndices[h + 1].lineIdx : lines.length;
    const body = lines.slice(startLine, endLine).join("\n");

    const scoreMatch = body.match(/(?:conversion\s*)?score\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 8;
    const content = body
      .replace(/^(?:conversion\s*)?score\s*[:\s]*\d+(?:\.\d+)?\s*\/\s*10.*$/gim, "")
      .trim();

    if (content.length > 20) {
      sections.push({
        id: generateId(),
        title: headerIndices[h].name,
        content,
        score: Math.round(score * 10) / 10,
      });
    }
  }

  return sections;
}

function getScoreColor(score: number) {
  if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 8) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 7) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

function getSectionIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("hero")) return Target;
  if (lower.includes("feature")) return Zap;
  if (lower.includes("benefit")) return Star;
  if (lower.includes("social") || lower.includes("proof")) return Users;
  if (lower.includes("faq")) return HelpCircle;
  if (lower.includes("cta") || lower.includes("call")) return Award;
  return Layout;
}

export function LandingPageGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useLandingPageStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [mainBenefit, setMainBenefit] = useState("");
  const [audiences, setAudiences] = useState<string[]>([]);
  const [customAudience, setCustomAudience] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [painPoint, setPainPoint] = useState("");
  const [pageType, setPageType] = useState("saas");
  const [tone, setTone] = useState("professional");

  const [userCount, setUserCount] = useState("");
  const [rating, setRating] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [companyLogos, setCompanyLogos] = useState("");
  const [successStats, setSuccessStats] = useState("");
  const [guarantee, setGuarantee] = useState("");

  const [streamedContent, setStreamedContent] = useState("");
  const [sections, setSections] = useState<ParsedSection[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = productName.trim() && description.trim() && mainBenefit.trim();

  const toggleAudience = (a: string) => {
    if (audiences.includes(a)) {
      setAudiences(audiences.filter(x => x !== a));
    } else if (audiences.length < 3) {
      setAudiences([...audiences, a]);
    }
  };

  const addCustomAudience = () => {
    if (customAudience.trim() && audiences.length < 3 && !audiences.includes(customAudience.trim())) {
      setAudiences([...audiences, customAudience.trim()]);
      setCustomAudience("");
      setShowCustom(false);
    }
  };

  const buildPrompt = () => {
    const pageLabel = PAGE_TYPES.find(p => p.value === pageType)?.label || pageType;
    const toneLabel = TONE_OPTIONS.find(t => t.value === tone)?.label || tone;
    const audienceList = audiences.length > 0 ? audiences.join(", ") : "General audience";

    let socialProof = "";
    if (userCount.trim()) socialProof += `Users: ${userCount}\n`;
    if (rating.trim()) socialProof += `Rating: ${rating}\n`;
    if (testimonial.trim()) socialProof += `Testimonial: "${testimonial}"\n`;
    if (companyLogos.trim()) socialProof += `Featured in: ${companyLogos}\n`;
    if (successStats.trim()) socialProof += `Stats: ${successStats}\n`;

    let prompt = `Generate complete landing page copy for this product.

Product: ${productName}
Description: ${description}
Main Benefit: ${mainBenefit}
Audience: ${audienceList}`;
    if (painPoint.trim()) prompt += `\nPain Point: ${painPoint}`;
    prompt += `\nPage Type: ${pageLabel}\nTone: ${toneLabel}`;
    if (socialProof.trim()) prompt += `\n\nSocial Proof Data:\n${socialProof}`;
    if (guarantee.trim()) prompt += `\nGuarantee: ${guarantee}`;

    prompt += `

Write 6 complete sections. For each, use this format:

HERO SECTION
Score: X/10
Headline Option 1: (benefit-driven headline)
Headline Option 2: (problem/solution headline)
Headline Option 3: (transformation headline)
Subheadline: (expand the promise, 2 sentences)
Primary CTA: (action button text)
Secondary CTA: (lower-commitment option)

FEATURES
Score: X/10
Feature 1: (title) - (benefit-focused description, 2 sentences)
Feature 2: (title) - (description)
Feature 3: (title) - (description)
Feature 4: (title) - (description)
Feature 5: (title) - (description)

BENEFITS
Score: X/10
Benefit 1: (title)
Before: (current pain)
After: (with your product)
Result: (outcome)

Benefit 2: (title)
Before: (pain)
After: (solution)
Result: (outcome)

Benefit 3: (title)
Before: (pain)
After: (solution)
Result: (outcome)

SOCIAL PROOF
Score: X/10
Trust Header: (headline for social proof section)
Stat 1: (number + context)
Stat 2: (number + context)
Testimonial 1: "(quote)" - Name, Title
Testimonial 2: "(quote)" - Name, Title

FAQ
Score: X/10
Q1: (common question)
A1: (reassuring answer, 2-3 sentences)
Q2: (question)
A2: (answer)
Q3: (question)
A3: (answer)
Q4: (question)
A4: (answer)
Q5: (question)
A5: (answer)

FINAL CTA
Score: X/10
Headline: (benefit-focused closing headline)
Supporting Text: (1-2 sentences with social proof reminder)
CTA Button: (action text)
Risk Reversal: (guarantee/free trial points)

Write conversion-optimized copy. Use specific numbers. Keep it scannable.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;
    setStreamedContent("");
    setSections([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedSection(null);

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
      console.log("Raw landing page output:", finalContent);
      const parsed = parseSections(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse landing page sections. Please try generating again.");
      } else {
        setSections(parsed);
        setExpandedSection(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setProductName(""); setDescription(""); setMainBenefit("");
    setAudiences([]); setCustomAudience(""); setShowCustom(false);
    setPainPoint(""); setPageType("saas"); setTone("professional");
    setUserCount(""); setRating(""); setTestimonial("");
    setCompanyLogos(""); setSuccessStats(""); setGuarantee("");
    setStreamedContent(""); setSections([]);
    setIsDone(false); setExpandedSection(null);
    setCopiedId(null); setSaved(false); setEmptyError("");
  };

  const handleCopySection = (sec: ParsedSection) => {
    navigator.clipboard.writeText(`${sec.title}\n\n${sec.content}`);
    setCopiedId(sec.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = sections.map(s => `=== ${s.title.toUpperCase()} ===\n\n${s.content}`).join("\n\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = () => {
    const text = sections.map(s => `=== ${s.title.toUpperCase()} ===\nScore: ${s.score}/10\n\n${s.content}`).join("\n\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-page-${productName.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    const md = sections.map(s => {
      const lines = s.content.split("\n").map(l => l.trim()).filter(Boolean);
      const formatted = lines.map(l => {
        if (l.match(/^(headline|subheadline|primary|secondary|trust|supporting|cta|risk)/i)) return `**${l}**`;
        if (l.match(/^(feature|benefit|q\d|a\d|stat|testimonial)/i)) return `### ${l}`;
        if (l.match(/^(before|after|result):/i)) return `- ${l}`;
        return l;
      }).join("\n\n");
      return `## ${s.title}\n\n${formatted}`;
    }).join("\n\n---\n\n");
    const blob = new Blob([`# ${productName} - Landing Page Copy\n\n${md}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-page-${productName.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = sections.map(s => `${s.title}\nScore: ${s.score}/10\n\n${s.content}`).join("\n\n---\n\n");
    saveDraft({
      productName, pageType, content,
      formData: { productName, description, mainBenefit, audiences, painPoint, pageType, tone, userCount, rating, testimonial, companyLogos, successStats, guarantee },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setProductName(fd.productName); setDescription(fd.description);
    setMainBenefit(fd.mainBenefit); setAudiences(fd.audiences);
    setPainPoint(fd.painPoint); setPageType(fd.pageType);
    setTone(fd.tone); setUserCount(fd.userCount);
    setRating(fd.rating); setTestimonial(fd.testimonial);
    setCompanyLogos(fd.companyLogos); setSuccessStats(fd.successStats);
    setGuarantee(fd.guarantee);
    setStreamedContent(draft.content);
    const parsed = parseSections(draft.content);
    if (parsed.length > 0) { setSections(parsed); setExpandedSection(parsed[0].id); }
    setIsDone(true); setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const avgScore = sections.length > 0 ? Math.round((sections.reduce((sum, s) => sum + s.score, 0) / sections.length) * 10) / 10 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button data-testid="button-toggle-drafts" onClick={() => setShowDrafts(!showDrafts)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors">
            <FolderOpen className="w-4 h-4" /> Saved Pages ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FolderOpen className="w-4 h-4 text-purple-500" /> Saved Pages</h4>
                <button data-testid="button-close-drafts" onClick={() => setShowDrafts(false)} aria-label="Close saved pages" className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
              </div>
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                  <button data-testid={`button-load-draft-${draft.id}`} type="button" onClick={() => loadDraft(draft)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{draft.productName} &middot; {PAGE_TYPES.find(p => p.value === draft.pageType)?.label || draft.pageType}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(draft.updatedAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-draft-${draft.id}`} onClick={() => deleteDraft(draft.id)} aria-label="Delete saved page" className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="mb-6">
          <h3 data-testid="text-section-product" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5 text-purple-500" /> Product / Service Information
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="lp-product-name" className="text-sm font-semibold text-slate-700 ml-1">Product / Service Name *</label>
              <input id="lp-product-name" data-testid="input-product-name" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., TaskFlow AI, Organic Skincare Bundle, Web Dev Masterclass" maxLength={100} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lp-description" className="text-sm font-semibold text-slate-700 ml-1">What Do You Offer? *</label>
              <div className="relative">
                <textarea id="lp-description" data-testid="input-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={"Describe your product or service.\n\nExamples:\n- AI-powered task management app\n- Organic skincare products\n- Online course teaching web development"} maxLength={400} rows={4} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400" />
                <span className="absolute bottom-3 right-3 text-xs text-slate-400">{description.length}/400</span>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="lp-main-benefit" className="text-sm font-semibold text-slate-700 ml-1">Main Benefit / Outcome *</label>
              <input id="lp-main-benefit" data-testid="input-main-benefit" type="text" value={mainBenefit} onChange={(e) => setMainBenefit(e.target.value)} placeholder="e.g., 'Save 10 hours/week', 'Clear skin in 30 days'" maxLength={150} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-audience" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" /> Target Audience
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {AUDIENCE_PRESETS.map((a) => (
              <button key={a} data-testid={`button-audience-${a.toLowerCase().replace(/[\s\/]+/g, "-")}`} onClick={() => toggleAudience(a)} aria-pressed={audiences.includes(a)} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border transition-all", audiences.includes(a) ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-200")}>
                {a}
              </button>
            ))}
            {!showCustom ? (
              <button data-testid="button-audience-custom" onClick={() => setShowCustom(true)} className="px-3 py-1.5 rounded-lg text-sm font-medium border border-dashed border-slate-300 text-slate-500 hover:border-purple-300 hover:text-purple-600 transition-all">
                + Custom...
              </button>
            ) : (
              <div className="flex gap-2">
                <input data-testid="input-custom-audience" type="text" value={customAudience} onChange={(e) => setCustomAudience(e.target.value)} placeholder="Custom audience" maxLength={50} className="bg-slate-50 border-2 border-purple-300 text-slate-900 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-purple-500/20 w-40" onKeyDown={(e) => e.key === "Enter" && addCustomAudience()} />
                <button onClick={addCustomAudience} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 border border-purple-300 text-purple-700">Add</button>
                <button onClick={() => setShowCustom(false)} className="px-2 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>
          {audiences.length > 0 && (
            <p className="text-xs text-slate-400 ml-1">Selected: {audiences.join(", ")} ({audiences.length}/3)</p>
          )}
          <div className="mt-3 space-y-2">
            <label htmlFor="lp-pain-point" className="text-sm font-semibold text-slate-700 ml-1">Audience Pain Point <span className="text-slate-400 font-normal">(optional)</span></label>
            <input id="lp-pain-point" data-testid="input-pain-point" type="text" value={painPoint} onChange={(e) => setPainPoint(e.target.value)} placeholder="e.g., 'Overwhelmed by manual tasks'" maxLength={100} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400" />
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-page-type" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Page Type & Tone
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {PAGE_TYPES.map((pt) => {
              const Icon = pt.icon;
              return (
                <button key={pt.value} data-testid={`button-pagetype-${pt.value}`} onClick={() => setPageType(pt.value)} aria-pressed={pageType === pt.value} className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all text-left", pageType === pt.value ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-200")}>
                  <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", pageType === pt.value ? "text-purple-600" : "text-slate-400")} />
                  <div>
                    <span className="font-semibold block">{pt.label}</span>
                    <span className="text-[11px] opacity-70">{pt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Tone / Voice</label>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((t) => (
                <button key={t.value} data-testid={`button-tone-${t.value}`} onClick={() => setTone(t.value)} aria-pressed={tone === t.value} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border transition-all", tone === t.value ? "bg-purple-100 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-600 hover:border-purple-200")}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-social-proof" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" /> Social Proof & Trust <span className="text-sm font-normal text-slate-400">(optional)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="lp-user-count" className="text-xs font-semibold text-slate-600 ml-1">User Count</label>
              <input id="lp-user-count" data-testid="input-user-count" type="text" value={userCount} onChange={(e) => setUserCount(e.target.value)} placeholder="e.g., 50,000" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lp-rating" className="text-xs font-semibold text-slate-600 ml-1">Rating / Reviews</label>
              <input id="lp-rating" data-testid="input-rating" type="text" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="e.g., 4.9 stars, 2,500 reviews" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lp-company-logos" className="text-xs font-semibold text-slate-600 ml-1">Featured In</label>
              <input id="lp-company-logos" data-testid="input-company-logos" type="text" value={companyLogos} onChange={(e) => setCompanyLogos(e.target.value)} placeholder="e.g., TechCrunch, Forbes" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lp-success-stats" className="text-xs font-semibold text-slate-600 ml-1">Success Stats</label>
              <input id="lp-success-stats" data-testid="input-success-stats" type="text" value={successStats} onChange={(e) => setSuccessStats(e.target.value)} placeholder="e.g., Users save avg 12 hours/week" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="lp-testimonial" className="text-xs font-semibold text-slate-600 ml-1">Testimonial Quote</label>
              <textarea id="lp-testimonial" data-testid="input-testimonial" value={testimonial} onChange={(e) => setTestimonial(e.target.value)} placeholder="A customer quote..." rows={2} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 transition-all resize-none placeholder:text-slate-400" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="lp-guarantee" className="text-xs font-semibold text-slate-600 ml-1">Guarantee / Risk Reversal</label>
              <input id="lp-guarantee" data-testid="input-guarantee" type="text" value={guarantee} onChange={(e) => setGuarantee(e.target.value)} placeholder="e.g., 30-day money-back guarantee, Cancel anytime" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-400 transition-all placeholder:text-slate-400" />
            </div>
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
            {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" /> Creating Landing Page...</>) : (<><Layout className="w-5 h-5" /> Generate Landing Page Copy</>)}
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
            <span className="text-sm font-semibold text-purple-600">Writing your landing page...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">{streamedContent}</pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && sections.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  Your Complete Landing Page Copy
                </h3>
                <p className="text-sm text-slate-500 mt-0.5" data-testid="text-avg-score">
                  {sections.length} sections &middot; Average Score: {avgScore}/10
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button data-testid="button-copy-all" onClick={handleCopyAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all">
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <InlineShareButtons />
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

            {sections.map((sec, index) => {
              const SectionIcon = getSectionIcon(sec.title);
              return (
                <motion.div key={sec.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <button data-testid={`button-expand-section-${index}`} type="button" onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)} aria-expanded={expandedSection === sec.id} className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 shrink-0">
                        <SectionIcon className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{sec.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Section {index + 1} of {sections.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getScoreColor(sec.score))}>{sec.score}/10</span>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedSection === sec.id && "rotate-180")} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedSection === sec.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{sec.content}</pre>
                          </div>
                          <button data-testid={`button-copy-section-${index}`} onClick={() => handleCopySection(sec)} className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                            {copiedId === sec.id ? (<><CheckCircle2 className="w-4 h-4" /> Copied!</>) : (<><Copy className="w-4 h-4" /> Copy Section</>)}
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
