import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, ChevronDown,
  Lightbulb, BookOpen, Baby, ListOrdered, Shuffle,
  Cpu, GraduationCap, Sparkles, BookMarked
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useExplainerStorage,
  type Explanation,
} from "@/hooks/use-explainer-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const EXPLANATION_MODES = [
  { value: "simple", label: "Simple", icon: Lightbulb, description: "Clear, plain language" },
  { value: "eli5", label: "ELI5", icon: Baby, description: "Explain like I'm 5" },
  { value: "stepbystep", label: "Step-by-Step", icon: ListOrdered, description: "Break it down sequentially" },
  { value: "analogy", label: "Analogy", icon: Shuffle, description: "Compare to familiar things" },
  { value: "technical", label: "Technical", icon: Cpu, description: "Precise technical detail" },
  { value: "academic", label: "Academic", icon: GraduationCap, description: "Scholarly explanation" },
];

const QUICK_EXAMPLES = [
  {
    label: "Academic",
    text: "Quantum entanglement is a phenomenon in quantum mechanics where two or more particles become interconnected in such a way that the quantum state of each particle cannot be described independently of the others, even when separated by large distances.",
  },
  {
    label: "Legal",
    text: "The indemnifying party shall defend, indemnify, and hold harmless the indemnified party from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to any breach of this Agreement.",
  },
  {
    label: "Medical",
    text: "The patient presents with bilateral pleural effusion and consolidation in the lower lobes. CT angiography revealed no evidence of pulmonary embolism. Recommend thoracentesis for diagnostic and therapeutic purposes.",
  },
  {
    label: "Technical",
    text: "The microservice architecture uses event-driven communication via Apache Kafka with exactly-once semantics. Each service maintains its own bounded context with CQRS pattern and event sourcing for state management.",
  },
  {
    label: "News",
    text: "The Federal Reserve announced a 25 basis point reduction in the federal funds rate, citing easing inflationary pressures and moderating labor market conditions, while maintaining its data-dependent approach to future monetary policy decisions.",
  },
  {
    label: "Scientific",
    text: "CRISPR-Cas9 is a genome editing tool that uses a guide RNA to direct the Cas9 nuclease to a specific genomic locus, where it creates a double-strand break that can be repaired by non-homologous end joining or homology-directed repair.",
  },
];

const SUBJECT_AREAS = [
  { value: "auto", label: "Auto-detect" },
  { value: "science", label: "Science" },
  { value: "technology", label: "Technology" },
  { value: "medicine", label: "Medicine" },
  { value: "law", label: "Law" },
  { value: "finance", label: "Finance" },
  { value: "engineering", label: "Engineering" },
  { value: "philosophy", label: "Philosophy" },
  { value: "history", label: "History" },
  { value: "mathematics", label: "Mathematics" },
  { value: "psychology", label: "Psychology" },
  { value: "politics", label: "Politics" },
  { value: "other", label: "Other" },
];

const READING_LEVELS = [
  { value: 5, label: "Grade 5" },
  { value: 6, label: "Grade 6" },
  { value: 7, label: "Grade 7" },
  { value: 8, label: "Grade 8" },
  { value: 9, label: "Grade 9" },
  { value: 10, label: "Grade 10" },
  { value: 11, label: "Grade 11" },
  { value: 12, label: "Grade 12" },
  { value: 13, label: "Undergraduate" },
  { value: 14, label: "Graduate" },
  { value: 15, label: "PhD" },
];

const MAX_CHARS = 10000;
const TRUNCATE_FOR_LLM = 4000;

const SYSTEM_PROMPT = `You are an expert explainer. Your goal is to make complex topics understandable. Be accurate, clear, and helpful. Only explain what is in the provided text.`;

export function ExplainThisGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveExplanation } = useExplainerStorage();

  const [inputText, setInputText] = useState("");
  const [selectedModes, setSelectedModes] = useState<string[]>(["simple"]);
  const [readingLevel, setReadingLevel] = useState(10);
  const [subjectArea, setSubjectArea] = useState("auto");
  const [additionalContext, setAdditionalContext] = useState("");
  const [specificConfusion, setSpecificConfusion] = useState("");
  const [defineTerms, setDefineTerms] = useState(true);
  const [visualDiagram, setVisualDiagram] = useState(true);
  const [relatedConcepts, setRelatedConcepts] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState<Explanation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleMode = (mode: string) => {
    setSelectedModes((prev) =>
      prev.includes(mode) ? (prev.length > 1 ? prev.filter((m) => m !== mode) : prev) : [...prev, mode]
    );
  };

  const handleReset = () => {
    setInputText("");
    setSelectedModes(["simple"]);
    setReadingLevel(10);
    setSubjectArea("auto");
    setAdditionalContext("");
    setSpecificConfusion("");
    setDefineTerms(true);
    setVisualDiagram(true);
    setRelatedConcepts(true);
    setShowAdvanced(false);
    setStreamingText("");
    setCurrentExplanation(null);
    setCopiedId(null);
    setGenerationProgress("");
  };

  const loadExample = (exampleText: string) => {
    if (inputText.trim().length > 0) return;
    setInputText(exampleText);
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const getReadingLevelLabel = (level: number): string => {
    const found = READING_LEVELS.find((r) => r.value === level);
    return found ? found.label : `Grade ${level}`;
  };

  const generateSection = async (textForLLM: string, modeType: string): Promise<string> => {
    const levelLabel = getReadingLevelLabel(readingLevel);
    const subjectHint = subjectArea !== "auto"
      ? `Subject area: ${SUBJECT_AREAS.find(s => s.value === subjectArea)?.label || subjectArea}.`
      : "";
    const contextHint = additionalContext ? `Additional context: ${additionalContext}` : "";
    const confusionHint = specificConfusion ? `The reader is specifically confused about: "${specificConfusion}"` : "";
    const termsHint = defineTerms ? "Define any technical terms used." : "";
    const diagramHint = visualDiagram ? "If helpful, describe a simple visual diagram or mental model." : "";
    const conceptsHint = relatedConcepts ? "Mention related concepts the reader might want to explore." : "";
    const extraContext = [subjectHint, contextHint, confusionHint, termsHint, diagramHint, conceptsHint].filter(Boolean).join("\n");

    const prompts: Record<string, string> = {
      simple: `Explain this text in simple, clear language suitable for a ${levelLabel} reading level. Use short sentences and common words.
${extraContext}

Text to explain:
${textForLLM}

Simple Explanation:`,
      eli5: `Explain this text as if you're talking to a 5-year-old. Use very simple words, fun comparisons, and relatable examples. Avoid any jargon.
${extraContext}

Text to explain:
${textForLLM}

ELI5 Explanation:`,
      stepbystep: `Break down this text into a numbered step-by-step explanation. Each step should build on the previous one. Target a ${levelLabel} reading level.
${extraContext}

Text to explain:
${textForLLM}

Step-by-Step Explanation:`,
      analogy: `Explain this text using analogies and metaphors that relate to everyday life. Compare complex concepts to familiar things. Target a ${levelLabel} reading level.
${extraContext}

Text to explain:
${textForLLM}

Explanation by Analogy:`,
      technical: `Provide a precise technical explanation of this text. Include relevant technical details, mechanisms, and implications. Assume the reader has some technical background.
${extraContext}

Text to explain:
${textForLLM}

Technical Explanation:`,
      academic: `Provide a scholarly explanation of this text. Include theoretical frameworks, cite relevant concepts, and discuss implications. Use an academic tone suitable for a ${levelLabel} level.
${extraContext}

Text to explain:
${textForLLM}

Academic Explanation:`,
    };

    const prompt = prompts[modeType];
    if (!prompt) return "";

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      maxTokens: 800,
      onChunk: (text) => setStreamingText(text),
    });

    return result || "";
  };

  const generateKeyTerms = async (textForLLM: string): Promise<string> => {
    const prompt = `Identify and define the key technical terms, jargon, or specialized vocabulary in this text. List each term followed by a brief, clear definition. Format as "Term: definition" on each line.

Text:
${textForLLM}

Key Terms:`;

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      maxTokens: 600,
      onChunk: (text) => setStreamingText(text),
    });

    return result || "";
  };

  const handleGenerate = async () => {
    if (!inputText.trim() || inputText.trim().length < 10) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentExplanation(null);
    setGenerationProgress("");

    const textForLLM = inputText.slice(0, TRUNCATE_FOR_LLM);

    const modeLabels: Record<string, string> = {
      simple: "Simple Explanation",
      eli5: "ELI5 Explanation",
      stepbystep: "Step-by-Step",
      analogy: "Analogy",
      technical: "Technical Explanation",
      academic: "Academic Explanation",
    };

    const results: Record<string, string> = {};
    let allRawText = "";
    const totalSteps = selectedModes.length + (defineTerms ? 1 : 0);

    try {
      for (let i = 0; i < selectedModes.length; i++) {
        const mode = selectedModes[i];
        const label = modeLabels[mode] || mode;
        setGenerationProgress(`Generating ${label}... (${i + 1}/${totalSteps})`);
        setStreamingText(allRawText + `\n\n--- Generating ${label}... ---`);

        const sectionResult = await generateSection(textForLLM, mode);
        results[mode] = sectionResult;
        allRawText += `\n\n${label.toUpperCase()}:\n${sectionResult}`;
        setStreamingText(allRawText.trim());
      }

      if (defineTerms) {
        setGenerationProgress(`Generating Key Terms... (${totalSteps}/${totalSteps})`);
        setStreamingText(allRawText + `\n\n--- Generating Key Terms... ---`);
        const keyTermsResult = await generateKeyTerms(textForLLM);
        results.keyTerms = keyTermsResult;
        allRawText += `\n\nKEY TERMS:\n${keyTermsResult}`;
        setStreamingText(allRawText.trim());
      }

      const explanation: Explanation = {
        id: generateId(),
        inputText: inputText,
        explanationModes: selectedModes,
        readingLevel: getReadingLevelLabel(readingLevel),
        subjectArea,
        additionalContext,
        specificConfusion,
        defineTerms,
        visualDiagram,
        relatedConcepts,
        simpleExplanation: (results.simple || "").trim(),
        eli5Explanation: (results.eli5 || "").trim(),
        stepByStepExplanation: (results.stepbystep || "").trim(),
        analogyExplanation: (results.analogy || "").trim(),
        technicalExplanation: (results.technical || "").trim(),
        academicExplanation: (results.academic || "").trim(),
        keyTerms: (results.keyTerms || "").trim(),
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentExplanation(explanation);
      saveExplanation(explanation);
    } catch (err) {
      console.error("Generation error:", err);
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate = state === "ready" && inputText.trim().length >= 10 && selectedModes.length > 0 && !isGenerating;

  const buildFullText = () => {
    if (!currentExplanation) return "";
    const parts: string[] = [];
    if (currentExplanation.simpleExplanation) { parts.push("SIMPLE EXPLANATION:"); parts.push(currentExplanation.simpleExplanation); parts.push(""); }
    if (currentExplanation.eli5Explanation) { parts.push("ELI5 EXPLANATION:"); parts.push(currentExplanation.eli5Explanation); parts.push(""); }
    if (currentExplanation.stepByStepExplanation) { parts.push("STEP-BY-STEP:"); parts.push(currentExplanation.stepByStepExplanation); parts.push(""); }
    if (currentExplanation.analogyExplanation) { parts.push("ANALOGY:"); parts.push(currentExplanation.analogyExplanation); parts.push(""); }
    if (currentExplanation.technicalExplanation) { parts.push("TECHNICAL EXPLANATION:"); parts.push(currentExplanation.technicalExplanation); parts.push(""); }
    if (currentExplanation.academicExplanation) { parts.push("ACADEMIC EXPLANATION:"); parts.push(currentExplanation.academicExplanation); parts.push(""); }
    if (currentExplanation.keyTerms) { parts.push("KEY TERMS:"); parts.push(currentExplanation.keyTerms); parts.push(""); }
    return parts.join("\n") || currentExplanation.rawText;
  };

  const hasAnyOutput = currentExplanation && (
    currentExplanation.simpleExplanation || currentExplanation.eli5Explanation ||
    currentExplanation.stepByStepExplanation || currentExplanation.analogyExplanation ||
    currentExplanation.technicalExplanation || currentExplanation.academicExplanation ||
    currentExplanation.keyTerms || currentExplanation.rawText
  );

  const modeToField: Record<string, { field: keyof Explanation; title: string; icon: any }> = {
    simple: { field: "simpleExplanation", title: "Simple Explanation", icon: Lightbulb },
    eli5: { field: "eli5Explanation", title: "ELI5 Explanation", icon: Baby },
    stepbystep: { field: "stepByStepExplanation", title: "Step-by-Step", icon: ListOrdered },
    analogy: { field: "analogyExplanation", title: "Analogy", icon: Shuffle },
    technical: { field: "technicalExplanation", title: "Technical Explanation", icon: Cpu },
    academic: { field: "academicExplanation", title: "Academic Explanation", icon: GraduationCap },
  };

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-explain-this">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="explain-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Paste Text to Explain *
            </label>
            <textarea
              id="explain-input"
              data-testid="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste any complex text, jargon, legal clause, medical report, technical documentation, or academic passage you want explained..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <div className="flex justify-between mt-1">
              <span data-testid="text-privacy-reminder" className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Processed 100% locally in your browser
              </span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">
                {inputText.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Quick Examples {inputText.trim().length > 0 && <span className="text-xs font-normal text-slate-400 ml-1">(clear text to load)</span>}
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-quick-examples">
              {QUICK_EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  data-testid={`button-example-${ex.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => loadExample(ex.text)}
                  disabled={inputText.trim().length > 0}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                    inputText.trim().length > 0
                      ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      : "border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:text-purple-700"
                  )}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Explanation Mode (select one or more)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" data-testid="container-explanation-modes">
              {EXPLANATION_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    data-testid={`toggle-mode-${mode.value}`}
                    onClick={() => toggleMode(mode.value)}
                    className={cn(
                      "flex flex-col items-start gap-1 px-3 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                      selectedModes.includes(mode.value)
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{mode.label}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-normal">{mode.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <button
              data-testid="button-toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} /> Advanced Options
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Reading Level: <span className="text-purple-600" data-testid="text-reading-level">{getReadingLevelLabel(readingLevel)}</span>
                      </label>
                      <input
                        type="range"
                        data-testid="slider-reading-level"
                        min={5}
                        max={15}
                        step={1}
                        value={readingLevel}
                        onChange={(e) => setReadingLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Grade 5</span>
                        <span>PhD</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject-area" className="block text-sm font-semibold text-slate-700 mb-1.5">Subject Area</label>
                      <select
                        id="subject-area"
                        data-testid="select-subject-area"
                        value={subjectArea}
                        onChange={(e) => setSubjectArea(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
                      >
                        {SUBJECT_AREAS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="additional-context" className="block text-sm font-semibold text-slate-700 mb-1.5">Additional Context (optional)</label>
                      <textarea
                        id="additional-context"
                        data-testid="input-additional-context"
                        value={additionalContext}
                        onChange={(e) => setAdditionalContext(e.target.value.slice(0, 200))}
                        placeholder="Any background info that might help the explanation..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
                      />
                      <span data-testid="text-context-count" className="text-xs text-slate-400 mt-1 block text-right">{additionalContext.length}/200</span>
                    </div>

                    <div>
                      <label htmlFor="specific-confusion" className="block text-sm font-semibold text-slate-700 mb-1.5">What Specifically Confuses You? (optional)</label>
                      <input
                        id="specific-confusion"
                        data-testid="input-specific-confusion"
                        type="text"
                        value={specificConfusion}
                        onChange={(e) => setSpecificConfusion(e.target.value.slice(0, 200))}
                        placeholder="e.g., What does 'indemnify' mean in this context?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
                      />
                      <span data-testid="text-confusion-count" className="text-xs text-slate-400 mt-1 block text-right">{specificConfusion.length}/200</span>
                    </div>

                    <div className="space-y-3">
                      <ToggleOption testId="toggle-define-terms" label="Define technical terms" value={defineTerms} onChange={() => setDefineTerms(!defineTerms)} />
                      <ToggleOption testId="toggle-visual-diagram" label="Include visual diagram descriptions" value={visualDiagram} onChange={() => setVisualDiagram(!visualDiagram)} />
                      <ToggleOption testId="toggle-related-concepts" label="Show related concepts" value={relatedConcepts} onChange={() => setRelatedConcepts(!relatedConcepts)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                <><Loader2 className="w-5 h-5 animate-spin" />Explaining...</>
              ) : (
                <><Lightbulb className="w-5 h-5" />Explain This (Privately)</>
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
              {generationProgress || "Explaining... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentExplanation && !isGenerating && hasAnyOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Explanation Results</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {currentExplanation.inputText.slice(0, 60)}{currentExplanation.inputText.length > 60 ? "..." : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(buildFullText(), "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
              <InlineShareButtons />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-chars-analyzed" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <BookOpen className="w-3.5 h-3.5" /> {currentExplanation.inputText.length.toLocaleString()} chars explained
            </div>
            <div data-testid="stat-modes-used" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Sparkles className="w-3.5 h-3.5" /> {currentExplanation.explanationModes.length} mode{currentExplanation.explanationModes.length > 1 ? "s" : ""}
            </div>
            <div data-testid="stat-reading-level" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <GraduationCap className="w-3.5 h-3.5" /> {currentExplanation.readingLevel}
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Local
            </div>
          </div>

          {Object.entries(modeToField).map(([mode, { field, title, icon }]) => {
            const content = currentExplanation[field] as string;
            if (!content) return null;
            return (
              <ResultSection
                key={mode}
                title={title}
                icon={icon}
                testId={`container-${mode}-explanation`}
                text={content}
                copiedId={copiedId}
                onCopy={(text) => copyToClipboard(text, mode)}
                copyId={mode}
              />
            );
          })}

          {currentExplanation.keyTerms && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-key-terms">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800">Key Terms</h3>
                </div>
                <CopyBtn id="keyterms" copiedId={copiedId} onClick={() => copyToClipboard(currentExplanation.keyTerms, "keyterms")} />
              </div>
              <div className="space-y-2">
                {currentExplanation.keyTerms.split("\n").filter(l => l.trim().length > 3).map((line, i) => {
                  const cleaned = line.trim().replace(/^[-*\u2022\d.)\]]+\s*/, "");
                  const colonIndex = cleaned.indexOf(":");
                  if (colonIndex > 0 && colonIndex < 60) {
                    const term = cleaned.slice(0, colonIndex).trim();
                    const def = cleaned.slice(colonIndex + 1).trim();
                    return (
                      <div key={i} className="flex items-start gap-2 text-sm" data-testid={`key-term-${i}`}>
                        <span className="font-semibold text-purple-700 shrink-0">{term}:</span>
                        <span className="text-slate-700">{def}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="text-sm text-slate-700" data-testid={`key-term-${i}`}>{cleaned}</div>
                  );
                })}
              </div>
            </div>
          )}

          {!currentExplanation.simpleExplanation && !currentExplanation.eli5Explanation &&
           !currentExplanation.stepByStepExplanation && !currentExplanation.analogyExplanation &&
           !currentExplanation.technicalExplanation && !currentExplanation.academicExplanation &&
           !currentExplanation.keyTerms && currentExplanation.rawText && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-raw-explanation">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Explanation</h3>
              </div>
              <div className="prose prose-sm prose-slate max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">{currentExplanation.rawText}</pre>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2" data-testid="banner-privacy">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs text-emerald-700">Your text was processed entirely in your browser. No data was sent to any server.</span>
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

function ResultSection({ title, icon: Icon, testId, text, copiedId, onCopy, copyId }: {
  title: string; icon: any; testId: string; text: string; copiedId: string | null;
  onCopy: (text: string) => void; copyId: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid={testId}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
        </div>
        <CopyBtn id={copyId} copiedId={copiedId} onClick={() => onCopy(text)} />
      </div>
      <p data-testid={`text-${copyId}-content`} className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

function CopyBtn({ id, copiedId, onClick }: { id: string; copiedId: string | null; onClick: () => void }) {
  return (
    <button
      data-testid={`button-copy-${id}`}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
        copiedId === id ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
      )}
    >
      {copiedId === id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copiedId === id ? "Copied" : "Copy"}
    </button>
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
