import { useState, useRef, useCallback, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Upload, Image as ImageIcon, Type, Loader2, Copy, Check,
  ChevronDown, ChevronUp, Lightbulb, BookOpen, Sparkles, RefreshCw,
  FlaskConical, Atom, Globe, Landmark, BookMarked, Calculator, X, History,
  Star, Trash2, Brain,
} from "lucide-react";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useToast } from "@/hooks/use-toast";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  title: string;
  content: string;
}
interface Concept {
  name: string;
  description: string;
}
interface Solution {
  answer: string;
  steps: Step[];
  concepts: Concept[];
  whyItMatters: string;
  rawText: string;
}
interface HistoryEntry {
  id: string;
  question: string;
  subject: string;
  answer: string;
  solvedAt: number;
}

type InputTab = "text" | "image";
type SolveMode = "normal" | "eli10";

// ─── Subject Detection ────────────────────────────────────────────────────────

const SUBJECTS: Record<string, { label: string; icon: any; keywords: string[] }> = {
  mathematics: {
    label: "Mathematics", icon: Calculator,
    keywords: ["solve", "equation", "calculate", "x =", "derivative", "integral", "polynomial",
      "fraction", "algebra", "geometry", "trigonometry", "factor", "graph", "slope", "area",
      "volume", "perimeter", "quadratic", "linear", "matrix", "vector", "probability", "statistics",
      "calculus", "limit", "theorem", "proof", "angle", "circle", "triangle", "ratio", "proportion"],
  },
  physics: {
    label: "Physics", icon: Atom,
    keywords: ["force", "velocity", "acceleration", "energy", "mass", "newton", "motion", "wave",
      "light", "electricity", "gravity", "momentum", "friction", "pressure", "density", "temperature",
      "magnetic", "current", "voltage", "resistance", "power", "work", "joule", "speed", "distance"],
  },
  chemistry: {
    label: "Chemistry", icon: FlaskConical,
    keywords: ["element", "compound", "molecule", "reaction", "atom", "periodic table", "bond",
      "acid", "base", "pH", "mole", "molarity", "oxidation", "reduction", "electron", "proton",
      "neutron", "isotope", "valence", "ionic", "covalent", "organic", "inorganic", "balance", "formula"],
  },
  biology: {
    label: "Biology", icon: Sparkles,
    keywords: ["cell", "dna", "organism", "photosynthesis", "evolution", "ecosystem", "species",
      "protein", "chromosome", "gene", "mitosis", "meiosis", "enzyme", "bacteria", "virus",
      "metabolism", "respiration", "nerve", "muscle", "organ", "tissue", "membrane", "nucleus"],
  },
  history: {
    label: "History", icon: Landmark,
    keywords: ["war", "revolution", "century", "empire", "treaty", "civilization", "ancient",
      "modern", "dynasty", "republic", "democracy", "president", "king", "queen", "battle",
      "colony", "independence", "constitution", "world war", "civil war", "renaissance", "medieval"],
  },
  geography: {
    label: "Geography", icon: Globe,
    keywords: ["country", "continent", "river", "mountain", "climate", "capital", "ocean", "sea",
      "latitude", "longitude", "population", "region", "border", "desert", "island", "valley",
      "plate", "tectonic", "erosion", "weather", "biome", "ecosystem", "urban", "rural"],
  },
  literature: {
    label: "Literature", icon: BookMarked,
    keywords: ["author", "novel", "poem", "theme", "character", "metaphor", "shakespeare",
      "plot", "setting", "narrative", "protagonist", "antagonist", "symbolism", "allegory",
      "stanza", "rhyme", "genre", "fiction", "non-fiction", "essay", "literary", "analysis"],
  },
  general: {
    label: "General", icon: BookOpen,
    keywords: [],
  },
};

function detectSubject(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [subject, data] of Object.entries(SUBJECTS)) {
    if (subject === "general") continue;
    scores[subject] = data.keywords.filter(kw => lower.includes(kw)).length;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "general";
}

// ─── Parsing ──────────────────────────────────────────────────────────────────

function parseSolution(raw: string): Solution {
  const norm = raw.replace(/\r\n/g, "\n");

  const answerMatch = norm.match(/ANSWER[:\s]+([\s\S]*?)(?=\n(?:STEPS?|SOLUTION)[:\s]|$)/i);
  const answer = answerMatch ? answerMatch[1].trim() : "";

  const stepsMatch = norm.match(/STEPS?[:\s]+([\s\S]*?)(?=\nCONCEPTS?[:\s]|$)/i);
  const steps: Step[] = [];
  if (stepsMatch) {
    const raw = stepsMatch[1];
    const stepRegex = /Step\s+\d+[:\s]+([^\n]+)\n([\s\S]*?)(?=Step\s+\d+[:\s]|$)/gi;
    let m;
    while ((m = stepRegex.exec(raw)) !== null) {
      const content = m[2].trim();
      if (content) steps.push({ title: m[1].trim(), content });
    }
    if (steps.length === 0 && raw.trim()) {
      steps.push({ title: "Solution", content: raw.trim() });
    }
  }

  const conceptsMatch = norm.match(/CONCEPTS?[:\s]+([\s\S]*?)(?=\nWHY[:\s]|$)/i);
  const concepts: Concept[] = [];
  if (conceptsMatch) {
    const lines = conceptsMatch[1].split("\n").filter(l => l.trim().match(/^[-•*]/));
    for (const line of lines) {
      const clean = line.replace(/^[-•*]\s*/, "");
      const colonIdx = clean.indexOf(":");
      if (colonIdx > 0) {
        concepts.push({ name: clean.slice(0, colonIdx).trim(), description: clean.slice(colonIdx + 1).trim() });
      } else if (clean.trim()) {
        concepts.push({ name: clean.trim(), description: "" });
      }
    }
  }

  const whyMatch = norm.match(/WHY[^:\n]*[:\s]+([\s\S]*?)$/i);
  const whyItMatters = whyMatch ? whyMatch[1].trim() : "";

  if (!answer && steps.length === 0) {
    return { answer: "", steps: [{ title: "Solution", content: norm.trim() }], concepts: [], whyItMatters: "", rawText: norm };
  }

  return { answer, steps, concepts, whyItMatters, rawText: norm };
}

// ─── Math rendering (simple inline LaTeX detection) ───────────────────────────

function renderMathLine(text: string): JSX.Element {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          const expr = part.slice(1, -1);
          try {
            const html = katex.renderToString(expr, { throwOnError: false, output: "html" });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <code key={i} className="px-1 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-sm font-mono">{expr}</code>;
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function StepContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5 shrink-0">•</span>
              <span>{renderMathLine(trimmed.replace(/^[-•*]\s*/, ""))}</span>
            </div>
          );
        }
        if (trimmed.match(/^\d+\.\s/)) {
          return <div key={i} className="font-medium">{renderMathLine(trimmed)}</div>;
        }
        return <p key={i}>{renderMathLine(trimmed)}</p>;
      })}
    </div>
  );
}

// ─── History helpers ──────────────────────────────────────────────────────────

const HISTORY_KEY = "hw-solver-history";
function loadHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 30)));
}

// ─── Example Questions ────────────────────────────────────────────────────────

const EXAMPLES = [
  "Solve: 2x + 5 = 13",
  "Explain the water cycle",
  "What caused World War I?",
  "Calculate the area of a circle with radius 5cm",
  "Balance this equation: H₂ + O₂ → H₂O",
  "Explain Newton's Second Law with an example",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeworkSolver() {
  const { toast } = useToast();
  const { state: llmState, progress, error: llmError, generateRaw } = useWebLLM();

  const [tab, setTab] = useState<InputTab>("text");
  const [question, setQuestion] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrPct, setOcrPct] = useState(0);

  const [detectedSubject, setDetectedSubject] = useState("general");
  const [subjectOverride, setSubjectOverride] = useState<string | null>(null);
  const [mode, setMode] = useState<SolveMode>("normal");

  const [solving, setSolving] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);

  const activeSubject = subjectOverride ?? detectedSubject;
  const SubjectIcon = SUBJECTS[activeSubject]?.icon ?? BookOpen;

  // Detect subject as user types
  useEffect(() => {
    if (question.length > 10) {
      setDetectedSubject(detectSubject(question));
    }
  }, [question]);

  // ─── OCR ──────────────────────────────────────────────────────────────────────

  const runOCR = useCallback(async (file: File) => {
    setOcrRunning(true);
    setOcrPct(0);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") setOcrPct(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const extracted = data.text.trim();
      setOcrText(extracted);
      setQuestion(extracted);
      if (extracted) setDetectedSubject(detectSubject(extracted));
      else toast({ title: "Could not read text", description: "Try a clearer photo or type your question.", variant: "destructive" });
    } catch {
      toast({ title: "OCR failed", description: "Could not read the image. Please type your question instead.", variant: "destructive" });
    } finally {
      setOcrRunning(false);
      setOcrPct(0);
    }
  }, [toast]);

  const onImageDrop = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Not an image", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setOcrText("");
    runOCR(file);
  }, [runOCR, toast]);

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setOcrText("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // ─── Solve ────────────────────────────────────────────────────────────────────

  const solve = useCallback(async () => {
    const q = (tab === "image" ? ocrText || question : question).trim();
    if (!q) {
      toast({ title: "Please enter a question", variant: "destructive" });
      return;
    }

    setSolving(true);
    setStreamText("");
    setSolution(null);
    setExpandedSteps({});
    setSubjectOverride(null);

    const subj = SUBJECTS[activeSubject]?.label ?? "General";

    const systemPrompt = mode === "eli10"
      ? `You are a friendly tutor explaining homework to a 10-year-old. Use simple words, short sentences, everyday examples, and an encouraging tone. No jargon.

Format your response exactly like this:

ANSWER:
[Simple, clear answer]

STEPS:
Step 1: [Simple title]
[Explanation using simple words and analogies]

Step 2: [Simple title]
[Explanation]

CONCEPTS:
- [Simple word]: [Kid-friendly definition]

WHY IT MATTERS:
[1 sentence about why this is cool or useful]`
      : `You are an expert tutor. Teach the student by explaining step-by-step, not just giving the answer. Subject: ${subj}.

Format your response EXACTLY like this — use these exact section headers:

ANSWER:
[The final answer, clearly stated]

STEPS:
Step 1: [Step title]
[Detailed explanation. Show all work and calculations.]

Step 2: [Step title]
[Explanation with reasoning]

[Continue for all steps needed]

CONCEPTS:
- [Concept Name]: [Brief, clear definition]
- [Concept Name]: [Brief definition]

WHY IT MATTERS:
[1-2 sentences on why this topic is useful]

Rules:
- Show all work for math problems
- Explain WHY each step is done, not just HOW
- Use simple language
- For equations, write them clearly (e.g. "2x + 5 = 13")`;

    const userMsg = `Problem: ${q}\n\nPlease solve this step-by-step following the format exactly.`;

    const result = await generateRaw({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMsg },
      ],
      temperature: 0.4,
      maxTokens: 1200,
      onChunk: (text) => {
        setStreamText(text);
        if (streamRef.current) {
          streamRef.current.scrollTop = streamRef.current.scrollHeight;
        }
      },
    });

    setSolving(false);

    if (result) {
      const parsed = parseSolution(result);
      setSolution(parsed);
      setExpandedSteps(
        Object.fromEntries(parsed.steps.map((_, i) => [i, true]))
      );

      const entry: HistoryEntry = {
        id: Math.random().toString(36).slice(2),
        question: q.slice(0, 120),
        subject: activeSubject,
        answer: parsed.answer.slice(0, 200),
        solvedAt: Date.now(),
      };
      const updated = [entry, ...history].slice(0, 30);
      setHistory(updated);
      saveHistory(updated);
    }
  }, [tab, question, ocrText, activeSubject, mode, generateRaw, history, toast]);

  const copyAll = () => {
    if (!solution) return;
    const text = [
      solution.answer ? `Answer: ${solution.answer}` : "",
      solution.steps.map((s, i) => `Step ${i + 1}: ${s.title}\n${s.content}`).join("\n\n"),
      solution.concepts.length ? "Key Concepts:\n" + solution.concepts.map(c => `• ${c.name}: ${c.description}`).join("\n") : "",
    ].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setQuestion(entry.question);
    setDetectedSubject(entry.subject);
    setSolution(null);
    setStreamText("");
    setShowHistory(false);
    setTab("text");
  };

  const deleteHistory = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    saveHistory(updated);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  const isModelReady = llmState === "ready" || llmState === "generating";
  const isModelLoading = llmState === "checking-gpu" || llmState === "downloading";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Model loading banner */}
      {isModelLoading && (
        <div className="rounded-2xl border border-purple-100 dark:border-purple-800/40 bg-purple-50 dark:bg-purple-900/20 p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-500 animate-spin shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {llmState === "checking-gpu" ? "Checking browser AI support…" : "Loading AI model…"}
            </p>
            {progress.text && (
              <p className="text-xs text-purple-500 dark:text-purple-400 truncate mt-0.5">{progress.text}</p>
            )}
            {progress.percent > 0 && (
              <div className="mt-2 w-full bg-purple-200 dark:bg-purple-800/50 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {llmError && (
        <div className="rounded-2xl border border-red-100 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
          {llmError}
        </div>
      )}

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setTab("text")}
            data-testid="tab-text-input"
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
              ${tab === "text"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Type className="w-4 h-4" /> Type Question
          </button>
          <button
            onClick={() => setTab("image")}
            data-testid="tab-image-input"
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
              ${tab === "image"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <ImageIcon className="w-4 h-4" /> Upload Image
          </button>

          {/* History button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            data-testid="button-show-history"
            className={`ml-auto flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              ${showHistory ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {history.length > 0 && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 rounded-full px-1.5 py-0.5">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* History drawer */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-slate-100 dark:border-slate-700"
            >
              <div className="p-4 max-h-64 overflow-y-auto space-y-2">
                {history.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No history yet — solve a problem to get started.</p>
                ) : (
                  history.map(entry => {
                    const Icon = SUBJECTS[entry.subject]?.icon ?? BookOpen;
                    return (
                      <div key={entry.id}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer group transition-colors"
                        onClick={() => loadFromHistory(entry)}
                        data-testid={`history-item-${entry.id}`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-purple-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{entry.question}</p>
                          {entry.answer && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">{entry.answer}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteHistory(entry.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-5 space-y-4">
          {/* Text input */}
          {tab === "text" && (
            <div className="space-y-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Paste your homework question here…&#10;&#10;Examples:&#10;• Solve: 2x + 5 = 13&#10;• Explain the water cycle&#10;• What caused World War I?"
                rows={5}
                data-testid="input-question"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 resize-none transition-colors"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{question.length} chars</span>
                {question && (
                  <button onClick={() => { setQuestion(""); setSolution(null); setStreamText(""); }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Image upload */}
          {tab === "image" && (
            <div className="space-y-3">
              {!imagePreview ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onImageDrop(f); }}
                  onClick={() => fileRef.current?.click()}
                  data-testid="dropzone-homework-image"
                  className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-all text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">Take a photo or upload an image</p>
                    <p className="text-sm text-slate-400 mt-1">Supports JPG, PNG, WebP · max 10 MB</p>
                  </div>
                  <input
                    ref={fileRef} type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    data-testid="input-image-homework"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageDrop(f); }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img src={imagePreview} alt="Homework" className="w-full max-h-64 object-contain" />
                    <button onClick={clearImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-500 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {ocrRunning ? (
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      <div className="flex-1">
                        <span>Reading text from image… {ocrPct}%</span>
                        <div className="mt-1.5 h-1.5 bg-purple-200 dark:bg-purple-800/50 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${ocrPct}%` }} />
                        </div>
                      </div>
                    </div>
                  ) : ocrText ? (
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 p-3">
                      <p className="text-xs text-slate-400 mb-1 font-medium">Text extracted from image:</p>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={3}
                        data-testid="input-ocr-question"
                        className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none"
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Subject detection */}
          {(question.length > 8 || ocrText) && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-medium">
                <SubjectIcon className="w-3.5 h-3.5" />
                {SUBJECTS[activeSubject]?.label ?? "General"}
              </div>
              <span className="text-xs text-slate-400">Change subject:</span>
              {Object.entries(SUBJECTS).map(([key, data]) => (
                <button key={key}
                  onClick={() => setSubjectOverride(key)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border
                    ${activeSubject === key
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                      : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-purple-300"}`}
                >
                  {data.label}
                </button>
              ))}
            </div>
          )}

          {/* Mode toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("normal")}
              data-testid="mode-normal"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors border
                ${mode === "normal"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-purple-400"}`}
            >
              <GraduationCap className="w-4 h-4" />
              Step-by-Step
            </button>
            <button
              onClick={() => setMode("eli10")}
              data-testid="mode-eli10"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors border
                ${mode === "eli10"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-amber-400"}`}
            >
              <Brain className="w-4 h-4" />
              Explain Simply
            </button>
          </div>

          {/* Solve button */}
          <button
            onClick={solve}
            disabled={!isModelReady || solving || (!question.trim() && !ocrText.trim())}
            data-testid="button-solve"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {solving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Solving…</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Solve This Problem</>
            )}
          </button>

          {/* Example chips */}
          {!question && !imagePreview && (
            <div className="pt-1">
              <p className="text-xs text-slate-400 mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => { setQuestion(ex); setTab("text"); }}
                    data-testid={`example-${ex.slice(0, 10).replace(/\s/g, "-")}`}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 transition-colors">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Streaming preview */}
      <AnimatePresence>
        {solving && streamText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 dark:border-slate-700">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Working on it…</span>
            </div>
            <div
              ref={streamRef}
              className="p-5 max-h-64 overflow-y-auto font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed"
            >
              {streamText}
              <span className="inline-block w-1.5 h-3 bg-purple-400 animate-pulse ml-0.5 align-text-bottom" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {solution && !solving && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                Solution
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyAll}
                  data-testid="button-copy-solution"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy All"}
                </button>
                <InlineShareButtons />
                <button
                  onClick={() => { setSolution(null); setStreamText(""); }}
                  data-testid="button-new-problem"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> New Problem
                </button>
              </div>
            </div>

            {/* Answer card */}
            {solution.answer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-200 text-sm uppercase tracking-wide">Final Answer</h3>
                </div>
                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100 leading-relaxed" data-testid="text-answer">
                  {renderMathLine(solution.answer)}
                </p>
              </motion.div>
            )}

            {/* Steps */}
            {solution.steps.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Step-by-Step Solution</h3>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {solution.steps.map((step, i) => (
                    <div key={i} data-testid={`step-${i}`}>
                      <button
                        onClick={() => setExpandedSteps(prev => ({ ...prev, [i]: !prev[i] }))}
                        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left"
                      >
                        <span className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{step.title}</span>
                        {expandedSteps[i]
                          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {expandedSteps[i] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 pt-1 border-l-2 border-purple-200 dark:border-purple-700/50 ml-8 mr-5">
                              <StepContent content={step.content} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concepts */}
            {solution.concepts.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Key Concepts</h3>
                </div>
                <div className="space-y-2" data-testid="concepts-container">
                  {solution.concepts.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/80 dark:border-amber-800/20">
                      <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                      <div>
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{c.name}</span>
                        {c.description && (
                          <span className="text-slate-500 dark:text-slate-400 text-sm">: {c.description}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why it matters */}
            {solution.whyItMatters && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Why It Matters</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed" data-testid="text-why-matters">
                    {solution.whyItMatters}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
