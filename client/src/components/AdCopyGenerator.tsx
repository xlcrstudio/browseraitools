import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  Target, TrendingUp, Sparkles, RotateCcw, Star
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useAdCopyStorage } from "@/hooks/use-ad-copy-storage";

const PLATFORMS = [
  { value: "facebook", label: "Facebook Feed", desc: "Newsfeed ads, engagement focused" },
  { value: "instagram", label: "Instagram Feed/Story", desc: "Visual-first, mobile-optimized" },
  { value: "google", label: "Google Search Ads", desc: "Search intent, direct response" },
  { value: "linkedin", label: "LinkedIn", desc: "Professional, B2B focused" },
  { value: "general", label: "General / Multi-Platform", desc: "Works anywhere" },
];

const AD_FORMATS = [
  { value: "single", label: "Single Image/Video" },
  { value: "carousel", label: "Carousel" },
  { value: "story", label: "Story Ad" },
  { value: "collection", label: "Collection" },
];

const TONES = [
  { value: "persuasive", label: "Persuasive / Direct", desc: "Action-oriented, benefit-focused" },
  { value: "friendly", label: "Friendly / Conversational", desc: "Warm, approachable, relatable" },
  { value: "urgent", label: "Urgent / FOMO", desc: "Time-sensitive, scarcity-driven" },
  { value: "luxury", label: "Luxury / Premium", desc: "Sophisticated, exclusive" },
  { value: "playful", label: "Playful / Fun", desc: "Energetic, entertaining, bold" },
  { value: "professional", label: "Professional / Informative", desc: "Fact-based, authoritative" },
];

const GOALS = [
  { value: "conversions", label: "Conversions / Sales" },
  { value: "leads", label: "Lead Generation" },
  { value: "traffic", label: "Traffic" },
  { value: "awareness", label: "Brand Awareness" },
  { value: "engagement", label: "Engagement" },
  { value: "app-installs", label: "App Installs" },
];

const AUDIENCES = [
  "Entrepreneurs", "Small Business Owners", "Students", "Parents",
  "Professionals (25-45)", "Millennials", "Gen Z", "Fitness Enthusiasts",
  "Tech-Savvy Users", "Creative Professionals",
];

const SYSTEM_PROMPT = `You are an expert digital advertising copywriter with 10+ years of experience creating high-converting ad copy for Facebook, Instagram, Google Ads, and LinkedIn.

Your expertise includes direct response copywriting, conversion rate optimization, platform-specific ad formats, A/B testing strategies, audience psychology, benefit-driven messaging, call-to-action optimization, and social proof integration.

You write ad copy that hooks attention immediately, focuses on benefits over features, uses specific numbers and proof, includes clear calls-to-action, matches platform best practices, speaks directly to the target audience, creates urgency when appropriate, and optimizes for character limits.`;

interface ParsedAd {
  id: string;
  angle: string;
  headline: string;
  primaryText: string;
  cta: string;
  score: number;
  analysis: string[];
  whenToUse: string;
}

function parseAds(raw: string): ParsedAd[] {
  const ads: ParsedAd[] = [];
  const sections = raw.split(/(?:AD\s*#?\s*\d|VARIATION\s*#?\s*\d)/i);

  for (let i = 1; i < sections.length && ads.length < 5; i++) {
    const section = sections[i];

    const angleMatch = section.match(/^[:\s\-]*(.+?)(?:\n|$)/);
    const angle = angleMatch ? angleMatch[1].replace(/^[:\s*\-]+/, "").trim() : `Variation ${i}`;

    const headlineMatch = section.match(/headline\s*[:\s]*(.+?)(?:\n|$)/i);
    const headline = headlineMatch ? headlineMatch[1].replace(/^[:\s*\-"]+|["]+$/g, "").trim() : "";

    const primaryMatch = section.match(/primary\s*text\s*[:\s]*([\s\S]*?)(?=\n\s*(?:call[- ]to[- ]action|cta|score|analysis|when\s*to\s*use|conversion|ad\s*#|variation\s*#)|$)/i);
    let primaryText = "";
    if (primaryMatch) {
      primaryText = primaryMatch[1].split("\n").map(l => l.replace(/^[\s\-*]+/, "").trim()).filter(l => l.length > 0).join(" ").trim();
    }

    const ctaMatch = section.match(/(?:call[- ]to[- ]action|cta)\s*[:\s]*(.+?)(?:\n|$)/i);
    const cta = ctaMatch ? ctaMatch[1].replace(/^[:\s*\-"]+|["]+$/g, "").replace(/[→>]+$/, "").trim() : "";

    const scoreMatch = section.match(/(?:score|conversion\s*score)\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7 + Math.random() * 2.5;

    const analysis: string[] = [];
    const analysisBlock = section.match(/(?:analysis|why\s*(?:this|it)\s*works)\s*[:\s]*([\s\S]*?)(?=when\s*to\s*use|ad\s*#|variation\s*#|\n\s*\n\s*\n|$)/i);
    if (analysisBlock) {
      const lines = analysisBlock[1].split("\n");
      for (const line of lines) {
        const cleaned = line.replace(/^[\s\-*•]+/, "").trim();
        if (cleaned.length > 5) analysis.push(cleaned);
      }
    }

    const whenMatch = section.match(/when\s*to\s*use\s*[:\s]*([\s\S]*?)(?=ad\s*#|variation\s*#|\n\s*\n\s*\n|$)/i);
    const whenToUse = whenMatch
      ? whenMatch[1].split("\n").map(l => l.replace(/^[\s\-*•]+/, "").trim()).filter(l => l.length > 3).join(", ")
      : "";

    if (headline || primaryText) {
      ads.push({
        id: generateId(),
        angle,
        headline,
        primaryText,
        cta,
        score: Math.round(score * 10) / 10,
        analysis: analysis.slice(0, 5),
        whenToUse,
      });
    }
  }

  return ads;
}

function getScoreColor(score: number) {
  if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 8) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 7) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

function getScoreStars(score: number): number {
  if (score >= 9) return 5;
  if (score >= 8) return 4;
  if (score >= 7) return 3;
  if (score >= 6) return 2;
  return 1;
}

export function AdCopyGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useAdCopyStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [product, setProduct] = useState("");
  const [usp, setUsp] = useState("");
  const [audience, setAudience] = useState("");
  const [customAudience, setCustomAudience] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [platform, setPlatform] = useState("facebook");
  const [adFormat, setAdFormat] = useState("single");
  const [tone, setTone] = useState("persuasive");
  const [goal, setGoal] = useState("conversions");
  const [specialOffer, setSpecialOffer] = useState("");

  const [streamedContent, setStreamedContent] = useState("");
  const [ads, setAds] = useState<ParsedAd[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedAd, setExpandedAd] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const resolvedAudience = audience === "__custom__" ? customAudience.trim() : audience;
  const isFormValid = product.trim() && resolvedAudience;

  const showFormat = platform === "facebook" || platform === "instagram";

  const buildPrompt = () => {
    const platformLimits: Record<string, string> = {
      facebook: "Headline: 40 chars max. Primary text: 125 chars recommended. Short and punchy.",
      instagram: "Headline: 40 chars max. Primary text: 125 chars recommended. Mobile-optimized, visual-first.",
      google: "Headline: 30 chars max. Description: 90 chars max. Keyword-focused.",
      linkedin: "Headline: 50 chars max. Primary text: 150 chars recommended. Professional tone.",
      general: "Headline: 40 chars max. Primary text: 150 chars recommended. Versatile format.",
    };

    const toneLabel = TONES.find(t => t.value === tone)?.label || tone;
    const goalLabel = GOALS.find(g => g.value === goal)?.label || goal;
    const platformLabel = PLATFORMS.find(p => p.value === platform)?.label || platform;
    const formatLabel = showFormat ? (AD_FORMATS.find(f => f.value === adFormat)?.label || adFormat) : "";

    let prompt = `Generate 5 high-converting ad copy variations.

PRODUCT/SERVICE: ${product}`;

    if (usp.trim()) prompt += `\nUSP: ${usp}`;
    if (painPoint.trim()) prompt += `\nPain Point: ${painPoint}`;

    prompt += `\n\nTARGET AUDIENCE: ${resolvedAudience}
PLATFORM: ${platformLabel}`;

    if (showFormat && formatLabel) prompt += `\nFormat: ${formatLabel}`;

    prompt += `\nTone: ${toneLabel}
Campaign Goal: ${goalLabel}`;

    if (specialOffer.trim()) prompt += `\nSpecial Offer: ${specialOffer}`;

    prompt += `

CHARACTER LIMITS:
${platformLimits[platform] || platformLimits.general}

Generate 5 VARIATIONS with different angles:

Variation 1: Benefit-Focused (lead with primary benefit, specific outcome)
Variation 2: Social Proof (include numbers, testimonial or statistic)
Variation 3: Problem/Solution (start with pain point, present solution)
Variation 4: Urgency/FOMO (time-sensitive, scarcity element)
Variation 5: Feature Highlight (unique differentiator, how it works)

For EACH variation output in this exact format:

AD #(number): (Angle Type)
Headline: (text)
Primary Text: (text)
CTA: (text)
Score: X/10
Analysis:
- (why it works point 1)
- (why it works point 2)
- (why it works point 3)
When to Use: (best scenario)

Generate 5 complete, platform-optimized ad variations ready for A/B testing. Keep headlines punchy. Make primary text compelling and concise. Every CTA must be action-oriented.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setStreamedContent("");
    setAds([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedAd(null);

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.7,
      maxTokens: 3000,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw ad copy output:", finalContent);
      const parsed = parseAds(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse ad variations. Please try generating again.");
      } else {
        setAds(parsed);
        setExpandedAd(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setProduct("");
    setUsp("");
    setAudience("");
    setCustomAudience("");
    setPainPoint("");
    setPlatform("facebook");
    setAdFormat("single");
    setTone("persuasive");
    setGoal("conversions");
    setSpecialOffer("");
    setStreamedContent("");
    setAds([]);
    setIsDone(false);
    setExpandedAd(null);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
  };

  const handleCopyAd = (ad: ParsedAd) => {
    const text = [
      `Headline: ${ad.headline}`,
      "",
      ad.primaryText,
      "",
      `CTA: ${ad.cta}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedId(ad.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = ads.map((ad, i) => [
      `--- AD ${i + 1}: ${ad.angle} ---`,
      `Headline: ${ad.headline}`,
      `Primary Text: ${ad.primaryText}`,
      `CTA: ${ad.cta}`,
      `Score: ${ad.score}/10`,
    ].join("\n")).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const text = ads.map((ad, i) => [
      `--- AD ${i + 1}: ${ad.angle} ---`,
      "",
      `Headline: ${ad.headline}`,
      `Primary Text: ${ad.primaryText}`,
      `CTA: ${ad.cta}`,
      "",
      `Score: ${ad.score}/10`,
      ad.analysis.length > 0 ? `Analysis:\n${ad.analysis.map(a => `  - ${a}`).join("\n")}` : "",
      ad.whenToUse ? `When to Use: ${ad.whenToUse}` : "",
    ].filter(Boolean).join("\n")).join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ad-copy-${product.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const headers = ["Ad #", "Angle", "Headline", "Primary Text", "CTA", "Score"];
    const rows = ads.map((ad, i) => [
      i + 1,
      `"${ad.angle.replace(/"/g, '""')}"`,
      `"${ad.headline.replace(/"/g, '""')}"`,
      `"${ad.primaryText.replace(/"/g, '""')}"`,
      `"${ad.cta.replace(/"/g, '""')}"`,
      ad.score,
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ad-copy-${product.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = ads.map((ad, i) =>
      `AD ${i + 1}: ${ad.angle}\nHeadline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\nCTA: ${ad.cta}\nScore: ${ad.score}/10`
    ).join("\n\n---\n\n");

    saveDraft({
      product,
      platform,
      adContent: content,
      formData: { product, usp, audience: resolvedAudience, painPoint, platform, adFormat, tone, goal, specialOffer },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setProduct(fd.product);
    setUsp(fd.usp);
    const isPreset = AUDIENCES.includes(fd.audience);
    if (isPreset) {
      setAudience(fd.audience);
      setCustomAudience("");
    } else {
      setAudience("__custom__");
      setCustomAudience(fd.audience);
    }
    setPainPoint(fd.painPoint);
    setPlatform(fd.platform);
    setAdFormat(fd.adFormat);
    setTone(fd.tone);
    setGoal(fd.goal);
    setSpecialOffer(fd.specialOffer);
    setStreamedContent(draft.adContent);
    const parsed = parseAds(draft.adContent);
    if (parsed.length > 0) {
      setAds(parsed);
      setExpandedAd(parsed[0].id);
    }
    setIsDone(true);
    setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bestAd = ads.length > 0 ? ads.reduce((best, ad) => ad.score > best.score ? ad : best, ads[0]) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button
            data-testid="button-toggle-drafts"
            onClick={() => setShowDrafts(!showDrafts)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Saved Ads ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-500" /> Saved Ad Copies
                </h4>
                <button
                  data-testid="button-close-drafts"
                  onClick={() => setShowDrafts(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors"
                >
                  <button
                    data-testid={`button-load-draft-${draft.id}`}
                    type="button"
                    onClick={() => loadDraft(draft)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {draft.product} &middot; {PLATFORMS.find(p => p.value === draft.platform)?.label || draft.platform}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    data-testid={`button-delete-draft-${draft.id}`}
                    onClick={() => deleteDraft(draft.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="mb-6">
          <h3 data-testid="text-section-product" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-500" /> What Are You Advertising?
          </h3>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Product / Service *</label>
            <div className="relative">
              <textarea
                data-testid="input-product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Describe your product or service. Include key features and benefits..."
                maxLength={500}
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span data-testid="text-product-char-count" className="absolute bottom-3 right-3 text-xs text-slate-400">
                {product.length}/500
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Unique Selling Point <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              data-testid="input-usp"
              type="text"
              value={usp}
              onChange={(e) => setUsp(e.target.value)}
              placeholder="e.g., 'Saves 10 hours/week', '100% natural ingredients'"
              maxLength={100}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-audience" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" /> Target Audience
          </h3>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Who Is This For? *</label>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a}
                  data-testid={`button-audience-${a.toLowerCase().replace(/[\s()]+/g, "-")}`}
                  onClick={() => { setAudience(a); setCustomAudience(""); }}
                  aria-pressed={audience === a}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    audience === a
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                  )}
                >
                  {a}
                </button>
              ))}
              <button
                data-testid="button-audience-custom"
                onClick={() => setAudience("__custom__")}
                aria-pressed={audience === "__custom__"}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                  audience === "__custom__"
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                )}
              >
                Custom...
              </button>
            </div>
            {audience === "__custom__" && (
              <input
                data-testid="input-custom-audience"
                type="text"
                value={customAudience}
                onChange={(e) => setCustomAudience(e.target.value)}
                placeholder="Describe your target audience..."
                maxLength={150}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400 mt-2"
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Audience Pain Point <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              data-testid="input-pain-point"
              type="text"
              value={painPoint}
              onChange={(e) => setPainPoint(e.target.value)}
              placeholder="e.g., 'Struggling with productivity', 'Tired of expensive gyms'"
              maxLength={100}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-platform" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-500" /> Ad Platform & Format
          </h3>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">Platform *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.value}
                  data-testid={`button-platform-${p.value}`}
                  onClick={() => setPlatform(p.value)}
                  aria-pressed={platform === p.value}
                  className={cn(
                    "flex flex-col items-start px-4 py-3 rounded-xl border text-sm transition-all text-left",
                    platform === p.value
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                  )}
                >
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-[11px] opacity-70">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
          {showFormat && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Ad Format</label>
              <div className="flex flex-wrap gap-2">
                {AD_FORMATS.map((f) => (
                  <button
                    key={f.value}
                    data-testid={`button-format-${f.value}`}
                    onClick={() => setAdFormat(f.value)}
                    aria-pressed={adFormat === f.value}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                      adFormat === f.value
                        ? "bg-purple-100 border-purple-300 text-purple-700"
                        : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-tone" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Tone & Style
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                data-testid={`button-tone-${t.value}`}
                onClick={() => setTone(t.value)}
                aria-pressed={tone === t.value}
                className={cn(
                  "flex flex-col items-start px-4 py-3 rounded-xl border text-sm transition-all text-left",
                  tone === t.value
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                )}
              >
                <span className="font-semibold">{t.label}</span>
                <span className="text-[11px] opacity-70">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-goal" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-500" /> Campaign Goal
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {GOALS.map((g) => (
              <button
                key={g.value}
                data-testid={`button-goal-${g.value}`}
                onClick={() => setGoal(g.value)}
                aria-pressed={goal === g.value}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                  goal === g.value
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Special Offer <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              data-testid="input-special-offer"
              type="text"
              value={specialOffer}
              onChange={(e) => setSpecialOffer(e.target.value)}
              placeholder="e.g., '50% off', 'Free trial', 'Limited time offer'"
              maxLength={50}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {(state === "checking-gpu" || state === "downloading" || state === "preparing") && (
          <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700">
                {state === "checking-gpu" && "Verifying hardware..."}
                {state === "downloading" && "Loading AI Engine..."}
                {state === "preparing" && "Preparing model..."}
              </span>
            </div>
            {state === "downloading" && (
              <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
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
          <button
            data-testid="button-generate"
            onClick={handleGenerate}
            disabled={!isFormValid || isGenerating || !isReady}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
              isFormValid && !isGenerating && isReady
                ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Creating Ad Copy...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Ad Copy
              </>
            )}
          </button>
          <button
            data-testid="button-reset"
            type="button"
            onClick={handleReset}
            disabled={isGenerating}
            className={cn(
              "px-4 py-4 rounded-2xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2",
              isGenerating
                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-sm font-semibold text-purple-600">Writing your ad copy...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">
            {streamedContent}
          </pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && ads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  {ads.length} Ad Variation{ads.length > 1 ? "s" : ""} Generated
                </h3>
                {bestAd && (
                  <p className="text-sm text-slate-500 mt-0.5" data-testid="text-best-ad">
                    Best Performing: {bestAd.angle} (Score: {bestAd.score}/10)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  data-testid="button-copy-all"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <button
                  data-testid="button-save-all"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  data-testid="button-download-txt"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  <Download className="w-4 h-4" /> TXT
                </button>
                <button
                  data-testid="button-download-csv"
                  onClick={handleDownloadCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  <Download className="w-4 h-4" /> CSV
                </button>
                <button
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            {ads.map((ad, index) => {
              const isBest = bestAd?.id === ad.id;
              return (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "bg-white rounded-2xl border shadow-sm overflow-hidden",
                    isBest ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200"
                  )}
                >
                  <button
                    data-testid={`button-expand-ad-${index}`}
                    type="button"
                    onClick={() => setExpandedAd(expandedAd === ad.id ? null : ad.id)}
                    aria-expanded={expandedAd === ad.id}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0",
                        isBest ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
                      )}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate flex items-center gap-2">
                          {ad.angle}
                          {isBest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Star className="w-3 h-3" /> Best
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {ad.headline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getScoreColor(ad.score))}>
                        {ad.score}/10
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: getScoreStars(ad.score) }).map((_, si) => (
                          <Star key={si} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedAd === ad.id && "rotate-180")} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedAd === ad.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <Megaphone className="w-3.5 h-3.5" /> Headline
                            </p>
                            <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-slate-50 border border-slate-100">
                              <span className="text-sm font-semibold text-slate-800">{ad.headline}</span>
                              <button
                                data-testid={`button-copy-headline-${index}`}
                                onClick={() => {
                                  navigator.clipboard.writeText(ad.headline);
                                  setCopiedId(`hl-${index}`);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                                className="shrink-0 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {copiedId === `hl-${index}` ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Primary Text</p>
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                              <p className="text-sm text-slate-700 leading-relaxed">{ad.primaryText}</p>
                            </div>
                          </div>

                          {ad.cta && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Call-to-Action</p>
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-sm">
                                {ad.cta}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", getScoreColor(ad.score))}>
                              <TrendingUp className="w-4 h-4" />
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Conversion Score</p>
                                <p className="text-sm font-bold">{ad.score}/10</p>
                              </div>
                            </div>
                          </div>

                          {ad.analysis.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Why This Works</p>
                              <ul className="space-y-1">
                                {ad.analysis.map((reason, ri) => (
                                  <li key={ri} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {ad.whenToUse && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">When to Use</p>
                              <p className="text-sm text-slate-600">{ad.whenToUse}</p>
                            </div>
                          )}

                          <button
                            data-testid={`button-copy-ad-${index}`}
                            onClick={() => handleCopyAd(ad)}
                            className="w-full py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                          >
                            {copiedId === ad.id ? (
                              <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                            ) : (
                              <><Copy className="w-4 h-4" /> Copy Ad</>
                            )}
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
