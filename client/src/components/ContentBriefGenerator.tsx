import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, Search,
  FileText, BookOpen, List, ListChecks, Scale,
  Target, ChevronDown, ChevronUp,
  BarChart3, HelpCircle, Pen, Users,
  Compass, Layers, Award
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useContentBriefStorage,
  type ContentBrief,
} from "@/hooks/use-content-brief-storage";

const CONTENT_TYPE_OPTIONS = [
  { value: "blog-post", label: "Blog Post", icon: FileText },
  { value: "ultimate-guide", label: "Ultimate Guide", icon: BookOpen },
  { value: "listicle", label: "Listicle", icon: List },
  { value: "how-to-guide", label: "How-To Guide", icon: ListChecks },
  { value: "comparison-review", label: "Comparison/Review", icon: Scale },
  { value: "landing-page", label: "Landing Page", icon: Target },
  { value: "news-article", label: "News Article", icon: FileText },
];

const SEARCH_INTENT_OPTIONS = [
  { value: "informational", label: "Informational" },
  { value: "commercial", label: "Commercial" },
  { value: "transactional", label: "Transactional" },
  { value: "navigational", label: "Navigational" },
];

const CONTENT_DEPTH_OPTIONS = [
  { value: "beginner", label: "Beginner", description: "Simple and accessible" },
  { value: "intermediate", label: "Intermediate", description: "Balanced depth" },
  { value: "advanced", label: "Advanced", description: "Expert-level detail" },
  { value: "mixed", label: "Mixed", description: "All skill levels" },
];

const TONE_VOICE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "authoritative", label: "Authoritative" },
  { value: "friendly", label: "Friendly" },
  { value: "educational", label: "Educational" },
  { value: "persuasive", label: "Persuasive" },
];

const CONTENT_TYPE_INTENT_MAP: Record<string, string> = {
  "blog-post": "informational",
  "ultimate-guide": "informational",
  "listicle": "informational",
  "how-to-guide": "informational",
  "comparison-review": "commercial",
  "landing-page": "transactional",
  "news-article": "informational",
};

const MAX_PRIMARY_KEYWORD_CHARS = 200;
const MAX_ADDITIONAL_KEYWORDS_CHARS = 300;
const MAX_TARGET_AUDIENCE_CHARS = 100;
const MAX_COMPETITOR_URLS_CHARS = 1000;
const MAX_BRAND_VOICE_CHARS = 500;
const MAX_COMPANY_NAME_CHARS = 100;
const MAX_CUSTOM_INSTRUCTIONS_CHARS = 300;

const SYSTEM_PROMPT = `You are an expert SEO content strategist and content brief specialist. Create comprehensive, actionable content briefs that help writers produce high-ranking content. Be specific, data-driven, and provide clear guidance. Write exactly the section requested.`;

export function ContentBriefGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveBrief } = useContentBriefStorage();

  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [additionalKeywords, setAdditionalKeywords] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [contentType, setContentType] = useState("blog-post");
  const [searchIntent, setSearchIntent] = useState("informational");
  const [wordCount, setWordCount] = useState(2000);
  const [contentDepth, setContentDepth] = useState("intermediate");
  const [toneVoice, setToneVoice] = useState<string[]>(["professional", "conversational"]);
  const [competitorUrls, setCompetitorUrls] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [includeFaq, setIncludeFaq] = useState(true);
  const [includeInternalLinking, setIncludeInternalLinking] = useState(true);
  const [includeKeywordDensity, setIncludeKeywordDensity] = useState(true);
  const [includeMetaDescription, setIncludeMetaDescription] = useState(true);
  const [includeTitleTags, setIncludeTitleTags] = useState(true);
  const [includeImageSuggestions, setIncludeImageSuggestions] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentBrief, setCurrentBrief] = useState<ContentBrief | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleToneVoice = (value: string) => {
    setToneVoice((prev) => {
      if (prev.includes(value)) {
        const updated = prev.filter((v) => v !== value);
        return updated.length === 0 ? prev : updated;
      }
      return [...prev, value];
    });
  };

  const handleContentTypeChange = (value: string) => {
    setContentType(value);
    const autoIntent = CONTENT_TYPE_INTENT_MAP[value];
    if (autoIntent) setSearchIntent(autoIntent);
  };

  const handleReset = () => {
    setPrimaryKeyword("");
    setAdditionalKeywords("");
    setTargetAudience("");
    setContentType("blog-post");
    setSearchIntent("informational");
    setWordCount(2000);
    setContentDepth("intermediate");
    setToneVoice(["professional", "conversational"]);
    setCompetitorUrls("");
    setBrandVoice("");
    setCompanyName("");
    setIncludeFaq(true);
    setIncludeInternalLinking(true);
    setIncludeKeywordDensity(true);
    setIncludeMetaDescription(true);
    setIncludeTitleTags(true);
    setIncludeImageSuggestions(false);
    setCustomInstructions("");
    setShowAdvanced(false);
    setStreamingText("");
    setCurrentBrief(null);
    setCopiedId(null);
    setGenerationProgress("");
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const copyAsMarkdown = async () => {
    if (!currentBrief) return;
    const md = `# Content Brief: ${currentBrief.primaryKeyword}\n\n## Overview\n${currentBrief.overview}\n\n## Content Structure\n${currentBrief.structure}\n\n## Keywords\n${currentBrief.keywords}\n\n## Questions & Angles\n${currentBrief.questions}\n\n## Writer Guidelines\n${currentBrief.guidance}`;
    await copyToClipboard(md, "markdown");
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
    if (!primaryKeyword.trim() || !targetAudience.trim()) return;

    setIsGenerating(true);
    setStreamingText("");
    setCurrentBrief(null);
    setGenerationProgress("");

    const contentTypeLabel = CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.label || contentType;
    const depthLabel = CONTENT_DEPTH_OPTIONS.find((d) => d.value === contentDepth)?.label || contentDepth;
    const toneLabels = toneVoice.map((t) => TONE_VOICE_OPTIONS.find((o) => o.value === t)?.label || t).join(", ");
    const additionalKwContext = additionalKeywords.trim() ? `Additional keywords: ${additionalKeywords.trim()}` : "";
    const competitorContext = competitorUrls.trim() ? `Competitor URLs/content to consider: ${competitorUrls.trim()}` : "";
    const brandContext = brandVoice.trim() ? `Brand voice guidelines: ${brandVoice.trim()}` : "";
    const companyContext = companyName.trim() ? `Company/Product: ${companyName.trim()}` : "";
    const customContext = customInstructions.trim() ? `Custom instructions: ${customInstructions.trim()}` : "";

    const advancedOptions: string[] = [];
    if (includeFaq) advancedOptions.push("Include FAQ section suggestions");
    if (includeInternalLinking) advancedOptions.push("Include internal linking opportunities");
    if (includeKeywordDensity) advancedOptions.push("Include keyword density recommendations");
    if (includeMetaDescription) advancedOptions.push("Include meta description template");
    if (includeTitleTags) advancedOptions.push("Include title tag suggestions");
    if (includeImageSuggestions) advancedOptions.push("Include image/visual suggestions");
    const advancedContext = advancedOptions.length > 0 ? `Requirements: ${advancedOptions.join(", ")}` : "";

    const optionsJson = JSON.stringify({
      includeFaq, includeInternalLinking, includeKeywordDensity,
      includeMetaDescription, includeTitleTags, includeImageSuggestions,
      customInstructions: customInstructions.trim(),
    });

    let allRawText = "";
    let overviewContent = "";
    let structureContent = "";
    let keywordsContent = "";
    let questionsContent = "";
    let guidanceContent = "";

    try {
      setGenerationProgress("Analyzing keyword & intent... (1/4)");
      setStreamingText("--- Analyzing keyword & intent... ---");

      const overviewPrompt = `Create the OVERVIEW section of a content brief for:

Primary Keyword: "${primaryKeyword.trim()}"
${additionalKwContext}
Target Audience: ${targetAudience.trim()}
Content Type: ${contentTypeLabel}
Search Intent: ${searchIntent}
Target Word Count: ${wordCount}
Content Depth: ${depthLabel}
Tone: ${toneLabels}
${competitorContext}
${companyContext}

Provide:
1. PRIMARY KEYWORD ANALYSIS: Search intent classification, keyword difficulty estimate (Low/Medium/High), and why this keyword matters
2. TARGET AUDIENCE PROFILE: Who the reader is, their pain points, and what they need from this content
3. CONTENT TYPE & FORMAT: Why ${contentTypeLabel} is the right format, and how to approach it
4. RECOMMENDED WORD COUNT: ${wordCount} words justification and how to distribute across sections
5. KEY TAKEAWAY: The single most important message the reader should walk away with

Format with clear labels.`;

      const overviewResult = await generateSection(overviewPrompt, 600, 0.5);
      overviewContent = overviewResult.trim();
      allRawText = `CONTENT OVERVIEW:\n${overviewContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Building content structure... (2/4)");
      setStreamingText(allRawText + "\n\n--- Building content structure... ---");

      const structurePrompt = `Create the CONTENT STRUCTURE section for a ${contentTypeLabel} about "${primaryKeyword.trim()}".

Context from overview: ${overviewContent.slice(0, 400)}
Target Audience: ${targetAudience.trim()}
Word Count: ${wordCount}
Content Depth: ${depthLabel}
${additionalKwContext}

Build a complete article outline with:
1. H1 TITLE: One compelling, SEO-optimized title
2. H2 SECTIONS: 5-8 main sections with H2 headings
3. H3 SUBSECTIONS: 2-3 H3 headings under each H2 where appropriate
4. SECTION GUIDANCE: For each H2, provide a brief (1-2 sentence) description of what to cover and approximate word count
${includeFaq ? "5. FAQ SECTION: Include an FAQ section outline with 5-6 questions" : ""}

Format as a clear hierarchical outline using H1:, H2:, H3: prefixes.`;

      const structureResult = await generateSection(structurePrompt, 800, 0.6);
      structureContent = structureResult.trim();
      allRawText += `\n\nCONTENT STRUCTURE:\n${structureContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Generating questions & angles... (3/4)");
      setStreamingText(allRawText + "\n\n--- Generating questions & angles... ---");

      const questionsPrompt = `Generate the QUESTIONS & ANGLES section for a ${contentTypeLabel} about "${primaryKeyword.trim()}".

Structure context: ${structureContent.slice(0, 400)}
Target Audience: ${targetAudience.trim()}
Search Intent: ${searchIntent}
${competitorContext}

Provide:
1. KEY QUESTIONS TO ANSWER: 8-10 specific questions the content must answer to satisfy search intent
2. UNIQUE ANGLES: 3-4 unique perspectives or hooks that differentiate this content from competitors
3. COMPETITOR GAPS: What existing content typically misses on this topic
${includeFaq ? "4. FAQ SUGGESTIONS: 5-6 \"People Also Ask\" style questions with brief answer guidance" : ""}

Be specific and actionable.`;

      const questionsResult = await generateSection(questionsPrompt, 600, 0.6);
      questionsContent = questionsResult.trim();
      allRawText += `\n\nQUESTIONS & ANGLES:\n${questionsContent}`;
      setStreamingText(allRawText);

      setGenerationProgress("Creating writer guidelines... (4/4)");
      setStreamingText(allRawText + "\n\n--- Creating writer guidelines... ---");

      const guidancePrompt = `Create the WRITER GUIDELINES section for a ${contentTypeLabel} about "${primaryKeyword.trim()}".

Overview: ${overviewContent.slice(0, 300)}
Structure: ${structureContent.slice(0, 300)}
Questions: ${questionsContent.slice(0, 200)}
Tone: ${toneLabels}
${brandContext}
${advancedContext}
${customContext}

Provide:
1. TONE & STYLE GUIDE: How to write this piece (voice, perspective, reading level)
2. DO'S AND DON'TS: 4-5 specific writing do's and don'ts for this topic
${includeKeywordDensity ? "3. KEYWORD PLACEMENT: Where to place the primary keyword and recommended density" : ""}
${includeMetaDescription ? "4. META DESCRIPTION TEMPLATE: One 150-160 character meta description template" : ""}
${includeTitleTags ? "5. TITLE TAG SUGGESTIONS: 3 SEO-optimized title tag variations (under 60 characters)" : ""}
${includeInternalLinking ? "6. INTERNAL LINKING: Suggested internal linking opportunities and anchor text ideas" : ""}
${includeImageSuggestions ? "7. IMAGE SUGGESTIONS: Types of images, infographics, or visuals to include" : ""}

Be concise and actionable.`;

      const guidanceResult = await generateSection(guidancePrompt, 600, 0.5);
      guidanceContent = guidanceResult.trim();
      allRawText += `\n\nWRITER GUIDELINES:\n${guidanceContent}`;
      setStreamingText(allRawText);

      const keywordsSection = `Primary: ${primaryKeyword.trim()}${additionalKeywords.trim() ? `\nAdditional: ${additionalKeywords.trim()}` : ""}\nExtracted from structure and questions above.`;

      const brief: ContentBrief = {
        id: generateId(),
        primaryKeyword: primaryKeyword.trim(),
        additionalKeywords: additionalKeywords.trim(),
        targetAudience: targetAudience.trim(),
        contentType,
        searchIntent,
        wordCount,
        contentDepth,
        toneVoice: toneVoice.join(","),
        competitorUrls: competitorUrls.trim(),
        brandVoice: brandVoice.trim(),
        companyName: companyName.trim(),
        options: optionsJson,
        overview: overviewContent,
        structure: structureContent,
        keywords: keywordsSection,
        questions: questionsContent,
        guidance: guidanceContent,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentBrief(brief);
      saveBrief(brief);
    } catch (err) {
      console.error("Generation error:", err);
      if (overviewContent) {
        const partial: ContentBrief = {
          id: generateId(),
          primaryKeyword: primaryKeyword.trim(),
          additionalKeywords: additionalKeywords.trim(),
          targetAudience: targetAudience.trim(),
          contentType,
          searchIntent,
          wordCount,
          contentDepth,
          toneVoice: toneVoice.join(","),
          competitorUrls: competitorUrls.trim(),
          brandVoice: brandVoice.trim(),
          companyName: companyName.trim(),
          options: optionsJson,
          overview: overviewContent,
          structure: structureContent,
          keywords: "",
          questions: questionsContent,
          guidance: guidanceContent,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCurrentBrief(partial);
        saveBrief(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    primaryKeyword.trim().length > 0 &&
    targetAudience.trim().length > 0 &&
    !isGenerating;

  const hasOutput = currentBrief && (currentBrief.overview || currentBrief.rawText);

  const contentTypeLabel = CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.label || contentType;
  const depthLabel = CONTENT_DEPTH_OPTIONS.find((d) => d.value === contentDepth)?.label || contentDepth;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-content-brief-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="primary-keyword-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Primary Keyword / Topic * <span className="font-normal text-slate-400">(what is this content about?)</span>
            </label>
            <input
              id="primary-keyword-input"
              data-testid="input-primary-keyword"
              type="text"
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value.slice(0, MAX_PRIMARY_KEYWORD_CHARS))}
              placeholder="e.g., best project management tools 2026, how to start a blog"
              className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-primary-keyword-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {primaryKeyword.length}/{MAX_PRIMARY_KEYWORD_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="additional-keywords-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Additional Keywords <span className="font-normal text-slate-400">(optional, comma-separated)</span>
            </label>
            <textarea
              id="additional-keywords-input"
              data-testid="input-additional-keywords"
              value={additionalKeywords}
              onChange={(e) => setAdditionalKeywords(e.target.value.slice(0, MAX_ADDITIONAL_KEYWORDS_CHARS))}
              placeholder="project management software, task management, team collaboration..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-additional-keywords-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {additionalKeywords.length}/{MAX_ADDITIONAL_KEYWORDS_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="target-audience-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Audience *
            </label>
            <input
              id="target-audience-input"
              data-testid="input-target-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value.slice(0, MAX_TARGET_AUDIENCE_CHARS))}
              placeholder="e.g., small business owners, marketing professionals, beginners"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-target-audience-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {targetAudience.length}/{MAX_TARGET_AUDIENCE_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="container-content-type-options">
              {CONTENT_TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-content-type-${opt.value}`}
                    onClick={() => handleContentTypeChange(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium border transition-all text-center",
                      contentType === opt.value
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search Intent</label>
            <div className="flex flex-wrap gap-2" data-testid="container-search-intent-options">
              {SEARCH_INTENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-intent-${opt.value}`}
                  onClick={() => setSearchIntent(opt.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    searchIntent === opt.value
                      ? "bg-blue-100 text-blue-700 border-blue-300 ring-1 ring-blue-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="word-count-slider" className="block text-sm font-semibold text-slate-700 mb-2">
              Word Count: <span className="text-emerald-600" data-testid="text-word-count-value">{wordCount.toLocaleString()}</span>
            </label>
            <input
              id="word-count-slider"
              data-testid="input-word-count"
              type="range"
              min={500}
              max={5000}
              step={500}
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>500</span>
              <span>5,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content Depth</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="container-content-depth-options">
              {CONTENT_DEPTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-depth-${opt.value}`}
                  onClick={() => setContentDepth(opt.value)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                    contentDepth === opt.value
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tone / Voice <span className="font-normal text-slate-400">(select multiple)</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="container-tone-voice-options">
              {TONE_VOICE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  data-testid={`button-tone-${opt.value}`}
                  onClick={() => toggleToneVoice(opt.value)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium border transition-all text-center",
                    toneVoice.includes(opt.value)
                      ? "bg-violet-100 text-violet-700 border-violet-300 ring-1 ring-violet-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-violet-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="competitor-urls-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Competitor URLs <span className="font-normal text-slate-400">(optional — paste URLs of top-ranking content)</span>
            </label>
            <textarea
              id="competitor-urls-input"
              data-testid="input-competitor-urls"
              value={competitorUrls}
              onChange={(e) => setCompetitorUrls(e.target.value.slice(0, MAX_COMPETITOR_URLS_CHARS))}
              placeholder="https://example.com/article-1&#10;https://example.com/article-2"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-competitor-urls-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {competitorUrls.length}/{MAX_COMPETITOR_URLS_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="brand-voice-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Brand Voice <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="brand-voice-input"
              data-testid="input-brand-voice"
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value.slice(0, MAX_BRAND_VOICE_CHARS))}
              placeholder="Describe your brand's voice and style guidelines..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-brand-voice-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {brandVoice.length}/{MAX_BRAND_VOICE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="company-name-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Company / Product Name <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="company-name-input"
              data-testid="input-company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value.slice(0, MAX_COMPANY_NAME_CHARS))}
              placeholder="e.g., Acme Corp, ToolX"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-company-name-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {companyName.length}/{MAX_COMPANY_NAME_CHARS}
            </span>
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 space-y-3 pl-2 border-l-2 border-slate-100"
                data-testid="container-advanced-options"
              >
                <ToggleOption
                  testId="toggle-faq"
                  label="Include FAQ section"
                  checked={includeFaq}
                  onChange={setIncludeFaq}
                />
                <ToggleOption
                  testId="toggle-internal-linking"
                  label="Include internal linking suggestions"
                  checked={includeInternalLinking}
                  onChange={setIncludeInternalLinking}
                />
                <ToggleOption
                  testId="toggle-keyword-density"
                  label="Include keyword density recommendations"
                  checked={includeKeywordDensity}
                  onChange={setIncludeKeywordDensity}
                />
                <ToggleOption
                  testId="toggle-meta-description"
                  label="Include meta description template"
                  checked={includeMetaDescription}
                  onChange={setIncludeMetaDescription}
                />
                <ToggleOption
                  testId="toggle-title-tags"
                  label="Include title tag suggestions"
                  checked={includeTitleTags}
                  onChange={setIncludeTitleTags}
                />
                <ToggleOption
                  testId="toggle-image-suggestions"
                  label="Include image suggestions"
                  checked={includeImageSuggestions}
                  onChange={setIncludeImageSuggestions}
                />
                <div>
                  <label htmlFor="custom-instructions-input" className="block text-sm font-medium text-slate-600 mb-1">
                    Custom Instructions <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="custom-instructions-input"
                    data-testid="input-custom-instructions"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value.slice(0, MAX_CUSTOM_INSTRUCTIONS_CHARS))}
                    placeholder="Any specific requirements or preferences..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
                  />
                  <span data-testid="text-custom-instructions-char-count" className="text-xs text-slate-400 mt-1 block text-right">
                    {customInstructions.length}/{MAX_CUSTOM_INSTRUCTIONS_CHARS}
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
                <><Loader2 className="w-5 h-5 animate-spin" />Generating content brief...</>
              ) : (
                <><FileText className="w-5 h-5" />Generate Content Brief (Privately)</>
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
              {generationProgress || "Generating content brief... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentBrief && !isGenerating && hasOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Content Brief</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                "{currentBrief.primaryKeyword}" — {contentTypeLabel} — {wordCount.toLocaleString()} words — {depthLabel}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(currentBrief.rawText, "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
              <button
                data-testid="button-copy-markdown"
                onClick={copyAsMarkdown}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "markdown" ? "bg-emerald-100 text-emerald-700" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                )}
              >
                {copiedId === "markdown" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "markdown" ? "Copied!" : "Copy as Markdown"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-keyword" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-semibold">
              <Search className="w-3.5 h-3.5" /> {currentBrief.primaryKeyword}
            </div>
            <div data-testid="stat-content-type" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <FileText className="w-3.5 h-3.5" /> {contentTypeLabel}
            </div>
            <div data-testid="stat-word-count" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Layers className="w-3.5 h-3.5" /> {wordCount.toLocaleString()} words
            </div>
            <div data-testid="stat-intent" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Target className="w-3.5 h-3.5" /> {searchIntent}
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {currentBrief.overview && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-overview">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-slate-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-overview">Overview</h3>
                </div>
                <button
                  data-testid="button-copy-overview"
                  onClick={() => copyToClipboard(currentBrief.overview, "overview")}
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
                  {currentBrief.overview}
                </p>
              </div>
            </div>
          )}

          {currentBrief.structure && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-structure">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-structure">Content Structure</h3>
                </div>
                <button
                  data-testid="button-copy-structure"
                  onClick={() => copyToClipboard(currentBrief.structure, "structure")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "structure" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "structure" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "structure" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-structure">
                  {currentBrief.structure}
                </p>
              </div>
            </div>
          )}

          {currentBrief.keywords && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-keywords">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-keywords">Keywords</h3>
                </div>
                <button
                  data-testid="button-copy-keywords"
                  onClick={() => copyToClipboard(currentBrief.keywords, "keywords")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "keywords" ? "bg-emerald-100 text-emerald-700" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  )}
                >
                  {copiedId === "keywords" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "keywords" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-keywords">
                  {currentBrief.keywords}
                </p>
              </div>
            </div>
          )}

          {currentBrief.questions && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-questions">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-questions">Questions & Angles</h3>
                </div>
                <button
                  data-testid="button-copy-questions"
                  onClick={() => copyToClipboard(currentBrief.questions, "questions")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "questions" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  )}
                >
                  {copiedId === "questions" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "questions" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-questions">
                  {currentBrief.questions}
                </p>
              </div>
            </div>
          )}

          {currentBrief.guidance && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-guidance">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Pen className="w-5 h-5 text-green-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-guidance">Writer Guidelines</h3>
                </div>
                <button
                  data-testid="button-copy-guidance"
                  onClick={() => copyToClipboard(currentBrief.guidance, "guidance")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "guidance" ? "bg-emerald-100 text-emerald-700" : "bg-green-50 text-green-700 hover:bg-green-100"
                  )}
                >
                  {copiedId === "guidance" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "guidance" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-green-50/50 border border-green-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-guidance">
                  {currentBrief.guidance}
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
