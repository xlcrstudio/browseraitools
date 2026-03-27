import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  Copy, Heart, RotateCcw, ArrowRight, Columns, FileText,
  Briefcase, Coffee, Smile, GraduationCap, Zap, HeartHandshake,
  Shield, HandMetal, Sparkles, Target
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";
import {
  useToneConverterStorage,
  type ToneConversion,
  type ToneChange,
  type ToneUsageNotes,
  type ToneConversionRecord,
} from "@/hooks/use-tone-converter-storage";

const TARGET_TONES = [
  { value: "professional", label: "Professional", desc: "Clear, respectful, business-appropriate", icon: Briefcase },
  { value: "casual", label: "Casual", desc: "Relaxed, conversational, friendly", icon: Coffee },
  { value: "friendly", label: "Friendly", desc: "Warm, approachable, positive", icon: Smile },
  { value: "formal", label: "Formal", desc: "Traditional, diplomatic, official", icon: GraduationCap },
  { value: "persuasive", label: "Persuasive", desc: "Compelling, convincing, action-oriented", icon: Zap },
  { value: "empathetic", label: "Empathetic", desc: "Understanding, supportive, compassionate", icon: HeartHandshake },
  { value: "confident", label: "Confident", desc: "Assertive, definitive, authoritative", icon: Shield },
  { value: "apologetic", label: "Apologetic", desc: "Remorseful, accountable, solution-focused", icon: HandMetal },
  { value: "enthusiastic", label: "Enthusiastic", desc: "Energetic, positive, exciting", icon: Sparkles },
  { value: "direct", label: "Direct", desc: "Straightforward, concise, clear", icon: Target },
];

const CURRENT_TONES = [
  "Auto-Detect", "Neutral", "Casual", "Professional", "Informal",
  "Formal", "Direct", "Passive", "Emotional", "Detached",
];

const SYSTEM_PROMPT = `You are an expert communication specialist and professional writer who understands how tone shapes meaning and perception.

Your expertise includes:
- Tone analysis and adaptation
- Business communication best practices
- Emotional intelligence in writing
- Audience-appropriate language
- Cultural and contextual sensitivity
- Voice preservation while shifting tone
- Register shifting (formal to casual and vice versa)
- Persuasive and diplomatic language

You convert text between tones while:
- Maintaining the core message and meaning
- Preserving key information and facts
- Adapting vocabulary appropriately
- Adjusting sentence structure and complexity
- Changing emotional coloring
- Keeping or removing jargon as needed
- Ensuring natural, authentic voice
- Avoiding awkward or forced language

You understand:
- Professional vs casual communication contexts
- When formality matters (job apps, proposals)
- When casualness builds connection (marketing, social)
- How tone affects persuasiveness
- Cultural norms in business communication
- The spectrum from aggressive to diplomatic
- How punctuation and formatting affect tone`;

export function ToneConverterGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveConversion, toggleFavorite } = useToneConverterStorage();

  const [originalText, setOriginalText] = useState("");
  const [currentTone, setCurrentTone] = useState("Auto-Detect");
  const [targetTone, setTargetTone] = useState("professional");
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [preserveLength, setPreserveLength] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generateAlternative, setGenerateAlternative] = useState(true);
  const [showDetailedComparison, setShowDetailedComparison] = useState(true);
  const [maintainPhrases, setMaintainPhrases] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<ToneConversionRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"converted" | "sidebyside">("converted");

  const handleReset = () => {
    setOriginalText("");
    setCurrentTone("Auto-Detect");
    setTargetTone("professional");
    setPurpose("");
    setAudience("");
    setPreserveLength(false);
    setShowAdvanced(false);
    setGenerateAlternative(true);
    setShowDetailedComparison(true);
    setMaintainPhrases("");
    setStreamingText("");
    setCurrentRecord(null);
    setCopiedId(null);
    setViewMode("converted");
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {}
  };

  const handleGenerate = async () => {
    if (!originalText.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentRecord(null);

    const toneLabel = TARGET_TONES.find((t) => t.value === targetTone)?.label || "Professional";
    const numVersions = generateAlternative ? 2 : 1;

    const userPrompt = `Convert the tone of this text while preserving its core message.

ORIGINAL TEXT:
"${originalText.trim()}"

Current Tone: ${currentTone}
Target Tone: ${toneLabel}
${purpose ? `Purpose: ${purpose.trim()}` : ""}
${audience ? `Audience: ${audience.trim()}` : ""}
${preserveLength ? "Keep approximately the same length as the original." : "Adjust length as needed for the tone."}
${maintainPhrases ? `Keep these exact phrases unchanged: ${maintainPhrases.trim()}` : ""}

Here is an example of how to format the output for a conversion from Casual to Professional:

CONVERTED TEXT (Primary)

Hello,

I wanted to follow up regarding the status of the report we discussed. Could you please provide an estimated completion date at your earliest convenience?

Thank you for your time.

WHAT CHANGED:
- "Hey!" changed to "Hello," -- more formal greeting
- "check in on" changed to "follow up regarding" -- professional business language
- "When do you think you'll have it done?" changed to "Could you please provide an estimated completion date" -- respectful request format
- Removed exclamation points, added "please" and "thank you"

${numVersions > 1 ? `ALTERNATIVE VERSION

Hi there,

I hope things are going well. I'm writing to check on the progress of the report. Would you be able to share an expected timeline for completion?

I appreciate your attention to this.

Best regards

WHY THIS VERSION:
Slightly warmer while still professional. Good for established relationships.
` : ""}
USAGE NOTES:
Best For: Business emails, manager communication, client correspondence
Audience Fit: Colleagues you don't know well, management, external stakeholders
Adjust If: The relationship is very casual, company culture is informal, message is time-sensitive

---

Now convert this actual text from ${currentTone} to ${toneLabel} tone. Write the REAL converted text, not placeholders. Use this exact format:

CONVERTED TEXT (Primary)

the actual converted text here

WHAT CHANGED:
- "original phrase" changed to "new phrase" -- explanation
- "original phrase" changed to "new phrase" -- explanation
- "original phrase" changed to "new phrase" -- explanation

${numVersions > 1 ? `ALTERNATIVE VERSION

alternative converted text here

WHY THIS VERSION:
when to use this alternative
` : ""}
USAGE NOTES:
Best For: context1, context2, context3
Audience Fit: audience description
Adjust If: specific scenario requiring adjustment`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 2500,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        let { conversions, changes, usageNotes } = parseToneOutput(result);
        if (conversions.length === 0) {
          conversions = [
            {
              id: generateId(),
              content: result.trim(),
              angle: "Converted",
              charCount: result.trim().length,
              wordCount: result.trim().split(/\s+/).length,
            },
          ];
        }
        const record: ToneConversionRecord = {
          id: generateId(),
          originalText: originalText.trim(),
          targetTone,
          currentTone,
          conversions,
          changes,
          usageNotes,
          favorites: [],
          createdAt: new Date().toISOString(),
        };
        setCurrentRecord(record);
        saveConversion(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && originalText.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-tone-converter">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="original-text" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Text to Convert *
            </label>
            <textarea
              id="original-text"
              data-testid="input-original-text"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value.slice(0, 2000))}
              placeholder={"Paste or type your text here. Examples:\n\nEmail: 'Hey! Just wanted to check in on that report. When do you think you'll have it done?'\n\nMessage: 'I can't make it to the meeting tomorrow.'\n\nText: 'This idea won't work and here's why...'"}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Enter the text you want to convert</span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">{originalText.length}/2000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="current-tone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Current Tone
              </label>
              <select
                id="current-tone"
                data-testid="select-current-tone"
                value={currentTone}
                onChange={(e) => setCurrentTone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              >
                {CURRENT_TONES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="text-xs text-slate-400 mt-1 block">What tone does your text currently have?</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Target Tone *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2" data-testid="container-target-tone">
              {TARGET_TONES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    data-testid={`toggle-tone-${t.value}`}
                    onClick={() => setTargetTone(t.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all",
                      targetTone === t.value
                        ? "bg-purple-50 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-semibold leading-tight">{t.label}</span>
                    </div>
                    <p className="text-[10px] opacity-60 leading-tight hidden md:block">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="purpose" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Purpose
              </label>
              <input
                id="purpose"
                data-testid="input-purpose"
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value.slice(0, 100))}
                placeholder="e.g., Declining a meeting, Requesting feedback"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="audience" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Audience
              </label>
              <input
                id="audience"
                data-testid="input-audience"
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value.slice(0, 50))}
                placeholder="e.g., Boss, Client, Friend, Customer"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
          </div>

          <ToggleOption
            testId="toggle-preserve-length"
            label="Preserve Length"
            description={preserveLength ? "Keep similar length" : "Adjust length as needed for tone"}
            value={preserveLength}
            onChange={() => setPreserveLength(!preserveLength)}
          />

          <div>
            <button
              data-testid="button-toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
              Advanced Options
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
                  <div className="pt-3 space-y-3">
                    <ToggleOption
                      testId="toggle-alternative"
                      label="Generate alternative version"
                      value={generateAlternative}
                      onChange={() => setGenerateAlternative(!generateAlternative)}
                    />
                    <ToggleOption
                      testId="toggle-comparison"
                      label="Show detailed comparison"
                      value={showDetailedComparison}
                      onChange={() => setShowDetailedComparison(!showDetailedComparison)}
                    />
                    <div>
                      <label htmlFor="maintain-phrases" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Maintain key phrases
                      </label>
                      <input
                        id="maintain-phrases"
                        data-testid="input-maintain-phrases"
                        type="text"
                        value={maintainPhrases}
                        onChange={(e) => setMaintainPhrases(e.target.value)}
                        placeholder="Comma-separated phrases to keep unchanged"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
                      />
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
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting to {TARGET_TONES.find((t) => t.value === targetTone)?.label} tone...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Convert Tone
                </>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={handleReset}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
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
            <span className="text-sm font-medium text-purple-600">Analyzing tone... Converting vocabulary... Adjusting structure...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentRecord && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
              Your Text in {TARGET_TONES.find((t) => t.value === currentRecord.targetTone)?.label} Tone
            </h3>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                data-testid="button-view-converted"
                onClick={() => setViewMode("converted")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  viewMode === "converted" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                Converted
              </button>
              <button
                data-testid="button-view-sidebyside"
                onClick={() => setViewMode("sidebyside")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  viewMode === "sidebyside" ? "bg-white text-purple-700 shadow-sm" : "text-slate-500"
                )}
              >
                <Columns className="w-3.5 h-3.5" />
                Side-by-Side
              </button>
            </div>
          </div>

          {viewMode === "sidebyside" && currentRecord.conversions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" data-testid="container-sidebyside">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="p-5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Original</div>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed" data-testid="text-original-sidebyside">{currentRecord.originalText}</p>
                  <div className="mt-3 text-xs text-slate-400">{currentRecord.originalText.length} characters</div>
                </div>
                <div className="p-5 bg-purple-50/30">
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">
                    {TARGET_TONES.find((t) => t.value === currentRecord.targetTone)?.label}
                  </div>
                  <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed" data-testid="text-converted-sidebyside">{currentRecord.conversions[0].content}</p>
                  <div className="mt-3 text-xs text-slate-400">{currentRecord.conversions[0].charCount} characters</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {currentRecord.conversions.map((conversion, i) => (
              <ConversionCard
                key={conversion.id}
                conversion={conversion}
                index={i}
                total={currentRecord.conversions.length}
                isFavorite={currentRecord.favorites.includes(conversion.id)}
                onToggleFavorite={() => {
                  toggleFavorite(currentRecord.id, conversion.id);
                  setCurrentRecord((prev) => {
                    if (!prev) return prev;
                    const isFav = prev.favorites.includes(conversion.id);
                    return {
                      ...prev,
                      favorites: isFav
                        ? prev.favorites.filter((id) => id !== conversion.id)
                        : [...prev.favorites, conversion.id],
                    };
                  });
                }}
                onCopy={(text) => copyToClipboard(text, conversion.id)}
                copied={copiedId === conversion.id}
                hidden={viewMode === "sidebyside" && i === 0}
              />
            ))}
          </div>

          {showDetailedComparison && currentRecord.changes.length > 0 && (
            <ChangesSection changes={currentRecord.changes} />
          )}

          {currentRecord.usageNotes && (
            <UsageNotesSection notes={currentRecord.usageNotes} />
          )}

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ToggleOption({ testId, label, description, value, onChange }: { testId: string; label: string; description?: string; value: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
      <div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        data-testid={testId}
        onClick={onChange}
        className={cn(
          "w-10 h-6 rounded-full transition-colors relative shrink-0 ml-3",
          value ? "bg-purple-500" : "bg-slate-300"
        )}
      >
        <div
          className={cn(
            "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
            value ? "left-5" : "left-1"
          )}
        />
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
          <div
            className="h-full bg-gradient-primary rounded-full transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      )}
    </div>
  );
}

function ConversionCard({
  conversion, index, total, isFavorite, onToggleFavorite, onCopy, copied, hidden,
}: {
  conversion: ToneConversion; index: number; total: number;
  isFavorite: boolean; onToggleFavorite: () => void;
  onCopy: (text: string) => void; copied: boolean; hidden?: boolean;
}) {
  if (hidden) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      data-testid={`card-conversion-${conversion.id}`}
    >
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            {total > 1 ? (index === 0 ? "Primary Version" : "Alternative Version") : "Converted Text"}
          </span>
          {conversion.angle && (
            <span className="text-xs text-slate-400">{conversion.angle}</span>
          )}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line" data-testid={`text-conversion-${conversion.id}`}>
            {conversion.content}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
          <span data-testid={`stat-chars-${conversion.id}`}>{conversion.charCount} characters</span>
          <span data-testid={`stat-words-${conversion.id}`}>{conversion.wordCount} words</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            data-testid={`button-copy-${conversion.id}`}
            onClick={() => onCopy(conversion.content)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            )}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Text"}
          </button>
          <InlineShareButtons />
          <button
            data-testid={`button-fav-${conversion.id}`}
            onClick={onToggleFavorite}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
          >
            <Heart className={cn("w-4 h-4", isFavorite ? "text-red-500 fill-red-500" : "")} />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ChangesSection({ changes }: { changes: ToneChange[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-changes">
      <button
        data-testid="button-toggle-changes"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-800">What Changed</h3>
          <span className="text-xs text-slate-400">({changes.length} changes)</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              {changes.map((change, i) => (
                <div key={i} className="flex items-start gap-2 text-sm" data-testid={`change-item-${i}`}>
                  <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-red-500 line-through">"{change.original}"</span>
                    <span className="text-slate-400 mx-1.5">{"->"}</span>
                    <span className="text-emerald-600 font-medium">"{change.converted}"</span>
                    {change.explanation && (
                      <p className="text-xs text-slate-400 mt-0.5">{change.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UsageNotesSection({ notes }: { notes: ToneUsageNotes }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-usage-notes">
      <h3 className="text-base font-bold text-slate-800 mb-4">Usage Notes</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.bestFor.length > 0 && (
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Best For</div>
            <ul className="space-y-1">
              {notes.bestFor.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {notes.audienceFit.length > 0 && (
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Audience Fit</div>
            <ul className="space-y-1">
              {notes.audienceFit.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {notes.adjustIf.length > 0 && (
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Adjust If</div>
            <ul className="space-y-1">
              {notes.adjustIf.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-slate-600">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function parseToneOutput(raw: string): { conversions: ToneConversion[]; changes: ToneChange[]; usageNotes: ToneUsageNotes | null } {
  const conversions: ToneConversion[] = [];
  const changes: ToneChange[] = [];
  let usageNotes: ToneUsageNotes | null = null;

  const convertedMatch = raw.match(/CONVERTED TEXT[^]*?(?:\(Primary\))?[:\s]*\n([\s\S]*?)(?=\n(?:WHAT CHANGED|ALTERNATIVE VERSION|USAGE NOTES|$))/i);
  if (convertedMatch) {
    const content = convertedMatch[1].trim();
    if (content.length > 5) {
      conversions.push({
        id: generateId(),
        content,
        angle: "Primary",
        charCount: content.length,
        wordCount: content.split(/\s+/).length,
      });
    }
  }

  const altMatch = raw.match(/ALTERNATIVE VERSION[:\s]*\n([\s\S]*?)(?=\n(?:WHY THIS VERSION|USAGE NOTES|$))/i);
  if (altMatch) {
    const content = altMatch[1].trim();
    if (content.length > 5) {
      conversions.push({
        id: generateId(),
        content,
        angle: "Alternative",
        charCount: content.length,
        wordCount: content.split(/\s+/).length,
      });
    }
  }

  const changesSection = raw.match(/WHAT CHANGED:?\s*\n([\s\S]*?)(?=\n(?:ALTERNATIVE VERSION|USAGE NOTES|$))/i);
  if (changesSection) {
    const lines = changesSection[1].split("\n");
    for (const line of lines) {
      const changeMatch = line.match(/[-*\u2022]\s*"([^"]+)"\s*(?:changed to|->|→)\s*"([^"]+)"\s*(?:--|-|:)\s*(.*)/i);
      if (changeMatch) {
        changes.push({
          original: changeMatch[1].trim(),
          converted: changeMatch[2].trim(),
          explanation: changeMatch[3].trim(),
        });
      }
    }
  }

  const usageMatch = raw.match(/USAGE NOTES:?\s*\n([\s\S]*?)$/i);
  if (usageMatch) {
    const usageText = usageMatch[1];
    const bestForMatch = usageText.match(/Best (?:For|Used For):?\s*([^\n]+(?:\n[-*\u2022][^\n]+)*)/i);
    const audienceMatch = usageText.match(/Audience Fit:?\s*([^\n]+(?:\n[-*\u2022][^\n]+)*)/i);
    const adjustMatch = usageText.match(/(?:Adjust If|May Need Adjustment If):?\s*([^\n]+(?:\n[-*\u2022][^\n]+)*)/i);

    const parseList = (text: string | undefined): string[] => {
      if (!text) return [];
      return text.split(/[,\n]/)
        .map((s) => s.trim().replace(/^[-*\u2022]\s*/, ""))
        .filter((s) => s.length > 3);
    };

    const bestFor = parseList(bestForMatch?.[1]);
    const audienceFit = parseList(audienceMatch?.[1]);
    const adjustIf = parseList(adjustMatch?.[1]);

    if (bestFor.length > 0 || audienceFit.length > 0 || adjustIf.length > 0) {
      usageNotes = { bestFor, audienceFit, adjustIf };
    }
  }

  return { conversions, changes, usageNotes };
}
