import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  Lock, ArrowRight, ChevronDown, ChevronUp,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Readability Engine (client-side, no AI) ──────────────────────────────────

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m?.length ?? 1);
}

function tokenizeSentences(text: string): string[] {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5 && /[a-zA-Z]/.test(s));
}

function tokenizeWords(text: string): string[] {
  return text.match(/\b[a-zA-Z']+\b/g) ?? [];
}

const PASSIVE_PATTERN = /\b(is|are|was|were|be|been|being|has been|have been|had been|will be|would be)\s+\w+ed\b|\b(is|are|was|were|be|been|being)\s+\w+(en|n)\b/i;

function isLongSentence(sentence: string): boolean {
  return tokenizeWords(sentence).length > 25;
}

function hasPassiveVoice(sentence: string): boolean {
  return PASSIVE_PATTERN.test(sentence);
}

function isComplexWord(word: string): boolean {
  const w = word.replace(/[^a-zA-Z]/g, "");
  if (w.length < 4) return false;
  const proper = /^[A-Z]/.test(word);
  if (proper) return false;
  return countSyllables(w) >= 3;
}

export interface ReadabilityMetrics {
  fleschEase: number;
  fleschKincaidGrade: number;
  gunningFog: number;
  smogGrade: number;
  avgSentenceLen: number;
  avgSyllablesPerWord: number;
  longSentenceCount: number;
  longSentencePct: number;
  passiveSentenceCount: number;
  passiveSentencePct: number;
  complexWordCount: number;
  complexWordPct: number;
  wordCount: number;
  sentenceCount: number;
  readingTimeSec: number;
  grade: number;
  gradeLabel: string;
  difficulty: "very-easy" | "easy" | "standard" | "difficult" | "very-difficult";
}

function calcMetrics(text: string): ReadabilityMetrics {
  const sentences = tokenizeSentences(text);
  const words = tokenizeWords(text);
  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = Math.max(1, words.length);
  const syllableCount = words.reduce((acc, w) => acc + countSyllables(w), 0);

  const longSentences = sentences.filter(isLongSentence);
  const passiveSentences = sentences.filter(hasPassiveVoice);
  const complexWords = words.filter(isComplexWord);
  const polysyllables = words.filter(w => countSyllables(w) >= 3);

  const avgSentenceLen = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  const fleschEase = Math.max(0, Math.min(100,
    206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllablesPerWord
  ));
  const fleschKincaidGrade = Math.max(0,
    0.39 * avgSentenceLen + 11.8 * avgSyllablesPerWord - 15.59
  );
  const gunningFog = Math.max(0,
    0.4 * (avgSentenceLen + 100 * (polysyllables.length / wordCount))
  );
  const smogGrade = sentenceCount >= 30
    ? 3 + Math.sqrt(polysyllables.length * (30 / sentenceCount))
    : 3 + Math.sqrt(polysyllables.length);

  // Primary grade = average of FK and Fog, clamped
  const grade = Math.round(Math.min(20, Math.max(1, (fleschKincaidGrade + gunningFog) / 2)));

  const GRADE_LABELS: Record<number, string> = {
    1: "Grade 1–3", 2: "Grade 1–3", 3: "Grade 1–3",
    4: "Grade 4–5", 5: "Grade 4–5",
    6: "Grade 6", 7: "Grade 7", 8: "Grade 8",
    9: "Grade 9", 10: "Grade 10", 11: "Grade 11", 12: "Grade 12",
    13: "College", 14: "College", 15: "College",
    16: "Graduate", 17: "Graduate", 18: "Graduate",
    19: "Expert", 20: "Expert",
  };

  const difficulty =
    grade <= 6 ? "very-easy" :
    grade <= 8 ? "easy" :
    grade <= 10 ? "standard" :
    grade <= 13 ? "difficult" : "very-difficult";

  const gradeLabel =
    grade <= 6 ? "Very Easy" :
    grade <= 8 ? "Easy" :
    grade <= 10 ? "Standard" :
    grade <= 13 ? "Fairly Difficult" : "Difficult";

  return {
    fleschEase: Math.round(fleschEase * 10) / 10,
    fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
    gunningFog: Math.round(gunningFog * 10) / 10,
    smogGrade: Math.round(smogGrade * 10) / 10,
    avgSentenceLen: Math.round(avgSentenceLen * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    longSentenceCount: longSentences.length,
    longSentencePct: Math.round((longSentences.length / sentenceCount) * 100),
    passiveSentenceCount: passiveSentences.length,
    passiveSentencePct: Math.round((passiveSentences.length / sentenceCount) * 100),
    complexWordCount: complexWords.length,
    complexWordPct: Math.round((complexWords.length / wordCount) * 100),
    wordCount,
    sentenceCount,
    readingTimeSec: Math.ceil((wordCount / 238) * 60),
    grade,
    gradeLabel,
    difficulty,
  };
}

// ─── Annotated text ───────────────────────────────────────────────────────────

function AnnotatedText({ text, showHighlights }: { text: string; showHighlights: boolean }) {
  const sentences = tokenizeSentences(text);

  return (
    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
      {sentences.map((sentence, i) => {
        const long = isLongSentence(sentence);
        const passive = hasPassiveVoice(sentence);
        return (
          <span key={i}>
            {showHighlights ? (
              <span className={cn(
                "rounded px-0.5 transition-all",
                long && passive ? "bg-red-100 dark:bg-red-900/30" :
                long ? "bg-amber-100 dark:bg-amber-900/30" :
                passive ? "bg-blue-100 dark:bg-blue-900/30" : ""
              )}>
                {sentence}
              </span>
            ) : sentence}{" "}
          </span>
        );
      })}
    </p>
  );
}

// ─── Score gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ metrics }: { metrics: ReadabilityMetrics }) {
  const colors: Record<string, string> = {
    "very-easy": "text-emerald-600 dark:text-emerald-400",
    "easy": "text-green-600 dark:text-green-400",
    "standard": "text-yellow-600 dark:text-yellow-400",
    "difficult": "text-orange-600 dark:text-orange-400",
    "very-difficult": "text-red-600 dark:text-red-400",
  };
  const bgColors: Record<string, string> = {
    "very-easy": "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    "easy": "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    "standard": "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    "difficult": "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    "very-difficult": "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  const easeBar = Math.round((metrics.fleschEase / 100) * 100);

  return (
    <div className={cn("rounded-2xl border-2 p-5 space-y-4", bgColors[metrics.difficulty])}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Readability Grade</p>
          <p className={cn("text-4xl font-black", colors[metrics.difficulty])}>
            Grade {metrics.grade}
          </p>
          <p className={cn("text-sm font-bold mt-0.5", colors[metrics.difficulty])}>
            {metrics.gradeLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Reading Time</p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {metrics.readingTimeSec < 60
              ? `${metrics.readingTimeSec}s`
              : `${Math.floor(metrics.readingTimeSec / 60)}m ${metrics.readingTimeSec % 60}s`}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{metrics.wordCount.toLocaleString()} words</p>
        </div>
      </div>

      {/* Flesch Ease bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-500">Flesch Reading Ease</span>
          <span className={cn("font-bold", colors[metrics.difficulty])}>{metrics.fleschEase} / 100</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              metrics.difficulty === "very-easy" ? "bg-emerald-500" :
              metrics.difficulty === "easy" ? "bg-green-500" :
              metrics.difficulty === "standard" ? "bg-yellow-500" :
              metrics.difficulty === "difficult" ? "bg-orange-500" : "bg-red-500"
            )}
            style={{ width: `${easeBar}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
          <span>Very Difficult (0)</span>
          <span>Very Easy (100)</span>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        {[
          { label: "Avg Sentence", value: `${metrics.avgSentenceLen} words` },
          { label: "FK Grade", value: metrics.fleschKincaidGrade },
          { label: "Gunning Fog", value: metrics.gunningFog },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Issue card ───────────────────────────────────────────────────────────────

function IssueCard({
  label, count, pct, threshold, description, color,
}: {
  label: string; count: number; pct: number; threshold: number;
  description: string; color: "amber" | "blue" | "purple";
}) {
  const isBad = pct >= threshold;
  const colorMap = {
    amber: {
      dot: isBad ? "bg-amber-500" : "bg-slate-300",
      badge: isBad ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500",
    },
    blue: {
      dot: isBad ? "bg-blue-500" : "bg-slate-300",
      badge: isBad ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500",
    },
    purple: {
      dot: isBad ? "bg-purple-500" : "bg-slate-300",
      badge: isBad ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500",
    },
  };

  return (
    <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
      <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", colorMap[color].dot)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</p>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0", colorMap[color].badge)}>
            {count} ({pct}%)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">{description}</p>
      </div>
    </div>
  );
}

// ─── AI suggestions ───────────────────────────────────────────────────────────

function buildAIPrompt(text: string, metrics: ReadabilityMetrics): string {
  const sentences = tokenizeSentences(text);
  const problemSentences = sentences
    .filter(s => isLongSentence(s) || hasPassiveVoice(s))
    .slice(0, 5)
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n");

  return `You are a writing coach. Analyze this text and give specific, actionable improvement suggestions.

TEXT METRICS:
- Grade Level: ${metrics.grade} (${metrics.gradeLabel})
- Flesch Reading Ease: ${metrics.fleschEase}/100
- Long sentences (>25 words): ${metrics.longSentenceCount} (${metrics.longSentencePct}%)
- Passive voice sentences: ${metrics.passiveSentenceCount} (${metrics.passiveSentencePct}%)
- Complex words: ${metrics.complexWordCount} (${metrics.complexWordPct}%)

MOST PROBLEMATIC SENTENCES:
${problemSentences || "None detected — text is well-structured."}

Give exactly 3 specific suggestions. For each one:
- Quote the exact problematic phrase (max 15 words)
- Explain the problem in one sentence
- Provide a rewritten version

Format:
SUGGESTION 1:
Quote: "..."
Problem: ...
Rewrite: "..."

SUGGESTION 2:
[same format]

SUGGESTION 3:
[same format]

Be concise and direct. Only suggest changes that clearly improve readability.`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReadabilityAnalyzer() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [text, setText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [streaming, setStreaming] = useState("");
  const [aiDone, setAiDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;

  const metrics = useMemo(() => {
    if (!text.trim() || text.trim().split(/\s+/).length < 10) return null;
    return calcMetrics(text);
  }, [text]);

  const handleAnalyze = () => {
    if (!metrics) return;
    setAnalyzed(true);
    setAiSuggestions("");
    setAiDone(false);
    setStreaming("");
  };

  const handleGetAISuggestions = useCallback(async () => {
    if (!metrics || !text.trim()) return;
    setAiSuggestions("");
    setStreaming("");
    setAiDone(false);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are a clear, concise writing coach. Give specific, actionable feedback only." },
        { role: "user", content: buildAIPrompt(text, metrics) },
      ],
      temperature: 0.3,
      maxTokens: 800,
      onChunk: chunk => setStreaming(chunk),
    });

    if (raw) {
      setAiSuggestions(raw);
      setAiDone(true);
    }
    setStreaming("");
  }, [text, metrics, generateRaw]);

  const handleReset = () => {
    setText(""); setAnalyzed(false); setAiSuggestions(""); setStreaming(""); setAiDone(false); setShowAnnotated(false);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input */}
      {!analyzed && (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Your Text</p>
            <span className="text-xs text-slate-400">{wordCount} words</span>
          </div>
          <textarea
            data-testid="input-text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your text here — an essay, article, email, report, or any writing you want to analyze…"
            rows={12}
            className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400"
          />
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Private — text never leaves your browser</span>
            </div>
            <button
              type="button"
              data-testid="button-analyze"
              onClick={handleAnalyze}
              disabled={wordCount < 10}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
                wordCount < 10
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98]"
              )}
            >
              Analyze Readability
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {analyzed && metrics && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Reset bar */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Analysis Results</p>
              <button type="button" data-testid="button-reset" onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors">
                <RotateCcw className="w-3 h-3" /> Analyze New Text
              </button>
            </div>

            {/* Score gauge */}
            <ScoreGauge metrics={metrics} />

            {/* Issues */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Issues Found</p>
              <IssueCard
                label="Long Sentences"
                count={metrics.longSentenceCount}
                pct={metrics.longSentencePct}
                threshold={20}
                description="Sentences over 25 words. Break them into two shorter ones."
                color="amber"
              />
              <IssueCard
                label="Passive Voice"
                count={metrics.passiveSentenceCount}
                pct={metrics.passiveSentencePct}
                threshold={15}
                description="Passive constructions ('was done by') — use active voice for clarity."
                color="blue"
              />
              <IssueCard
                label="Complex Words"
                count={metrics.complexWordCount}
                pct={metrics.complexWordPct}
                threshold={20}
                description="Words with 3+ syllables. Replace with simpler alternatives where possible."
                color="purple"
              />
            </div>

            {/* Annotated text */}
            <div className="glass-panel rounded-2xl overflow-hidden">
              <button type="button" data-testid="button-toggle-annotated"
                onClick={() => setShowAnnotated(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Highlighted Text</p>
                <div className="flex items-center gap-2">
                  {showAnnotated && (
                    <div className="flex items-center gap-3 text-[10px] font-semibold">
                      <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-amber-200 inline-block" /> Long</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-200 inline-block" /> Passive</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-200 inline-block" /> Both</span>
                    </div>
                  )}
                  {showAnnotated ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>
              <AnimatePresence initial={false}>
                {showAnnotated && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-slate-100 dark:border-slate-800">
                    <div className="px-4 py-4 max-h-80 overflow-y-auto space-y-2">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <span className="text-[10px] text-slate-400">Highlights:</span>
                        <button type="button" data-testid="button-toggle-highlights"
                          onClick={() => setShowHighlights(v => !v)}
                          className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-lg border transition-all",
                            showHighlights
                              ? "border-purple-400 text-purple-600 bg-purple-50 dark:bg-purple-900/20"
                              : "border-slate-200 dark:border-slate-700 text-slate-400"
                          )}>
                          {showHighlights ? "On" : "Off"}
                        </button>
                      </div>
                      <AnnotatedText text={text} showHighlights={showHighlights} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simplify CTA */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Simplify this text automatically</p>
                <p className="text-xs text-slate-500 mt-0.5">Paste your text into the AI Paraphrasing Tool on Simple mode for an instant rewrite.</p>
              </div>
              <Link href="/ai-paraphrasing-tool"
                data-testid="link-paraphrasing-tool"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-primary text-white text-xs font-bold whitespace-nowrap hover:opacity-90 transition-all">
                Simplify All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* AI Suggestions */}
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">AI Writing Suggestions</p>
                {aiDone && (
                  <button type="button" data-testid="button-copy-suggestions"
                    onClick={() => { navigator.clipboard.writeText(aiSuggestions); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>

              <div className="p-4">
                {!isGenerating && !aiDone && !streaming && (
                  <div className="text-center py-2 space-y-3">
                    <p className="text-xs text-slate-400">Get 3 specific rewrites for your most problematic sentences.</p>
                    <button type="button" data-testid="button-get-ai-suggestions"
                      onClick={handleGetAISuggestions}
                      disabled={isBusy}
                      className={cn(
                        "flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl font-bold text-sm transition-all",
                        isBusy
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                          : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98]"
                      )}>
                      {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : "Get AI Suggestions"}
                    </button>
                  </div>
                )}

                {state === "downloading" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin" />
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Loading AI model… {Math.round(progress?.percent ?? 0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
                    </div>
                  </div>
                )}

                {(isGenerating && streaming) || aiDone ? (
                  <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-mono text-xs">
                    {aiDone ? aiSuggestions : streaming}
                    {!aiDone && <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />}
                  </div>
                ) : null}

                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
