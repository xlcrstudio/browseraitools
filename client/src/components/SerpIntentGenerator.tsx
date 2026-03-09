import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, Search,
  Zap, BarChart3, Target, Lightbulb, HelpCircle,
  LayoutList, FileText, AlignLeft
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useSerpIntentStorage,
  type SerpIntentAnalysis,
} from "@/hooks/use-serp-intent-storage";

const COUNTRY_OPTIONS = [
  { value: "global", label: "Global" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "other", label: "Other" },
];

const DEPTH_OPTIONS = [
  { value: "quick", label: "Quick", icon: Zap, badge: null },
  { value: "standard", label: "Standard", icon: BarChart3, badge: "Most Popular" },
  { value: "deep", label: "Deep Dive", icon: Search, badge: null },
];

const EXTRA_INSIGHTS_OPTIONS = [
  { value: "content-types", label: "Top Content Types on SERP", icon: LayoutList },
  { value: "article-formats", label: "Recommended Article Formats", icon: FileText },
  { value: "title-templates", label: "Winning Title Templates", icon: Lightbulb },
  { value: "people-also-ask", label: "People Also Ask Questions", icon: HelpCircle },
  { value: "content-depth", label: "Content Depth & Word Count", icon: AlignLeft },
  { value: "competitor-angles", label: "Competitor Angle Opportunities", icon: Target },
];

const MAX_KEYWORD_CHARS = 150;
const MAX_NICHE_CHARS = 100;

const SYSTEM_PROMPT = `You are an expert SERP intent analyst and SEO strategist. Classify search intent into four types: Informational (seeking knowledge), Navigational (seeking a specific site/page), Commercial (comparing/researching before purchase), and Transactional (ready to buy/act). Provide specific, actionable recommendations based on real SERP patterns. Be data-driven and precise.`;

export function SerpIntentGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveAnalysis } = useSerpIntentStorage();

  const [keyword, setKeyword] = useState("");
  const [niche, setNiche] = useState("");
  const [country, setCountry] = useState("global");
  const [depth, setDepth] = useState("standard");
  const [extraInsights, setExtraInsights] = useState<string[]>(["content-types"]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<SerpIntentAnalysis | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleInsight = (value: string) => {
    setExtraInsights((prev) => {
      if (prev.includes(value)) {
        const updated = prev.filter((v) => v !== value);
        return updated;
      }
      return [...prev, value];
    });
  };

  const handleReset = () => {
    setKeyword("");
    setNiche("");
    setCountry("global");
    setDepth("standard");
    setExtraInsights(["content-types"]);
    setStreamingText("");
    setCurrentAnalysis(null);
    setCopiedId(null);
    setGenerationProgress("");
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

  const countryLabel = COUNTRY_OPTIONS.find((c) => c.value === country)?.label || "Global";
  const depthLabel = DEPTH_OPTIONS.find((d) => d.value === depth)?.label || depth;
  const insightLabels = extraInsights.map((i) => EXTRA_INSIGHTS_OPTIONS.find((o) => o.value === i)?.label || i).join(", ");

  const handleGenerate = async () => {
    if (!keyword.trim()) return;

    setIsGenerating(true);
    setStreamingText("");
    setCurrentAnalysis(null);
    setGenerationProgress("");

    const nicheContext = niche.trim() ? `Niche/Industry: ${niche.trim()}` : "";
    const countryContext = country !== "global" ? `Target Country: ${countryLabel}` : "";
    const depthContext = `Analysis Depth: ${depthLabel}`;
    const insightsContext = extraInsights.length > 0 ? `Extra Insights Requested: ${insightLabels}` : "";

    let allRawText = "";
    let intentReport = "";
    let contentTypes = "";
    let articleFormat = "";
    let titleIdeas = "";
    let peopleAlsoAsk = "";
    let contentDepth = "";

    try {
      setGenerationProgress("Classifying intent... (1/4)");
      setStreamingText("--- Classifying search intent... ---");

      const intentPrompt = `Analyze the search intent for the keyword: "${keyword.trim()}"

${nicheContext}
${countryContext}
${depthContext}

Classify the search intent into one of these four types:
- Informational: User wants to learn or understand something
- Navigational: User wants to find a specific website or page
- Commercial: User is researching/comparing before a purchase decision
- Transactional: User is ready to buy, sign up, or take action

Provide:
1. PRIMARY INTENT: (one of the four types) with a confidence percentage
2. SECONDARY INTENT: (if applicable, one of the four types) with a confidence percentage
3. INTENT EXPLANATION: A clear 2-3 sentence explanation of why this keyword has this intent, what the searcher is looking for, and what kind of content Google rewards for it.

Format clearly with labels.`;

      const intentResult = await generateSection(intentPrompt, 400, 0.5);
      intentReport = intentResult.trim();
      allRawText = `SEARCH INTENT CLASSIFICATION:\n${intentReport}`;
      setStreamingText(allRawText);

      setGenerationProgress("Analyzing SERP patterns... (2/4)");
      setStreamingText(allRawText + "\n\n--- Analyzing SERP patterns... ---");

      const serpPrompt = `Based on the search intent analysis for "${keyword.trim()}":

Intent Analysis: ${intentReport.slice(0, 300)}
${nicheContext}
${insightsContext}

Provide two sections:

SERP CONTENT PATTERNS:
List the top content types that dominate the SERP for this keyword. For each, give an estimated percentage of page-1 results. Examples: listicles, how-to guides, product pages, comparison articles, videos, tools/calculators, etc.

RECOMMENDED ARTICLE FORMAT:
Based on the SERP patterns above, recommend the best article format to rank for this keyword. Include a suggested H1 and a brief content structure outline (H2 headings). Be specific and actionable.`;

      const serpResult = await generateSection(serpPrompt, 600, 0.6);
      const serpText = serpResult.trim();

      const contentTypesMatch = serpText.split(/RECOMMENDED ARTICLE FORMAT/i);
      contentTypes = (contentTypesMatch[0] || serpText).replace(/SERP CONTENT PATTERNS:?\s*/i, "").trim();
      articleFormat = (contentTypesMatch[1] || "").replace(/^:?\s*/, "").trim();

      allRawText += `\n\nSERP CONTENT PATTERNS:\n${contentTypes}\n\nRECOMMENDED ARTICLE FORMAT:\n${articleFormat}`;
      setStreamingText(allRawText);

      setGenerationProgress("Generating titles & questions... (3/4)");
      setStreamingText(allRawText + "\n\n--- Generating titles & questions... ---");

      const titlesPrompt = `For the keyword "${keyword.trim()}" with ${intentReport.slice(0, 200)} intent and recommended format: ${articleFormat.slice(0, 200)}

${nicheContext}

Provide two sections:

WINNING TITLE IDEAS:
Generate exactly 5 high-CTR title ideas optimized for this keyword and search intent. Number them 1-5. Each title should use a different angle or hook (e.g., numbers, year, "how to", comparison, guide).

PEOPLE ALSO ASK:
Generate 8-12 realistic "People Also Ask" questions that Google would show for this keyword. These should be questions real users would ask, ranging from basic to advanced. List them as bullet points.`;

      const titlesResult = await generateSection(titlesPrompt, 500, 0.7);
      const titlesText = titlesResult.trim();

      const paaMatch = titlesText.split(/PEOPLE ALSO ASK:?\s*/i);
      titleIdeas = (paaMatch[0] || titlesText).replace(/WINNING TITLE IDEAS:?\s*/i, "").trim();
      peopleAlsoAsk = (paaMatch[1] || "").trim();

      allRawText += `\n\nWINNING TITLE IDEAS:\n${titleIdeas}\n\nPEOPLE ALSO ASK:\n${peopleAlsoAsk}`;
      setStreamingText(allRawText);

      setGenerationProgress("Building recommendations... (4/4)");
      setStreamingText(allRawText + "\n\n--- Building recommendations... ---");

      const depthPrompt = `For the keyword "${keyword.trim()}" in the ${niche.trim() || "general"} niche:

Intent: ${intentReport.slice(0, 200)}
Content types: ${contentTypes.slice(0, 200)}
Article format: ${articleFormat.slice(0, 200)}

Provide:

CONTENT DEPTH RECOMMENDATION:
- Recommended word count range
- Number of H2 sections recommended
- Suggested media (images, videos, infographics)
- Internal/external linking suggestions
- Key statistics or data points to include

COMPETITOR ANGLES:
- 3-4 unique angles or gaps that competitors are likely missing
- How to differentiate your content from existing top results

QUICK STATS:
- Primary Intent: (type)
- SERP Dominance: (what content type dominates, e.g., "How-to guides - 60%")
- Opportunity Score: (Low/Medium/High/Very High) with brief explanation`;

      const depthResult = await generateSection(depthPrompt, 500, 0.6);
      contentDepth = depthResult.trim();
      allRawText += `\n\nCONTENT DEPTH & RECOMMENDATIONS:\n${contentDepth}`;
      setStreamingText(allRawText);

      const analysis: SerpIntentAnalysis = {
        id: generateId(),
        keyword: keyword.trim(),
        niche: niche.trim(),
        country,
        depth,
        extraInsights: extraInsights.join(","),
        intentReport,
        contentTypes,
        articleFormat,
        titleIdeas,
        peopleAlsoAsk,
        contentDepth,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentAnalysis(analysis);
      saveAnalysis(analysis);
    } catch (err) {
      console.error("Generation error:", err);
      if (intentReport) {
        const partial: SerpIntentAnalysis = {
          id: generateId(),
          keyword: keyword.trim(),
          niche: niche.trim(),
          country,
          depth,
          extraInsights: extraInsights.join(","),
          intentReport,
          contentTypes,
          articleFormat,
          titleIdeas,
          peopleAlsoAsk,
          contentDepth,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCurrentAnalysis(partial);
        saveAnalysis(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    keyword.trim().length > 0 &&
    !isGenerating;

  const hasOutput = currentAnalysis && (currentAnalysis.intentReport || currentAnalysis.rawText);

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-serp-intent-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="keyword-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Keyword * <span className="font-normal text-slate-400">(enter the keyword to analyze)</span>
            </label>
            <input
              id="keyword-input"
              data-testid="input-keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.slice(0, MAX_KEYWORD_CHARS))}
              placeholder="e.g., best project management software, how to start a blog, buy running shoes online"
              className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-keyword-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {keyword.length}/{MAX_KEYWORD_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="niche-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Niche / Industry <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="niche-input"
              data-testid="input-niche"
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value.slice(0, MAX_NICHE_CHARS))}
              placeholder="e.g., SEO, digital marketing, SaaS, fitness"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-niche-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {niche.length}/{MAX_NICHE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="country-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Country <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <select
              id="country-select"
              data-testid="select-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            >
              {COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Analysis Depth</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-testid="container-depth-options">
              {DEPTH_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-depth-${opt.value}`}
                    onClick={() => setDepth(opt.value)}
                    className={cn(
                      "relative px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left flex items-center gap-3",
                      depth === opt.value
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div>
                      <span className="block font-semibold">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-xs text-emerald-600 font-medium">{opt.badge}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Extra Insights <span className="font-normal text-slate-400">(select any)</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="container-extra-insights">
              {EXTRA_INSIGHTS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-insight-${opt.value}`}
                    onClick={() => toggleInsight(opt.value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      extraInsights.includes(opt.value)
                        ? "bg-blue-100 text-blue-700 border-blue-300 ring-1 ring-blue-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
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
                <><Loader2 className="w-5 h-5 animate-spin" />Analyzing search intent...</>
              ) : (
                <><Search className="w-5 h-5" />Analyze SERP Intent (Privately)</>
              )}
            </button>
            <button
              data-testid="button-new-keyword"
              onClick={handleReset}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /><span className="hidden sm:inline">New Keyword</span>
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
              {generationProgress || "Analyzing search intent... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentAnalysis && !isGenerating && hasOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">SERP Intent Analysis</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                "{currentAnalysis.keyword}" — {countryLabel} — {depthLabel}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(currentAnalysis.rawText, "all")}
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
            <div data-testid="stat-primary-intent" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              <Target className="w-3.5 h-3.5" /> Primary Intent
            </div>
            <div data-testid="stat-serp-dominance" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
              <BarChart3 className="w-3.5 h-3.5" /> SERP Dominance
            </div>
            <div data-testid="stat-opportunity" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Lightbulb className="w-3.5 h-3.5" /> Opportunity Score
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {currentAnalysis.intentReport && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-intent-report">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-rose-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-intent-report">Intent Classification</h3>
                </div>
                <button
                  data-testid="button-copy-intent"
                  onClick={() => copyToClipboard(currentAnalysis.intentReport, "intent")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "intent" ? "bg-emerald-100 text-emerald-700" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  )}
                >
                  {copiedId === "intent" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "intent" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-intent-report">
                  {currentAnalysis.intentReport}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.contentTypes && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-content-types">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LayoutList className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-content-types">SERP Content Patterns</h3>
                </div>
                <button
                  data-testid="button-copy-content-types"
                  onClick={() => copyToClipboard(currentAnalysis.contentTypes, "content-types")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "content-types" ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  )}
                >
                  {copiedId === "content-types" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "content-types" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-content-types">
                  {currentAnalysis.contentTypes}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.articleFormat && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-article-format">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-article-format">Article Format</h3>
                </div>
                <button
                  data-testid="button-copy-article-format"
                  onClick={() => copyToClipboard(currentAnalysis.articleFormat, "article-format")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "article-format" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "article-format" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "article-format" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-article-format">
                  {currentAnalysis.articleFormat}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.titleIdeas && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-title-ideas">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-green-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-title-ideas">Winning Title Ideas</h3>
                </div>
                <button
                  data-testid="button-copy-titles"
                  onClick={() => copyToClipboard(currentAnalysis.titleIdeas, "titles")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "titles" ? "bg-emerald-100 text-emerald-700" : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}
                >
                  {copiedId === "titles" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "titles" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-green-50/50 border border-green-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-title-ideas">
                  {currentAnalysis.titleIdeas}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.peopleAlsoAsk && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-people-also-ask">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-people-also-ask">People Also Ask</h3>
                </div>
                <button
                  data-testid="button-copy-paa"
                  onClick={() => copyToClipboard(currentAnalysis.peopleAlsoAsk, "paa")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "paa" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "paa" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "paa" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-people-also-ask">
                  {currentAnalysis.peopleAlsoAsk}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.contentDepth && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-content-depth">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-5 h-5 text-slate-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-content-depth">Content Depth & Recommendations</h3>
                </div>
                <button
                  data-testid="button-copy-depth"
                  onClick={() => copyToClipboard(currentAnalysis.contentDepth, "depth")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "depth" ? "bg-emerald-100 text-emerald-700" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {copiedId === "depth" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "depth" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-slate-50/50 border border-slate-200 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-content-depth">
                  {currentAnalysis.contentDepth}
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
            <button
              data-testid="button-new-keyword-bottom"
              onClick={handleReset}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> New Keyword
            </button>
          </div>
        </motion.div>
      )}
    </div>
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
