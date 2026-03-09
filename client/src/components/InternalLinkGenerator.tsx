import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, Link2,
  Brain, TrendingUp, Users, Scale,
  ChevronDown, ChevronUp
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useInternalLinkStorage,
  type InternalLinkAnalysis,
} from "@/hooks/use-internal-link-storage";

const LINKING_GOAL_OPTIONS = [
  { value: "topical-authority", label: "Topical Authority", description: "Build expertise cluster", icon: Brain },
  { value: "pagerank", label: "PageRank Distribution", description: "Boost important pages", icon: TrendingUp },
  { value: "user-experience", label: "User Experience", description: "Helpful navigation", icon: Users },
  { value: "balanced", label: "Balanced Approach", description: "Mix of SEO and UX", icon: Scale },
];

const MAX_PAGE_CONTENT_CHARS = 10000;
const MAX_PAGE_URL_CHARS = 200;
const MAX_KEYWORDS_CHARS = 200;
const MAX_SITE_PAGES_CHARS = 20000;
const MAX_CURRENT_LINKS_CHARS = 2000;
const MAX_PRIORITY_PAGES_CHARS = 500;
const MAX_AVOID_PAGES_CHARS = 500;

const SYSTEM_PROMPT = `You are an expert internal linking strategist and topical authority specialist. You analyze page content and site structure to suggest strategic internal links with optimized anchor text. Be specific, actionable, and data-driven. Write exactly the section requested.`;

function summarizeContent(text: string): string {
  const lines = text.split("\n");
  const headings = lines.filter(
    (line) => line.trim().startsWith("#") || (line.trim().length > 3 && line.trim().length < 100 && line.trim() === line.trim().toUpperCase() && /[A-Z]/.test(line.trim()))
  ).slice(0, 20);
  const first800 = text.slice(0, 800);
  const last400 = text.slice(-400);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const parts = [
    `Word count: ${wordCount}`,
    headings.length > 0 ? `Headings:\n${headings.join("\n")}` : "No headings found",
    `Opening: ${first800}`,
    `Closing: ${last400}`,
  ];
  return parts.join("\n\n");
}

function truncateSitePages(text: string): string {
  return text.slice(0, 2000);
}

export function InternalLinkGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveAnalysis } = useInternalLinkStorage();

  const [pageContent, setPageContent] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [sitePages, setSitePages] = useState("");
  const [currentLinks, setCurrentLinks] = useState("");
  const [linkingGoal, setLinkingGoal] = useState("balanced");
  const [linkCount, setLinkCount] = useState(8);

  const [includeAnchorText, setIncludeAnchorText] = useState(true);
  const [prioritizeDeepPages, setPrioritizeDeepPages] = useState(true);
  const [suggestConversionLinks, setSuggestConversionLinks] = useState(false);
  const [avoidOverOptimization, setAvoidOverOptimization] = useState(false);
  const [priorityPages, setPriorityPages] = useState("");
  const [avoidPages, setAvoidPages] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<InternalLinkAnalysis | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const wordCount = pageContent.split(/\s+/).filter(Boolean).length;

  const handleReset = () => {
    setPageContent("");
    setPageUrl("");
    setTargetKeywords("");
    setSitePages("");
    setCurrentLinks("");
    setLinkingGoal("balanced");
    setLinkCount(8);
    setIncludeAnchorText(true);
    setPrioritizeDeepPages(true);
    setSuggestConversionLinks(false);
    setAvoidOverOptimization(false);
    setPriorityPages("");
    setAvoidPages("");
    setShowAdvanced(false);
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
      onChunk: (text) => setStreamingText(text),
    });
    return result || "";
  };

  const handleGenerate = async () => {
    if (!pageContent.trim() || !sitePages.trim()) return;

    setIsGenerating(true);
    setStreamingText("");
    setCurrentAnalysis(null);
    setGenerationProgress("");

    const contentSummary = summarizeContent(pageContent);
    const truncatedSitePages = truncateSitePages(sitePages);
    const goalLabel = LINKING_GOAL_OPTIONS.find((g) => g.value === linkingGoal)?.label || linkingGoal;
    const keywordsContext = targetKeywords.trim() ? `Target keywords: ${targetKeywords.trim()}` : "";
    const urlContext = pageUrl.trim() ? `Page URL/Title: ${pageUrl.trim()}` : "";
    const currentLinksContext = currentLinks.trim() ? `Current internal links (avoid duplicates):\n${currentLinks.trim()}` : "";
    const priorityContext = priorityPages.trim() ? `Priority pages to link to:\n${priorityPages.trim()}` : "";
    const avoidContext = avoidPages.trim() ? `Pages to avoid linking to:\n${avoidPages.trim()}` : "";

    const advancedOpts = [
      includeAnchorText ? "Include anchor text suggestions" : "",
      prioritizeDeepPages ? "Prioritize deep pages" : "",
      suggestConversionLinks ? "Suggest conversion page links" : "",
      avoidOverOptimization ? "Avoid over-optimization" : "",
    ].filter(Boolean).join(", ");

    let allRawText = "";
    let overviewContent = "";
    let suggestionsContent = "";
    let implementationContent = "";

    try {
      setGenerationProgress("Analyzing content... (1/3)");
      setStreamingText("--- Analyzing content... ---");

      const overviewPrompt = `Analyze this page content for internal linking opportunities.

${urlContext}
${keywordsContext}
Linking goal: ${goalLabel}
Requested link count: ${linkCount}
${advancedOpts ? `Options: ${advancedOpts}` : ""}
${currentLinksContext}

PAGE CONTENT SUMMARY:
${contentSummary}

AVAILABLE SITE PAGES:
${truncatedSitePages}

Provide a content analysis overview including:
- Main topics and themes of this page
- Current link density assessment
- Overall structure assessment
- Key linking opportunities identified
- Relevance score (1-10) for internal linking potential

Content Analysis Overview:`;

      const overviewResult = await generateSection(overviewPrompt, 500, 0.5);
      overviewContent = overviewResult.trim();
      allRawText = `CONTENT ANALYSIS OVERVIEW:\n${overviewContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Finding link opportunities... (2/3)");
      setStreamingText(allRawText + "\n\n--- Finding link opportunities... ---");

      const suggestionsPrompt = `Based on this content analysis, suggest ${linkCount} strategic internal links.

${urlContext}
${keywordsContext}
Linking goal: ${goalLabel}
${advancedOpts ? `Options: ${advancedOpts}` : ""}
${currentLinksContext}
${priorityContext}
${avoidContext}

PAGE CONTENT SUMMARY:
${contentSummary}

AVAILABLE SITE PAGES:
${truncatedSitePages}

CONTENT OVERVIEW:
${overviewContent.slice(0, 400)}

For each link suggestion, provide:
1. Link Target URL (from the site pages list)
2. Primary Anchor Text suggestion
3. Alternative Anchor Text option
4. Placement Context (quote or describe where in the content to place it)
5. Why It Works (1-2 sentences on relevance and SEO value)
6. Relevance Score (High/Medium/Low)

Format each suggestion clearly numbered. Provide exactly ${linkCount} suggestions.

Internal Link Suggestions:`;

      const suggestionsResult = await generateSection(suggestionsPrompt, 800, 0.6);
      suggestionsContent = suggestionsResult.trim();
      allRawText += `\n\nINTERNAL LINK SUGGESTIONS:\n${suggestionsContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Building implementation guide... (3/3)");
      setStreamingText(allRawText + "\n\n--- Building implementation guide... ---");

      const implementationPrompt = `Create an implementation guide for these internal link suggestions.

Link suggestions summary:
${suggestionsContent.slice(0, 600)}

${avoidOverOptimization ? "Important: Include warnings about over-optimization risks." : ""}

Provide:
- HTML code snippets for the top 3-4 link implementations (using <a> tags with proper anchor text)
- Optimization tips and warnings
- Next steps for improving internal linking strategy
- Any potential issues to watch for

Implementation Guide:`;

      const implementationResult = await generateSection(implementationPrompt, 400, 0.5);
      implementationContent = implementationResult.trim();
      allRawText += `\n\nIMPLEMENTATION GUIDE:\n${implementationContent}`;
      setStreamingText(allRawText);

      const optionsJson = JSON.stringify({
        includeAnchorText,
        prioritizeDeepPages,
        suggestConversionLinks,
        avoidOverOptimization,
        priorityPages,
        avoidPages,
      });

      const analysis: InternalLinkAnalysis = {
        id: generateId(),
        pageContent: pageContent.slice(0, 500),
        pageUrl,
        targetKeywords,
        sitePages: sitePages.slice(0, 500),
        currentLinks,
        linkingGoal,
        linkCount,
        options: optionsJson,
        suggestions: suggestionsContent,
        overview: overviewContent,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentAnalysis(analysis);
      saveAnalysis(analysis);
    } catch (err) {
      console.error("Generation error:", err);
      if (overviewContent) {
        const optionsJson = JSON.stringify({
          includeAnchorText,
          prioritizeDeepPages,
          suggestConversionLinks,
          avoidOverOptimization,
          priorityPages,
          avoidPages,
        });
        const partial: InternalLinkAnalysis = {
          id: generateId(),
          pageContent: pageContent.slice(0, 500),
          pageUrl,
          targetKeywords,
          sitePages: sitePages.slice(0, 500),
          currentLinks,
          linkingGoal,
          linkCount,
          options: optionsJson,
          suggestions: suggestionsContent,
          overview: overviewContent,
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
    pageContent.trim().length > 0 &&
    sitePages.trim().length > 0 &&
    !isGenerating;

  const hasOutput = currentAnalysis && (currentAnalysis.suggestions || currentAnalysis.rawText);

  const goalLabel = LINKING_GOAL_OPTIONS.find((g) => g.value === linkingGoal)?.label || linkingGoal;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-internal-link-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="page-content-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Page Content * <span className="font-normal text-slate-400">(paste your page content)</span>
            </label>
            <textarea
              id="page-content-input"
              data-testid="input-page-content"
              value={pageContent}
              onChange={(e) => setPageContent(e.target.value.slice(0, MAX_PAGE_CONTENT_CHARS))}
              placeholder="Paste the full content of the page you want to add internal links to..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <div className="flex items-center justify-between mt-1">
              <span data-testid="text-word-count" className="text-xs text-slate-400">
                {wordCount} words
              </span>
              <span data-testid="text-page-content-char-count" className="text-xs text-slate-400">
                {pageContent.length}/{MAX_PAGE_CONTENT_CHARS}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="page-url-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Page URL / Title <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="page-url-input"
              data-testid="input-page-url"
              type="text"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value.slice(0, MAX_PAGE_URL_CHARS))}
              placeholder="https://example.com/my-page or 'My Page Title'"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-page-url-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {pageUrl.length}/{MAX_PAGE_URL_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="target-keywords-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Keywords <span className="font-normal text-slate-400">(optional, comma-separated)</span>
            </label>
            <input
              id="target-keywords-input"
              data-testid="input-target-keywords"
              type="text"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value.slice(0, MAX_KEYWORDS_CHARS))}
              placeholder="internal linking, SEO strategy, site structure..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-keywords-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {targetKeywords.length}/{MAX_KEYWORDS_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="site-pages-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Site Pages * <span className="font-normal text-slate-400">(paste your site pages list — URLs, URL + description, or sitemap)</span>
            </label>
            <textarea
              id="site-pages-input"
              data-testid="input-site-pages"
              value={sitePages}
              onChange={(e) => setSitePages(e.target.value.slice(0, MAX_SITE_PAGES_CHARS))}
              placeholder={"https://example.com/page-1 - About our services\nhttps://example.com/blog/topic - Blog post about topic\nhttps://example.com/products - Product listing page\n..."}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-site-pages-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {sitePages.length}/{MAX_SITE_PAGES_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="current-links-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Current Internal Links <span className="font-normal text-slate-400">(optional — list existing internal links to avoid duplicates)</span>
            </label>
            <textarea
              id="current-links-input"
              data-testid="input-current-links"
              value={currentLinks}
              onChange={(e) => setCurrentLinks(e.target.value.slice(0, MAX_CURRENT_LINKS_CHARS))}
              placeholder={"https://example.com/existing-link-1\nhttps://example.com/existing-link-2"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-current-links-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {currentLinks.length}/{MAX_CURRENT_LINKS_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Linking Goal</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="container-linking-goal">
              {LINKING_GOAL_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-goal-${opt.value}`}
                    onClick={() => setLinkingGoal(opt.value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      linkingGoal === opt.value
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
            <label htmlFor="link-count-slider" className="block text-sm font-semibold text-slate-700 mb-2">
              Number of Links: <span className="text-emerald-600" data-testid="text-link-count">{linkCount}</span>
            </label>
            <input
              id="link-count-slider"
              data-testid="input-link-count"
              type="range"
              min={3}
              max={15}
              value={linkCount}
              onChange={(e) => setLinkCount(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>3</span>
              <span>15</span>
            </div>
          </div>

          <div>
            <button
              data-testid="button-toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Advanced Options
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4 p-4 rounded-xl bg-slate-50/50 border border-slate-200">
                <ToggleOption
                  testId="toggle-anchor-text"
                  label="Include anchor text suggestions"
                  checked={includeAnchorText}
                  onChange={setIncludeAnchorText}
                />
                <ToggleOption
                  testId="toggle-deep-pages"
                  label="Prioritize deep pages"
                  checked={prioritizeDeepPages}
                  onChange={setPrioritizeDeepPages}
                />
                <ToggleOption
                  testId="toggle-conversion-links"
                  label="Suggest conversion page links"
                  checked={suggestConversionLinks}
                  onChange={setSuggestConversionLinks}
                />
                <ToggleOption
                  testId="toggle-avoid-optimization"
                  label="Avoid over-optimization"
                  checked={avoidOverOptimization}
                  onChange={setAvoidOverOptimization}
                />

                <div>
                  <label htmlFor="priority-pages-input" className="block text-sm font-medium text-slate-600 mb-1">
                    Priority Pages <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="priority-pages-input"
                    data-testid="input-priority-pages"
                    value={priorityPages}
                    onChange={(e) => setPriorityPages(e.target.value.slice(0, MAX_PRIORITY_PAGES_CHARS))}
                    placeholder="URLs of pages you want to prioritize linking to..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
                  />
                  <span data-testid="text-priority-pages-char-count" className="text-xs text-slate-400 mt-1 block text-right">
                    {priorityPages.length}/{MAX_PRIORITY_PAGES_CHARS}
                  </span>
                </div>

                <div>
                  <label htmlFor="avoid-pages-input" className="block text-sm font-medium text-slate-600 mb-1">
                    Avoid Linking To <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="avoid-pages-input"
                    data-testid="input-avoid-pages"
                    value={avoidPages}
                    onChange={(e) => setAvoidPages(e.target.value.slice(0, MAX_AVOID_PAGES_CHARS))}
                    placeholder="URLs of pages you want to avoid linking to..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
                  />
                  <span data-testid="text-avoid-pages-char-count" className="text-xs text-slate-400 mt-1 block text-right">
                    {avoidPages.length}/{MAX_AVOID_PAGES_CHARS}
                  </span>
                </div>
              </div>
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
                <><Loader2 className="w-5 h-5 animate-spin" />Analyzing internal links...</>
              ) : (
                <><Link2 className="w-5 h-5" />Suggest Internal Links (Privately)</>
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
              {generationProgress || "Analyzing internal links... 100% in-browser"}
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
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Internal Link Analysis</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {goalLabel} — {linkCount} links requested
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
            <div data-testid="stat-goal" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Scale className="w-3.5 h-3.5" /> {goalLabel}
            </div>
            <div data-testid="stat-link-count" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Link2 className="w-3.5 h-3.5" /> {linkCount} links
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {currentAnalysis.overview && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-overview">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-slate-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-overview">Content Analysis Overview</h3>
                </div>
                <button
                  data-testid="button-copy-overview"
                  onClick={() => copyToClipboard(currentAnalysis.overview, "overview")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "overview" ? "bg-emerald-100 text-emerald-700" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {copiedId === "overview" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "overview" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-slate-50/50 border border-slate-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-overview">
                  {currentAnalysis.overview}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.suggestions && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-suggestions">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-suggestions">Internal Link Suggestions</h3>
                </div>
                <button
                  data-testid="button-copy-suggestions"
                  onClick={() => copyToClipboard(currentAnalysis.suggestions, "suggestions")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "suggestions" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  )}
                >
                  {copiedId === "suggestions" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "suggestions" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-suggestions">
                  {currentAnalysis.suggestions}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.rawText.includes("IMPLEMENTATION GUIDE:") && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-implementation">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-implementation">Implementation Guide</h3>
                </div>
                <button
                  data-testid="button-copy-implementation"
                  onClick={() => {
                    const implText = currentAnalysis.rawText.split("IMPLEMENTATION GUIDE:\n")[1] || "";
                    copyToClipboard(implText.trim(), "implementation");
                  }}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "implementation" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "implementation" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "implementation" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-implementation">
                  {currentAnalysis.rawText.split("IMPLEMENTATION GUIDE:\n")[1]?.trim() || ""}
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

function ToggleOption({ testId, label, checked, onChange }: { testId: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" data-testid={testId}>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors cursor-pointer",
          checked ? "bg-emerald-500" : "bg-slate-300"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </div>
      <span className="text-sm text-slate-700">{label}</span>
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
