import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  ChevronLeft, ChevronRight, Download, Plus, Lock,
  BookOpen, RefreshCw, Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Flashcard {
  front: string;
  back: string;
}

interface StudyGuide {
  subject: string;
  difficulty: string;
  keyTerms: string[];
  summary: string;
  practiceQuestions: string[];
  cards: Flashcard[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CARD_COUNTS = [10, 20, 30, 50];

const MODES = [
  { id: "flashcards", label: "Flashcards + Study Guide", desc: "Full set of cards + a comprehensive study guide" },
  { id: "cards-only", label: "Flashcards Only", desc: "Just the Q&A cards, fast output" },
  { id: "guide-only", label: "Study Guide Only", desc: "Summary, key terms, and practice questions" },
];

const HISTORY_KEY = "flashcard-history-v1";

// ─── Parsing ─────────────────────────────────────────────────────────────────

function parseOutput(raw: string): StudyGuide {
  const get = (tag: string) => {
    const rx = new RegExp(`${tag}[:\\s]*\\n?([\\s\\S]*?)(?=\\n[A-Z][A-Z &]+:|$)`, "i");
    return (raw.match(rx)?.[1] ?? "").trim();
  };

  // Parse flashcards from FRONT/BACK pairs
  const cards: Flashcard[] = [];
  const cardRx = /FRONT:\s*(.+?)[\r\n]+BACK:\s*([\s\S]+?)(?=FRONT:|$)/gi;
  let m;
  while ((m = cardRx.exec(raw)) !== null) {
    const front = m[1].trim();
    const back = m[2].trim().replace(/\n{2,}/g, "\n").trim();
    if (front && back) cards.push({ front, back });
  }

  const keyTermsRaw = get("KEY TERMS?");
  const keyTerms = keyTermsRaw
    .split(/[\n,]/)
    .map(t => t.replace(/^[-•*\d.]+\s*/, "").trim())
    .filter(Boolean);

  const practiceQuestionsRaw = get("PRACTICE QUESTIONS?");
  const practiceQuestions = practiceQuestionsRaw
    .split("\n")
    .map(q => q.replace(/^[-•*\d.]+\s*/, "").trim())
    .filter(Boolean);

  return {
    subject: get("SUBJECT|TOPIC").split("\n")[0].trim(),
    difficulty: get("DIFFICULTY|LEVEL").split("\n")[0].trim(),
    keyTerms,
    summary: get("SUMMARY|OVERVIEW"),
    practiceQuestions,
    cards,
    raw,
  } as StudyGuide & { raw: string };
}

function buildMessages(notes: string, count: number, mode: string) {
  const wantCards = mode !== "guide-only";
  const wantGuide = mode !== "cards-only";

  const cardSection = wantCards ? `Generate exactly ${count} flashcards. Each card MUST use this exact format:
FRONT: [one clear question or term]
BACK: [concise answer, 1–2 sentences max]

Repeat for all ${count} cards without skipping any.` : "";

  const guideSection = wantGuide ? `After the cards, output:
SUBJECT: [topic in 4–6 words]
DIFFICULTY: [Beginner / Intermediate / Advanced]
SUMMARY:
[2–3 sentences covering the main ideas]
KEY TERMS:
[5–8 terms, one per line, format: Term — definition]
PRACTICE QUESTIONS:
[5 numbered questions]` : "";

  const systemPrompt = `You are a flashcard and study guide generator. Be concise. Every answer must be short enough to memorize.
${cardSection}
${guideSection}
Output ONLY the requested content. No preamble, no commentary.`;

  return [
    { role: "system" as const, content: systemPrompt },
    {
      role: "user" as const,
      content: `Notes to study:\n${notes}`,
    },
  ];
}

// ─── Flashcard Viewer ────────────────────────────────────────────────────────

function FlashcardViewer({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = cards[index];
  const knownCount = known.size;

  const go = (dir: number) => {
    setIndex(i => Math.max(0, Math.min(cards.length - 1, i + dir)));
    setFlipped(false);
  };

  const markKnown = () => {
    setKnown(prev => { const n = new Set(prev); n.add(index); return n; });
    if (index < cards.length - 1) go(1);
  };

  const [copied, setCopied] = useState(false);
  const handleCopyAll = () => {
    const text = cards.map((c, i) => `Card ${i + 1}\nQ: ${c.front}\nA: ${c.back}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500">{index + 1} / {cards.length}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{knownCount} known</span>
          <button type="button" data-testid="button-copy-all-cards" onClick={handleCopyAll}
            className={cn("flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all",
              copied ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300 hover:text-purple-600"
            )}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? "Copied!" : "Copy All"}
          </button>
        </div>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
        <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
      </div>

      {/* Card */}
      <div
        data-testid={`card-flashcard-${index}`}
        onClick={() => setFlipped(v => !v)}
        className={cn(
          "relative w-full rounded-2xl border-2 cursor-pointer transition-all min-h-[200px] flex flex-col items-center justify-center p-8 text-center select-none",
          flipped
            ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700"
            : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-purple-300"
        )}
      >
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-slate-400">
          {flipped ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {flipped ? "Answer" : "Question"}
        </div>
        {known.has(index) && (
          <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Known</div>
        )}
        <p className={cn("font-semibold leading-relaxed", flipped ? "text-purple-800 dark:text-purple-200 text-sm" : "text-slate-800 dark:text-slate-100 text-base")}>
          {flipped ? card.back : card.front}
        </p>
        <p className="text-xs text-slate-400 mt-4">Tap to {flipped ? "see question" : "reveal answer"}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button type="button" data-testid="button-prev-card" onClick={() => go(-1)} disabled={index === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <button type="button" data-testid="button-mark-known" onClick={markKnown}
          className={cn(
            "flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all",
            known.has(index)
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-700 dark:text-emerald-400"
              : "border-emerald-400 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          )}
        >
          {known.has(index) ? "✓ Known" : "Mark as Known"}
        </button>

        <button type="button" data-testid="button-next-card" onClick={() => go(1)} disabled={index === cards.length - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Shuffle / Reset */}
      <div className="flex gap-2">
        <button type="button" data-testid="button-reset-progress" onClick={() => { setIndex(0); setFlipped(false); setKnown(new Set()); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300 hover:text-purple-600 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
        </button>
      </div>

      {/* Card list */}
      <details className="group">
        <summary className="cursor-pointer text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors list-none flex items-center gap-1.5 py-2">
          <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" /> View all {cards.length} cards
        </summary>
        <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
          {cards.map((c, i) => (
            <button key={i} type="button" data-testid={`button-jump-card-${i}`}
              onClick={() => { setIndex(i); setFlipped(false); }}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl border transition-all",
                i === index ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20" : "border-slate-200 dark:border-slate-700 hover:border-purple-300"
              )}
            >
              <div className="flex items-start gap-2">
                <span className={cn("text-[10px] font-bold mt-0.5 shrink-0", known.has(i) ? "text-emerald-500" : "text-slate-400")}>{i + 1}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{c.front}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight line-clamp-1">{c.back}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

// ─── Anki Export ─────────────────────────────────────────────────────────────

function exportToTxt(cards: Flashcard[], subject: string) {
  const lines = cards.map(c => `${c.front}\t${c.back}`).join("\n");
  const blob = new Blob([lines], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${subject || "flashcards"}-anki.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportStudyGuide(guide: StudyGuide, subject: string) {
  const lines = [
    `STUDY GUIDE: ${guide.subject || subject}`,
    `Difficulty: ${guide.difficulty}`,
    "",
    "SUMMARY",
    guide.summary,
    "",
    "KEY TERMS",
    ...guide.keyTerms.map(t => `• ${t}`),
    "",
    "PRACTICE QUESTIONS",
    ...guide.practiceQuestions.map((q, i) => `${i + 1}. ${q}`),
    "",
    "FLASHCARDS",
    ...guide.cards.map((c, i) => `\n[${i + 1}]\nQ: ${c.front}\nA: ${c.back}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${subject || "study-guide"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FlashcardGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [notes, setNotes] = useState("");
  const [cardCount, setCardCount] = useState(10);
  const [mode, setMode] = useState("cards-only");
  const [guide, setGuide] = useState<StudyGuide | null>(null);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [activeTab, setActiveTab] = useState<"cards" | "guide">("cards");

  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";

  const handleGenerate = useCallback(async (extraNotes?: string) => {
    const text = (extraNotes ?? notes).trim();
    if (text.length < 20) { setInputError("Please paste some notes or text (at least a sentence)."); return; }
    setInputError("");
    setGuide(null);
    setStreaming("");
    setIsDone(false);

    const raw = await generateRaw({
      messages: buildMessages(text, cardCount, mode),
      temperature: 0.4,
      maxTokens: 2000,
      onChunk: (chunk) => setStreaming(chunk),
    });

    if (raw) {
      const parsed = parseOutput(raw);
      setGuide(parsed);
      setStreaming("");
      setIsDone(true);
      if (parsed.cards.length > 0) setActiveTab("cards");
      else setActiveTab("guide");
    }
  }, [notes, cardCount, mode, generateRaw]);

  const handleMoreCards = useCallback(async () => {
    if (!guide) return;
    const existing = guide.cards.map(c => `Q: ${c.front}`).join("\n");
    await handleGenerate(`${notes}\n\nI already have these flashcards, generate ${cardCount} NEW ones that don't overlap:\n${existing}`);
  }, [guide, notes, cardCount, handleGenerate]);

  const handleReset = () => {
    setNotes(""); setGuide(null); setStreaming(""); setIsDone(false); setInputError("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">

      {/* Mode selector */}
      <div className="glass-panel rounded-2xl p-4 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Output Mode</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MODES.map(m => {
              const active = mode === m.id;
              return (
                <button key={m.id} type="button" data-testid={`button-mode-${m.id}`} onClick={() => setMode(m.id)}
                  className={cn(
                    "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                    active ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300"
                  )}
                >
                  <span className={cn("text-xs font-bold leading-none", active ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>{m.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-tight">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card count */}
        {mode !== "guide-only" && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Number of Flashcards</p>
            <div className="flex gap-2">
              {CARD_COUNTS.map(n => (
                <button key={n} type="button" data-testid={`button-count-${n}`} onClick={() => setCardCount(n)}
                  className={cn(
                    "px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all",
                    cardCount === n ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-300"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes input */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Paste Your Notes</p>
          </div>
          {notes && (
            <button type="button" data-testid="button-clear-notes" onClick={() => setNotes("")} className="text-xs text-slate-400 hover:text-red-400 transition-colors">Clear</button>
          )}
        </div>
        <textarea
          data-testid="input-notes"
          value={notes}
          onChange={e => { setNotes(e.target.value); setInputError(""); }}
          placeholder={"Paste lecture notes, textbook excerpts, article text, or any study material here…\n\nWorks with any subject: Biology, History, Law, Chemistry, Computer Science, Economics, and more."}
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-3 text-sm leading-relaxed resize-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
          style={{ minHeight: 200 }}
        />
        {inputError && (
          <div className="px-4 pb-3">
            <p className="text-xs text-red-500 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" />{inputError}</p>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lock className="w-3 h-3" />
            <span>Private — your notes never leave your browser</span>
          </div>
          <span className="text-xs text-slate-400">{notes.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </div>

      {/* Generate button */}
      <div className="flex gap-3">
        <button type="button" data-testid="button-generate"
          onClick={() => handleGenerate()}
          disabled={isGenerating || isLoading || notes.trim().length < 20}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm",
            isGenerating || isLoading || notes.trim().length < 20
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-purple-500/20"
          )}
        >
          {isGenerating
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
            : <><BookOpen className="w-4 h-4" /> Generate {mode !== "guide-only" ? `${cardCount} Flashcards` : "Study Guide"}</>
          }
        </button>
        {(notes || isDone) && (
          <button type="button" data-testid="button-reset" onClick={handleReset}
            className="px-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-300 hover:text-red-500 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Model loading */}
      <AnimatePresence>
        {state === "downloading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
          >
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

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Streaming */}
      {isGenerating && streaming && (
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Generating…</span>
          </div>
          <pre className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed max-h-52 overflow-hidden font-mono">
            {streaming}
            <span className="inline-block w-1 h-3 bg-purple-500 animate-pulse ml-0.5 align-middle" />
          </pre>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {isDone && guide && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {guide.subject || "Study Set"}
                </p>
                {guide.difficulty && (
                  <span className="text-xs text-slate-400">{guide.difficulty}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {guide.cards.length > 0 && (
                  <button type="button" data-testid="button-export-anki"
                    onClick={() => exportToTxt(guide.cards, guide.subject)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Export for Anki (.txt)
                  </button>
                )}
                <button type="button" data-testid="button-export-guide"
                  onClick={() => exportStudyGuide(guide, guide.subject)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-300 hover:text-purple-600 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download Guide (.txt)
                </button>
              </div>
            </div>

            {/* Tabs */}
            {guide.cards.length > 0 && (guide.summary || guide.keyTerms.length > 0) && (
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                {[
                  { key: "cards", label: `Flashcards (${guide.cards.length})` },
                  { key: "guide", label: "Study Guide" },
                ].map(tab => (
                  <button key={tab.key} type="button" data-testid={`button-tab-${tab.key}`}
                    onClick={() => setActiveTab(tab.key as "cards" | "guide")}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                      activeTab === tab.key
                        ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Flashcard tab */}
            {activeTab === "cards" && guide.cards.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-2xl p-5">
                <FlashcardViewer cards={guide.cards} />
              </motion.div>
            )}

            {/* Study guide tab */}
            {(activeTab === "guide" || guide.cards.length === 0) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {guide.summary && (
                  <div className="glass-panel rounded-2xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">Summary</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{guide.summary}</p>
                  </div>
                )}
                {guide.keyTerms.length > 0 && (
                  <div className="glass-panel rounded-2xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Key Terms</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {guide.keyTerms.map((t, i) => (
                        <div key={i} className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {guide.practiceQuestions.length > 0 && (
                  <div className="glass-panel rounded-2xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Practice Questions</p>
                    <ol className="space-y-2">
                      {guide.practiceQuestions.map((q, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-200">
                          <span className="text-purple-400 font-bold shrink-0">{i + 1}.</span>
                          <span className="leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </motion.div>
            )}

            {/* Generate more cards */}
            {isDone && guide.cards.length > 0 && mode !== "guide-only" && (
              <button type="button" data-testid="button-more-cards"
                onClick={handleMoreCards}
                disabled={isGenerating || isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 font-semibold text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all disabled:opacity-40"
              >
                <Plus className="w-4 h-4" /> Generate {cardCount} More Cards
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
