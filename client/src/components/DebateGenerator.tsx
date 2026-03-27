import { useState } from "react";
import {
  Backpack, GraduationCap, Briefcase, Brain, Heart, Scale,
  ChevronDown, Loader2, AlertTriangle, Copy, Check, RefreshCw, RotateCcw,
  ThumbsUp, ThumbsDown, Sparkles,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useDebateStorage, type DebateResult } from "@/hooks/use-debate-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const LEVELS = [
  { value: "School", label: "School / High School", icon: Backpack, description: "Simple language, easy to understand" },
  { value: "College", label: "College / University", icon: GraduationCap, description: "Moderate complexity, academic" },
  { value: "Professional", label: "Professional / Advanced", icon: Briefcase, description: "Sophisticated analysis, expert-level" },
] as const;

const ARG_STYLES = [
  { value: "Logical", label: "Logical / Rational", icon: Brain, description: "Facts, data, reasoning, evidence-based" },
  { value: "Emotional", label: "Emotional / Persuasive", icon: Heart, description: "Appeals to values, ethics, human impact" },
  { value: "Balanced", label: "Balanced", icon: Scale, description: "Mix of logic and emotion" },
] as const;

const ARG_COUNTS = [3, 5, 7] as const;

const FORMATS = ["General", "Lincoln-Douglas", "Policy Debate", "Parliamentary", "Public Forum"] as const;

const QUICK_TOPICS = [
  "Should AI replace human jobs?",
  "Is social media harmful to society?",
  "Should college education be free?",
  "Is nuclear energy the future?",
  "Should schools ban smartphones?",
  "Is remote work better than office work?",
  "Should voting be mandatory?",
  "Is space exploration worth the cost?",
];

const SYSTEM_PROMPT = `You are an expert debate coach and critical thinking instructor with deep knowledge of argumentation, logic, and rhetoric. You construct balanced, well-reasoned arguments, understand multiple perspectives on complex issues, use evidence-based argumentation, and help users think critically. You present both sides fairly and equally, use sound logic and reasoning, include specific evidence and examples, avoid logical fallacies, and match the requested complexity level.`;

export function DebateGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveDebate, deleteDebate } = useDebateStorage();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("College");
  const [argStyle, setArgStyle] = useState("Balanced");
  const [argCount, setArgCount] = useState<number>(5);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [debateFormat, setDebateFormat] = useState("General");
  const [includeRebuttals, setIncludeRebuttals] = useState(true);
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [includeFallacies, setIncludeFallacies] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [proText, setProText] = useState("");
  const [conText, setConText] = useState("");
  const [activeTab, setActiveTab] = useState<"pro" | "con">("pro");
  const [copiedPro, setCopiedPro] = useState(false);
  const [copiedCon, setCopiedCon] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const canGenerate = topic.trim().length > 0;

  const handleReset = () => {
    setTopic("");
    setLevel("College");
    setArgStyle("Balanced");
    setArgCount(5);
    setAdvancedOpen(false);
    setDebateFormat("General");
    setIncludeRebuttals(true);
    setIncludeEvidence(true);
    setIncludeFallacies(false);
    setStreamingText("");
    setProText("");
    setConText("");
    setActiveTab("pro");
    setCopiedPro(false);
    setCopiedCon(false);
    setCopiedAll(false);
  };

  const copyText = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {}
  };

  const buildSidePrompt = (side: "PRO" | "CON") => {
    let levelGuide = "";
    if (level === "School") levelGuide = "Use simple, clear language suitable for grade 9-10 students. Keep examples relatable and easy to understand.";
    else if (level === "Professional") levelGuide = "Use sophisticated analysis with expert-level vocabulary. Include complex, multi-layered reasoning and theoretical frameworks.";
    else levelGuide = "Use moderate complexity with academic vocabulary. Include nuanced arguments and mention research.";

    let styleGuide = "";
    if (argStyle === "Logical") styleGuide = "Focus on facts, data, statistics, cause-and-effect reasoning, and empirical evidence. Minimize emotional appeals.";
    else if (argStyle === "Emotional") styleGuide = "Focus on values, ethics, human impact stories, moral arguments, social implications, and rights.";
    else styleGuide = "Use a balanced mix of logical reasoning with data AND emotional/ethical appeals. Be comprehensive.";

    const rebuttalLine = includeRebuttals ? "\n- After each argument, include a REBUTTAL paragraph that counters the strongest opposing point (2-3 sentences)" : "";
    const evidenceLine = includeEvidence ? "\n- After each argument, include an EVIDENCE section with 2-3 specific supporting facts, statistics, or real-world examples" : "";
    const formatLine = debateFormat !== "General" ? `\nDebate Format: ${debateFormat} - adapt argument structure accordingly` : "";

    return `Write ${argCount} strong ${side} arguments for the following debate topic.

IMPORTANT CONTEXT - every argument MUST directly address this specific topic: "${topic.trim()}". Do NOT write generic arguments.

Topic: "${topic.trim()}"
Side: ${side} (arguing ${side === "PRO" ? "IN FAVOR of" : "AGAINST"} the proposition)
Audience Level: ${level} - ${levelGuide}
Argument Style: ${argStyle} - ${styleGuide}${formatLine}

For each argument, write:
- A clear title (5-10 words, on its own line starting with the argument number)
- An explanation paragraph (3-5 sentences with specific reasoning)${evidenceLine}${rebuttalLine}

Write exactly ${argCount} arguments. Number them 1 through ${argCount}. Separate each argument with a blank line. Write real, substantive content about "${topic.trim()}" - no placeholders or generic filler.

Begin writing the ${side} arguments now:`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setProText("");
    setConText("");
    setCopiedPro(false);
    setCopiedCon(false);
    setCopiedAll(false);
    setActiveTab("pro");

    try {
      setStreamingText("Generating PRO arguments...");
      const proResult = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildSidePrompt("PRO") },
        ],
        temperature: 0.7,
        maxTokens: 1500,
        onChunk: (text) => setStreamingText(`[PRO Arguments]\n\n${text}`),
      });

      const proClean = proResult?.trim() || "";
      setProText(proClean);

      setStreamingText("Generating CON arguments...");
      const conResult = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildSidePrompt("CON") },
        ],
        temperature: 0.7,
        maxTokens: 1500,
        onChunk: (text) => setStreamingText(`[CON Arguments]\n\n${text}`),
      });

      const conClean = conResult?.trim() || "";
      setConText(conClean);

      if (proClean || conClean) {
        const record: DebateResult = {
          id: generateId(),
          topic: topic.trim(),
          level,
          argStyle,
          argCount,
          debateFormat,
          includeRebuttals,
          includeEvidence,
          includeFallacies,
          proArgs: proClean,
          conArgs: conClean,
          rawText: `PRO ARGUMENTS:\n\n${proClean}\n\n===\n\nCON ARGUMENTS:\n\n${conClean}`,
          createdAt: new Date().toISOString(),
        };
        saveDebate(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setStreamingText("");
    setIsGenerating(false);
  };

  const hasResults = proText.length > 0 || conText.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6" data-testid="text-generator-heading">
          Generate Debate Arguments
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Debate Topic / Resolution <span className="text-red-500">*</span>
            </label>
            <textarea
              data-testid="input-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 300))}
              placeholder="Enter your debate topic or resolution, e.g.:\n- Should AI replace human jobs?\n- Is social media harmful to society?\n- Should college education be free?"
              rows={3}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              maxLength={300}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{topic.length}/300</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Quick Topics</label>
            <div className="flex flex-wrap gap-2" data-testid="container-quick-topics">
              {QUICK_TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  data-testid={`button-topic-${t.slice(0, 20).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  onClick={() => setTopic(t)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Audience / Skill Level <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" data-testid="container-level-cards">
              {LEVELS.map(({ value, label, icon: Icon, description }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={level === value}
                  data-testid={`toggle-level-${value.toLowerCase()}`}
                  onClick={() => setLevel(value)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                    level === value
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", level === value ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                  <div>
                    <span className={cn("text-sm font-semibold block", level === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Argument Style <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" data-testid="container-style-cards">
              {ARG_STYLES.map(({ value, label, icon: Icon, description }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={argStyle === value}
                  data-testid={`toggle-style-${value.toLowerCase()}`}
                  onClick={() => setArgStyle(value)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all",
                    argStyle === value
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", argStyle === value ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                  <div>
                    <span className={cn("text-sm font-semibold block", argStyle === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Arguments per Side: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{argCount}</span>
            </label>
            <div className="flex gap-2" data-testid="container-arg-count">
              {ARG_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={argCount === count}
                  data-testid={`toggle-count-${count}`}
                  onClick={() => setArgCount(count)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-center font-semibold text-sm transition-all",
                    argCount === count
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{argCount} Pro + {argCount} Con = {argCount * 2} total arguments</p>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              data-testid="toggle-advanced"
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Advanced Options
              <ChevronDown className={cn("w-4 h-4 transition-transform", advancedOpen && "rotate-180")} />
            </button>

            {advancedOpen && (
              <div className="px-4 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" data-testid="toggle-rebuttals" checked={includeRebuttals} onChange={(e) => setIncludeRebuttals(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600 text-indigo-500 focus:ring-indigo-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Include rebuttals (counter-arguments)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" data-testid="toggle-evidence" checked={includeEvidence} onChange={(e) => setIncludeEvidence(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600 text-indigo-500 focus:ring-indigo-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Include evidence suggestions</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" data-testid="toggle-fallacies" checked={includeFallacies} onChange={(e) => setIncludeFallacies(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600 text-indigo-500 focus:ring-indigo-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Include logical fallacies to avoid</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Debate Format</label>
                  <select
                    data-testid="select-format"
                    value={debateFormat}
                    onChange={(e) => setDebateFormat(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {state !== "ready" && state !== "generating" && (
            <div data-testid="container-engine-status">
              {state === "error" ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50" data-testid="container-error">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50" data-testid="container-loading">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                      {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
                    </p>
                  </div>
                  <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} data-testid="bar-engine-progress" />
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              data-testid="button-generate"
              disabled={!canGenerate || isGenerating || state !== "ready"}
              onClick={handleGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2",
                canGenerate && !isGenerating && state === "ready"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing both perspectives...
                </>
              ) : (
                <>
                  <Scale className="w-5 h-5" />
                  Generate Debate Arguments
                </>
              )}
            </button>
            {(hasResults || streamingText) && (
              <button
                data-testid="button-reset"
                onClick={handleReset}
                className="px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {isGenerating && streamingText && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {streamingText.includes("PRO") ? "Generating PRO arguments..." : "Generating CON arguments..."}
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {hasResults && (
          <div className="mt-8" data-testid="container-results">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">
                Debate Analysis
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="button-copy-all"
                  onClick={() => copyText(`PRO ARGUMENTS:\n\n${proText}\n\n---\n\nCON ARGUMENTS:\n\n${conText}`, setCopiedAll)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </button>
                <InlineShareButtons />
                <button
                  type="button"
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span>Level: <strong>{level}</strong></span>
              <span>Style: <strong>{argStyle}</strong></span>
              <span>Format: <strong>{debateFormat}</strong></span>
              <span>Arguments: <strong>{argCount} per side</strong></span>
            </div>

            <div className="md:hidden flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-4 mt-3">
              <button
                type="button"
                aria-pressed={activeTab === "pro"}
                data-testid="tab-pro"
                onClick={() => setActiveTab("pro")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors",
                  activeTab === "pro"
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-b-2 border-green-500"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                )}
              >
                <ThumbsUp className="w-4 h-4" />
                PRO ({argCount})
              </button>
              <button
                type="button"
                aria-pressed={activeTab === "con"}
                data-testid="tab-con"
                onClick={() => setActiveTab("con")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors",
                  activeTab === "con"
                    ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-b-2 border-red-500"
                    : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                )}
              >
                <ThumbsDown className="w-4 h-4" />
                CON ({argCount})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className={cn("md:block", activeTab === "pro" ? "block" : "hidden")} data-testid="panel-pro">
                <div className="rounded-xl border-2 border-green-200 dark:border-green-700/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700/50">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-bold text-green-700 dark:text-green-300">PRO Arguments</span>
                    </div>
                    <button
                      type="button"
                      data-testid="button-copy-pro"
                      onClick={() => copyText(proText, setCopiedPro)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    >
                      {copiedPro ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedPro ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800/80">
                    <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed" data-testid="text-pro-args">
                      {proText}
                    </p>
                  </div>
                </div>
              </div>

              <div className={cn("md:block", activeTab === "con" ? "block" : "hidden")} data-testid="panel-con">
                <div className="rounded-xl border-2 border-red-200 dark:border-red-700/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-700/50">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-bold text-red-700 dark:text-red-300">CON Arguments</span>
                    </div>
                    <button
                      type="button"
                      data-testid="button-copy-con"
                      onClick={() => copyText(conText, setCopiedCon)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      {copiedCon ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedCon ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800/80">
                    <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed" data-testid="text-con-args">
                      {conText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && !isGenerating && (
          <div className="mt-10" data-testid="container-history">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Debates</h3>
            <div className="space-y-3">
              {history.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  data-testid={`card-history-${record.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{record.topic}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{record.level} | {record.argStyle} | {record.argCount} per side | {new Date(record.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    type="button"
                    data-testid={`button-delete-history-${record.id}`}
                    onClick={() => deleteDebate(record.id)}
                    className="ml-3 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
