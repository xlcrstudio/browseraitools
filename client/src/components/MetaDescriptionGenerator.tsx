import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, Search,
  TrendingUp, Briefcase, Smile, Megaphone,
  ChevronDown, ChevronUp, Target, List,
  Eye
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useMetaDescriptionStorage,
  type MetaDescription,
} from "@/hooks/use-meta-description-storage";

const TONE_OPTIONS = [
  { value: "professional", label: "Professional", description: "Authoritative and trustworthy", icon: Briefcase },
  { value: "persuasive", label: "Persuasive", description: "Action-oriented and compelling", icon: TrendingUp },
  { value: "friendly", label: "Friendly", description: "Approachable and conversational", icon: Smile },
  { value: "sales", label: "Sales", description: "Direct and benefit-focused", icon: Megaphone },
];

const CONTENT_TYPE_OPTIONS = [
  { value: "blog-post", label: "Blog Post/Article" },
  { value: "product-page", label: "Product Page" },
  { value: "service-page", label: "Service Page" },
  { value: "homepage", label: "Homepage" },
  { value: "landing-page", label: "Landing Page" },
  { value: "category-page", label: "Category Page" },
  { value: "about-page", label: "About Page" },
];

const MAX_TITLE_CHARS = 200;
const MAX_KEYWORDS_CHARS = 150;
const MAX_DESCRIPTION_CHARS = 500;
const MAX_BRAND_NAME_CHARS = 100;
const MAX_INSTRUCTIONS_CHARS = 200;

const SYSTEM_PROMPT = `You are an expert SEO copywriter specializing in meta descriptions. You create compelling, click-worthy meta descriptions that are optimized for search engines and drive high click-through rates. Always follow the exact format requested.`;

function getCharCountColor(count: number): string {
  if (count >= 150 && count <= 160) return "text-emerald-600";
  if ((count >= 140 && count < 150) || (count > 160 && count <= 165)) return "text-amber-600";
  return "text-red-600";
}

function getCharCountBg(count: number): string {
  if (count >= 150 && count <= 160) return "bg-emerald-50 border-emerald-200";
  if ((count >= 140 && count < 150) || (count > 160 && count <= 165)) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function parseDescriptions(text: string): string[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const descriptions: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^\d+[\.\)\-:\s]+/, "").replace(/^["']|["']$/g, "").trim();
    if (cleaned.length >= 50 && cleaned.length <= 300) {
      descriptions.push(cleaned);
    }
  }
  return descriptions.slice(0, 5);
}

const VARIATION_LABELS = [
  "Benefit-Focused",
  "Question Hook",
  "Statistical/Proof",
  "Problem/Solution",
  "Direct Value",
];

export function MetaDescriptionGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveDescription } = useMetaDescriptionStorage();

  const [pageTitle, setPageTitle] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [contentType, setContentType] = useState("blog-post");

  const [includeCTA, setIncludeCTA] = useState(true);
  const [emphasizeBenefits, setEmphasizeBenefits] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUrgency, setIncludeUrgency] = useState(false);
  const [includeBrandName, setIncludeBrandName] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [generationProgress, setGenerationProgress] = useState("");
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [analysisText, setAnalysisText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState(0);

  const handleReset = () => {
    setPageTitle("");
    setTargetKeywords("");
    setPageDescription("");
    setTone("professional");
    setContentType("blog-post");
    setIncludeCTA(true);
    setEmphasizeBenefits(true);
    setIncludeNumbers(true);
    setIncludeUrgency(false);
    setIncludeBrandName(false);
    setBrandName("");
    setSpecialInstructions("");
    setShowAdvanced(false);
    setStreamingText("");
    setGenerationProgress("");
    setDescriptions([]);
    setAnalysisText("");
    setCopiedId(null);
    setSelectedPreview(0);
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const generateSection = async (sectionPrompt: string, maxTokens: number, temperature: number): Promise<string> => {
    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sectionPrompt },
      ],
      temperature,
      maxTokens,
      onChunk: () => {},
    });
    return result || "";
  };

  const handleGenerate = async () => {
    if (!pageTitle.trim() || !targetKeywords.trim() || !pageDescription.trim()) return;

    setIsGenerating(true);
    setStreamingText("");
    setDescriptions([]);
    setAnalysisText("");
    setGenerationProgress("");
    setSelectedPreview(0);

    const toneLabel = TONE_OPTIONS.find((t) => t.value === tone)?.label || tone;
    const contentTypeLabel = CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.label || contentType;

    const advancedNotes: string[] = [];
    if (includeCTA) advancedNotes.push("Include a call-to-action");
    if (emphasizeBenefits) advancedNotes.push("Emphasize benefits over features");
    if (includeNumbers) advancedNotes.push("Include numbers or statistics where relevant");
    if (includeUrgency) advancedNotes.push("Add urgency or scarcity elements");
    if (includeBrandName && brandName.trim()) advancedNotes.push(`Include brand name: ${brandName.trim()}`);
    if (specialInstructions.trim()) advancedNotes.push(`Special instructions: ${specialInstructions.trim()}`);

    const advancedContext = advancedNotes.length > 0 ? `\nAdditional requirements:\n${advancedNotes.map((n) => `- ${n}`).join("\n")}` : "";

    let allRawText = "";
    let parsedDescriptions: string[] = [];
    let analysisContent = "";

    try {
      setGenerationProgress("Generating descriptions... (1/2)");
      setStreamingText("--- Generating meta descriptions... ---");

      const generatePrompt = `Generate exactly 5 unique meta description variations for this page:

Page Title: ${pageTitle.trim()}
Target Keywords: ${targetKeywords.trim()}
Page Description: ${pageDescription.trim()}
Tone: ${toneLabel}
Content Type: ${contentTypeLabel}
${advancedContext}

CRITICAL RULES:
1. Each description MUST be between 150-160 characters (this is crucial for SEO).
2. Each description must use a different approach:
   - Description 1: Benefit-focused (highlight key benefits)
   - Description 2: Question hook (start with an engaging question)
   - Description 3: Statistical/proof (use numbers, data, or social proof)
   - Description 4: Problem/solution (address a pain point and offer solution)
   - Description 5: Direct value (clear, straightforward value proposition)
3. Naturally include the target keywords.
4. Output ONLY the 5 descriptions, one per line, numbered 1-5.
5. Do NOT include any labels, headers, or explanations.

1.`;

      const descriptionsResult = await generateSection(generatePrompt, 800, 0.7);
      const fullDescriptionsText = "1." + descriptionsResult.trim();
      parsedDescriptions = parseDescriptions(fullDescriptionsText);
      allRawText = `META DESCRIPTIONS:\n${fullDescriptionsText}`;
      setStreamingText(allRawText);
      setDescriptions(parsedDescriptions);

      setGenerationProgress("Analyzing & scoring... (2/2)");
      setStreamingText(allRawText + "\n\n--- Analyzing & scoring... ---");

      const descriptionsForAnalysis = parsedDescriptions.map((d, i) => `${i + 1}. ${d}`).join("\n");

      const analysisPrompt = `Analyze and score these 5 meta descriptions for the page "${pageTitle.trim()}" with target keywords "${targetKeywords.trim()}":

${descriptionsForAnalysis}

For EACH description (1-5), provide:
- Character count assessment (is it in the ideal 150-160 range?)
- Keyword inclusion check
- CTA presence (yes/no)
- SEO strength score (X/10)
- Brief "Why it works" explanation (1 sentence)

Format each analysis as:
Description X:
- Characters: [count] — [good/needs adjustment]
- Keywords: [included/missing]
- CTA: [yes/no]
- SEO Score: [X/10]
- Why it works: [explanation]`;

      const analysisResult = await generateSection(analysisPrompt, 600, 0.5);
      analysisContent = analysisResult.trim();
      allRawText += `\n\nANALYSIS:\n${analysisContent}`;
      setStreamingText(allRawText);
      setAnalysisText(analysisContent);

      const optionsJson = JSON.stringify({
        includeCTA,
        emphasizeBenefits,
        includeNumbers,
        includeUrgency,
        includeBrandName,
        brandName: brandName.trim(),
        specialInstructions: specialInstructions.trim(),
      });

      const saved: MetaDescription = {
        id: generateId(),
        pageTitle: pageTitle.trim(),
        targetKeywords: targetKeywords.trim(),
        pageDescription: pageDescription.trim(),
        tone,
        contentType,
        options: optionsJson,
        descriptions: parsedDescriptions.join("\n---\n"),
        analysis: analysisContent,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      saveDescription(saved);
    } catch (err) {
      console.error("Generation error:", err);
      if (parsedDescriptions.length > 0) {
        const partial: MetaDescription = {
          id: generateId(),
          pageTitle: pageTitle.trim(),
          targetKeywords: targetKeywords.trim(),
          pageDescription: pageDescription.trim(),
          tone,
          contentType,
          options: "",
          descriptions: parsedDescriptions.join("\n---\n"),
          analysis: analysisContent,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        saveDescription(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    pageTitle.trim().length > 0 &&
    targetKeywords.trim().length > 0 &&
    pageDescription.trim().length > 0 &&
    !isGenerating;

  const hasOutput = descriptions.length > 0;

  const avgLength = descriptions.length > 0
    ? Math.round(descriptions.reduce((sum, d) => sum + d.length, 0) / descriptions.length)
    : 0;

  const keywordList = targetKeywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
  const keywordCoverage = descriptions.length > 0 && keywordList.length > 0
    ? Math.round(
        (keywordList.filter((kw) =>
          descriptions.some((d) => d.toLowerCase().includes(kw))
        ).length / keywordList.length) * 100
      )
    : 0;

  const allDescriptionsText = descriptions.map((d, i) => `${i + 1}. ${d}`).join("\n\n");

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-meta-description-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="page-title-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Page Title * <span className="font-normal text-slate-400">(the title of your page)</span>
            </label>
            <input
              id="page-title-input"
              data-testid="input-page-title"
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value.slice(0, MAX_TITLE_CHARS))}
              placeholder="e.g., Best AI SEO Tools for Small Businesses in 2026"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-page-title-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {pageTitle.length}/{MAX_TITLE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="target-keywords-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Keywords * <span className="font-normal text-slate-400">(comma-separated)</span>
            </label>
            <input
              id="target-keywords-input"
              data-testid="input-target-keywords"
              type="text"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value.slice(0, MAX_KEYWORDS_CHARS))}
              placeholder="e.g., AI SEO tools, small business SEO"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-keywords-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {targetKeywords.length}/{MAX_KEYWORDS_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="page-description-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Page Description * <span className="font-normal text-slate-400">(describe what your page is about)</span>
            </label>
            <textarea
              id="page-description-input"
              data-testid="input-page-description"
              value={pageDescription}
              onChange={(e) => setPageDescription(e.target.value.slice(0, MAX_DESCRIPTION_CHARS))}
              placeholder="Describe what your page is about..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-description-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {pageDescription.length}/{MAX_DESCRIPTION_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tone *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="container-tone-options">
              {TONE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-tone-${opt.value}`}
                    onClick={() => setTone(opt.value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      tone === opt.value
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="block font-semibold">{opt.label}</span>
                      <span className="block text-xs opacity-70 mt-0.5">{opt.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="content-type-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Content Type
            </label>
            <select
              id="content-type-select"
              data-testid="select-content-type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            >
              {CONTENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              data-testid="button-toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Advanced Options
            </button>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 space-y-3 pl-2 border-l-2 border-slate-100"
              >
                <ToggleOption
                  testId="toggle-include-cta"
                  label="Include call-to-action"
                  checked={includeCTA}
                  onChange={setIncludeCTA}
                />
                <ToggleOption
                  testId="toggle-emphasize-benefits"
                  label="Emphasize benefits over features"
                  checked={emphasizeBenefits}
                  onChange={setEmphasizeBenefits}
                />
                <ToggleOption
                  testId="toggle-include-numbers"
                  label="Include numbers/statistics"
                  checked={includeNumbers}
                  onChange={setIncludeNumbers}
                />
                <ToggleOption
                  testId="toggle-include-urgency"
                  label="Include urgency/scarcity"
                  checked={includeUrgency}
                  onChange={setIncludeUrgency}
                />
                <ToggleOption
                  testId="toggle-include-brand"
                  label="Include brand name"
                  checked={includeBrandName}
                  onChange={setIncludeBrandName}
                />
                {includeBrandName && (
                  <div className="ml-6">
                    <input
                      data-testid="input-brand-name"
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value.slice(0, MAX_BRAND_NAME_CHARS))}
                      placeholder="Enter your brand name..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="special-instructions" className="block text-xs font-medium text-slate-500 mb-1">
                    Special Instructions <span className="text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="special-instructions"
                    data-testid="input-special-instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value.slice(0, MAX_INSTRUCTIONS_CHARS))}
                    placeholder="Any specific requirements..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm resize-y"
                  />
                  <span className="text-xs text-slate-400 mt-0.5 block text-right">
                    {specialInstructions.length}/{MAX_INSTRUCTIONS_CHARS}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span data-testid="text-privacy-reminder">Processed 100% locally in your browser — nothing is sent to any server</span>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-primary shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Generating meta descriptions...</>
              ) : (
                <><Search className="w-5 h-5" />Generate Meta Descriptions (Privately)</>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={handleReset}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {isGenerating && streamingText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8"
          data-testid="container-streaming"
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600" data-testid="text-generation-progress">
              {generationProgress || "Generating meta descriptions... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {hasOutput && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Meta Descriptions</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {TONE_OPTIONS.find((t) => t.value === tone)?.label} tone — {CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.label}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(allDescriptionsText, "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-total" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <List className="w-3.5 h-3.5" /> {descriptions.length} generated
            </div>
            <div data-testid="stat-avg-length" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Target className="w-3.5 h-3.5" /> Avg: {avgLength} chars
            </div>
            <div data-testid="stat-keyword-coverage" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <TrendingUp className="w-3.5 h-3.5" /> {keywordCoverage}% keyword coverage
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {descriptions.map((desc, i) => {
            const charCount = desc.length;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6"
                data-testid={`container-description-${i}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700" data-testid={`text-label-${i}`}>
                      Option {i + 1}: {VARIATION_LABELS[i] || `Variation ${i + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      data-testid={`text-char-count-${i}`}
                      className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", getCharCountBg(charCount), getCharCountColor(charCount))}
                    >
                      {charCount} chars
                    </span>
                    <button
                      data-testid={`button-copy-${i}`}
                      onClick={() => copyToClipboard(desc, `desc-${i}`)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                        copiedId === `desc-${i}` ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      )}
                    >
                      {copiedId === `desc-${i}` ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === `desc-${i}` ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-4">
                  <p className="text-sm text-slate-700 leading-relaxed" data-testid={`text-description-${i}`}>
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-google-preview">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-bold text-slate-800" data-testid="heading-google-preview">Google Search Preview</h3>
            </div>

            {descriptions.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {descriptions.map((_, i) => (
                  <button
                    key={i}
                    data-testid={`button-preview-${i}`}
                    onClick={() => setSelectedPreview(i)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      selectedPreview === i
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : "bg-white text-slate-500 border-slate-200 hover:border-blue-200"
                    )}
                  >
                    Option {i + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-4" data-testid="container-preview-card">
              <p className="text-lg text-blue-700 hover:underline cursor-pointer leading-snug" data-testid="text-preview-title">
                {pageTitle.trim() || "Page Title"}
              </p>
              <p className="text-sm text-green-700 mt-1" data-testid="text-preview-url">
                https://example.com › {pageTitle.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 40)}
              </p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed" data-testid="text-preview-description">
                {descriptions[selectedPreview] || "Meta description will appear here..."}
              </p>
            </div>
          </div>

          {analysisText && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-analysis">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-analysis">Analysis & Scoring</h3>
                </div>
                <button
                  data-testid="button-copy-analysis"
                  onClick={() => copyToClipboard(analysisText, "analysis")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "analysis" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "analysis" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "analysis" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-analysis">
                  {analysisText}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ToggleOption({ testId, label, checked, onChange }: { testId: string; label: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" data-testid={testId}>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          "w-9 h-5 rounded-full relative transition-colors cursor-pointer",
          checked ? "bg-emerald-500" : "bg-slate-300"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </div>
      <span className="text-sm text-slate-600">{label}</span>
    </label>
  );
}

function EngineStatus({ state, progress, error }: { state: string; progress: { text: string; percent: number }; error: string | null }) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" data-testid="status-error">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700" data-testid="text-error-title">AI Engine Error</p>
          <p className="text-sm text-red-600 mt-1" data-testid="text-error-message">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span className="text-sm font-medium text-emerald-700" data-testid="text-engine-status">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}
