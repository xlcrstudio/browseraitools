import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  Copy, Heart, RotateCcw, RefreshCw, Lightbulb, Search, List,
  BookOpen, MessageSquare, Sparkles
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useBlogOutlineStorage,
  type TitleOption,
  type OutlineSection,
  type OutlineIntro,
  type OutlineConclusion,
  type OutlineFAQ,
  type BlogOutlineRecord,
} from "@/hooks/use-blog-outline-storage";

const CONTENT_TYPES = [
  { value: "how-to", label: "How-To Guide / Tutorial" },
  { value: "listicle", label: "Listicle (Top X, Best X)" },
  { value: "ultimate-guide", label: "Ultimate Guide" },
  { value: "comparison", label: "Comparison / vs Article" },
  { value: "review", label: "Review / Product Roundup" },
  { value: "opinion", label: "Opinion / Thought Leadership" },
  { value: "case-study", label: "Case Study / Success Story" },
  { value: "news", label: "News / Trend Analysis" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "educational", label: "Educational" },
  { value: "entertaining", label: "Entertaining" },
  { value: "authoritative", label: "Authoritative" },
];

const DEPTHS = [
  { value: "beginner", label: "Beginner-friendly", desc: "Simple explanations" },
  { value: "intermediate", label: "Intermediate", desc: "Balanced depth" },
  { value: "advanced", label: "Advanced", desc: "Expert-level" },
];

const SEARCH_INTENTS = [
  { value: "informational", label: "Informational (Learn, how-to)" },
  { value: "commercial", label: "Commercial (Best, reviews)" },
  { value: "transactional", label: "Transactional (Buy, compare)" },
];

const SYSTEM_PROMPT = `You are an expert content strategist and SEO specialist with 10+ years creating high-ranking blog content.

You create blog outlines that:
- Match search intent perfectly
- Are comprehensive yet focused
- Include engaging hooks and CTAs
- Optimize for on-page SEO
- Structure content for readability
- Guide the writer clearly
- Rank on page 1 of Google

You understand how people consume blog content (skimming, scanning), what makes readers click and share, and how to structure for both humans and search engines.`;

export function BlogOutlineGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveRecord, toggleFavorite } = useBlogOutlineStorage();

  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("how-to");
  const [wordCount, setWordCount] = useState(1500);
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [searchIntent, setSearchIntent] = useState("informational");
  const [selectedTones, setSelectedTones] = useState<string[]>(["professional"]);
  const [depth, setDepth] = useState("intermediate");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeFAQ, setIncludeFAQ] = useState(true);
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeMeta, setIncludeMeta] = useState(true);
  const [titleCount, setTitleCount] = useState(3);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<BlogOutlineRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleTone = (tone: string) => {
    setSelectedTones((prev) =>
      prev.includes(tone) ? (prev.length > 1 ? prev.filter((t) => t !== tone) : prev) : [...prev, tone]
    );
  };

  const handleReset = () => {
    setTopic(""); setAudience(""); setContentType("how-to"); setWordCount(1500);
    setPrimaryKeyword(""); setSecondaryKeywords(""); setSearchIntent("informational");
    setSelectedTones(["professional"]); setDepth("intermediate");
    setShowAdvanced(false); setIncludeFAQ(true); setIncludeIntro(true);
    setIncludeMeta(true); setTitleCount(3);
    setStreamingText(""); setCurrentRecord(null); setCopiedId(null);
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const getWordCountLabel = () => {
    if (wordCount <= 1000) return "Short";
    if (wordCount <= 2000) return "Medium";
    if (wordCount <= 3000) return "Long";
    return "Comprehensive";
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !audience.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentRecord(null);

    const toneLabel = selectedTones.map((t) => TONES.find((x) => x.value === t)?.label || t).join(", ");
    const typeLabel = CONTENT_TYPES.find((t) => t.value === contentType)?.label || "How-To Guide";
    const depthLabel = DEPTHS.find((d) => d.value === depth)?.label || "Intermediate";
    const intentLabel = SEARCH_INTENTS.find((s) => s.value === searchIntent)?.label || "Informational";
    const sectionCount = Math.max(3, Math.ceil(wordCount / 350));

    const userPrompt = `Create an SEO-optimized blog outline for: ${topic.trim()}
Audience: ${audience.trim()} | Type: ${typeLabel} | ${wordCount} words | Tone: ${toneLabel} | Depth: ${depthLabel}
${primaryKeyword ? `Primary Keyword: ${primaryKeyword.trim()}` : ""}
${secondaryKeywords ? `Secondary Keywords: ${secondaryKeywords.trim()}` : ""}

Write ${titleCount} title options and ${sectionCount} main sections. Use this EXACT format:

TITLE OPTIONS:
Title 1: 10 Proven Email Marketing Tips to Boost Open Rates
Why: Uses number, power word, and specific benefit

Title 2: Email Marketing Guide: How to Write Emails People Open
Why: Clear promise addressing reader pain point
${includeMeta ? `
META DESCRIPTIONS:
Meta 1: Discover proven email marketing strategies that boost open rates by 40%. Step-by-step guide with templates and real examples for beginners and pros.
Meta 2: Master email marketing with our complete guide. Learn to write subject lines, segment lists, and create campaigns that convert.` : ""}
${includeIntro ? `
INTRODUCTION:
HOOK: A compelling opening statistic or question about ${topic.trim()}.
PROBLEM: The main challenge ${audience.trim()} face with this topic.
PROMISE: What the reader will learn and achieve.
PREVIEW: Brief list of main topics covered.` : ""}

H2: First Main Section Title
Word Count: 300 words
Key Points:
- Specific point about the topic
- Another actionable insight
- Data or example to include
H3: Subsection One
H3: Subsection Two
Content Notes: Specific examples and data to include.
SEO Notes: Keywords to use and linking opportunities.

H2: Second Main Section Title
Word Count: 350 words
Key Points:
- Key insight for this section
- Practical tip or strategy
- Supporting evidence
H3: Subsection One
H3: Subsection Two
Content Notes: Real-world examples.
SEO Notes: Related keywords to include naturally.

CONCLUSION:
TAKEAWAYS:
- Key takeaway one
- Key takeaway two
- Key takeaway three
CALL TO ACTION: What the reader should do next.
FINAL THOUGHT: Inspiring closing statement.
${includeFAQ ? `
FAQ SECTION:
Q: Common question about the topic?
A: Concise 2-3 sentence answer with actionable guidance.

Q: Another frequent question?
A: Clear answer addressing the concern directly.` : ""}

Now write the REAL outline about "${topic.trim()}" for ${audience.trim()}. Write ${sectionCount} H2 sections. Be specific and actionable -- no bracket placeholders.`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 3000,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseOutlineOutput(result);
        const record: BlogOutlineRecord = {
          id: generateId(),
          topic: topic.trim(),
          audience: audience.trim(),
          contentType,
          wordCount,
          titleOptions: parsed.titleOptions,
          metaDescriptions: parsed.metaDescriptions,
          intro: parsed.intro,
          sections: parsed.sections,
          conclusion: parsed.conclusion,
          faqs: parsed.faqs,
          rawText: result,
          favorites: [],
          createdAt: new Date().toISOString(),
        };
        setCurrentRecord(record);
        saveRecord(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }
    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && topic.trim().length > 0 && audience.trim().length > 0 && !isGenerating;

  const buildFullOutlineText = () => {
    if (!currentRecord) return "";
    if (currentRecord.titleOptions.length === 0 && currentRecord.sections.length === 0 && currentRecord.rawText) {
      return currentRecord.rawText;
    }
    const parts: string[] = [];
    if (currentRecord.titleOptions.length > 0) {
      parts.push("TITLE OPTIONS:");
      currentRecord.titleOptions.forEach((t, i) => parts.push(`${i + 1}. ${t.title}`));
      parts.push("");
    }
    if (currentRecord.metaDescriptions.length > 0) {
      parts.push("META DESCRIPTIONS:");
      currentRecord.metaDescriptions.forEach((m, i) => parts.push(`${i + 1}. ${m}`));
      parts.push("");
    }
    if (currentRecord.intro) {
      parts.push("INTRODUCTION:");
      parts.push(`Hook: ${currentRecord.intro.hook}`);
      parts.push(`Problem: ${currentRecord.intro.problem}`);
      parts.push(`Promise: ${currentRecord.intro.promise}`);
      parts.push(`Preview: ${currentRecord.intro.preview}`);
      parts.push("");
    }
    currentRecord.sections.forEach((s) => {
      parts.push(`## ${s.heading} (${s.wordCount})`);
      s.keyPoints.forEach((p) => parts.push(`- ${p}`));
      s.subsections.forEach((sub) => parts.push(`### ${sub}`));
      parts.push("");
    });
    if (currentRecord.conclusion) {
      parts.push("CONCLUSION:");
      currentRecord.conclusion.takeaways.forEach((t) => parts.push(`- ${t}`));
      parts.push(`CTA: ${currentRecord.conclusion.callToAction}`);
      parts.push("");
    }
    if (currentRecord.faqs.length > 0) {
      parts.push("FAQ:");
      currentRecord.faqs.forEach((f) => { parts.push(`Q: ${f.question}`); parts.push(`A: ${f.answer}`); parts.push(""); });
    }
    return parts.join("\n");
  };

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-blog-outline-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 mb-1.5">Blog Topic / Title Idea *</label>
            <input
              id="topic" data-testid="input-topic" type="text" value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 200))}
              placeholder="e.g., How to Start a Blog in 2026, Best Email Marketing Tools, SEO for Beginners"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">What do you want to write about?</span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">{topic.length}/200</span>
            </div>
          </div>

          <div>
            <label htmlFor="audience" className="block text-sm font-semibold text-slate-700 mb-1.5">Target Audience *</label>
            <input
              id="audience" data-testid="input-audience" type="text" value={audience}
              onChange={(e) => setAudience(e.target.value.slice(0, 100))}
              placeholder="e.g., beginner bloggers, small business owners, marketing professionals"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content Type *</label>
            <div className="flex flex-wrap gap-2" data-testid="container-content-type">
              {CONTENT_TYPES.map((ct) => (
                <button key={ct.value} data-testid={`toggle-type-${ct.value}`} onClick={() => setContentType(ct.value)}
                  className={cn("px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                    contentType === ct.value ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200" : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}>{ct.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Target Word Count: <span className="text-purple-600">{wordCount.toLocaleString()} words</span> <span className="text-xs font-normal text-slate-400">({getWordCountLabel()})</span>
            </label>
            <input
              data-testid="input-word-count" type="range" min={500} max={5000} step={100} value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>500</span><span>1500</span><span>3000</span><span>5000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primary-kw" className="block text-sm font-semibold text-slate-700 mb-1.5">Primary Keyword</label>
              <input id="primary-kw" data-testid="input-primary-keyword" type="text" value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value.slice(0, 50))} placeholder="e.g., blog outline, content marketing"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all" />
            </div>
            <div>
              <label htmlFor="secondary-kw" className="block text-sm font-semibold text-slate-700 mb-1.5">Secondary Keywords</label>
              <input id="secondary-kw" data-testid="input-secondary-keywords" type="text" value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value.slice(0, 200))} placeholder="e.g., content strategy, blog writing"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all" />
            </div>
          </div>

          <div>
            <label htmlFor="search-intent" className="block text-sm font-semibold text-slate-700 mb-1.5">Search Intent</label>
            <select id="search-intent" data-testid="select-search-intent" value={searchIntent} onChange={(e) => setSearchIntent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all">
              {SEARCH_INTENTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tone</label>
            <div className="flex flex-wrap gap-2" data-testid="container-tone">
              {TONES.map((t) => (
                <button key={t.value} data-testid={`toggle-tone-${t.value}`} onClick={() => toggleTone(t.value)}
                  className={cn("px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                    selectedTones.includes(t.value) ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200" : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}>{t.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content Depth</label>
            <div className="flex gap-2" data-testid="container-depth">
              {DEPTHS.map((d) => (
                <button key={d.value} data-testid={`toggle-depth-${d.value}`} onClick={() => setDepth(d.value)}
                  className={cn("flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                    depth === d.value ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200" : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}>
                  <div className="font-semibold">{d.label}</div>
                  <div className="text-xs opacity-60">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <button data-testid="button-toggle-advanced" onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} /> Advanced Options
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="pt-3 space-y-3">
                    <ToggleOption testId="toggle-faq" label="Include FAQ section" value={includeFAQ} onChange={() => setIncludeFAQ(!includeFAQ)} />
                    <ToggleOption testId="toggle-intro" label="Include introduction hook" value={includeIntro} onChange={() => setIncludeIntro(!includeIntro)} />
                    <ToggleOption testId="toggle-meta" label="Include meta description" value={includeMeta} onChange={() => setIncludeMeta(!includeMeta)} />
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Title options: {titleCount}</span>
                        <div className="flex gap-1">
                          {[3, 4, 5].map((n) => (
                            <button key={n} data-testid={`toggle-titles-${n}`} onClick={() => setTitleCount(n)}
                              className={cn("w-8 h-8 rounded-lg text-sm font-bold border transition-all",
                                titleCount === n ? "bg-purple-100 text-purple-700 border-purple-300" : "bg-white text-slate-600 border-slate-200"
                              )}>{n}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <button data-testid="button-generate" onClick={handleGenerate} disabled={!canGenerate}
              className={cn("flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate ? "bg-gradient-primary shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0" : "bg-slate-300 cursor-not-allowed"
              )}>
              {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" />Creating outline...</>) : (<><FileText className="w-5 h-5" />Generate Blog Outline</>)}
            </button>
            <button data-testid="button-reset" onClick={handleReset} disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {isGenerating && streamingText && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8" data-testid="container-streaming">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            <span className="text-sm font-medium text-purple-600">Analyzing topic... Creating structure... Optimizing for SEO...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed">{streamingText}</pre>
        </motion.div>
      )}

      {currentRecord && !isGenerating && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6" data-testid="container-results">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Blog Outline</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {currentRecord.topic} | ~{currentRecord.wordCount.toLocaleString()} words
              </p>
            </div>
            <button data-testid="button-copy-all" onClick={() => copyToClipboard(buildFullOutlineText(), "all")}
              className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              )}>
              {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedId === "all" ? "Copied!" : "Copy All"}
            </button>
          </div>

          {currentRecord.titleOptions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-titles">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Title Options</h3>
              </div>
              <div className="space-y-3">
                {currentRecord.titleOptions.map((t, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50" data-testid={`title-option-${i}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{t.why}</p>
                        <span className="text-xs text-slate-400">{t.title.length} chars</span>
                      </div>
                      <button data-testid={`button-copy-title-${i}`} onClick={() => copyToClipboard(t.title, `title-${i}`)} className="shrink-0">
                        {copiedId === `title-${i}` ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400 hover:text-purple-500" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentRecord.metaDescriptions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-meta">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Meta Descriptions</h3>
              </div>
              <div className="space-y-3">
                {currentRecord.metaDescriptions.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-2" data-testid={`meta-option-${i}`}>
                    <div>
                      <p className="text-sm text-slate-700">{m}</p>
                      <span className="text-xs text-slate-400">{m.length} chars</span>
                    </div>
                    <button data-testid={`button-copy-meta-${i}`} onClick={() => copyToClipboard(m, `meta-${i}`)} className="shrink-0">
                      {copiedId === `meta-${i}` ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400 hover:text-purple-500" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentRecord.intro && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-intro">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Introduction Structure</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "HOOK", text: currentRecord.intro.hook },
                  { label: "PROBLEM", text: currentRecord.intro.problem },
                  { label: "PROMISE", text: currentRecord.intro.promise },
                  { label: "PREVIEW", text: currentRecord.intro.preview },
                ].filter((item) => item.text).map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider shrink-0 mt-0.5 w-16">{item.label}</span>
                    <p className="text-sm text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentRecord.sections.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Main Content Sections</h3>
              </div>
              {currentRecord.sections.map((section, i) => (
                <SectionCard key={section.id} section={section} index={i} copiedId={copiedId}
                  onCopy={(text, id) => copyToClipboard(text, id)}
                  isFavorite={currentRecord.favorites.includes(section.id)}
                  onFavorite={() => {
                    toggleFavorite(currentRecord.id, section.id);
                    setCurrentRecord((prev) => {
                      if (!prev) return prev;
                      const isFav = prev.favorites.includes(section.id);
                      return { ...prev, favorites: isFav ? prev.favorites.filter((id) => id !== section.id) : [...prev.favorites, section.id] };
                    });
                  }}
                />
              ))}
            </div>
          )}

          {currentRecord.conclusion && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-conclusion">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Conclusion</h3>
              </div>
              {currentRecord.conclusion.takeaways.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Takeaways</p>
                  {currentRecord.conclusion.takeaways.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{t}</span>
                    </div>
                  ))}
                </div>
              )}
              {currentRecord.conclusion.callToAction && (
                <div className="mb-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Call to Action</p>
                  <p className="text-sm text-slate-700">{currentRecord.conclusion.callToAction}</p>
                </div>
              )}
              {currentRecord.conclusion.finalThought && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Final Thought</p>
                  <p className="text-sm text-slate-700 italic">{currentRecord.conclusion.finalThought}</p>
                </div>
              )}
            </div>
          )}

          {currentRecord.faqs.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-outline-faqs">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Suggested FAQ Section ({currentRecord.faqs.length})</h3>
              </div>
              <div className="space-y-3">
                {currentRecord.faqs.map((faq, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50" data-testid={`outline-faq-${i}`}>
                    <p className="text-sm font-semibold text-slate-800">Q: {faq.question}</p>
                    <p className="text-sm text-slate-600 mt-1">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentRecord.titleOptions.length === 0 && currentRecord.sections.length === 0 && currentRecord.rawText && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-raw-outline">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Your Blog Outline</h3>
              </div>
              <div className="prose prose-sm prose-slate max-w-none">
                {formatRawOutline(currentRecord.rawText)}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button data-testid="button-regenerate" onClick={handleGenerate} disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors">
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function SectionCard({ section, index, copiedId, onCopy, isFavorite, onFavorite }: {
  section: OutlineSection; index: number; copiedId: string | null;
  onCopy: (text: string, id: string) => void; isFavorite: boolean; onFavorite: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sectionText = [
    `## ${section.heading}`,
    `Word Count: ${section.wordCount}`,
    ...section.keyPoints.map((p) => `- ${p}`),
    ...section.subsections.map((s) => `### ${s}`),
  ].join("\n");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid={`section-card-${index}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-600">H2</span>
            <h4 className="text-sm font-bold text-slate-800" data-testid={`section-heading-${index}`}>{section.heading}</h4>
          </div>
          <span className="text-xs text-slate-400">{section.wordCount}</span>
        </div>
        <button data-testid={`button-expand-section-${index}`} onClick={() => setExpanded(!expanded)} className="shrink-0">
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {section.keyPoints.length > 0 && (
        <div className="mt-3 space-y-1">
          {section.keyPoints.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-purple-400 shrink-0 mt-0.5">-</span>
              <span className="text-slate-600">{p}</span>
            </div>
          ))}
        </div>
      )}

      {section.subsections.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {section.subsections.map((sub, i) => (
            <span key={i} className="text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-600 font-medium">H3: {sub}</span>
          ))}
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-3 mt-3 border-t border-slate-100 space-y-3">
              {section.contentNotes.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Content Notes</p>
                  {section.contentNotes.map((n, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm"><Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" /><span className="text-slate-600">{n}</span></div>
                  ))}
                </div>
              )}
              {section.seoNotes.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SEO Notes</p>
                  {section.seoNotes.map((n, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm"><Search className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /><span className="text-slate-600">{n}</span></div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <button data-testid={`button-copy-section-${index}`} onClick={() => onCopy(sectionText, section.id)}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            copiedId === section.id ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
          )}>
          {copiedId === section.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedId === section.id ? "Copied!" : "Copy"}
        </button>
        <button data-testid={`button-fav-section-${index}`} onClick={onFavorite}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
          <Heart className={cn("w-3.5 h-3.5", isFavorite ? "text-red-500 fill-red-500" : "")} />
          {isFavorite ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

function ToggleOption({ testId, label, value, onChange }: { testId: string; label: string; value: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button data-testid={testId} onClick={onChange}
        className={cn("w-10 h-6 rounded-full transition-colors relative shrink-0 ml-3", value ? "bg-purple-500" : "bg-slate-300")}>
        <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", value ? "left-5" : "left-1")} />
      </button>
    </label>
  );
}

function EngineStatus({ state, progress, error }: { state: string; progress: { text: string; percent: number }; error: string | null }) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" data-testid="status-error">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div><p className="text-sm font-semibold text-red-700">AI Engine Error</p><p className="text-sm text-red-600 mt-1">{error}</p></div>
      </div>
    );
  }
  return (
    <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span className="text-sm font-medium text-purple-700">{state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}</span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}

function formatRawOutline(raw: string) {
  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<br key={`br-${i}`} />);
      continue;
    }
    if (/^#{1,3}\s/.test(trimmed) || /^H[23]:/.test(trimmed) || /^[A-Z][A-Z\s]{4,}:?\s*$/.test(trimmed) || /^━+/.test(trimmed)) {
      const heading = trimmed.replace(/^#{1,3}\s*/, "").replace(/^H[23]:\s*/, "").replace(/^━+$/, "").replace(/:?\s*$/, "");
      if (heading) {
        elements.push(<h4 key={`h-${i}`} className="font-bold text-slate-800 mt-3 mb-1">{heading}</h4>);
      }
    } else if (/^[-*\u2022]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 text-sm text-slate-700 ml-2">
          <span className="text-purple-400 shrink-0 mt-0.5">-</span>
          <span>{trimmed.replace(/^[-*\u2022\d.)]+\s*/, "")}</span>
        </div>
      );
    } else {
      elements.push(<p key={`p-${i}`} className="text-sm text-slate-700 leading-relaxed">{trimmed}</p>);
    }
  }
  return <>{elements}</>;
}

function parseOutlineOutput(raw: string): {
  titleOptions: TitleOption[];
  metaDescriptions: string[];
  intro: OutlineIntro | null;
  sections: OutlineSection[];
  conclusion: OutlineConclusion | null;
  faqs: OutlineFAQ[];
} {
  const titleOptions: TitleOption[] = [];
  const metaDescriptions: string[] = [];
  let intro: OutlineIntro | null = null;
  const sections: OutlineSection[] = [];
  let conclusion: OutlineConclusion | null = null;
  const faqs: OutlineFAQ[] = [];

  const titleMatch = raw.match(/TITLE\s*OPTIONS?:?\s*\n([\s\S]*?)(?=\n(?:META|INTRODUCTION|SECTIONS|H2:))/i);
  if (titleMatch) {
    const lines = titleMatch[1].split("\n");
    let currentTitle = "";
    let currentWhy = "";
    for (const line of lines) {
      const trimmed = line.trim();
      const tMatch = trimmed.match(/^(?:Title\s*\d+|\d+\.\s*|Option\s*\d+):?\s*(.+)/i);
      const wMatch = trimmed.match(/^(?:Why|Reason|Explanation)[:\s]+(.+)/i);
      if (tMatch) {
        if (currentTitle) titleOptions.push({ title: currentTitle, why: currentWhy });
        currentTitle = tMatch[1].trim().replace(/^["']|["']$/g, "");
        currentWhy = "";
      } else if (wMatch) {
        currentWhy = wMatch[1].trim();
      }
    }
    if (currentTitle) titleOptions.push({ title: currentTitle, why: currentWhy });
  }

  const metaMatch = raw.match(/META\s*DESCRIPTIONS?\s*(?:OPTIONS?)?:?\s*\n([\s\S]*?)(?=\n(?:INTRODUCTION|SECTIONS|H2:))/i);
  if (metaMatch) {
    const lines = metaMatch[1].split("\n");
    for (const line of lines) {
      const mMatch = line.trim().match(/^(?:Meta\s*\d+|\d+\.\s*|Option\s*\d+):?\s*(.+)/i);
      if (mMatch && mMatch[1].length > 20) metaDescriptions.push(mMatch[1].trim().replace(/^["']|["']$/g, ""));
    }
  }

  const introMatch = raw.match(/INTRODUCTION:?\s*\n([\s\S]*?)(?=\n(?:SECTIONS|MAIN\s*CONTENT|H2:))/i);
  if (introMatch) {
    const text = introMatch[1];
    const hookM = text.match(/HOOK:?\s*(.+)/i);
    const probM = text.match(/PROBLEM:?\s*(.+)/i);
    const promM = text.match(/PROMISE:?\s*(.+)/i);
    const prevM = text.match(/PREVIEW:?\s*(.+)/i);
    if (hookM || probM || promM || prevM) {
      intro = {
        hook: hookM ? hookM[1].trim() : "",
        problem: probM ? probM[1].trim() : "",
        promise: promM ? promM[1].trim() : "",
        preview: prevM ? prevM[1].trim() : "",
      };
    }
  }

  const sectionRegex = /(?:^|\n)H2:\s*(.+)\n([\s\S]*?)(?=\nH2:|CONCLUSION|FAQ\s*SECTION|CONTENT\s*ENHANCEMENT|$)/gi;
  let sMatch;
  while ((sMatch = sectionRegex.exec(raw)) !== null) {
    const heading = sMatch[1].trim();
    const block = sMatch[2];
    const wcMatch = block.match(/Word\s*Count:?\s*(.+)/i);
    const keyPoints: string[] = [];
    const subsections: string[] = [];
    const contentNotes: string[] = [];
    const seoNotes: string[] = [];

    const kpMatch = block.match(/Key\s*Points?:?\s*\n([\s\S]*?)(?=\nH3:|Content\s*Notes|SEO\s*Notes|Visual|Engagement|---|\n\n|$)/i);
    if (kpMatch) {
      kpMatch[1].split("\n").forEach((l) => {
        const cleaned = l.trim().replace(/^[-*\u2022\d.)\]]+\s*/, "").trim();
        if (cleaned.length > 5) keyPoints.push(cleaned);
      });
    }

    const h3Regex = /(?:H3|###):?\s*(.+)/gi;
    let h3Match;
    while ((h3Match = h3Regex.exec(block)) !== null) {
      const sub = h3Match[1].trim().replace(/^[-:]\s*/, "");
      if (sub.length > 3) subsections.push(sub);
    }

    const cnMatch = block.match(/Content\s*Notes?:?\s*\n?([\s\S]*?)(?=\nSEO\s*Notes|Visual|Engagement|---|\n\n|$)/i);
    if (cnMatch) {
      const cnInline = block.match(/Content\s*Notes?:?\s*([^\n]+)/i);
      if (cnInline && cnInline[1].trim().length > 10 && !cnInline[1].trim().startsWith("-")) {
        contentNotes.push(cnInline[1].trim());
      }
      cnMatch[1].split("\n").forEach((l) => {
        const cleaned = l.trim().replace(/^[-*\u2022]\s*/, "").trim();
        if (cleaned.length > 5) contentNotes.push(cleaned);
      });
    }

    const snMatch = block.match(/SEO\s*Notes?:?\s*\n?([\s\S]*?)(?=\nVisual|Content\s*Notes|Engagement|---|\n\n|$)/i);
    if (snMatch) {
      const snInline = block.match(/SEO\s*Notes?:?\s*([^\n]+)/i);
      if (snInline && snInline[1].trim().length > 10 && !snInline[1].trim().startsWith("-")) {
        seoNotes.push(snInline[1].trim());
      }
      snMatch[1].split("\n").forEach((l) => {
        const cleaned = l.trim().replace(/^[-*\u2022]\s*/, "").trim();
        if (cleaned.length > 5) seoNotes.push(cleaned);
      });
    }

    sections.push({
      id: generateId(),
      heading,
      wordCount: wcMatch ? wcMatch[1].trim() : "",
      keyPoints,
      subsections,
      contentNotes,
      seoNotes,
    });
  }

  const conclusionMatch = raw.match(/CONCLUSION:?\s*\n([\s\S]*?)(?=\nFAQ|CONTENT\s*ENHANCEMENT|$)/i);
  if (conclusionMatch) {
    const text = conclusionMatch[1];
    const takeaways: string[] = [];
    const tkMatch = text.match(/(?:KEY\s*)?TAKEAWAYS?:?\s*\n([\s\S]*?)(?=\nCALL|CTA|FINAL|$)/i);
    if (tkMatch) {
      tkMatch[1].split("\n").forEach((l) => {
        const cleaned = l.trim().replace(/^[-*\u2022\d.)\]]+\s*/, "").trim();
        if (cleaned.length > 5) takeaways.push(cleaned);
      });
    }
    const ctaMatch = text.match(/(?:CALL[- ]?TO[- ]?ACTION|CTA):?\s*(.+)/i);
    const ftMatch = text.match(/FINAL\s*THOUGHT:?\s*(.+)/i);
    conclusion = {
      takeaways,
      callToAction: ctaMatch ? ctaMatch[1].trim() : "",
      finalThought: ftMatch ? ftMatch[1].trim() : "",
    };
  }

  const faqMatch = raw.match(/FAQ\s*SECTION:?\s*\n([\s\S]*?)(?=\n(?:CONTENT\s*ENHANCEMENT|---\s*$)|$)/i);
  if (faqMatch) {
    const lines = faqMatch[1].split("\n");
    let currentQ = "";
    for (const line of lines) {
      const trimmed = line.trim();
      const qMatch = trimmed.match(/^(?:Q\d*|Question\s*\d*)[.:)]\s*(.+)/i);
      const aMatch = trimmed.match(/^(?:A\d*|Answer\s*\d*)[.:)]\s*(.+)/i);
      if (qMatch) {
        currentQ = qMatch[1].trim();
      } else if (aMatch && currentQ) {
        faqs.push({ question: currentQ, answer: aMatch[1].trim() });
        currentQ = "";
      }
    }
  }

  return { titleOptions, metaDescriptions, intro, sections, conclusion, faqs };
}
