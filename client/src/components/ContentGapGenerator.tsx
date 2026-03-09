import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, Search,
  TrendingUp, Brain, ClipboardList, BarChart3,
  FileText, Target, Lightbulb, HelpCircle
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useContentGapStorage,
  type ContentGapAnalysis,
} from "@/hooks/use-content-gap-storage";

const ANALYSIS_DEPTH_OPTIONS = [
  { value: "quick", label: "Quick Scan", description: "Fastest" },
  { value: "standard", label: "Standard", description: "Balanced" },
  { value: "deep", label: "Deep Dive", description: "Most comprehensive" },
];

const FOCUS_AREA_OPTIONS = [
  { value: "missing-topics", label: "Missing Topics & Subtopics", icon: Search },
  { value: "keyword-gaps", label: "Keyword & Semantic Gaps", icon: Target },
  { value: "question-gaps", label: "Question Gaps (People Also Ask)", icon: HelpCircle },
  { value: "content-structure", label: "Content Structure & Headings", icon: FileText },
  { value: "unique-angles", label: "Unique Angles & Hooks", icon: Lightbulb },
  { value: "word-count-depth", label: "Recommended Word Count & Depth", icon: BarChart3 },
];

const MAX_ARTICLE_CHARS = 15000;
const MAX_KEYWORDS_CHARS = 300;
const MAX_NICHE_CHARS = 200;

const SYSTEM_PROMPT = `You are an expert SEO content strategist. Analyze content gaps between articles. Identify missing topics, keyword opportunities, and structural improvements. Be specific and actionable. Write exactly the section requested. Base recommendations strictly on what competitors cover that the user's article does not.`;

function summarizeArticle(text: string): string {
  const lines = text.split("\n");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const headings = lines.filter(
    (line) => line.trim().startsWith("#") || (line.trim().length > 3 && line.trim().length < 100 && line.trim() === line.trim().toUpperCase() && /[A-Z]/.test(line.trim()))
  ).slice(0, 20);
  const first300 = text.slice(0, 300);
  const last200 = text.slice(-200);
  const parts = [
    `Word count: ${wordCount}`,
    headings.length > 0 ? `Headings:\n${headings.join("\n")}` : "No headings found",
    `Opening: ${first300}`,
    `Closing: ${last200}`,
  ];
  return parts.join("\n\n");
}

export function ContentGapGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveAnalysis } = useContentGapStorage();

  const [userArticle, setUserArticle] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [competitor1, setCompetitor1] = useState("");
  const [competitor2, setCompetitor2] = useState("");
  const [competitor3, setCompetitor3] = useState("");
  const [niche, setNiche] = useState("");
  const [analysisDepth, setAnalysisDepth] = useState("standard");
  const [focusAreas, setFocusAreas] = useState<string[]>(["missing-topics"]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<ContentGapAnalysis | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleFocusArea = (value: string) => {
    setFocusAreas((prev) => {
      if (prev.includes(value)) {
        const updated = prev.filter((v) => v !== value);
        return updated.length === 0 ? prev : updated;
      }
      return [...prev, value];
    });
  };

  const handleReset = () => {
    setUserArticle("");
    setTargetKeywords("");
    setCompetitor1("");
    setCompetitor2("");
    setCompetitor3("");
    setNiche("");
    setAnalysisDepth("standard");
    setFocusAreas(["missing-topics"]);
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

  const competitorArticles = [competitor1, competitor2, competitor3].filter((c) => c.trim().length > 0);
  const competitorCount = competitorArticles.length;

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
    if (!userArticle.trim() || !competitor1.trim() || !niche.trim() || focusAreas.length === 0) return;

    setIsGenerating(true);
    setStreamingText("");
    setCurrentAnalysis(null);
    setGenerationProgress("");

    const userSummary = summarizeArticle(userArticle);
    const competitorSummaries = competitorArticles.map((c, i) => `Competitor ${i + 1}:\n${summarizeArticle(c)}`).join("\n\n---\n\n");
    const depthLabel = ANALYSIS_DEPTH_OPTIONS.find((d) => d.value === analysisDepth)?.label || analysisDepth;
    const focusLabels = focusAreas.map((f) => FOCUS_AREA_OPTIONS.find((o) => o.value === f)?.label || f).join(", ");
    const keywordsContext = targetKeywords.trim() ? `Target keywords: ${targetKeywords.trim()}` : "";

    let allRawText = "";
    let missingTopicsContent = "";
    let keywordGapsContent = "";
    let recommendedHeadingsContent = "";
    let contentBriefContent = "";

    try {
      setGenerationProgress("Analyzing content gaps... (1/4)");
      setStreamingText("--- Analyzing content gaps... ---");

      const missingTopicsPrompt = `Analyze content gaps between a user's article and ${competitorCount} competitor article(s).

Niche: ${niche}
${keywordsContext}
Analysis depth: ${depthLabel}
Focus areas: ${focusLabels}

USER'S ARTICLE SUMMARY:
${userSummary}

COMPETITOR ARTICLE SUMMARIES:
${competitorSummaries}

List the missing topics that competitors cover but the user's article does not. Be specific and prioritize by importance (High/Medium).

Missing Topics:`;

      const missingTopicsResult = await generateSection(missingTopicsPrompt, 600, 0.5);
      missingTopicsContent = missingTopicsResult.trim();
      allRawText = `MISSING TOPICS:\n${missingTopicsContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Finding keyword gaps... (2/5)");
      setStreamingText(allRawText + "\n\n--- Finding keyword gaps... ---");

      const keywordGapsPrompt = `Identify keyword and semantic gaps for a ${niche} article.

${keywordsContext}

USER'S ARTICLE SUMMARY:
${userSummary}

COMPETITOR ARTICLE SUMMARIES:
${competitorSummaries}

What keywords, phrases, and semantic themes do competitors use that the user's article misses? List specific keywords and their search intent (informational/commercial/navigational). Do NOT repeat the missing topics already found.

Keyword & Semantic Gaps:`;

      const keywordGapsResult = await generateSection(keywordGapsPrompt, 500, 0.5);
      keywordGapsContent = keywordGapsResult.trim();
      allRawText += `\n\nKEYWORD & SEMANTIC GAPS:\n${keywordGapsContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Generating heading suggestions... (3/5)");
      setStreamingText(allRawText + "\n\n--- Generating heading suggestions... ---");

      const headingsPrompt = `Based on these content gaps found in a ${niche} article:

${missingTopicsContent.slice(0, 500)}

Suggest specific H2 and H3 headings the user should add to their article to fill these gaps. Format as a structured outline with H2 and H3 levels clearly marked. Each heading should target a specific gap or missing topic.

Recommended Headings & Structure:`;

      const headingsResult = await generateSection(headingsPrompt, 600, 0.5);
      recommendedHeadingsContent = headingsResult.trim();
      allRawText += `\n\nRECOMMENDED HEADINGS:\n${recommendedHeadingsContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Creating content brief... (4/5)");
      setStreamingText(allRawText + "\n\n--- Creating content brief... ---");

      const briefPrompt = `Create an actionable content brief for improving a ${niche} article based on these gaps and heading suggestions:

Gaps: ${missingTopicsContent.slice(0, 400)}
Headings: ${recommendedHeadingsContent.slice(0, 300)}

Include: recommended additional word count, key questions to answer, unique angles to explore, and a prioritized action plan. Be concise and actionable.

Content Brief:`;

      const briefResult = await generateSection(briefPrompt, 600, 0.6);
      contentBriefContent = briefResult.trim();
      allRawText += `\n\nCONTENT BRIEF:\n${contentBriefContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Generating summary & stats... (5/5)");
      setStreamingText(allRawText + "\n\n--- Generating summary & stats... ---");

      const summaryPrompt = `Provide a quick summary for a content gap analysis in the ${niche} niche.

Gaps found: ${missingTopicsContent.slice(0, 300)}
Headings suggested: ${recommendedHeadingsContent.slice(0, 200)}
Brief: ${contentBriefContent.slice(0, 200)}

Write: an opportunity score (Low/Medium/High/Very High), estimated number of gaps found, estimated ranking impact, and a brief "Why These Gaps Matter" paragraph (2-3 sentences).

Quick Stats & Summary:`;

      const summaryResult = await generateSection(summaryPrompt, 400, 0.5);
      const summaryContent = summaryResult.trim();
      allRawText += `\n\nQUICK STATS & SUMMARY:\n${summaryContent}`;
      setStreamingText(allRawText);

      const analysis: ContentGapAnalysis = {
        id: generateId(),
        userArticle: userArticle,
        niche,
        targetKeywords,
        competitorCount,
        analysisDepth,
        focusAreas,
        missingTopics: missingTopicsContent,
        keywordGaps: keywordGapsContent,
        recommendedHeadings: recommendedHeadingsContent,
        contentBrief: contentBriefContent,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentAnalysis(analysis);
      saveAnalysis(analysis);
    } catch (err) {
      console.error("Generation error:", err);
      if (missingTopicsContent) {
        const partial: ContentGapAnalysis = {
          id: generateId(),
          userArticle: userArticle,
          niche,
          targetKeywords,
          competitorCount,
          analysisDepth,
          focusAreas,
          missingTopics: missingTopicsContent,
          keywordGaps: keywordGapsContent,
          recommendedHeadings: recommendedHeadingsContent,
          contentBrief: contentBriefContent,
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
    userArticle.trim().length > 0 &&
    competitor1.trim().length > 0 &&
    niche.trim().length > 0 &&
    focusAreas.length > 0 &&
    !isGenerating;

  const hasOutput = currentAnalysis && (currentAnalysis.missingTopics || currentAnalysis.rawText);

  const depthLabel = ANALYSIS_DEPTH_OPTIONS.find((d) => d.value === analysisDepth)?.label || analysisDepth;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-content-gap-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="user-article-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Your Article * <span className="font-normal text-slate-400">(paste your full article)</span>
            </label>
            <textarea
              id="user-article-input"
              data-testid="input-user-article"
              value={userArticle}
              onChange={(e) => setUserArticle(e.target.value.slice(0, MAX_ARTICLE_CHARS))}
              placeholder="Paste your full article or blog post here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-user-article-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {userArticle.length}/{MAX_ARTICLE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="target-keywords-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Keywords <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="target-keywords-input"
              data-testid="input-target-keywords"
              type="text"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value.slice(0, MAX_KEYWORDS_CHARS))}
              placeholder="AI tools, content gap analysis, SEO strategy..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-keywords-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {targetKeywords.length}/{MAX_KEYWORDS_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="competitor1-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Competitor 1 Article * <span className="font-normal text-slate-400">(required)</span>
            </label>
            <textarea
              id="competitor1-input"
              data-testid="input-competitor-1"
              value={competitor1}
              onChange={(e) => setCompetitor1(e.target.value.slice(0, MAX_ARTICLE_CHARS))}
              placeholder="Paste the full competitor article here..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-competitor1-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {competitor1.length}/{MAX_ARTICLE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="competitor2-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Competitor 2 Article <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="competitor2-input"
              data-testid="input-competitor-2"
              value={competitor2}
              onChange={(e) => setCompetitor2(e.target.value.slice(0, MAX_ARTICLE_CHARS))}
              placeholder="Paste a second competitor article here..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-competitor2-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {competitor2.length}/{MAX_ARTICLE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="competitor3-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Competitor 3 Article <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="competitor3-input"
              data-testid="input-competitor-3"
              value={competitor3}
              onChange={(e) => setCompetitor3(e.target.value.slice(0, MAX_ARTICLE_CHARS))}
              placeholder="Paste a third competitor article here..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-competitor3-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {competitor3.length}/{MAX_ARTICLE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="niche-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Niche / Industry *
            </label>
            <input
              id="niche-input"
              data-testid="input-niche"
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value.slice(0, MAX_NICHE_CHARS))}
              placeholder="e.g., AI tools, digital marketing, fitness, SaaS"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-niche-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {niche.length}/{MAX_NICHE_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Analysis Depth</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-testid="container-depth-options">
              {ANALYSIS_DEPTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-depth-${opt.value}`}
                  onClick={() => setAnalysisDepth(opt.value)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                    analysisDepth === opt.value
                      ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"
                  )}
                >
                  <span className="block font-semibold">{opt.label}</span>
                  <span className="block text-xs opacity-70 mt-0.5">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Focus Areas * <span className="font-normal text-slate-400">(select at least 1)</span></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="container-focus-areas">
              {FOCUS_AREA_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-focus-${opt.value}`}
                    onClick={() => toggleFocusArea(opt.value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      focusAreas.includes(opt.value)
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
                <><Loader2 className="w-5 h-5 animate-spin" />Analyzing content gaps...</>
              ) : (
                <><Search className="w-5 h-5" />Analyze Content Gaps (Privately)</>
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
              {generationProgress || "Analyzing content gaps... 100% in-browser"}
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
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Content Gap Analysis</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {niche} — {competitorCount} competitor{competitorCount !== 1 ? "s" : ""} — {depthLabel}
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
            <div data-testid="stat-niche" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Brain className="w-3.5 h-3.5" /> {niche}
            </div>
            <div data-testid="stat-competitors" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <TrendingUp className="w-3.5 h-3.5" /> {competitorCount} competitor{competitorCount !== 1 ? "s" : ""} analyzed
            </div>
            <div data-testid="stat-depth" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Search className="w-3.5 h-3.5" /> {depthLabel}
            </div>
            <div data-testid="stat-focus-areas" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ClipboardList className="w-3.5 h-3.5" /> {focusAreas.length} focus area{focusAreas.length !== 1 ? "s" : ""}
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {currentAnalysis.missingTopics && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-missing-topics">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-rose-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-missing-topics">Missing Topics</h3>
                </div>
                <button
                  data-testid="button-copy-missing-topics"
                  onClick={() => copyToClipboard(currentAnalysis.missingTopics, "missing-topics")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "missing-topics" ? "bg-emerald-100 text-emerald-700" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  )}
                >
                  {copiedId === "missing-topics" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "missing-topics" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-rose-50/50 border border-rose-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-missing-topics">
                  {currentAnalysis.missingTopics}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.keywordGaps && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-keyword-gaps">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-keyword-gaps">Keyword & Semantic Gaps</h3>
                </div>
                <button
                  data-testid="button-copy-keyword-gaps"
                  onClick={() => copyToClipboard(currentAnalysis.keywordGaps, "keyword-gaps")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "keyword-gaps" ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  )}
                >
                  {copiedId === "keyword-gaps" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "keyword-gaps" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-keyword-gaps">
                  {currentAnalysis.keywordGaps}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.recommendedHeadings && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-recommended-headings">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-recommended-headings">Recommended Headings & Structure</h3>
                </div>
                <button
                  data-testid="button-copy-headings"
                  onClick={() => copyToClipboard(currentAnalysis.recommendedHeadings, "headings")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "headings" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "headings" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "headings" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-recommended-headings">
                  {currentAnalysis.recommendedHeadings}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.contentBrief && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-content-brief">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-green-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-content-brief">Content Brief</h3>
                </div>
                <button
                  data-testid="button-copy-brief"
                  onClick={() => copyToClipboard(currentAnalysis.contentBrief, "brief")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "brief" ? "bg-emerald-100 text-emerald-700" : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}
                >
                  {copiedId === "brief" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "brief" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-green-50/50 border border-green-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-content-brief">
                  {currentAnalysis.contentBrief}
                </p>
              </div>
            </div>
          )}

          {currentAnalysis.rawText.includes("QUICK STATS & SUMMARY:") && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-quick-summary">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-quick-summary">Quick Stats & Summary</h3>
                </div>
                <button
                  data-testid="button-copy-summary"
                  onClick={() => {
                    const summaryText = currentAnalysis.rawText.split("QUICK STATS & SUMMARY:\n")[1] || "";
                    copyToClipboard(summaryText.trim(), "summary");
                  }}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "summary" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "summary" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "summary" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-quick-summary">
                  {currentAnalysis.rawText.split("QUICK STATS & SUMMARY:\n")[1]?.trim() || ""}
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
