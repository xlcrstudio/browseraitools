import { useState, useRef, useCallback, useEffect } from "react";
import { useWebLLM } from "@/hooks/use-web-llm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, Copy, Check, RotateCcw, Loader2, AlertCircle,
  Bot, User, ArrowLeftRight, ChevronRight, ListChecks,
  TrendingDown, TrendingUp, Minus, Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const MAX_INPUT_CHARS = 10000;
const MAX_MODEL_CHARS = 1500; // keep within 4096-token context window

// ─── AI Detection Heuristic ──────────────────────────────────────────────────
const AI_MARKERS = [
  "furthermore", "moreover", "additionally", "consequently",
  "in conclusion", "to summarize", "it is important", "it is worth",
  "it is crucial", "notably", "significantly", "substantially",
  "ultimately", "paramount", "comprehensive", "robust", "leverage",
  "utilize", "utilization", "facilitate", "optimize", "optimization",
  "stakeholder", "paradigm", "synergy", "proactive", "streamline",
  "in order to", "due to the fact", "it should be noted", "it is evident",
  "delve into", "elucidate", "underscore", "necessitate", "aforementioned",
  "heretofore", "henceforth", "vis-a-vis",
];

function computeAIRisk(text: string): number {
  if (!text || text.trim().split(/\s+/).length < 8) return 0;
  let score = 0;
  const words = text.trim().split(/\s+/);
  const wc = words.length;
  const lower = text.toLowerCase();

  // Primary signal: AI marker words/phrases (most reliable indicator)
  let hits = 0;
  for (const m of AI_MARKERS) {
    const rx = new RegExp(`\\b${m.replace(/[-]/g, "\\-")}\\b`, "gi");
    const found = lower.match(rx);
    if (found) hits += found.length;
  }
  score += Math.min(50, (hits / wc) * 700);

  // Sentence uniformity — only meaningful with 5+ complete sentences.
  // Natural prose has sd 3-6; very uniform AI prose has sd < 2.
  // Notes/bullets rarely form complete sentences so this check is skipped.
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length >= 5) {
    const lens = sentences.map(s => s.trim().split(/\s+/).length);
    const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
    const sd = Math.sqrt(lens.reduce((s, l) => s + (l - avg) ** 2, 0) / lens.length);
    // Only penalise very uniform text (sd < 2); natural varied prose scores near 0
    score += Math.max(0, Math.min(12, 12 - sd * 3.5));
  }

  // Lack of contractions — AI text rarely uses them
  const contractions = text.match(/\b(don't|can't|won't|it's|I'm|I've|we're|they're|isn't|aren't|wasn't|weren't|I'll|you'll|he's|she's|that's|there's|we've)\b/gi) || [];
  score += Math.max(0, Math.min(18, 18 - contractions.length * 3));

  // Passive voice constructions
  const passive = text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || [];
  score += Math.min(12, passive.length * 4);

  // Formal sentence openers (loudest AI signal)
  const formalStart = (text.match(/\b(Furthermore|Moreover|Additionally|Consequently|Subsequently|Notwithstanding)\b/g) || []).length;
  score += Math.min(8, formalStart * 4);

  return Math.round(Math.min(100, score));
}

// ─── Text improvement metrics ────────────────────────────────────────────────
function computeTextMetrics(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const contractions = (text.match(/\b(don't|can't|won't|it's|I'm|I've|we're|they're|isn't|aren't|wasn't|weren't|I'll|you'll|he's|she's|that's|there's|we've)\b/gi) || []).length;
  const passive = (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;
  let aiMarkers = 0;
  for (const m of AI_MARKERS) {
    const rx = new RegExp(`\\b${m.replace(/[-]/g, "\\-")}\\b`, "gi");
    aiMarkers += (text.match(rx)?.length || 0);
  }
  const sentLens = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLen = sentLens.length > 0 ? sentLens.reduce((a, b) => a + b, 0) / sentLens.length : 0;
  const sdLen = sentLens.length > 1
    ? Math.sqrt(sentLens.reduce((s, l) => s + (l - avgLen) ** 2, 0) / sentLens.length)
    : 0;
  return { contractions, passive, aiMarkers, sentVariety: Math.round(sdLen * 10) / 10, sentCount: sentences.length };
}

function riskMeta(score: number) {
  if (score >= 70) return { label: "High Risk", bar: "bg-red-500", text: "text-red-600 dark:text-red-400", ring: "ring-red-200 dark:ring-red-900/40" };
  if (score >= 40) return { label: "Medium Risk", bar: "bg-amber-400", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-200 dark:ring-amber-900/40" };
  return { label: "Low Risk", bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-900/40" };
}

function RiskMeter({ score, label }: { score: number; label: string }) {
  const meta = riskMeta(score);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`font-semibold ${meta.text}`}>{score}% — {meta.label}</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
        <div className={`${meta.bar} h-2 rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

// ─── Parse sections (reuse PDF summarizer approach) ───────────────────────────
function parseSections(text: string): { title: string; content: string }[] {
  const result: { title: string; content: string }[] = [];
  const parts = text.split(/\n(?=##\s)/);
  for (const part of parts) {
    const match = part.match(/^##\s+(.+?)\n([\s\S]*)$/);
    if (match) result.push({ title: match[1].trim(), content: match[2].trim() });
  }
  return result;
}

// ─── Prompt builder ──────────────────────────────────────────────────────────
const LEVELS: Record<string, { label: string; desc: string }> = {
  light: { label: "Light", desc: "subtle changes only — fix obvious AI patterns" },
  moderate: { label: "Moderate", desc: "balanced rewrite — natural sentences and vocabulary" },
  heavy: { label: "Heavy", desc: "deep transformation — fully conversational style" },
};
const TONES: Record<string, { label: string; desc: string; icon: string }> = {
  casual: { label: "Casual", desc: "friendly and conversational", icon: "chat" },
  professional: { label: "Professional", desc: "clear, confident, workplace-ready", icon: "brief" },
  academic: { label: "Academic", desc: "scholarly but readable", icon: "book" },
  simple: { label: "Simple", desc: "plain language, short sentences", icon: "abc" },
};

const SYSTEM_PROMPT = `You are an expert writing coach who transforms AI-generated text into natural, human-sounding writing. You vary sentence length, use contractions, prefer active voice, and choose simple everyday words over formal abstract language.`;

function buildPrompt(text: string, level: string, tone: string, creativity: number): string {
  const snippet = text.slice(0, MAX_MODEL_CHARS);
  const truncNote = text.length > MAX_MODEL_CHARS ? " [text truncated for processing]" : "";
  return `Humanize this AI-generated text into 3 different natural versions.${truncNote}

LEVEL: ${LEVELS[level].label} — ${LEVELS[level].desc}
TONE: ${TONES[tone].label} — ${TONES[tone].desc}
CREATIVITY: ${creativity < 40 ? "conservative (stay close to original)" : creativity > 70 ? "high (free to restructure significantly)" : "moderate"}

TEXT TO HUMANIZE:
${snippet}

Rules for all 3 versions:
- Vary sentence length (mix short, medium, long)
- Use contractions naturally (don't, can't, it's, etc.)
- Replace "utilize" with "use", "facilitate" with "help", "furthermore" with nothing or "also"
- Active voice preferred
- No "Furthermore," "Moreover," "Additionally," at sentence starts
- Preserve all facts, meaning, and key points

Output using EXACTLY this format:
## Version 1
[Recommended — most natural rewrite]

## Version 2
[Alternative — slightly different approach or emphasis]

## Version 3
[Another variation — different style or structure]

## Changes Made
- [specific word/phrase swapped]
- [structural change made]
- [pattern removed]
- [element added]
- [other change]`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function AIHumanizerGenerator() {
  const { state, progress, error: llmError, generateRaw } = useWebLLM();
  const { toast } = useToast();

  const [inputText, setInputText] = useState("");
  const [level, setLevel] = useState<"light" | "moderate" | "heavy">("moderate");
  const [tone, setTone] = useState<"casual" | "professional" | "academic" | "simple">("professional");
  const [creativity, setCreativity] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [output, setOutput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const streamRef = useRef("");
  const inputRisk = computeAIRisk(inputText);

  const isReady = state === "ready" || state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";

  // Poll stream ref → state at 30fps while generating
  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => setStreamText(streamRef.current), 33);
    return () => clearInterval(id);
  }, [isGenerating]);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim() || !isReady) return;
    streamRef.current = "";
    setStreamText("");
    setOutput("");
    setShowComparison(false);
    setIsGenerating(true);

    const temperature = 0.3 + (creativity / 100) * 0.55;

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(inputText, level, tone, creativity) },
      ],
      temperature,
      maxTokens: 1500,
      onChunk: (text) => { streamRef.current = text; },
    });

    const final = result ?? streamRef.current;
    setOutput(final ?? "");
    setIsGenerating(false);
  }, [inputText, level, tone, creativity, isReady, generateRaw]);

  const copyText = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const sections = output ? parseSections(output) : [];
  const versions = sections.filter(s => s.title.startsWith("Version"));
  const changesSection = sections.find(s => s.title.startsWith("Changes"));

  const TONE_LABELS: Record<string, string> = {
    casual: "Casual", professional: "Professional", academic: "Academic", simple: "Simple",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Input panel ── */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  <Bot className="w-4 h-4 text-slate-400" />
                  AI-Generated Text
                </div>
                {inputText && (
                  <span className="text-xs text-slate-400">{inputText.length.toLocaleString()} / {MAX_INPUT_CHARS.toLocaleString()}</span>
                )}
              </div>
              {/* Live detection meter */}
              {inputText.trim().split(/\s+/).length >= 8 && (
                <RiskMeter score={inputRisk} label="AI Detection Risk" />
              )}
            </div>

            <textarea
              data-testid="input-ai-text"
              value={inputText}
              onChange={e => setInputText(e.target.value.slice(0, MAX_INPUT_CHARS))}
              placeholder={"Paste AI-generated text here…\n\nWorks with text from:\n• ChatGPT\n• Claude\n• Gemini\n• Any AI writing tool"}
              className="w-full px-5 py-4 text-sm text-slate-800 dark:text-slate-200 bg-transparent placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
              rows={10}
            />
          </div>

          {/* Settings */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-5">
            {/* Humanization Level */}
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">Humanization Level</label>
              <div className="flex gap-2">
                {(["light", "moderate", "heavy"] as const).map(l => (
                  <button
                    key={l}
                    data-testid={`button-level-${l}`}
                    onClick={() => setLevel(l)}
                    className={`flex-1 py-2.5 px-2 rounded-xl border text-xs font-medium transition-all ${
                      level === l
                        ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 dark:border-indigo-500"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-indigo-200"
                    }`}
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 block">Output Tone</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(TONES) as (keyof typeof TONES)[]).map(t => (
                  <button
                    key={t}
                    data-testid={`button-tone-${t}`}
                    onClick={() => setTone(t as any)}
                    className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                      tone === t
                        ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500"
                        : "border-slate-200 dark:border-slate-600 hover:border-indigo-200"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${tone === t ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"}`}>{TONES[t].label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{TONES[t].desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Creativity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Creativity</label>
                <span className="text-xs text-slate-400">{creativity < 35 ? "Conservative" : creativity > 65 ? "High" : "Balanced"}</span>
              </div>
              <input
                data-testid="slider-creativity"
                type="range"
                min={0}
                max={100}
                value={creativity}
                onChange={e => setCreativity(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Close to original</span>
                <span>Freely rewritten</span>
              </div>
            </div>

            {/* Model status */}
            {isModelLoading && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">AI model loading…</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">{progress.text}</p>
                </div>
              </div>
            )}
            {llmError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />{llmError}
              </div>
            )}

            <button
              data-testid="button-humanize"
              onClick={handleGenerate}
              disabled={!inputText.trim() || !isReady || isGenerating}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200/40 dark:shadow-indigo-900/30 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Humanizing…</>
              ) : (
                <><Wand2 className="w-4 h-4" />Humanize Text</>
              )}
            </button>
          </div>
        </div>

        {/* ── Right: Output panel ── */}
        <div className="space-y-5">
          {/* Streaming card */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div key="stream" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  Writing 3 versions…
                </div>
                <div className="p-5 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm min-h-[100px]">
                  {streamText
                    ? <>{streamText}<span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 align-middle animate-pulse" /></>
                    : <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs italic">
                        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />Processing text — first words appear shortly…
                      </span>
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Placeholder when idle */}
          <AnimatePresence>
            {!isGenerating && !output && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-10 text-center text-slate-400 dark:text-slate-500">
                <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Humanized versions will appear here</p>
                <p className="text-xs mt-1">Paste text and click Humanize Text</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Parsed output sections */}
          <AnimatePresence>
            {!isGenerating && output && (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">

                {/* What Changed card — always shows concrete improvements */}
                {versions.length > 0 && (() => {
                  const before = computeTextMetrics(inputText);
                  const after = computeTextMetrics(versions[0].content);
                  const afterRisk = Math.round(computeAIRisk(versions[0].content));
                  const riskDelta = inputRisk - afterRisk;

                  const rows: { label: string; before: number | string; after: number | string; delta: number; good: "up" | "down"; unit?: string }[] = [
                    { label: "Contractions", before: before.contractions, after: after.contractions, delta: after.contractions - before.contractions, good: "up" },
                    { label: "AI signal words", before: before.aiMarkers, after: after.aiMarkers, delta: after.aiMarkers - before.aiMarkers, good: "down" },
                    { label: "Passive voice", before: before.passive, after: after.passive, delta: after.passive - before.passive, good: "down" },
                    { label: "Sentence variety", before: before.sentVariety, after: after.sentVariety, delta: after.sentVariety - before.sentVariety, good: "up", unit: " σ" },
                  ];

                  const improvements = rows.filter(r => r.good === "up" ? r.delta > 0 : r.delta < 0).length;

                  return (
                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-800/40 bg-indigo-50 dark:bg-indigo-900/10 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-5 py-3.5 border-b border-indigo-100 dark:border-indigo-800/40">
                        <div className="flex items-center gap-2 font-semibold text-indigo-800 dark:text-indigo-200 text-sm">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          What Changed
                        </div>
                        {improvements > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold">
                            {improvements} improvement{improvements !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {/* Metric rows */}
                      <div className="divide-y divide-indigo-100 dark:divide-indigo-800/30">
                        {rows.map(row => {
                          const isGood = row.good === "up" ? row.delta > 0 : row.delta < 0;
                          const isNeutral = row.delta === 0;
                          const Icon = isNeutral ? Minus : row.delta > 0 ? TrendingUp : TrendingDown;
                          const iconColor = isNeutral ? "text-slate-400" : isGood ? "text-emerald-500" : "text-amber-500";
                          const badgeColor = isNeutral
                            ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                            : isGood
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
                          const changeText = isNeutral ? "no change"
                            : row.delta > 0
                              ? `+${row.delta}${row.unit ?? ""}`
                              : `${row.delta}${row.unit ?? ""}`;
                          return (
                            <div key={row.label} className="flex items-center justify-between px-5 py-2.5 bg-white dark:bg-slate-800">
                              <span className="text-sm text-slate-600 dark:text-slate-300">{row.label}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">{row.before}{row.unit ?? ""} → {row.after}{row.unit ?? ""}</span>
                                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                                  <Icon className={`w-3 h-3 ${iconColor}`} />
                                  {changeText}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detection risk summary — de-emphasised at the bottom */}
                      <div className="px-5 py-3 flex items-center justify-between border-t border-indigo-100 dark:border-indigo-800/40">
                        <span className="text-xs text-slate-500 dark:text-slate-400">AI detection risk</span>
                        <span className={`text-xs font-semibold ${riskDelta >= 5 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                          {inputRisk}% → {afterRisk}%
                          {riskDelta >= 5 ? ` (−${riskDelta} pts)` : riskDelta > 0 ? " (slight drop)" : " (similar)"}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Regenerate + Compare row */}
                <div className="flex items-center gap-2">
                  <button data-testid="button-regenerate" onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  {inputText && (
                    <button data-testid="button-toggle-comparison" onClick={() => setShowComparison(v => !v)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${showComparison ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 dark:border-indigo-600" : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600"}`}>
                      <ArrowLeftRight className="w-3.5 h-3.5" /> {showComparison ? "Hide" : "Compare"}
                    </button>
                  )}
                </div>

                {/* Before / After comparison panel */}
                <AnimatePresence>
                  {showComparison && versions.length > 0 && (
                    <motion.div key="compare" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-700">
                        <div className="p-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                            <Bot className="w-3.5 h-3.5" /> Before
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{inputText.slice(0, 500)}{inputText.length > 500 ? "…" : ""}</p>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wide">
                            <User className="w-3.5 h-3.5" /> After
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{versions[0].content.slice(0, 500)}{versions[0].content.length > 500 ? "…" : ""}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3 Version cards */}
                {versions.map((v, vi) => {
                  const versionRisk = Math.round(computeAIRisk(v.content));
                  const vRiskMeta = riskMeta(versionRisk);
                  const isFirst = vi === 0;
                  return (
                    <motion.div key={v.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: vi * 0.08 }}
                      className={`rounded-2xl border overflow-hidden ${isFirst ? "border-indigo-200 dark:border-indigo-700/50" : "border-slate-200 dark:border-slate-700"}`}>
                      <div className={`flex items-center justify-between px-5 py-3.5 border-b ${isFirst ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/40" : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isFirst ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-300"}`}>
                            {v.title}
                          </span>
                          {isFirst && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${vRiskMeta.text}`}>{versionRisk}% AI risk</span>
                          <button
                            data-testid={`button-copy-version-${vi + 1}`}
                            onClick={() => copyText(`v${vi}`, v.content)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-700/70 hover:bg-white dark:hover:bg-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors"
                          >
                            {copiedKey === `v${vi}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            {copiedKey === `v${vi}` ? "Copied" : "Copy"}
                          </button>
                          <InlineShareButtons />
                        </div>
                      </div>
                      <div className="p-5 bg-white dark:bg-slate-800">
                        <p data-testid={`text-version-${vi + 1}`} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{v.content}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Changes Made */}
                {changesSection && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 text-sm">
                      <ListChecks className="w-4 h-4 text-indigo-500" />
                      Changes Made
                    </div>
                    <ul className="p-5 space-y-2" data-testid="text-changes">
                      {changesSection.content.split("\n").filter(l => l.trim().startsWith("-")).map((line, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          {line.replace(/^-\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Fallback: raw output if parsing failed */}
                {versions.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Humanized Text</span>
                      <button onClick={() => copyText("raw", output)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">
                        {copiedKey === "raw" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === "raw" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div data-testid="text-raw-output" className="p-5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{output}</div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
