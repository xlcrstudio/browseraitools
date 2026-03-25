import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, RotateCcw, Lock,
  ChevronDown, ChevronUp, ArrowRight, Copy, Check,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GradeResult {
  grade: string;
  score: number;
  thesisScore: number;
  thesisFeedback: string;
  structureScore: number;
  structureFeedback: string;
  evidenceScore: number;
  evidenceFeedback: string;
  clarityScore: number;
  clarityFeedback: string;
  grammarScore: number;
  grammarFeedback: string;
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GRADE_LEVELS = [
  { id: "middle", label: "Middle School", sublabel: "Grades 6–8" },
  { id: "high", label: "High School", sublabel: "Grades 9–12" },
  { id: "college", label: "Undergraduate", sublabel: "College / University" },
  { id: "grad", label: "Graduate", sublabel: "Masters / PhD" },
];

const DIMENSIONS = [
  { key: "thesis", label: "Thesis & Argument", desc: "Clarity and strength of the main argument", fixTool: null },
  { key: "structure", label: "Structure & Organization", desc: "Flow, transitions, and paragraph coherence", fixTool: null },
  { key: "evidence", label: "Evidence & Support", desc: "Use of examples, data, and citations", fixTool: null },
  { key: "clarity", label: "Clarity & Style", desc: "Writing quality, word choice, readability", fixTool: "/ai-readability-analyzer" },
  { key: "grammar", label: "Grammar & Mechanics", desc: "Sentence structure, spelling, punctuation", fixTool: "/ai-paraphrasing-tool" },
] as const;

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(essay: string, gradeLevel: string, prompt: string, subject: string): string {
  const level = GRADE_LEVELS.find(g => g.id === gradeLevel)!;
  return `You are an expert academic writing instructor grading a ${level.label} essay (${level.sublabel}).${subject ? ` Subject: ${subject}.` : ""}${prompt ? `\n\nAssignment prompt: "${prompt}"` : ""}

Grade this essay and provide structured feedback. Be honest, specific, and constructive. Reference actual phrases or sections from the essay in your feedback.

ESSAY:
${essay}

Respond in this exact format — every field is required:

GRADE: [A+/A/A-/B+/B/B-/C+/C/C-/D+/D/F]
SCORE: [0-100]

THESIS_SCORE: [0-100]
THESIS_FEEDBACK: [2-3 sentences. Reference specific claims in the essay.]

STRUCTURE_SCORE: [0-100]
STRUCTURE_FEEDBACK: [2-3 sentences. Mention specific sections.]

EVIDENCE_SCORE: [0-100]
EVIDENCE_FEEDBACK: [2-3 sentences. Name specific examples used or missing.]

CLARITY_SCORE: [0-100]
CLARITY_FEEDBACK: [2-3 sentences. Quote a specific sentence if possible.]

GRAMMAR_SCORE: [0-100]
GRAMMAR_FEEDBACK: [2-3 sentences. Note specific error patterns.]

STRENGTHS:
- [specific strength 1]
- [specific strength 2]
- [specific strength 3]

IMPROVEMENTS:
- [specific actionable improvement 1]
- [specific actionable improvement 2]
- [specific actionable improvement 3]

OVERALL_FEEDBACK:
[3-4 sentences. Holistic assessment. Encourage the student while being honest about the path to improvement.]`;
}

function parseGradeResult(raw: string): GradeResult | null {
  const get = (key: string) => {
    const m = raw.match(new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, "si"));
    return m?.[1]?.trim() ?? "";
  };
  const getNum = (key: string) => {
    const m = raw.match(new RegExp(`${key}:\\s*(\\d+)`));
    return parseInt(m?.[1] ?? "0", 10);
  };
  const getList = (key: string) => {
    const m = raw.match(new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`, "i"));
    if (!m) return [];
    return m[1].split("\n").map(l => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
  };

  const grade = get("GRADE");
  const score = getNum("SCORE");
  if (!grade || !score) return null;

  return {
    grade,
    score,
    thesisScore: getNum("THESIS_SCORE"),
    thesisFeedback: get("THESIS_FEEDBACK"),
    structureScore: getNum("STRUCTURE_SCORE"),
    structureFeedback: get("STRUCTURE_FEEDBACK"),
    evidenceScore: getNum("EVIDENCE_SCORE"),
    evidenceFeedback: get("EVIDENCE_FEEDBACK"),
    clarityScore: getNum("CLARITY_SCORE"),
    clarityFeedback: get("CLARITY_FEEDBACK"),
    grammarScore: getNum("GRAMMAR_SCORE"),
    grammarFeedback: get("GRAMMAR_FEEDBACK"),
    strengths: getList("STRENGTHS"),
    improvements: getList("IMPROVEMENTS"),
    overallFeedback: get("OVERALL_FEEDBACK"),
  };
}

// ─── Grade display helpers ────────────────────────────────────────────────────

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" };
  if (grade.startsWith("B")) return { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" };
  if (grade.startsWith("C")) return { text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" };
  if (grade.startsWith("D")) return { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800" };
  return { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" };
}

function scoreColor(score: number) {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-yellow-500";
  if (score >= 60) return "bg-orange-500";
  return "bg-red-500";
}

function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Satisfactory";
  if (score >= 60) return "Needs Work";
  return "Poor";
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, desc, score, feedback, fixTool }: {
  label: string; desc: string; score: number; feedback: string; fixTool: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800/40">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                score >= 90 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700" :
                score >= 80 ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700" :
                score >= 70 ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700" :
                "bg-red-100 dark:bg-red-900/40 text-red-700"
              )}>
                {scoreLabel(score)}
              </span>
              <span className="text-sm font-black text-slate-600 dark:text-slate-300 w-10 text-right">{score}</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={cn("h-full rounded-full", scoreColor(score))}
            />
          </div>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-700">
            <div className="px-4 py-3 space-y-3">
              <p className="text-xs text-slate-400 italic">{desc}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{feedback}</p>
              <div className="flex items-center gap-2">
                <button type="button"
                  onClick={() => { navigator.clipboard.writeText(feedback); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-purple-600 transition-colors">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy feedback"}
                </button>
                {fixTool && score < 85 && (
                  <Link href={fixTool}
                    className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors ml-auto">
                    Fix this <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EssayGrader() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [essay, setEssay] = useState("");
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("high");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [parseError, setParseError] = useState(false);
  const [showInput, setShowInput] = useState(true);

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  const handleGrade = useCallback(async () => {
    if (wordCount < 50) { setInputError("Please paste at least 50 words of essay text."); return; }
    setInputError("");
    setResult(null);
    setStreaming("");
    setIsDone(false);
    setParseError(false);
    setShowInput(false);

    const raw = await generateRaw({
      messages: [
        { role: "system", content: "You are a strict but fair academic essay grader. Always follow the exact output format requested. Never deviate from it." },
        { role: "user", content: buildPrompt(essay, gradeLevel, prompt, subject) },
      ],
      temperature: 0.2,
      maxTokens: 1200,
      onChunk: chunk => setStreaming(chunk),
    });

    if (raw) {
      const parsed = parseGradeResult(raw);
      if (parsed) {
        setResult(parsed);
        setIsDone(true);
      } else {
        setParseError(true);
      }
    }
    setStreaming("");
  }, [essay, gradeLevel, prompt, subject, wordCount, generateRaw]);

  const handleReset = () => {
    setEssay(""); setPrompt(""); setSubject(""); setResult(null);
    setStreaming(""); setIsDone(false); setParseError(false); setShowInput(true); setInputError("");
  };

  const colors = result ? gradeColor(result.grade) : null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Input panel */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <button type="button" data-testid="button-toggle-input"
          onClick={() => setShowInput(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Essay Input</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{wordCount > 0 ? `${wordCount} words` : ""}</span>
            {showInput ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {showInput && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              className="overflow-hidden border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 space-y-4">
                {/* Grade level */}
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Grade Level</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GRADE_LEVELS.map(g => (
                      <button key={g.id} type="button" data-testid={`button-level-${g.id}`}
                        onClick={() => setGradeLevel(g.id)}
                        className={cn(
                          "flex flex-col items-start px-3 py-2.5 rounded-xl border-2 text-left transition-all",
                          gradeLevel === g.id
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-purple-300"
                        )}>
                        <span className={cn("text-xs font-bold", gradeLevel === g.id ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>{g.label}</span>
                        <span className="text-[10px] text-slate-400">{g.sublabel}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional context */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Subject / Course (optional)</label>
                    <input type="text" data-testid="input-subject"
                      value={subject} onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. AP Literature, Economics 101"
                      className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Assignment Prompt (optional)</label>
                    <input type="text" data-testid="input-prompt"
                      value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="e.g. Analyze the theme of power in Macbeth"
                      className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Essay text */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                    Essay Text <span className="text-red-400">*</span>
                  </label>
                  <textarea data-testid="input-essay"
                    value={essay}
                    onChange={e => { setEssay(e.target.value); setInputError(""); }}
                    placeholder="Paste your full essay here — introduction, body paragraphs, and conclusion…"
                    rows={12}
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed placeholder:text-slate-400"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span>Private — your essay never leaves your browser</span>
                    </div>
                    <span className="text-xs text-slate-400">{wordCount} words</span>
                  </div>
                </div>

                {inputError && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />{inputError}
                  </p>
                )}

                <button type="button" data-testid="button-grade"
                  onClick={handleGrade}
                  disabled={isBusy || wordCount < 50}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                    isBusy || wordCount < 50
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
                  )}>
                  {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Grading Essay…</> : "Grade My Essay"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Model loading */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Loading AI model…</span>
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1.5 mb-1">
              <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.round(progress?.percent ?? 0)}%` }} />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">{Math.round(progress?.percent ?? 0)}% — {progress?.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streaming preview */}
      {isGenerating && streaming && !isDone && (
        <div className="glass-panel rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wider">Grading…</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
            {streaming}
            <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
          </p>
        </div>
      )}

      {isGenerating && !streaming && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
          <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Reading your essay…</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {parseError && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Couldn't parse the grading response.</p>
            <p className="text-xs text-amber-600 mt-1">Try grading again — the AI occasionally produces unexpected formatting.</p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {isDone && result && colors && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Action bar */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Grading Results</p>
              <button type="button" data-testid="button-reset" onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors">
                <RotateCcw className="w-3 h-3" /> Grade New Essay
              </button>
            </div>

            {/* Grade card */}
            <div className={cn("rounded-2xl border-2 p-5", colors.bg)}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Overall Grade</p>
                  <p className={cn("text-6xl font-black tracking-tight", colors.text)}>
                    {result.grade}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Score</p>
                  <p className={cn("text-3xl font-black", colors.text)}>{result.score}<span className="text-lg font-bold">/100</span></p>
                  <p className="text-xs text-slate-400 mt-1">{GRADE_LEVELS.find(g => g.id === gradeLevel)?.label}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{result.overallFeedback}</p>
            </div>

            {/* Dimension scores */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Breakdown — Click any category for detailed feedback</p>

              <ScoreBar
                label="Thesis & Argument"
                desc="Clarity and strength of the central argument"
                score={result.thesisScore}
                feedback={result.thesisFeedback}
                fixTool={null}
              />
              <ScoreBar
                label="Structure & Organization"
                desc="Flow, transitions, and paragraph coherence"
                score={result.structureScore}
                feedback={result.structureFeedback}
                fixTool={null}
              />
              <ScoreBar
                label="Evidence & Support"
                desc="Use of examples, data, and citations"
                score={result.evidenceScore}
                feedback={result.evidenceFeedback}
                fixTool={null}
              />
              <ScoreBar
                label="Clarity & Style"
                desc="Writing quality, word choice, readability"
                score={result.clarityScore}
                feedback={result.clarityFeedback}
                fixTool="/ai-readability-analyzer"
              />
              <ScoreBar
                label="Grammar & Mechanics"
                desc="Sentence structure, spelling, punctuation"
                score={result.grammarScore}
                feedback={result.grammarFeedback}
                fixTool="/ai-paraphrasing-tool"
              />
            </div>

            {/* Strengths & improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">What's Working</p>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="glass-panel rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">Priority Improvements</p>
                <ul className="space-y-2">
                  {result.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Fix this CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Improve Readability</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Check grade level, passive voice, and long sentences</p>
                </div>
                <Link href="/ai-readability-analyzer"
                data-testid="link-readability"
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold whitespace-nowrap hover:opacity-90 transition-all">
                Analyze <ArrowRight className="w-3 h-3" />
              </Link>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Rephrase Weak Sections</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Rewrite paragraphs in Fluency or Formal mode</p>
                </div>
                <Link href="/ai-paraphrasing-tool"
                data-testid="link-paraphrasing"
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold whitespace-nowrap hover:opacity-90 transition-all">
                Rephrase <ArrowRight className="w-3 h-3" />
              </Link>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
