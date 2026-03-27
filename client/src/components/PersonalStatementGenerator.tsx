import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  Lock, ChevronRight, ChevronLeft, Wand2, Download,
  RefreshCw, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  essayType: string;
  schoolPrompt: string;
  customPrompt: string;
  story: string;
  growth: string;
  achievements: string;
  uniqueAngle: string;
  major: string;
  wordCount: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ESSAY_TYPES = [
  { id: "common-app", label: "Common App", sublabel: "Personal Statement", words: "650" },
  { id: "uc", label: "UC Application", sublabel: "PIQ Essay", words: "350" },
  { id: "supplemental", label: "Supplemental", sublabel: "School-Specific", words: "250" },
  { id: "grad", label: "Graduate School", sublabel: "Statement of Purpose", words: "1000" },
  { id: "scholarship", label: "Scholarship", sublabel: "Award Essay", words: "500" },
];

const SCHOOL_PROMPTS: Record<string, { school: string; prompt: string }[]> = {
  supplemental: [
    { school: "Harvard", prompt: "How has your upbringing or background shaped your perspective?" },
    { school: "Stanford", prompt: "What matters to you, and why?" },
    { school: "MIT", prompt: "Describe the world you come from and how it has shaped your dreams and aspirations." },
    { school: "Yale", prompt: "Why Yale specifically?" },
    { school: "Columbia", prompt: "What draws you to your chosen area of study?" },
    { school: "Princeton", prompt: "Tell us about a person who has influenced you in a significant way." },
    { school: "UChicago", prompt: "Share an essay on any topic of your choice." },
    { school: "Custom", prompt: "" },
  ],
  "common-app": [
    { school: "Prompt 1", prompt: "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it." },
    { school: "Prompt 2", prompt: "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a challenge you've faced, and what you learned from it." },
    { school: "Prompt 3", prompt: "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?" },
    { school: "Prompt 4", prompt: "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way." },
    { school: "Prompt 5", prompt: "Discuss an accomplishment, event, or realization that sparked a period of personal growth." },
    { school: "Prompt 6", prompt: "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time." },
    { school: "Prompt 7", prompt: "Share an essay on any topic of your choice." },
  ],
  uc: [
    { school: "PIQ 1", prompt: "Describe an example of your leadership experience in which you have positively influenced others." },
    { school: "PIQ 2", prompt: "Every person has a creative side. Describe how you express your creative side." },
    { school: "PIQ 3", prompt: "What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time?" },
    { school: "PIQ 4", prompt: "Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier." },
    { school: "PIQ 5", prompt: "Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge." },
    { school: "PIQ 6", prompt: "Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom." },
    { school: "PIQ 7", prompt: "What have you done to make your school or your community a better place?" },
    { school: "PIQ 8", prompt: "Beyond what has already been shared in your application, what do you want us to know about you?" },
  ],
};

const REFINEMENTS = [
  { id: "authentic", label: "More Authentic", icon: "✦", instruction: "Rewrite to sound more natural and authentic — less formal, more personal voice. Avoid clichés. Make it feel genuinely written by this student." },
  { id: "hook", label: "Stronger Opening", icon: "⚡", instruction: "Rewrite ONLY the opening paragraph to be more compelling — start in the middle of the action, with a vivid scene, surprising statement, or powerful question." },
  { id: "shorten", label: "Shorten", icon: "↕", instruction: "Cut the essay by roughly 20% while preserving all key content. Remove redundant phrases and tighten every sentence." },
  { id: "specific", label: "More Specific", icon: "🎯", instruction: "Replace generic statements with specific details, examples, and sensory language. Show, don't tell." },
  { id: "conclusion", label: "Stronger Ending", icon: "◎", instruction: "Rewrite ONLY the final paragraph to be more memorable — connect back to the opening, end with insight or forward momentum." },
];

const DEFAULT_FORM: FormData = {
  essayType: "common-app",
  schoolPrompt: "Prompt 2",
  customPrompt: "",
  story: "",
  growth: "",
  achievements: "",
  uniqueAngle: "",
  major: "",
  wordCount: "650",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function buildMessages(form: FormData, version: 1 | 2, refinement?: { text: string; instruction: string }) {
  const type = ESSAY_TYPES.find(t => t.id === form.essayType)!;
  const prompts = SCHOOL_PROMPTS[form.essayType] ?? [];
  const selectedPrompt = form.essayType === "supplemental"
    ? (form.schoolPrompt === "Custom" ? form.customPrompt : prompts.find(p => p.school === form.schoolPrompt)?.prompt ?? "")
    : prompts.find(p => p.school === form.schoolPrompt)?.prompt ?? "";

  if (refinement) {
    return [
      {
        role: "system" as const,
        content: `You are an expert college admissions essay coach. ${refinement.instruction} Output ONLY the revised essay — no preamble, no commentary, no labels.`,
      },
      { role: "user" as const, content: `Revise this essay:\n\n${refinement.text}` },
    ];
  }

  const angle = version === 1
    ? "Open with an immediate scene or action — put the reader inside the moment. Use vivid, specific sensory details."
    : "Open with a reflective or philosophical statement. Start from the insight, then build back to the story.";

  const systemPrompt = `You are an expert college admissions essay writer and coach with 15 years of experience helping students get into top universities. You write essays that are authentic, specific, emotionally resonant, and free of clichés. You understand what admissions officers are looking for: genuine personality, growth, and a clear sense of the applicant's voice.

Essay requirements:
- Type: ${type.label} ${type.sublabel}
- Target word count: ${form.wordCount} words (stay within ±10%)
- Approach for this version: ${angle}
- The essay must feel genuinely written by the student — no corporate language, no generic statements
- Show growth and self-reflection, not just a list of accomplishments
- Avoid these clichés: "passionate", "since I was a little kid", "I have always known", "the world is a better place"

Output ONLY the essay text — no title, no preamble, no word count label, no commentary.`;

  const userMsg = [
    selectedPrompt ? `Essay prompt: "${selectedPrompt}"` : "",
    `About me:`,
    form.story ? `Main story/experience: ${form.story}` : "",
    form.growth ? `What I learned / how I grew: ${form.growth}` : "",
    form.achievements ? `Key achievements: ${form.achievements}` : "",
    form.major ? `Intended major / career goal: ${form.major}` : "",
    form.uniqueAngle ? `What makes me unique: ${form.uniqueAngle}` : "",
  ].filter(Boolean).join("\n");

  return [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userMsg },
  ];
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div className={cn(
      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
      done ? "bg-purple-600 border-purple-600 text-white" : active ? "border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-900/20" : "border-slate-300 dark:border-slate-600 text-slate-400"
    )}>
      {done ? "✓" : n}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PersonalStatementGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [essays, setEssays] = useState<[string, string]>(["", ""]);
  const [activeVersion, setActiveVersion] = useState<0 | 1>(0);
  const [streaming, setStreaming] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [inputError, setInputError] = useState("");
  const [copied, setCopied] = useState(false);
  const [refining, setRefining] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const isGenerating = state === "generating";
  const isLoading = state === "checking-gpu" || state === "downloading";
  const isBusy = isGenerating || isLoading;

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const essayTypeObj = ESSAY_TYPES.find(t => t.id === form.essayType)!;
  const prompts = SCHOOL_PROMPTS[form.essayType] ?? [];

  // Set word count when essay type changes
  const handleEssayType = (id: string) => {
    const t = ESSAY_TYPES.find(et => et.id === id)!;
    const defaultPrompt = SCHOOL_PROMPTS[id]?.[0]?.school ?? "";
    setForm(f => ({ ...f, essayType: id, wordCount: t.words, schoolPrompt: defaultPrompt }));
  };

  const validateStep = () => {
    if (step === 1 && !form.essayType) { setInputError("Please select an essay type."); return false; }
    if (step === 2 && !form.story.trim()) { setInputError("Please describe your main story or experience."); return false; }
    setInputError("");
    return true;
  };

  const handleGenerate = useCallback(async () => {
    if (!validateStep()) return;
    setEssays(["", ""]);
    setStreaming("");
    setIsDone(false);
    setStep(3);

    // Generate version 1
    const v1 = await generateRaw({
      messages: buildMessages(form, 1),
      temperature: 0.75,
      maxTokens: 1500,
      onChunk: (chunk) => { setStreaming(chunk); if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; },
    });
    if (!v1) return;

    setEssays(prev => [v1, prev[1]]);
    setStreaming("");

    // Generate version 2
    const v2 = await generateRaw({
      messages: buildMessages(form, 2),
      temperature: 0.78,
      maxTokens: 1500,
      onChunk: (chunk) => { setStreaming(chunk); if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight; },
    });

    if (v2) {
      setEssays([v1, v2]);
      setActiveVersion(0);
      setIsDone(true);
      setStreaming("");
    }
  }, [form, generateRaw]);

  const handleRefine = useCallback(async (refinement: typeof REFINEMENTS[0]) => {
    const current = essays[activeVersion];
    if (!current) return;
    setRefining(true);
    setStreaming("");

    const result = await generateRaw({
      messages: buildMessages(form, 1, { text: current, instruction: refinement.instruction }),
      temperature: 0.65,
      maxTokens: 1500,
      onChunk: (chunk) => setStreaming(chunk),
    });

    if (result) {
      const updated = [...essays] as [string, string];
      updated[activeVersion] = result;
      setEssays(updated);
    }
    setStreaming("");
    setRefining(false);
  }, [essays, activeVersion, form, generateRaw]);

  const handleCopy = () => {
    navigator.clipboard.writeText(essays[activeVersion]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `${essayTypeObj.label} ${essayTypeObj.sublabel}\n${"=".repeat(40)}\n\n${essays[activeVersion]}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `personal-statement-v${activeVersion + 1}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setForm(DEFAULT_FORM); setStep(1); setEssays(["", ""]); setStreaming(""); setIsDone(false); setInputError("");
  };

  const currentEssay = refining && streaming ? streaming : essays[activeVersion];
  const wordCount = countWords(currentEssay);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">

      {/* Step bar */}
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex items-center gap-3 flex-1">
            <StepDot n={n} active={step === n} done={step > n} />
            {i < 2 && <div className={cn("flex-1 h-0.5 rounded-full transition-all", step > n ? "bg-purple-500" : "bg-slate-200 dark:bg-slate-700")} />}
          </div>
        ))}
        <div className="text-xs text-slate-400 ml-2 whitespace-nowrap">
          {step === 1 ? "Essay Type" : step === 2 ? "About You" : "Your Essay"}
        </div>
      </div>

      {/* Step 1: Essay type */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Essay Type</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ESSAY_TYPES.map(t => (
                    <button key={t.id} type="button" data-testid={`button-type-${t.id}`}
                      onClick={() => handleEssayType(t.id)}
                      className={cn(
                        "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                        form.essayType === t.id ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-purple-300"
                      )}
                    >
                      <span className={cn("text-xs font-bold", form.essayType === t.id ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>{t.label}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{t.sublabel} · {t.words}w</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt selection */}
              {prompts.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                    {form.essayType === "supplemental" ? "School / Prompt" : "Prompt"}
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {prompts.map(p => (
                      <button key={p.school} type="button" data-testid={`button-prompt-${p.school}`}
                        onClick={() => set("schoolPrompt", p.school)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all",
                          form.schoolPrompt === p.school ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : "border-slate-200 dark:border-slate-700 hover:border-purple-300"
                        )}
                      >
                        <span className={cn("text-xs font-bold block", form.schoolPrompt === p.school ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-300")}>{p.school}</span>
                        {p.prompt && <span className="text-[10px] text-slate-400 leading-tight">{p.prompt}</span>}
                      </button>
                    ))}
                  </div>
                  {form.essayType === "supplemental" && form.schoolPrompt === "Custom" && (
                    <textarea
                      data-testid="input-custom-prompt"
                      value={form.customPrompt}
                      onChange={e => set("customPrompt", e.target.value)}
                      placeholder="Paste the exact essay prompt here…"
                      rows={3}
                      className="mt-2 w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    />
                  )}
                </div>
              )}

              {/* Word count override */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Target Length</p>
                <div className="flex gap-2">
                  {["250", "350", "500", "650", "1000"].map(w => (
                    <button key={w} type="button" data-testid={`button-words-${w}`}
                      onClick={() => set("wordCount", w)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition-all",
                        form.wordCount === w ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-300"
                      )}
                    >
                      {w}w
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {inputError && <p className="text-xs text-red-500 flex items-center gap-1.5 px-1"><AlertTriangle className="w-3 h-3" />{inputError}</p>}

            <button type="button" data-testid="button-next-step1"
              onClick={() => { if (validateStep()) setStep(2); }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-primary text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Next: Tell Us About You <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Questionnaire */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                The more detail you give here, the better your essay will be. You don't need to write perfectly — just tell your story honestly.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  What is the main story, experience, or topic you want to write about? *
                </label>
                <textarea data-testid="input-story" value={form.story} onChange={e => { set("story", e.target.value); setInputError(""); }}
                  placeholder="e.g. I volunteered at an animal shelter for 3 years. I learned to handle difficult situations by comforting scared animals. I want to study veterinary medicine."
                  rows={4} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  What did you learn, overcome, or how did you grow from this experience?
                </label>
                <textarea data-testid="input-growth" value={form.growth} onChange={e => set("growth", e.target.value)}
                  placeholder="e.g. I learned patience, empathy, and that vulnerability is not weakness. I overcame my fear of responsibility by caring for animals that depended entirely on me."
                  rows={3} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Your key achievements, activities, or defining experiences (academic or personal)
                </label>
                <textarea data-testid="input-achievements" value={form.achievements} onChange={e => set("achievements", e.target.value)}
                  placeholder="e.g. Captain of debate team, 3.9 GPA, founded school environmental club, completed 200+ shelter volunteer hours, won regional science fair."
                  rows={3} className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none leading-relaxed placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Intended major or field of study
                  </label>
                  <input data-testid="input-major" value={form.major} onChange={e => set("major", e.target.value)}
                    placeholder="e.g. Veterinary Medicine, Computer Science…"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    What makes you unique or different from other applicants?
                  </label>
                  <input data-testid="input-unique" value={form.uniqueAngle} onChange={e => set("uniqueAngle", e.target.value)}
                    placeholder="e.g. First-generation student, bilingual, raised abroad…"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Private — your information never leaves your browser</span>
              </div>
            </div>

            {inputError && <p className="text-xs text-red-500 flex items-center gap-1.5 px-1"><AlertTriangle className="w-3 h-3" />{inputError}</p>}

            <div className="flex gap-3">
              <button type="button" data-testid="button-back-step2" onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 font-semibold text-sm hover:border-purple-300 hover:text-purple-600 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button type="button" data-testid="button-generate"
                onClick={handleGenerate}
                disabled={isBusy}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all",
                  isBusy ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" : "bg-gradient-primary text-white hover:opacity-90 active:scale-[0.98] shadow-sm shadow-purple-500/20"
                )}
              >
                {isBusy ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Wand2 className="w-4 h-4" /> Generate 2 Versions</>}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Output */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

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

            {/* Version tabs */}
            {(isDone || essays[0]) && (
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {(["Version 1", "Version 2"] as const).map((label, i) => {
                    const available = !!essays[i];
                    return (
                      <button key={label} type="button" data-testid={`button-version-${i + 1}`}
                        onClick={() => available && setActiveVersion(i as 0 | 1)}
                        disabled={!available}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                          activeVersion === i && available ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                      >
                        {label} {!available && isGenerating ? <Loader2 className="inline w-3 h-3 animate-spin ml-1" /> : ""}
                      </button>
                    );
                  })}
                </div>
                {isDone && (
                  <div className="flex items-center gap-2">
                    <button type="button" data-testid="button-regenerate"
                      onClick={() => { setStep(2); }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Edit & Regenerate
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Essay output */}
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {essayTypeObj.label} Essay — Version {activeVersion + 1}
                  </span>
                  {currentEssay && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      Math.abs(wordCount - parseInt(form.wordCount)) <= parseInt(form.wordCount) * 0.1
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-700"
                    )}>
                      {wordCount} words
                    </span>
                  )}
                </div>
                {currentEssay && (
                  <div className="flex items-center gap-1.5">
                    <button type="button" data-testid="button-download" onClick={handleDownload}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" data-testid="button-copy" onClick={handleCopy}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                        copied ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200" : "border-slate-200 dark:border-slate-700 text-slate-600 hover:border-purple-300 hover:text-purple-600"
                      )}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <InlineShareButtons />
                  </div>
                )}
              </div>

              <div ref={outputRef} className="px-5 py-4 min-h-[300px] max-h-[600px] overflow-y-auto">
                {(isGenerating || refining) && streaming ? (
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {streaming}
                    <span className="inline-block w-1 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle rounded-sm" />
                  </p>
                ) : currentEssay ? (
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{currentEssay}</p>
                ) : isGenerating ? (
                  <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
                    <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                    <span>Writing your essay…</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 dark:text-slate-600">Your essay will appear here…</p>
                )}
              </div>
            </div>

            {/* Refinement buttons */}
            {isDone && currentEssay && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Refine This Version</p>
                <div className="flex flex-wrap gap-2">
                  {REFINEMENTS.map(r => (
                    <button key={r.id} type="button" data-testid={`button-refine-${r.id}`}
                      onClick={() => handleRefine(r)}
                      disabled={isBusy || refining}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                        isBusy || refining ? "border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      )}
                    >
                      <span>{r.icon}</span> {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom actions */}
            <div className="flex gap-3">
              <button type="button" data-testid="button-back-step3" onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 font-semibold text-sm hover:border-purple-300 hover:text-purple-600 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button type="button" data-testid="button-start-over" onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 font-semibold text-sm hover:border-red-300 hover:text-red-500 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
              {isDone && (
                <button type="button" data-testid="button-new-version"
                  onClick={handleGenerate}
                  disabled={isBusy}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-primary text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" /> Generate New Versions
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
