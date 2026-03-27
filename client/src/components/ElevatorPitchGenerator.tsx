import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  RefreshCw, Download, Copy, Save, FolderOpen, Trash2, X,
  Target, TrendingUp, Sparkles, RotateCcw, Star, Timer,
  Play, Pause, RotateCw, Clock, MessageSquare, HelpCircle
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useElevatorPitchStorage } from "@/hooks/use-elevator-pitch-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

const AUDIENCES = [
  { value: "investors", label: "Investors", desc: "ROI, market size, traction" },
  { value: "customers", label: "Customers", desc: "Benefits, pain points, value" },
  { value: "partners", label: "Partners", desc: "Mutual value, collaboration" },
  { value: "general", label: "General / Networking", desc: "Memorable, clear" },
];

const STAGES = [
  { value: "idea", label: "Idea Stage" },
  { value: "mvp", label: "MVP / Early Product" },
  { value: "revenue", label: "Early Revenue" },
  { value: "growth", label: "Growth Stage" },
];

const OUTCOMES = [
  { value: "meeting", label: "Get Meeting / Follow-up" },
  { value: "investment", label: "Investment / Funding" },
  { value: "sale", label: "First Sale / Customer" },
  { value: "partnership", label: "Partnership" },
  { value: "interest", label: "General Interest" },
];

const SYSTEM_PROMPT = `You are an expert startup pitch coach. You write concise, compelling elevator pitches that hook attention, use simple language, include specific numbers, and end with clear calls to action. You always output exactly 5 pitch variations when asked.`;

interface ParsedPitch {
  id: string;
  angle: string;
  duration: string;
  pitchText: string;
  wordCount: number;
  speakingTime: string;
  score: number;
  analysis: string[];
  whenToUse: string;
  followUpQuestions: string[];
}

function parsePitches(raw: string): ParsedPitch[] {
  const pitches: ParsedPitch[] = [];

  const sections = raw.split(/(?:PITCH\s*#?\s*\d|pitch\s*#?\s*\d|\n\d+[\.\)]\s+[A-Z])/i);

  if (sections.length <= 1) {
    const altSections = raw.split(/(?:---+|\*\*\*+|===+|#{2,}\s)/);
    if (altSections.length > 1) {
      sections.length = 0;
      sections.push("", ...altSections.filter(s => s.trim().length > 30));
    }
  }

  const ANGLE_NAMES = ["Problem-First", "Vision-First", "Traction-First", "Story Approach", "Contrarian"];

  for (let i = 1; i < sections.length && pitches.length < 5; i++) {
    const section = sections[i];

    const angleMatch = section.match(/^[:\s.\-)*]*(.+?)(?:\n|$)/);
    let angle = angleMatch ? angleMatch[1].replace(/^[:\s*\-)+.]+/, "").trim() : "";
    angle = angle.replace(/\(.*?\)/, "").trim();
    if (!angle || angle.length > 50) angle = ANGLE_NAMES[pitches.length] || `Pitch ${pitches.length + 1}`;

    const durationMatch = section.match(/(\d+)[- ]?(?:second|sec)/i);
    const duration = durationMatch ? `${durationMatch[1]}s` : ["30s", "60s", "30s", "45s", "30s"][pitches.length] || "30s";

    let pitchText = "";

    const quoteBlocks = section.match(/"([^"]{20,})"/s);
    if (quoteBlocks) {
      pitchText = quoteBlocks[1].trim();
    }

    if (!pitchText || pitchText.length < 20) {
      const lines = section.split("\n");
      const bodyLines: string[] = [];
      let inBody = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (!inBody) {
          if (trimmed.length > 20 && !trimmed.match(/^(PITCH|pitch|word\s*count|speaking|score|strength|analysis|what\s*works|when\s*to|follow|framework|approach|angle|#|\d+[\.\)])/i)) {
            inBody = true;
            bodyLines.push(trimmed.replace(/^["]+|["]+$/g, ""));
          }
          continue;
        }
        if (trimmed.match(/^(word\s*count|speaking\s*time|pitch\s*strength|score|analysis|what\s*works|when\s*to\s*use|follow|framework|━|───|---)/i)) break;
        if (trimmed.length === 0) { bodyLines.push(""); continue; }
        bodyLines.push(trimmed.replace(/^["]+|["]+$/g, ""));
      }
      const candidate = bodyLines.join("\n").trim();
      if (candidate.length > pitchText.length) pitchText = candidate;
    }

    if (!pitchText || pitchText.length < 20) continue;

    const wordCount = pitchText.split(/\s+/).filter(w => w.length > 0).length;

    const timeMatch = section.match(/speaking\s*time\s*[:\s]*~?(\d+)\s*seconds?/i);
    const speakingTime = timeMatch ? `${timeMatch[1]} seconds` : `~${Math.round(wordCount / 2.5)} seconds`;

    const scoreMatch = section.match(/(?:pitch\s*strength|score)\s*[:\s]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7.5;

    const analysis: string[] = [];
    const analysisBlock = section.match(/(?:analysis|what\s*works|strengths?)\s*[:\s]*([\s\S]*?)(?=when\s*to\s*use|follow|likely|pitch\s*#|\d+[\.\)]\s|---|\n\s*\n\s*\n|$)/i);
    if (analysisBlock) {
      for (const line of analysisBlock[1].split("\n")) {
        const cleaned = line.replace(/^[\s\-*•✓✅]+/, "").trim();
        if (cleaned.length > 5) analysis.push(cleaned);
      }
    }

    const whenMatch = section.match(/when\s*to\s*use\s*[:\s]*([\s\S]*?)(?=follow|likely|pitch\s*#|\d+[\.\)]\s|---|\n\s*\n\s*\n|$)/i);
    const whenToUse = whenMatch
      ? whenMatch[1].split("\n").map(l => l.replace(/^[\s\-*•]+/, "").trim()).filter(l => l.length > 3).join(", ")
      : "";

    const followUpQuestions: string[] = [];
    const followBlock = section.match(/(?:follow[- ]?up\s*questions?|likely\s*follow|questions?\s*they\s*might)\s*[:\s]*([\s\S]*?)(?=pitch\s*#|\d+[\.\)]\s|---|\n\s*\n\s*\n|$)/i);
    if (followBlock) {
      for (const line of followBlock[1].split("\n")) {
        const cleaned = line.replace(/^[\s\-*•"]+/, "").replace(/["]+$/, "").trim();
        if (cleaned.length > 5 && cleaned.includes("?")) followUpQuestions.push(cleaned);
      }
    }

    pitches.push({
      id: generateId(),
      angle,
      duration,
      pitchText,
      wordCount,
      speakingTime,
      score: Math.round(score * 10) / 10,
      analysis: analysis.slice(0, 6),
      whenToUse,
      followUpQuestions: followUpQuestions.slice(0, 5),
    });
  }

  return pitches;
}

function getScoreColor(score: number) {
  if (score >= 9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 8) return "text-blue-600 bg-blue-50 border-blue-200";
  if (score >= 7) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

function PracticeTimer({ wordCount, onClose }: { wordCount: number; onClose: () => void }) {
  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const setTimerDuration = (d: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setDuration(d);
    setTimeLeft(d);
  };

  const pct = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
  const isFinished = timeLeft === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          <Timer className="w-4 h-4 text-purple-500" /> Practice Timer
        </h4>
        <button
          data-testid="button-close-timer"
          onClick={onClose}
          aria-label="Close practice timer"
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {[30, 45, 60].map((d) => (
          <button
            key={d}
            data-testid={`button-timer-${d}`}
            onClick={() => setTimerDuration(d)}
            aria-pressed={duration === d}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
              duration === d
                ? "bg-purple-100 border-purple-300 text-purple-700"
                : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
            )}
          >
            {d}s
          </button>
        ))}
      </div>

      <div className="text-center mb-4">
        <div className={cn(
          "text-5xl font-display font-extrabold tabular-nums",
          isFinished ? "text-red-500" : timeLeft <= 10 ? "text-amber-500" : "text-slate-800"
        )}>
          {timeLeft}
        </div>
        <p className="text-xs text-slate-400 mt-1">seconds remaining</p>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            isFinished ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-purple-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-3 mb-3">
        {!running ? (
          <button
            data-testid="button-timer-start"
            onClick={start}
            disabled={isFinished}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all",
              isFinished
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            )}
          >
            <Play className="w-4 h-4" /> Start
          </button>
        ) : (
          <button
            data-testid="button-timer-pause"
            onClick={pause}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
        )}
        <button
          data-testid="button-timer-reset"
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
          <RotateCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="text-center text-xs text-slate-400">
        <Clock className="w-3 h-3 inline mr-1" />
        {wordCount} words &middot; ~{Math.round(wordCount / 2.5)}s at normal pace
      </div>
    </div>
  );
}

export function ElevatorPitchGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { drafts, saveDraft, deleteDraft } = useElevatorPitchStorage();
  const [showDrafts, setShowDrafts] = useState(false);

  const [business, setBusiness] = useState("");
  const [audience, setAudience] = useState("investors");
  const [stage, setStage] = useState("idea");
  const [uniqueAngle, setUniqueAngle] = useState("");
  const [traction, setTraction] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("meeting");

  const [streamedContent, setStreamedContent] = useState("");
  const [pitches, setPitches] = useState<ParsedPitch[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [expandedPitch, setExpandedPitch] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emptyError, setEmptyError] = useState("");
  const [timerPitchId, setTimerPitchId] = useState<string | null>(null);

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";
  const isFormValid = business.trim() && uniqueAngle.trim();

  const buildPrompt = () => {
    const audienceLabel = AUDIENCES.find(a => a.value === audience)?.label || audience;
    const stageLabel = STAGES.find(s => s.value === stage)?.label || stage;
    const outcomeLabel = OUTCOMES.find(o => o.value === desiredOutcome)?.label || desiredOutcome;

    let audienceInstructions = "";
    if (audience === "investors") {
      audienceInstructions = "Focus on market size, ROI potential, traction, and business metrics. Include a clear funding ask.";
    } else if (audience === "customers") {
      audienceInstructions = "Focus on benefits, pain points, and emotional language. Include a clear value proposition.";
    } else if (audience === "partners") {
      audienceInstructions = "Focus on mutual value, collaboration opportunities, and win-win framing.";
    } else {
      audienceInstructions = "Keep it memorable, conversational, and easy to understand. Focus on creating interest.";
    }

    let prompt = `Write 5 short elevator pitches for this business. Each pitch uses a different angle.

Business: ${business}
Audience: ${audienceLabel}
Stage: ${stageLabel}
Differentiator: ${uniqueAngle}`;

    if (traction.trim()) prompt += `\nTraction: ${traction}`;

    prompt += `\nGoal: ${outcomeLabel}
Note: ${audienceInstructions}

Write exactly 5 pitches in this format:

PITCH #1: Problem-First
"(30-second pitch starting with a pain point, then solution, proof, and ask)"
Score: X/10
What Works: (2-3 bullet points)
When to Use: (one line)
Follow-up Questions: (2-3 questions with ?)

PITCH #2: Vision-First
"(60-second pitch starting with big picture vision, then problem, solution, proof, ask)"
Score: X/10
What Works: (2-3 bullet points)
When to Use: (one line)
Follow-up Questions: (2-3 questions with ?)

PITCH #3: Traction-First
"(30-second pitch leading with numbers/proof, then explanation, ask)"
Score: X/10
What Works: (2-3 bullet points)
When to Use: (one line)
Follow-up Questions: (2-3 questions with ?)

PITCH #4: Story Approach
"(45-second pitch with personal story hook, problem, solution, results, ask)"
Score: X/10
What Works: (2-3 bullet points)
When to Use: (one line)
Follow-up Questions: (2-3 questions with ?)

PITCH #5: Contrarian
"(30-second pitch challenging an assumption, different approach, why it works, ask)"
Score: X/10
What Works: (2-3 bullet points)
When to Use: (one line)
Follow-up Questions: (2-3 questions with ?)

Keep pitches natural and conversational. Use specific numbers. End each with a clear call to action.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!isFormValid) return;

    setStreamedContent("");
    setPitches([]);
    setIsDone(false);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setExpandedPitch(null);
    setTimerPitchId(null);

    const finalContent = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt() },
      ],
      temperature: 0.7,
      maxTokens: 4096,
      onChunk: (chunk) => setStreamedContent(chunk),
    });

    if (finalContent) {
      console.log("Raw elevator pitch output:", finalContent);
      const parsed = parsePitches(finalContent);
      if (parsed.length === 0) {
        setEmptyError("Could not parse pitch variations. Please try generating again.");
      } else {
        setPitches(parsed);
        setExpandedPitch(parsed[0].id);
      }
      setIsDone(true);
    } else {
      setEmptyError("Generation produced no output. Please try again.");
      setIsDone(true);
    }
  };

  const handleReset = () => {
    setBusiness("");
    setAudience("investors");
    setStage("idea");
    setUniqueAngle("");
    setTraction("");
    setDesiredOutcome("meeting");
    setStreamedContent("");
    setPitches([]);
    setIsDone(false);
    setExpandedPitch(null);
    setCopiedId(null);
    setSaved(false);
    setEmptyError("");
    setTimerPitchId(null);
  };

  const handleCopyPitch = (pitch: ParsedPitch) => {
    navigator.clipboard.writeText(pitch.pitchText);
    setCopiedId(pitch.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = pitches.map((p, i) => [
      `--- PITCH ${i + 1}: ${p.angle} (${p.duration}) ---`,
      "",
      p.pitchText,
      "",
      `Word Count: ${p.wordCount} | Speaking Time: ${p.speakingTime} | Score: ${p.score}/10`,
    ].join("\n")).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId("all");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = () => {
    const text = pitches.map((p, i) => [
      `--- PITCH ${i + 1}: ${p.angle} (${p.duration}) ---`,
      "",
      p.pitchText,
      "",
      `Word Count: ${p.wordCount}`,
      `Speaking Time: ${p.speakingTime}`,
      `Score: ${p.score}/10`,
      p.analysis.length > 0 ? `\nWhat Works:\n${p.analysis.map(a => `  - ${a}`).join("\n")}` : "",
      p.whenToUse ? `\nWhen to Use: ${p.whenToUse}` : "",
      p.followUpQuestions.length > 0 ? `\nFollow-up Questions:\n${p.followUpQuestions.map(q => `  - ${q}`).join("\n")}` : "",
    ].filter(Boolean).join("\n")).join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elevator-pitches-${business.replace(/\s+/g, "-").toLowerCase().slice(0, 30)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const content = pitches.map((p, i) =>
      `PITCH ${i + 1}: ${p.angle}\n"${p.pitchText}"\nScore: ${p.score}/10`
    ).join("\n\n---\n\n");

    saveDraft({
      business,
      audience,
      pitchContent: content,
      formData: { business, audience, stage, uniqueAngle, traction, desiredOutcome },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const loadDraft = (draft: typeof drafts[0]) => {
    const fd = draft.formData;
    setBusiness(fd.business);
    setAudience(fd.audience);
    setStage(fd.stage);
    setUniqueAngle(fd.uniqueAngle);
    setTraction(fd.traction);
    setDesiredOutcome(fd.desiredOutcome);
    setStreamedContent(draft.pitchContent);
    const parsed = parsePitches(draft.pitchContent);
    if (parsed.length > 0) {
      setPitches(parsed);
      setExpandedPitch(parsed[0].id);
    }
    setIsDone(true);
    setShowDrafts(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bestPitch = pitches.length > 0 ? pitches.reduce((best, p) => p.score > best.score ? p : best, pitches[0]) : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {drafts.length > 0 && (
        <div className="flex justify-end">
          <button
            data-testid="button-toggle-drafts"
            onClick={() => setShowDrafts(!showDrafts)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Saved Pitches ({drafts.length})
          </button>
        </div>
      )}

      <AnimatePresence>
        {showDrafts && drafts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-500" /> Saved Pitches
                </h4>
                <button
                  data-testid="button-close-drafts"
                  onClick={() => setShowDrafts(false)}
                  aria-label="Close saved pitches"
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors"
                >
                  <button
                    data-testid={`button-load-draft-${draft.id}`}
                    type="button"
                    onClick={() => loadDraft(draft)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {draft.business} &middot; {AUDIENCES.find(a => a.value === draft.audience)?.label || draft.audience}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                  <button
                    data-testid={`button-delete-draft-${draft.id}`}
                    onClick={() => deleteDraft(draft.id)}
                    aria-label="Delete saved pitch"
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-visible z-20">
        <div className="mb-6">
          <h3 data-testid="text-section-business" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Presentation className="w-5 h-5 text-purple-500" /> Your Business / Idea
          </h3>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-semibold text-slate-700 ml-1">What Are You Pitching? *</label>
            <div className="relative">
              <textarea
                data-testid="input-business"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Describe your business or idea. What problem do you solve and for whom?

Examples:
- AI productivity app that helps entrepreneurs automate tasks
- Organic skincare line for sensitive skin
- SaaS tool for email marketing automation"
                maxLength={300}
                rows={4}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none font-medium placeholder:text-slate-400"
              />
              <span data-testid="text-business-char-count" className="absolute bottom-3 right-3 text-xs text-slate-400">
                {business.length}/300
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">What Makes You Different? *</label>
            <input
              data-testid="input-unique-angle"
              type="text"
              value={uniqueAngle}
              onChange={(e) => setUniqueAngle(e.target.value)}
              placeholder="e.g., 'Only AI that learns your workflow without coding'"
              maxLength={150}
              className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-audience" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" /> Who Are You Pitching To?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {AUDIENCES.map((a) => (
              <button
                key={a.value}
                data-testid={`button-audience-${a.value}`}
                onClick={() => setAudience(a.value)}
                aria-pressed={audience === a.value}
                className={cn(
                  "flex flex-col items-start px-4 py-3 rounded-xl border text-sm transition-all text-left",
                  audience === a.value
                    ? "bg-purple-100 border-purple-300 text-purple-700"
                    : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                )}
              >
                <span className="font-semibold">{a.label}</span>
                <span className="text-[11px] opacity-70">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 data-testid="text-section-details" className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" /> Details
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Business Stage</label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.value}
                    data-testid={`button-stage-${s.value}`}
                    onClick={() => setStage(s.value)}
                    aria-pressed={stage === s.value}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                      stage === s.value
                        ? "bg-purple-100 border-purple-300 text-purple-700"
                        : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Traction / Proof <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                data-testid="input-traction"
                type="text"
                value={traction}
                onChange={(e) => setTraction(e.target.value)}
                placeholder="e.g., '500 users, $10k MRR', 'Featured in TechCrunch'"
                maxLength={100}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Desired Outcome</label>
              <div className="flex flex-wrap gap-2">
                {OUTCOMES.map((o) => (
                  <button
                    key={o.value}
                    data-testid={`button-outcome-${o.value}`}
                    onClick={() => setDesiredOutcome(o.value)}
                    aria-pressed={desiredOutcome === o.value}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                      desiredOutcome === o.value
                        ? "bg-purple-100 border-purple-300 text-purple-700"
                        : "bg-white border-slate-200 text-slate-600 hover:border-purple-200"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(state === "checking-gpu" || state === "downloading") && (
          <div className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <span className="text-sm font-semibold text-purple-700">
                {state === "checking-gpu" && "Verifying hardware..."}
                {state === "downloading" && "Loading AI Engine..."}
              </span>
            </div>
            {state === "downloading" && (
              <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            data-testid="button-generate"
            onClick={handleGenerate}
            disabled={!isFormValid || isGenerating || !isReady}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3",
              isFormValid && !isGenerating && isReady
                ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Crafting Your Pitches...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate 5 Pitches
              </>
            )}
          </button>
          <button
            data-testid="button-reset"
            type="button"
            onClick={handleReset}
            disabled={isGenerating}
            className={cn(
              "px-4 py-4 rounded-2xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2",
              isGenerating
                ? "border-slate-200 text-slate-300 cursor-not-allowed"
                : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {emptyError && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3" data-testid="alert-empty-result">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">{emptyError}</p>
        </div>
      )}

      {isGenerating && streamedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-sm font-semibold text-purple-600">Writing your elevator pitches...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed max-h-[400px] overflow-y-auto">
            {streamedContent}
          </pre>
        </motion.div>
      )}

      <AnimatePresence>
        {isDone && pitches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800" data-testid="text-results-heading">
                  {pitches.length} Pitch Variation{pitches.length > 1 ? "s" : ""} Generated
                </h3>
                {bestPitch && (
                  <p className="text-sm text-slate-500 mt-0.5" data-testid="text-best-pitch">
                    Strongest: {bestPitch.angle} (Score: {bestPitch.score}/10)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  data-testid="button-copy-all"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  {copiedId === "all" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedId === "all" ? "Copied!" : "Copy All"}
                </button>
                <InlineShareButtons />
                <button
                  data-testid="button-save-all"
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  data-testid="button-download"
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button
                  data-testid="button-regenerate"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-purple-200 hover:bg-purple-50 text-slate-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>
            </div>

            {pitches.map((pitch, index) => {
              const isBest = bestPitch?.id === pitch.id;
              return (
                <motion.div
                  key={pitch.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "bg-white rounded-2xl border shadow-sm overflow-hidden",
                    isBest ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200"
                  )}
                >
                  <button
                    data-testid={`button-expand-pitch-${index}`}
                    type="button"
                    onClick={() => setExpandedPitch(expandedPitch === pitch.id ? null : pitch.id)}
                    aria-expanded={expandedPitch === pitch.id}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0",
                        isBest ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
                      )}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate flex items-center gap-2">
                          {pitch.angle}
                          {isBest && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Star className="w-3 h-3" /> Strongest
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {pitch.duration} &middot; {pitch.wordCount} words &middot; {pitch.speakingTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border", getScoreColor(pitch.score))}>
                        {pitch.score}/10
                      </span>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedPitch === pitch.id && "rotate-180")} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedPitch === pitch.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <Presentation className="w-3.5 h-3.5" /> Pitch Script
                            </p>
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line italic">
                                &ldquo;{pitch.pitchText}&rdquo;
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border", getScoreColor(pitch.score))}>
                              <TrendingUp className="w-4 h-4" />
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Pitch Strength</p>
                                <p className="text-sm font-bold">{pitch.score}/10</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                              <Clock className="w-4 h-4" />
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Speaking Time</p>
                                <p className="text-sm font-bold">{pitch.speakingTime}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                              <MessageSquare className="w-4 h-4" />
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-70">Words</p>
                                <p className="text-sm font-bold">{pitch.wordCount}</p>
                              </div>
                            </div>
                          </div>

                          {pitch.analysis.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">What Works</p>
                              <ul className="space-y-1">
                                {pitch.analysis.map((item, ai) => (
                                  <li key={ai} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {pitch.whenToUse && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">When to Use</p>
                              <p className="text-sm text-slate-600">{pitch.whenToUse}</p>
                            </div>
                          )}

                          {pitch.followUpQuestions.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5" /> Likely Follow-up Questions
                              </p>
                              <ul className="space-y-1">
                                {pitch.followUpQuestions.map((q, qi) => (
                                  <li key={qi} className="flex items-start gap-2 text-sm text-slate-600">
                                    <span className="text-purple-400 shrink-0 mt-0.5">Q:</span>
                                    {q}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              data-testid={`button-copy-pitch-${index}`}
                              onClick={() => handleCopyPitch(pitch)}
                              className="flex-1 py-2.5 rounded-xl font-semibold text-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                            >
                              {copiedId === pitch.id ? (
                                <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                              ) : (
                                <><Copy className="w-4 h-4" /> Copy Pitch</>
                              )}
                            </button>
                            <button
                              data-testid={`button-practice-${index}`}
                              onClick={() => setTimerPitchId(timerPitchId === pitch.id ? null : pitch.id)}
                              aria-pressed={timerPitchId === pitch.id}
                              className={cn(
                                "px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors flex items-center justify-center gap-2",
                                timerPitchId === pitch.id
                                  ? "border-purple-300 bg-purple-100 text-purple-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-purple-200 hover:bg-purple-50"
                              )}
                            >
                              <Timer className="w-4 h-4" /> Practice
                            </button>
                          </div>

                          <AnimatePresence>
                            {timerPitchId === pitch.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <PracticeTimer
                                  wordCount={pitch.wordCount}
                                  onClose={() => setTimerPitchId(null)}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
