import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, MessageSquare,
  Target, MessageCircle, Flag, Heart, Briefcase, ShieldAlert,
  Sparkles
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useMessageAnalyzerStorage,
  type MessageAnalysis,
} from "@/hooks/use-message-analyzer-storage";

const RELATIONSHIP_CONTEXTS = [
  { value: "auto", label: "Auto-detect" },
  { value: "dating", label: "Dating/Romantic Interest" },
  { value: "partner", label: "Partner/Spouse" },
  { value: "friend", label: "Friend" },
  { value: "family", label: "Family Member" },
  { value: "boss", label: "Boss/Manager" },
  { value: "colleague", label: "Colleague/Coworker" },
  { value: "client", label: "Client/Customer" },
  { value: "recruiter", label: "Recruiter/Job Related" },
  { value: "stranger", label: "Stranger/Unknown" },
  { value: "scam", label: "Potential Scam" },
  { value: "other", label: "Other" },
];

const ANALYSIS_OPTIONS = [
  { value: "tone", label: "Tone Analysis", icon: MessageSquare },
  { value: "intent", label: "Intent Analysis", icon: Target },
  { value: "replies", label: "Reply Suggestions", icon: MessageCircle },
  { value: "redflags", label: "Red Flags Check", icon: Flag },
  { value: "relationship", label: "Relationship Insights", icon: Heart },
  { value: "professional", label: "Professional Analysis", icon: Briefcase },
  { value: "scam", label: "Scam Detection", icon: ShieldAlert },
];

const QUICK_EXAMPLES = [
  {
    label: "Dating Text",
    message: "Hey, been really busy lately. Maybe we can hang out sometime if things calm down.",
  },
  {
    label: "Work Email",
    message: "Per my last email, I mentioned this deadline was important.",
  },
  {
    label: "Suspicious Message",
    message: "Your package could not be delivered. Click here to reschedule: bit.ly/xyz123",
  },
  {
    label: "Cold Response",
    message: "Thanks for reaching out. I'll think about it.",
  },
];

const QUICK_PRESETS = [
  { label: "Dating Message", options: ["tone", "intent", "relationship", "replies"] },
  { label: "Work Email", options: ["tone", "intent", "professional", "replies"] },
  { label: "Suspicious Message", options: ["scam", "redflags", "intent"] },
  { label: "Full Analysis", options: ["tone", "intent", "replies", "redflags", "relationship", "professional", "scam"] },
];

const MAX_CHARS = 5000;
const TRUNCATE_FOR_LLM = 4000;

const SYSTEM_PROMPT = `You are a message analyst. Analyze messages accurately based on communication patterns. Be direct and practical.`;

export function MessageAnalyzerGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveAnalysis } = useMessageAnalyzerStorage();

  const [message, setMessage] = useState("");
  const [relationshipContext, setRelationshipContext] = useState("auto");
  const [mainQuestion, setMainQuestion] = useState("");
  const [background, setBackground] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["tone", "intent", "replies"]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<MessageAnalysis | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? (prev.length > 1 ? prev.filter((o) => o !== opt) : prev) : [...prev, opt]
    );
  };

  const applyPreset = (options: string[]) => {
    setSelectedOptions([...options]);
  };

  const handleReset = () => {
    setMessage("");
    setRelationshipContext("auto");
    setMainQuestion("");
    setBackground("");
    setSelectedOptions(["tone", "intent", "replies"]);
    setStreamingText("");
    setCurrentAnalysis(null);
    setCopiedId(null);
    setGenerationProgress("");
  };

  const loadExample = (exampleMessage: string) => {
    if (message.trim().length > 0) return;
    setMessage(exampleMessage);
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const generateSection = async (textForLLM: string, sectionType: string): Promise<string> => {
    const contextHint = relationshipContext !== "auto"
      ? `Context: This message is from a ${RELATIONSHIP_CONTEXTS.find(r => r.value === relationshipContext)?.label || relationshipContext}.`
      : "";
    const questionHint = mainQuestion ? `The reader's main question: "${mainQuestion}"` : "";
    const backgroundHint = background ? `Background: ${background}` : "";
    const extraContext = [contextHint, questionHint, backgroundHint].filter(Boolean).join("\n");

    const prompts: Record<string, string> = {
      tone: `Analyze the tone of this message. Identify the primary tone, list tone indicators from the text, and explain what the tone means.
${extraContext}

Message:
${textForLLM}

Tone Analysis:`,
      intent: `Analyze this message's intent. State the surface meaning, then the likely actual intent. List the sender's probable motivations.
${extraContext}

Message:
${textForLLM}

Intent Analysis:`,
      replies: `Suggest exactly 3 reply options for this message. For each reply, write the reply text on one line, then on the next line explain briefly why it works. Label them Reply 1, Reply 2, Reply 3.
${extraContext}

Message:
${textForLLM}

Reply Suggestions:`,
      redflags: `Check this message for red flags. Look for manipulation, gaslighting, pressure tactics, scam indicators. Also list any positive signs. Be specific.
${extraContext}

Message:
${textForLLM}

Red Flags Analysis:`,
      relationship: `Analyze this message for relationship signals. Assess the sender's interest level, enthusiasm, and commitment signals. Note what's present and what's missing.
${extraContext}

Message:
${textForLLM}

Relationship Insights:`,
      professional: `Analyze this message professionally. Rate the professionalism level, check for passive-aggression, and recommend how to respond in a work context.
${extraContext}

Message:
${textForLLM}

Professional Analysis:`,
      scam: `Analyze this message for scam/phishing indicators. Assess the risk level (Low/Medium/High), list specific indicators found, and recommend actions.
${extraContext}

Message:
${textForLLM}

Scam Detection:`,
    };

    const prompt = prompts[sectionType];
    if (!prompt) return "";

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      maxTokens: sectionType === "replies" ? 800 : 600,
      onChunk: (text) => setStreamingText(text),
    });

    return result || "";
  };

  const handleGenerate = async () => {
    if (!message.trim() || message.trim().length < 5) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentAnalysis(null);
    setGenerationProgress("");

    const textForLLM = message.slice(0, TRUNCATE_FOR_LLM);

    const sectionLabels: Record<string, string> = {
      tone: "Tone Analysis",
      intent: "Intent Analysis",
      replies: "Reply Suggestions",
      redflags: "Red Flags Check",
      relationship: "Relationship Insights",
      professional: "Professional Analysis",
      scam: "Scam Detection",
    };

    const results: Record<string, string> = {};
    let allRawText = "";

    try {
      for (let i = 0; i < selectedOptions.length; i++) {
        const section = selectedOptions[i];
        const label = sectionLabels[section] || section;
        setGenerationProgress(`Generating ${label}... (${i + 1}/${selectedOptions.length})`);
        setStreamingText(allRawText + `\n\n--- Generating ${label}... ---`);

        const sectionResult = await generateSection(textForLLM, section);
        results[section] = sectionResult;
        allRawText += `\n\n${label.toUpperCase()}:\n${sectionResult}`;
        setStreamingText(allRawText.trim());
      }

      const analysis: MessageAnalysis = {
        id: generateId(),
        message: message,
        relationshipContext,
        mainQuestion,
        background,
        analysisOptions: selectedOptions,
        toneAnalysis: (results.tone || "").trim(),
        intentAnalysis: (results.intent || "").trim(),
        replySuggestions: (results.replies || "").trim(),
        redFlags: (results.redflags || "").trim(),
        relationshipInsights: (results.relationship || "").trim(),
        professionalAnalysis: (results.professional || "").trim(),
        scamDetection: (results.scam || "").trim(),
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentAnalysis(analysis);
      saveAnalysis(analysis);
    } catch (err) {
      console.error("Generation error:", err);
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate = state === "ready" && message.trim().length >= 5 && selectedOptions.length > 0 && !isGenerating;

  const buildFullText = () => {
    if (!currentAnalysis) return "";
    const parts: string[] = [];
    if (currentAnalysis.toneAnalysis) { parts.push("TONE ANALYSIS:"); parts.push(currentAnalysis.toneAnalysis); parts.push(""); }
    if (currentAnalysis.intentAnalysis) { parts.push("INTENT ANALYSIS:"); parts.push(currentAnalysis.intentAnalysis); parts.push(""); }
    if (currentAnalysis.replySuggestions) { parts.push("REPLY SUGGESTIONS:"); parts.push(currentAnalysis.replySuggestions); parts.push(""); }
    if (currentAnalysis.redFlags) { parts.push("RED FLAGS:"); parts.push(currentAnalysis.redFlags); parts.push(""); }
    if (currentAnalysis.relationshipInsights) { parts.push("RELATIONSHIP INSIGHTS:"); parts.push(currentAnalysis.relationshipInsights); parts.push(""); }
    if (currentAnalysis.professionalAnalysis) { parts.push("PROFESSIONAL ANALYSIS:"); parts.push(currentAnalysis.professionalAnalysis); parts.push(""); }
    if (currentAnalysis.scamDetection) { parts.push("SCAM DETECTION:"); parts.push(currentAnalysis.scamDetection); parts.push(""); }
    return parts.join("\n") || currentAnalysis.rawText;
  };

  const hasAnyOutput = currentAnalysis && (
    currentAnalysis.toneAnalysis || currentAnalysis.intentAnalysis ||
    currentAnalysis.replySuggestions || currentAnalysis.redFlags ||
    currentAnalysis.relationshipInsights || currentAnalysis.professionalAnalysis ||
    currentAnalysis.scamDetection || currentAnalysis.rawText
  );

  const parseReplies = (text: string): Array<{ reply: string; reason: string }> => {
    const replies: Array<{ reply: string; reason: string }> = [];
    const blocks = text.split(/Reply\s*\d[:.]\s*/i).filter(b => b.trim());
    for (const block of blocks) {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length >= 1) {
        const reply = lines[0].replace(/^[""]|[""]$/g, "").trim();
        const reason = lines.slice(1).join(" ").replace(/^Why[^:]*:\s*/i, "").trim();
        if (reply.length > 5) {
          replies.push({ reply, reason });
        }
      }
    }
    if (replies.length === 0 && text.trim()) {
      const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 10);
      for (let i = 0; i < Math.min(lines.length, 3); i++) {
        replies.push({ reply: lines[i], reason: "" });
      }
    }
    return replies.slice(0, 5);
  };

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-message-analyzer">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="message-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Paste Your Message *
            </label>
            <textarea
              id="message-input"
              data-testid="input-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste the message, email, text, or conversation you want to analyze..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <div className="flex justify-between mt-1">
              <span data-testid="text-privacy-reminder" className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                This message never leaves your browser
              </span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">
                {message.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Quick Examples {message.trim().length > 0 && <span className="text-xs font-normal text-slate-400 ml-1">(clear message to load)</span>}
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-quick-examples">
              {QUICK_EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  data-testid={`button-example-${ex.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => loadExample(ex.message)}
                  disabled={message.trim().length > 0}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-medium border transition-all",
                    message.trim().length > 0
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
            <label htmlFor="relationship-context" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Relationship Context
            </label>
            <select
              id="relationship-context"
              data-testid="select-relationship-context"
              value={relationshipContext}
              onChange={(e) => setRelationshipContext(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            >
              {RELATIONSHIP_CONTEXTS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <span className="text-xs text-slate-400 mt-1 block">Helps provide context-specific insights</span>
          </div>

          <div>
            <label htmlFor="main-question" className="block text-sm font-semibold text-slate-700 mb-1.5">
              What's Your Main Question? (optional)
            </label>
            <input
              id="main-question"
              data-testid="input-main-question"
              type="text"
              value={mainQuestion}
              onChange={(e) => setMainQuestion(e.target.value.slice(0, 200))}
              placeholder="e.g., Are they interested in me? Is this rude? How should I respond?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
          </div>

          <div>
            <label htmlFor="background" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Relationship History (optional)
            </label>
            <textarea
              id="background"
              data-testid="input-background"
              value={background}
              onChange={(e) => setBackground(e.target.value.slice(0, 300))}
              placeholder="Any background that might help? e.g., 'We've been dating for 2 months but he's been distant lately'"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-y"
            />
            <span data-testid="text-background-count" className="text-xs text-slate-400 mt-1 block text-right">
              {background.length}/300
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Analysis Options (select one or more)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" data-testid="container-analysis-options">
              {ANALYSIS_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    data-testid={`toggle-option-${opt.value}`}
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left",
                      selectedOptions.includes(opt.value)
                        ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2" data-testid="container-presets">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  data-testid={`button-preset-${preset.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => applyPreset(preset.options)}
                  className="px-3 py-2 rounded-xl text-sm font-medium border border-purple-200 bg-purple-50/50 text-purple-600 hover:bg-purple-100 transition-all"
                >
                  {preset.label}
                </button>
              ))}
            </div>
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
                <><Loader2 className="w-5 h-5 animate-spin" />Analyzing message...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" />Analyze Message (Privately)</>
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
              {generationProgress || "Analyzing message... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentAnalysis && !isGenerating && hasAnyOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Message Analysis</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {currentAnalysis.message.slice(0, 60)}{currentAnalysis.message.length > 60 ? "..." : ""}
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
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-chars-analyzed" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <MessageSquare className="w-3.5 h-3.5" /> {currentAnalysis.message.length} chars analyzed
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Local
            </div>
          </div>

          {currentAnalysis.toneAnalysis && (
            <ResultSection
              title="Tone Analysis"
              icon={MessageSquare}
              testId="container-tone-analysis"
              text={currentAnalysis.toneAnalysis}
              copiedId={copiedId}
              onCopy={(text) => copyToClipboard(text, "tone")}
              copyId="tone"
            />
          )}

          {currentAnalysis.intentAnalysis && (
            <ResultSection
              title="Intent Analysis"
              icon={Target}
              testId="container-intent-analysis"
              text={currentAnalysis.intentAnalysis}
              copiedId={copiedId}
              onCopy={(text) => copyToClipboard(text, "intent")}
              copyId="intent"
            />
          )}

          {currentAnalysis.replySuggestions && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-reply-suggestions">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <h3 className="text-base font-bold text-slate-800">Reply Suggestions</h3>
                </div>
                <CopyBtn id="replies" copiedId={copiedId} onClick={() => copyToClipboard(currentAnalysis.replySuggestions, "replies")} />
              </div>
              <div className="space-y-4">
                {parseReplies(currentAnalysis.replySuggestions).map((r, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30" data-testid={`reply-suggestion-${i}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{r.reply}</p>
                        {r.reason && <p className="text-xs text-slate-500 mt-2">{r.reason}</p>}
                      </div>
                      <button
                        data-testid={`button-copy-reply-${i}`}
                        onClick={() => copyToClipboard(r.reply, `reply-${i}`)}
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all shrink-0",
                          copiedId === `reply-${i}` ? "bg-emerald-100 text-emerald-700" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                        )}
                      >
                        {copiedId === `reply-${i}` ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === `reply-${i}` ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
                {parseReplies(currentAnalysis.replySuggestions).length === 0 && (
                  <p className="text-sm text-slate-600 whitespace-pre-line">{currentAnalysis.replySuggestions}</p>
                )}
              </div>
            </div>
          )}

          {currentAnalysis.redFlags && (
            <ResultSection
              title="Red Flags Check"
              icon={Flag}
              testId="container-red-flags"
              text={currentAnalysis.redFlags}
              copiedId={copiedId}
              onCopy={(text) => copyToClipboard(text, "redflags")}
              copyId="redflags"
            />
          )}

          {currentAnalysis.relationshipInsights && (
            <ResultSection
              title="Relationship Insights"
              icon={Heart}
              testId="container-relationship-insights"
              text={currentAnalysis.relationshipInsights}
              copiedId={copiedId}
              onCopy={(text) => copyToClipboard(text, "relationship")}
              copyId="relationship"
            />
          )}

          {currentAnalysis.professionalAnalysis && (
            <ResultSection
              title="Professional Analysis"
              icon={Briefcase}
              testId="container-professional-analysis"
              text={currentAnalysis.professionalAnalysis}
              copiedId={copiedId}
              onCopy={(text) => copyToClipboard(text, "professional")}
              copyId="professional"
            />
          )}

          {currentAnalysis.scamDetection && (
            <ResultSection
              title="Scam Detection"
              icon={ShieldAlert}
              testId="container-scam-detection"
              text={currentAnalysis.scamDetection}
              copiedId={copiedId}
              onCopy={(text) => copyToClipboard(text, "scam")}
              copyId="scam"
            />
          )}

          {!currentAnalysis.toneAnalysis && !currentAnalysis.intentAnalysis && !currentAnalysis.replySuggestions &&
           !currentAnalysis.redFlags && !currentAnalysis.relationshipInsights && !currentAnalysis.professionalAnalysis &&
           !currentAnalysis.scamDetection && currentAnalysis.rawText && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-raw-analysis">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Message Analysis</h3>
              </div>
              <div className="prose prose-sm prose-slate max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">{currentAnalysis.rawText}</pre>
              </div>
            </div>
          )}

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
