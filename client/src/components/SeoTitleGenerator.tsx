import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck,
  ChevronDown, ChevronUp, Tag,
  FileText, ShoppingBag, Video, Target, FolderOpen, Building2,
  List, HelpCircle, BookOpen, Zap, Hash, Lightbulb, Scale,
  BarChart3, Sparkles, TrendingUp
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useSeoTitleStorage,
  type SeoTitle,
} from "@/hooks/use-seo-title-storage";

const CONTENT_TYPE_OPTIONS = [
  { value: "blog-post", label: "Blog Post", icon: FileText },
  { value: "product-page", label: "Product Page", icon: ShoppingBag },
  { value: "youtube-video", label: "YouTube Video", icon: Video },
  { value: "landing-page", label: "Landing Page", icon: Target },
  { value: "category-page", label: "Category Page", icon: FolderOpen },
  { value: "about-page", label: "About Page", icon: Building2 },
];

const TITLE_STYLE_OPTIONS = [
  { value: "list", label: "List Style", description: "10 Best..., 7 Ways to...", icon: List },
  { value: "question", label: "Question Style", description: "How to..., What is...", icon: HelpCircle },
  { value: "how-to", label: "How-To Guide", description: "Complete guide to...", icon: BookOpen },
  { value: "power-words", label: "Power Words", description: "Ultimate, Essential, Proven", icon: Zap },
  { value: "number-based", label: "Number-Based", description: "2026 Guide, Under $50", icon: Hash },
  { value: "problem-solution", label: "Problem/Solution", description: "Stop X, Start Y", icon: Lightbulb },
  { value: "comparison", label: "Comparison", description: "X vs Y, Best alternatives", icon: Scale },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "authoritative", label: "Authoritative" },
  { value: "friendly", label: "Friendly" },
  { value: "urgent", label: "Urgent" },
  { value: "educational", label: "Educational" },
];

const MAX_TOPIC_CHARS = 500;
const MAX_KEYWORD_CHARS = 100;
const MAX_SECONDARY_CHARS = 150;
const MAX_AUDIENCE_CHARS = 50;
const MAX_BRAND_CHARS = 100;
const MAX_LOCATION_CHARS = 100;
const MAX_SPECIAL_CHARS = 200;

const SYSTEM_PROMPT = `You are an expert SEO copywriter specializing in title tags and headlines. You create compelling, click-worthy SEO titles that are optimized for search engines and drive high click-through rates. Always follow the exact format requested.`;

function getCharCountColor(count: number): string {
  if (count >= 50 && count <= 60) return "text-emerald-600";
  if ((count >= 45 && count < 50) || (count > 60 && count <= 65)) return "text-amber-600";
  return "text-red-600";
}

function getCharCountBg(count: number): string {
  if (count >= 50 && count <= 60) return "bg-emerald-50 border-emerald-200";
  if ((count >= 45 && count < 50) || (count > 60 && count <= 65)) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function parseTitles(text: string): string[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const titles: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^\d+[\.\)\-:\s]+/, "").replace(/^["']|["']$/g, "").trim();
    if (cleaned.length >= 15 && cleaned.length <= 150) {
      titles.push(cleaned);
    }
  }
  return titles.slice(0, 10);
}

function getStyleLabel(index: number, selectedStyles: string[]): string {
  if (index < selectedStyles.length) {
    const style = TITLE_STYLE_OPTIONS.find((s) => s.value === selectedStyles[index]);
    if (style) return style.label;
  }
  const allLabels = selectedStyles.map((s) => TITLE_STYLE_OPTIONS.find((o) => o.value === s)?.label || s);
  return allLabels[index % allLabels.length] || "Mixed";
}

function extractScores(analysisText: string): number[] {
  const scores: number[] = [];
  const regex = /(\d+(?:\.\d+)?)\s*\/\s*10/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(analysisText)) !== null) {
    scores.push(parseFloat(m[1]));
  }
  return scores;
}

function countPowerWords(titles: string[]): number {
  const powerWords = ["ultimate", "essential", "proven", "best", "top", "powerful", "complete", "definitive", "guaranteed", "incredible", "amazing", "secret", "expert", "exclusive", "free", "instant", "easy", "simple", "fast", "quick"];
  const allText = titles.join(" ").toLowerCase();
  return powerWords.filter((w) => allText.includes(w)).length;
}

export function SeoTitleGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveTitle } = useSeoTitleStorage();

  const [topic, setTopic] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [contentType, setContentType] = useState("blog-post");
  const [titleStyles, setTitleStyles] = useState<string[]>(["list", "question", "how-to"]);
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("");

  const [includeYear, setIncludeYear] = useState(true);
  const [includeBrand, setIncludeBrand] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [includeLocation, setIncludeLocation] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [generationProgress, setGenerationProgress] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [analysisText, setAnalysisText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleReset = () => {
    setTopic("");
    setTargetKeyword("");
    setSecondaryKeywords("");
    setContentType("blog-post");
    setTitleStyles(["list", "question", "how-to"]);
    setTone("professional");
    setTargetAudience("");
    setIncludeYear(true);
    setIncludeBrand(false);
    setBrandName("");
    setIncludeLocation(false);
    setLocationName("");
    setSpecialRequirements("");
    setShowAdvanced(false);
    setStreamingText("");
    setGenerationProgress("");
    setTitles([]);
    setAnalysisText("");
    setCopiedId(null);
  };

  const toggleStyle = (value: string) => {
    setTitleStyles((prev) => {
      if (prev.includes(value)) {
        if (prev.length <= 1) return prev;
        return prev.filter((s) => s !== value);
      }
      return [...prev, value];
    });
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
    if (!topic.trim() || !targetKeyword.trim() || titleStyles.length === 0) return;

    setIsGenerating(true);
    setStreamingText("");
    setTitles([]);
    setAnalysisText("");
    setGenerationProgress("");

    const contentTypeLabel = CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.label || contentType;
    const toneLabel = TONE_OPTIONS.find((t) => t.value === tone)?.label || tone;
    const stylesLabels = titleStyles.map((s) => TITLE_STYLE_OPTIONS.find((o) => o.value === s)?.label || s).join(", ");

    const advancedNotes: string[] = [];
    if (includeYear) advancedNotes.push("Include the current year (2026) in at least 2 titles");
    if (includeBrand && brandName.trim()) advancedNotes.push(`Include brand name "${brandName.trim()}" in at least 1 title`);
    if (includeLocation && locationName.trim()) advancedNotes.push(`Include location "${locationName.trim()}" in at least 1 title`);
    if (targetAudience.trim()) advancedNotes.push(`Target audience: ${targetAudience.trim()}`);
    if (secondaryKeywords.trim()) advancedNotes.push(`Also consider secondary keywords: ${secondaryKeywords.trim()}`);
    if (specialRequirements.trim()) advancedNotes.push(`Special requirements: ${specialRequirements.trim()}`);

    const advancedContext = advancedNotes.length > 0 ? `\nAdditional requirements:\n${advancedNotes.map((n) => `- ${n}`).join("\n")}` : "";

    let allRawText = "";
    let parsedTitles: string[] = [];
    let analysisContent = "";

    try {
      setGenerationProgress("Generating titles... (1/2)");
      setStreamingText("--- Generating SEO title variations... ---");

      const generatePrompt = `Generate exactly 10 unique SEO title tag variations for this content:

Topic/Description: ${topic.trim()}
Target Keyword: ${targetKeyword.trim()}
Content Type: ${contentTypeLabel}
Tone: ${toneLabel}
Title Styles to mix: ${stylesLabels}
${advancedContext}

CRITICAL RULES:
1. Each title MUST be between 50-60 characters (this is crucial for SEO title tags).
2. Naturally include the target keyword "${targetKeyword.trim()}" in every title.
3. Mix the requested styles (${stylesLabels}) across the 10 titles.
4. Use power words, numbers, and emotional triggers where appropriate.
5. Each title should be unique and take a different angle.
6. Output ONLY the 10 titles, one per line, numbered 1-10.
7. Do NOT include any labels, headers, or explanations.

1.`;

      const titlesResult = await generateSection(generatePrompt, 800, 0.7);
      const trimmed = titlesResult.trim();
      const fullTitlesText = /^\d/.test(trimmed) ? trimmed : "1." + trimmed;
      parsedTitles = parseTitles(fullTitlesText);
      allRawText = `SEO TITLES:\n${fullTitlesText}`;
      setStreamingText(allRawText);
      setTitles(parsedTitles);

      setGenerationProgress("Scoring headlines... (2/2)");
      setStreamingText(allRawText + "\n\n--- Scoring headlines... ---");

      const titlesForAnalysis = parsedTitles.map((t, i) => `${i + 1}. ${t}`).join("\n");

      const analysisPrompt = `Analyze and score these 10 SEO title tags for the topic "${topic.trim()}" with target keyword "${targetKeyword.trim()}":

${titlesForAnalysis}

For EACH title (1-10), provide:
- Character count assessment (is it in the ideal 50-60 range?)
- SEO strength score (X/10)
- Click potential (high/medium/low)
- Power words used (list them)
- Brief "Why it works" explanation (1 sentence)

Format each analysis as:
Title X:
- Characters: [count] — [good/needs adjustment]
- SEO Score: [X/10]
- Click Potential: [high/medium/low]
- Power Words: [list]
- Why it works: [explanation]`;

      const analysisResult = await generateSection(analysisPrompt, 700, 0.5);
      analysisContent = analysisResult.trim();
      allRawText += `\n\nANALYSIS:\n${analysisContent}`;
      setStreamingText(allRawText);
      setAnalysisText(analysisContent);

      const optionsJson = JSON.stringify({
        includeYear,
        includeBrand,
        brandName: brandName.trim(),
        includeLocation,
        locationName: locationName.trim(),
        specialRequirements: specialRequirements.trim(),
      });

      const saved: SeoTitle = {
        id: generateId(),
        topic: topic.trim(),
        targetKeyword: targetKeyword.trim(),
        secondaryKeywords: secondaryKeywords.trim(),
        contentType,
        titleStyles: titleStyles.join(","),
        tone,
        targetAudience: targetAudience.trim(),
        options: optionsJson,
        titles: parsedTitles.join("\n---\n"),
        analysis: analysisContent,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      saveTitle(saved);
    } catch (err) {
      console.error("Generation error:", err);
      if (parsedTitles.length > 0) {
        const partial: SeoTitle = {
          id: generateId(),
          topic: topic.trim(),
          targetKeyword: targetKeyword.trim(),
          secondaryKeywords: secondaryKeywords.trim(),
          contentType,
          titleStyles: titleStyles.join(","),
          tone,
          targetAudience: targetAudience.trim(),
          options: "",
          titles: parsedTitles.join("\n---\n"),
          analysis: analysisContent,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        saveTitle(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    topic.trim().length > 0 &&
    targetKeyword.trim().length > 0 &&
    titleStyles.length > 0 &&
    !isGenerating;

  const hasOutput = titles.length > 0;

  const avgLength = titles.length > 0
    ? Math.round(titles.reduce((sum, t) => sum + t.length, 0) / titles.length)
    : 0;

  const scores = analysisText ? extractScores(analysisText) : [];
  const avgScore = scores.length > 0
    ? (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1)
    : "—";

  const powerWordsCount = titles.length > 0 ? countPowerWords(titles) : 0;

  const allTitlesText = titles.map((t, i) => `${i + 1}. ${t}`).join("\n\n");

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-seo-title-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Topic / Page Description * <span className="font-normal text-slate-400">(What is your content about?)</span>
            </label>
            <textarea
              id="topic-input"
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, MAX_TOPIC_CHARS))}
              placeholder="Describe what your page or article is about..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-y"
            />
            <span data-testid="text-topic-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {topic.length}/{MAX_TOPIC_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="target-keyword-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Keyword * <span className="font-normal text-slate-400">(Main keyword you want to rank for)</span>
            </label>
            <input
              id="target-keyword-input"
              data-testid="input-target-keyword"
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value.slice(0, MAX_KEYWORD_CHARS))}
              placeholder="e.g., AI SEO tools"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            />
            <span data-testid="text-keyword-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {targetKeyword.length}/{MAX_KEYWORD_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="secondary-keywords-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Secondary Keywords <span className="font-normal text-slate-400">(optional, comma-separated)</span>
            </label>
            <input
              id="secondary-keywords-input"
              data-testid="input-secondary-keywords"
              type="text"
              value={secondaryKeywords}
              onChange={(e) => setSecondaryKeywords(e.target.value.slice(0, MAX_SECONDARY_CHARS))}
              placeholder="e.g., free SEO tools, keyword research"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            />
            <span data-testid="text-secondary-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {secondaryKeywords.length}/{MAX_SECONDARY_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="container-content-type-options">
              {CONTENT_TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-content-type-${opt.value}`}
                    onClick={() => setContentType(opt.value)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      contentType === opt.value
                        ? "bg-violet-100 text-violet-700 border-violet-300 ring-1 ring-violet-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-violet-200"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Title Styles * <span className="font-normal text-slate-400">(select at least 1)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="container-title-style-options">
              {TITLE_STYLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = titleStyles.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    data-testid={`button-style-${opt.value}`}
                    onClick={() => toggleStyle(opt.value)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      isSelected
                        ? "bg-violet-100 text-violet-700 border-violet-300 ring-1 ring-violet-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-violet-200"
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
            <label htmlFor="tone-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tone
            </label>
            <select
              id="tone-select"
              data-testid="select-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            >
              {TONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="audience-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Audience <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="audience-input"
              data-testid="input-target-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value.slice(0, MAX_AUDIENCE_CHARS))}
              placeholder="e.g., small business owners, marketers"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            />
            <span data-testid="text-audience-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {targetAudience.length}/{MAX_AUDIENCE_CHARS}
            </span>
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
                  testId="toggle-include-year"
                  label="Include current year (2026)"
                  checked={includeYear}
                  onChange={setIncludeYear}
                />
                <ToggleOption
                  testId="toggle-include-brand"
                  label="Include brand name"
                  checked={includeBrand}
                  onChange={setIncludeBrand}
                />
                {includeBrand && (
                  <div className="ml-6">
                    <input
                      data-testid="input-brand-name"
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value.slice(0, MAX_BRAND_CHARS))}
                      placeholder="Enter your brand name..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all text-sm"
                    />
                  </div>
                )}
                <ToggleOption
                  testId="toggle-include-location"
                  label="Include location"
                  checked={includeLocation}
                  onChange={setIncludeLocation}
                />
                {includeLocation && (
                  <div className="ml-6">
                    <input
                      data-testid="input-location-name"
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value.slice(0, MAX_LOCATION_CHARS))}
                      placeholder="Enter location (e.g., New York, USA)..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all text-sm"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="special-requirements" className="block text-xs font-medium text-slate-500 mb-1">
                    Special Requirements <span className="text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="special-requirements"
                    data-testid="input-special-requirements"
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value.slice(0, MAX_SPECIAL_CHARS))}
                    placeholder="Any specific requirements for your titles..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all text-sm resize-y"
                  />
                  <span className="text-xs text-slate-400 mt-0.5 block text-right">
                    {specialRequirements.length}/{MAX_SPECIAL_CHARS}
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
                  ? "bg-gradient-primary shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Generating SEO titles...</>
              ) : (
                <><Tag className="w-5 h-5" />Generate SEO Titles (Privately)</>
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
            <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
            <span className="text-sm font-medium text-violet-600" data-testid="text-generation-progress">
              {generationProgress || "Generating SEO titles... 100% in-browser"}
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
              <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">SEO Title Variations</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {TONE_OPTIONS.find((t) => t.value === tone)?.label} tone — {CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.label}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(allTitlesText, "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-violet-100 text-violet-700" : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-avg-score" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <BarChart3 className="w-3.5 h-3.5" /> Avg Score: {avgScore}/10
            </div>
            <div data-testid="stat-avg-length" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Target className="w-3.5 h-3.5" /> Avg Length: {avgLength} chars
            </div>
            <div data-testid="stat-power-words" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Zap className="w-3.5 h-3.5" /> {powerWordsCount} Power Words
            </div>
            <div data-testid="stat-total" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Sparkles className="w-3.5 h-3.5" /> {titles.length} Variations
            </div>
          </div>

          {titles.map((title, i) => {
            const charCount = title.length;
            const styleLabel = getStyleLabel(i, titleStyles);
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6"
                data-testid={`container-title-${i}`}
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700" data-testid={`text-label-${i}`}>
                      #{i + 1} {styleLabel}
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
                      onClick={() => copyToClipboard(title, `title-${i}`)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                        copiedId === `title-${i}` ? "bg-violet-100 text-violet-700" : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                      )}
                    >
                      {copiedId === `title-${i}` ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === `title-${i}` ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className="rounded-xl bg-violet-50/50 border border-violet-100 p-4">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium" data-testid={`text-title-${i}`}>
                    {title}
                  </p>
                </div>
              </div>
            );
          })}

          {analysisText && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-analysis">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-analysis">Analysis & Scoring</h3>
                </div>
                <button
                  data-testid="button-copy-analysis"
                  onClick={() => copyToClipboard(analysisText, "analysis")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "analysis" ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "analysis" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "analysis" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
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
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-violet-200 text-violet-700 font-medium hover:bg-violet-50 transition-colors"
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
          checked ? "bg-violet-500" : "bg-slate-300"
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
    <div className="mb-6 p-4 rounded-xl bg-violet-50 border border-violet-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
        <span className="text-sm font-medium text-violet-700" data-testid="text-engine-status">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-violet-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}
