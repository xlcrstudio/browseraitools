import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, ChevronDown,
  ScrollText, BookOpen, GraduationCap, PenTool,
  FileText, Scale, Eye, MessageSquare, Sparkles,
  Clock, BarChart3, Quote
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useEssayWriterStorage,
  type Essay,
} from "@/hooks/use-essay-writer-storage";

const ESSAY_TYPES = [
  { value: "argumentative", label: "Argumentative", icon: Scale, description: "Defend a position with evidence" },
  { value: "expository", label: "Expository", icon: BookOpen, description: "Explain a topic clearly" },
  { value: "narrative", label: "Narrative", icon: PenTool, description: "Tell a compelling story" },
  { value: "descriptive", label: "Descriptive", icon: Eye, description: "Paint a vivid picture" },
  { value: "compare-contrast", label: "Compare & Contrast", icon: BarChart3, description: "Analyze similarities and differences" },
  { value: "persuasive", label: "Persuasive", icon: MessageSquare, description: "Convince the reader" },
];

const ACADEMIC_LEVELS = [
  { value: "high-school", label: "High School" },
  { value: "college", label: "College" },
  { value: "university", label: "University" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
];

const CITATION_STYLES = [
  { value: "apa7", label: "APA 7th Edition" },
  { value: "mla9", label: "MLA 9th Edition" },
  { value: "chicago", label: "Chicago" },
  { value: "harvard", label: "Harvard" },
  { value: "none", label: "None" },
];

const TONES = [
  { value: "formal", label: "Formal" },
  { value: "academic", label: "Academic" },
  { value: "persuasive", label: "Persuasive" },
];

const MAX_TOPIC_CHARS = 300;
const MAX_KEYPOINTS_CHARS = 500;

const SYSTEM_PROMPT = `You are an expert academic essay writer who produces well-structured, original content. Rules:
- Write in clear, natural prose appropriate to the specified academic level and tone.
- Each section must logically flow from the previous one.
- Use evidence-based reasoning and concrete examples.
- Define technical terms when writing for lower academic levels.
- Maintain a consistent thesis throughout all sections.
- When a citation style is specified, include brief in-text citations and note them for the references section.
- Never use filler phrases or pad word count artificially.
- Write exactly the section requested -- do not repeat instructions or add meta-commentary.`;

export function EssayWriterGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveEssay } = useEssayWriterStorage();

  const [topic, setTopic] = useState("");
  const [essayType, setEssayType] = useState("argumentative");
  const [academicLevel, setAcademicLevel] = useState("college");
  const [wordCount, setWordCount] = useState(1500);
  const [citationStyle, setCitationStyle] = useState("apa7");
  const [keyPoints, setKeyPoints] = useState("");
  const [outlineOnly, setOutlineOnly] = useState(false);
  const [tone, setTone] = useState("formal");
  const [includeCounterarguments, setIncludeCounterarguments] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentEssay, setCurrentEssay] = useState<Essay | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const shouldShowCounterarguments = essayType === "argumentative" || essayType === "persuasive";

  const handleReset = () => {
    setTopic("");
    setEssayType("argumentative");
    setAcademicLevel("college");
    setWordCount(1500);
    setCitationStyle("apa7");
    setKeyPoints("");
    setOutlineOnly(false);
    setTone("formal");
    setIncludeCounterarguments(true);
    setStreamingText("");
    setCurrentEssay(null);
    setCopiedId(null);
    setGenerationProgress("");
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const getEssayTypeLabel = (val: string) => ESSAY_TYPES.find(t => t.value === val)?.label || val;
  const getAcademicLevelLabel = (val: string) => ACADEMIC_LEVELS.find(l => l.value === val)?.label || val;
  const getCitationStyleLabel = (val: string) => CITATION_STYLES.find(c => c.value === val)?.label || val;

  const buildContext = () => {
    const parts = [
      `Essay type: ${getEssayTypeLabel(essayType)}`,
      `Academic level: ${getAcademicLevelLabel(academicLevel)}`,
      `Tone: ${tone}`,
      `Target word count: approximately ${wordCount} words total`,
    ];
    if (citationStyle !== "none") parts.push(`Citation style: ${getCitationStyleLabel(citationStyle)}`);
    if (keyPoints) parts.push(`Key points to address: ${keyPoints}`);
    if (shouldShowCounterarguments && includeCounterarguments) parts.push("Include counterarguments and rebuttals.");
    return parts.join("\n");
  };

  const generateSection = async (sectionPrompt: string, maxTokens: number): Promise<string> => {
    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sectionPrompt },
      ],
      temperature: 0.7,
      maxTokens,
      onChunk: () => {},
    });
    return result || "";
  };

  const handleGenerate = async () => {
    if (!topic.trim() || topic.trim().length < 5) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentEssay(null);
    setGenerationProgress("");

    const context = buildContext();
    let allRawText = "";

    try {
      if (outlineOnly) {
        setGenerationProgress("Writing Outline... (1/1)");
        setStreamingText("--- Writing Outline... ---");

        const outlinePrompt = `Create a detailed essay outline for the following topic.

${context}

Topic: ${topic}

Write a structured outline with:
- A clear thesis statement
- Introduction points
- 3 body section headings with sub-points for each
- Conclusion points
${citationStyle !== "none" ? "- Suggested reference types" : ""}

Essay Outline:`;

        const outlineResult = await generateSection(outlinePrompt, 1200);
        allRawText = outlineResult.trim();
        setStreamingText(allRawText);
      } else {
        const sectionWordTarget = Math.round(wordCount / 5);
        const tokenScale = Math.max(1, Math.min(3, wordCount / 1500));
        const bodyTokens = Math.round(800 * tokenScale);
        const introTokens = Math.round(600 * tokenScale);
        const conclusionTokens = Math.round(500 * tokenScale);

        setGenerationProgress("Planning thesis & outline... (1/6)");
        setStreamingText("--- Planning thesis & outline... ---");

        const planPrompt = `Create a thesis statement and brief outline for a ${getEssayTypeLabel(essayType)} essay about "${topic}".

${context}

Write:
1. THESIS: One clear thesis sentence
2. OUTLINE: 3 body section titles (one line each)

Thesis and Outline:`;

        const planResult = await generateSection(planPrompt, 400);
        allRawText = `ESSAY PLAN:\n${planResult}`;
        setStreamingText(allRawText.trim());

        const essayPlan = planResult.trim();

        const sections = [
          {
            label: "Introduction",
            prompt: `Write the introduction for a ${getEssayTypeLabel(essayType)} essay about "${topic}".

${context}

Essay plan to follow:
${essayPlan}

Write approximately ${sectionWordTarget} words. Hook the reader, provide context, and end with the thesis statement from the plan above.

Introduction:`,
            maxTokens: introTokens,
          },
          {
            label: "Body Section 1",
            prompt: `Write body section 1 for a ${getEssayTypeLabel(essayType)} essay about "${topic}".

${context}

Essay plan:
${essayPlan}

Write approximately ${sectionWordTarget} words. Cover the first main argument from the outline. Use a topic sentence, evidence, and analysis.

Body Section 1:`,
            maxTokens: bodyTokens,
          },
          {
            label: "Body Section 2",
            prompt: `Write body section 2 for a ${getEssayTypeLabel(essayType)} essay about "${topic}".

${context}

Essay plan:
${essayPlan}

Write approximately ${sectionWordTarget} words. Cover the second argument from the outline. Use different evidence than section 1.

Body Section 2:`,
            maxTokens: bodyTokens,
          },
          {
            label: "Body Section 3",
            prompt: `Write body section 3 for a ${getEssayTypeLabel(essayType)} essay about "${topic}".

${context}

Essay plan:
${essayPlan}
${shouldShowCounterarguments && includeCounterarguments ? "\nAddress counterarguments and provide rebuttals in this section." : ""}

Write approximately ${sectionWordTarget} words. Cover the third argument from the outline.

Body Section 3:`,
            maxTokens: bodyTokens,
          },
          {
            label: "Conclusion",
            prompt: `Write the conclusion for a ${getEssayTypeLabel(essayType)} essay about "${topic}".

${context}

Essay plan:
${essayPlan}

Write approximately ${Math.round(sectionWordTarget * 0.7)} words. Restate the thesis differently, summarize key arguments, end with a thought-provoking closing.

Conclusion:`,
            maxTokens: conclusionTokens,
          },
        ];

        if (citationStyle !== "none") {
          sections.push({
            label: "References",
            prompt: `Generate 4-6 plausible academic references for an essay about "${topic}".

Format in ${getCitationStyleLabel(citationStyle)} style. Include journal articles, books, and credible sources relevant to the topic.

References:`,
            maxTokens: 600,
          });
        }

        const totalSteps = sections.length + 1;

        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          setGenerationProgress(`Writing ${section.label}... (${i + 2}/${totalSteps})`);
          setStreamingText(allRawText + `\n\n--- Writing ${section.label}... ---`);

          const sectionResult = await generateSection(section.prompt, section.maxTokens);
          allRawText += `\n\n${section.label.toUpperCase()}:\n${sectionResult}`;
          setStreamingText(allRawText.trim());
        }

        allRawText = allRawText.trim();
      }

      const essay: Essay = {
        id: generateId(),
        topic,
        essayType,
        academicLevel,
        wordCount,
        citationStyle,
        keyPoints,
        outlineOnly,
        tone,
        includeCounterarguments: shouldShowCounterarguments ? includeCounterarguments : false,
        essayContent: allRawText,
        rawText: allRawText,
        createdAt: new Date().toISOString(),
      };
      setCurrentEssay(essay);
      saveEssay(essay);
    } catch (err) {
      console.error("Generation error:", err);
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate = state === "ready" && topic.trim().length >= 5 && !isGenerating;

  const getWordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
  const getReadTime = (wc: number) => Math.max(1, Math.round(wc / 200));

  const hasOutput = currentEssay && (currentEssay.essayContent || currentEssay.rawText);

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-essay-writer">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="essay-topic" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Essay Topic *
            </label>
            <textarea
              id="essay-topic"
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, MAX_TOPIC_CHARS))}
              placeholder="Enter your essay topic, thesis question, or subject area..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <div className="flex justify-between mt-1">
              <span data-testid="text-privacy-reminder" className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Processed 100% locally in your browser
              </span>
              <span data-testid="text-topic-char-count" className="text-xs text-slate-400">
                {topic.length}/{MAX_TOPIC_CHARS}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Essay Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-testid="container-essay-types">
              {ESSAY_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    data-testid={`button-essay-type-${type.value}`}
                    onClick={() => setEssayType(type.value)}
                    className={cn(
                      "flex flex-col items-start gap-1 px-3 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      essayType === type.value
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{type.label}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-normal">{type.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Academic Level</label>
            <div className="flex flex-wrap gap-2" data-testid="container-academic-levels">
              {ACADEMIC_LEVELS.map((level) => (
                <button
                  key={level.value}
                  data-testid={`button-academic-level-${level.value}`}
                  onClick={() => setAcademicLevel(level.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    academicLevel === level.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Word Count: <span className="text-purple-600" data-testid="text-word-count-value">{wordCount.toLocaleString()}</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                data-testid="slider-word-count"
                min={500}
                max={5000}
                step={100}
                value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <input
                type="number"
                data-testid="input-word-count"
                min={500}
                max={5000}
                step={100}
                value={wordCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) setWordCount(Math.min(5000, Math.max(500, val)));
                }}
                className="w-24 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>500</span>
              <span>5,000</span>
            </div>
          </div>

          <div>
            <label htmlFor="citation-style" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Citation Style
            </label>
            <select
              id="citation-style"
              data-testid="select-citation-style"
              value={citationStyle}
              onChange={(e) => setCitationStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            >
              {CITATION_STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="key-points" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Key Points / Requirements (optional)
            </label>
            <textarea
              id="key-points"
              data-testid="input-key-points"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value.slice(0, MAX_KEYPOINTS_CHARS))}
              placeholder="Any specific points to cover, arguments to make, or requirements to follow..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <span data-testid="text-keypoints-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {keyPoints.length}/{MAX_KEYPOINTS_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tone</label>
            <div className="flex flex-wrap gap-2" data-testid="container-tones">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  data-testid={`button-tone-${t.value}`}
                  onClick={() => setTone(t.value)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    tone === t.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/30">
              <div>
                <span className="text-sm font-medium text-slate-700">Outline Only</span>
                <p className="text-xs text-slate-400 mt-0.5">Generate a structured outline instead of a full essay</p>
              </div>
              <button
                data-testid="toggle-outline-only"
                onClick={() => setOutlineOnly(!outlineOnly)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  outlineOnly ? "bg-purple-500" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                  outlineOnly && "translate-x-5"
                )} />
              </button>
            </div>

            {shouldShowCounterarguments && (
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/30">
                <div>
                  <span className="text-sm font-medium text-slate-700">Include Counterarguments</span>
                  <p className="text-xs text-slate-400 mt-0.5">Address opposing viewpoints and provide rebuttals</p>
                </div>
                <button
                  data-testid="toggle-counterarguments"
                  onClick={() => setIncludeCounterarguments(!includeCounterarguments)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors",
                    includeCounterarguments ? "bg-purple-500" : "bg-slate-300"
                  )}
                >
                  <span className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                    includeCounterarguments && "translate-x-5"
                  )} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-primary shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" />{outlineOnly ? "Writing Outline..." : "Writing Essay..."}</>
              ) : (
                <><ScrollText className="w-5 h-5" />{outlineOnly ? "Generate Outline (Privately)" : "Generate Essay (Privately)"}</>
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
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            <span className="text-sm font-medium text-purple-600" data-testid="text-generation-progress">
              {generationProgress || "Writing essay... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentEssay && !isGenerating && hasOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                {currentEssay.outlineOnly ? "Essay Outline" : "Generated Essay"}
              </span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-topic">
                {currentEssay.topic.slice(0, 80)}{currentEssay.topic.length > 80 ? "..." : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(currentEssay.essayContent || currentEssay.rawText, "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-word-count" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <FileText className="w-3.5 h-3.5" /> {getWordCount(currentEssay.essayContent || currentEssay.rawText).toLocaleString()} words
            </div>
            <div data-testid="stat-read-time" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Clock className="w-3.5 h-3.5" /> {getReadTime(getWordCount(currentEssay.essayContent || currentEssay.rawText))} min read
            </div>
            <div data-testid="stat-academic-level" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <GraduationCap className="w-3.5 h-3.5" /> {getAcademicLevelLabel(currentEssay.academicLevel)}
            </div>
            {currentEssay.citationStyle !== "none" && (
              <div data-testid="stat-citation-style" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                <Quote className="w-3.5 h-3.5" /> {getCitationStyleLabel(currentEssay.citationStyle)}
              </div>
            )}
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Local
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-essay-content">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">
                  {currentEssay.outlineOnly ? "Essay Outline" : "Full Essay"}
                </h3>
              </div>
              <button
                data-testid="button-copy-essay"
                onClick={() => copyToClipboard(currentEssay.essayContent || currentEssay.rawText, "essay")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                  copiedId === "essay" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "essay" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === "essay" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
              <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-essay-content">
                {currentEssay.essayContent || currentEssay.rawText}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors"
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
          <p className="text-sm font-semibold text-red-700">AI Engine Error</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span className="text-sm font-medium text-purple-700">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}
