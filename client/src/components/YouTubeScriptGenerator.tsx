import { useState, useRef, useCallback, useEffect } from "react";
import { useWebLLM } from "@/hooks/use-web-llm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard, Copy, Check, RotateCcw, Loader2, AlertCircle,
  Zap, PlayCircle, FileText, Star, Lightbulb, BookOpen, GraduationCap,
  List, Flame, Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Types ────────────────────────────────────────────────────────────────────
type ScriptLength = "short" | "medium" | "long" | "extended";
type ScriptStyle = "storytelling" | "educational" | "list" | "viral";
type Tone = "casual" | "professional" | "energetic" | "calm" | "humorous";

// ─── Options ─────────────────────────────────────────────────────────────────
const AUDIENCES = ["General audience", "Beginners", "Professionals", "Students", "Entrepreneurs", "Tech enthusiasts"];

const LENGTHS: Record<ScriptLength, { label: string; range: string; words: string; maxTokens: number }> = {
  short:    { label: "Short",    range: "3–5 min",   words: "450–700 words",   maxTokens: 900  },
  medium:   { label: "Medium",   range: "8–10 min",  words: "1,100–1,400 words", maxTokens: 1600 },
  long:     { label: "Long",     range: "15–20 min", words: "2,000–2,600 words", maxTokens: 2000 },
  extended: { label: "Extended", range: "30+ min",   words: "4,000+ words",    maxTokens: 2000 },
};

const STYLES: Record<ScriptStyle, { label: string; desc: string; best: string; icon: React.ElementType }> = {
  storytelling: { label: "Storytelling",     desc: "Narrative, engaging, personal",       best: "Vlogs, experiences",      icon: BookOpen       },
  educational:  { label: "Educational",      desc: "Informative, structured, clear",      best: "Tutorials, how-tos",      icon: GraduationCap  },
  list:         { label: "List-Based",       desc: "Numbered points, organized",          best: "Top 10s, roundups",       icon: List           },
  viral:        { label: "Viral / Hook-Heavy", desc: "Attention-grabbing, fast-paced",    best: "Trending, entertainment", icon: Flame          },
};

const TONES: Record<Tone, string> = {
  casual:       "Casual / Friendly",
  professional: "Professional",
  energetic:    "Energetic / Enthusiastic",
  calm:         "Educational / Calm",
  humorous:     "Humorous / Fun",
};

const EXAMPLE_TOPIC = `10 best productivity apps in 2026 — I tested them all so you don't have to. Which ones actually saved me hours every week and which ones were complete waste of money.`;

// ─── Virality score ───────────────────────────────────────────────────────────
function computeViralityScore(hook: string, main: string, cta: string): number {
  const full = [hook, main, cta].join(" ");
  const lower = full.toLowerCase();
  let s = 0;

  // Hook signals
  if (hook.includes("?")) s += 0.8;
  if (/\d/.test(hook)) s += 1;
  if (lower.includes("you")) s += 0.5;
  const powerWords = ["secret", "revealed", "mistake", "never", "always", "truth", "wrong", "actually", "honest", "real", "worst", "best", "only"];
  if (powerWords.some(w => lower.includes(w))) s += 0.8;
  if (hook.length > 50 && hook.length < 220) s += 0.5;
  if (lower.includes("here's") || lower.includes("let me") || lower.includes("stick around") || lower.includes("wait until")) s += 0.5;

  // Content signals
  const numbers = (full.match(/\d+/g) || []).length;
  s += Math.min(1.5, numbers * 0.2);
  if ((full.match(/\[\d+:\d+\]/g) || []).length >= 2) s += 0.8;
  const youCount = (lower.match(/\byou\b|\byour\b/g) || []).length;
  s += Math.min(1, youCount * 0.08);

  // CTA quality
  if (cta.length > 40) s += 0.7;
  if (lower.includes("comment") || lower.includes("subscribe") || lower.includes("like")) s += 0.5;

  // Length bonus
  const wc = full.split(/\s+/).filter(Boolean).length;
  if (wc >= 500) s += 0.5;
  if (wc >= 1000) s += 0.4;

  return Math.min(10, Math.round(s * 10) / 10);
}

function viralityMeta(score: number) {
  if (score >= 8.5) return { label: "Viral Potential", color: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-400", retention: "Excellent", retColor: "text-emerald-600 dark:text-emerald-400" };
  if (score >= 7)   return { label: "High Engagement", color: "text-blue-600 dark:text-blue-400",    ring: "ring-blue-400",    retention: "High",      retColor: "text-blue-600 dark:text-blue-400"    };
  if (score >= 5)   return { label: "Good Content",    color: "text-amber-600 dark:text-amber-400",  ring: "ring-amber-400",   retention: "Moderate",  retColor: "text-amber-600 dark:text-amber-400"  };
  return              { label: "Needs Polish",    color: "text-slate-500 dark:text-slate-400",  ring: "ring-slate-300",   retention: "Low",       retColor: "text-slate-500 dark:text-slate-400"  };
}

// ─── Section parser ───────────────────────────────────────────────────────────
function parseSections(text: string): { title: string; content: string }[] {
  const result: { title: string; content: string }[] = [];
  const parts = text.split(/\n(?=##\s)/);
  for (const part of parts) {
    const m = part.match(/^##\s+(.+?)\n([\s\S]*)$/);
    if (m) result.push({ title: m[1].trim(), content: m[2].trim() });
  }
  return result;
}

// ─── Script text renderer ─────────────────────────────────────────────────────
function ScriptRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        // Timestamps like [0:00] or [1:30]
        const withTimestamps = line.replace(/\[(\d+:\d+)\]/g, (_, ts) =>
          `<span class="inline-block px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-mono font-semibold rounded mr-1">${ts}</span>`
        );
        // Bold **text**
        const withBold = withTimestamps.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-slate-100">$1</strong>');

        // Section headers (### or #)
        if (line.startsWith("### ")) {
          return <p key={i} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-3 mb-0.5" dangerouslySetInnerHTML={{ __html: withBold.replace(/^### /, "") }} />;
        }
        if (line.startsWith("# ")) {
          return <p key={i} className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1" dangerouslySetInnerHTML={{ __html: withBold.replace(/^# /, "") }} />;
        }
        // List items
        if (line.startsWith("- ") || line.startsWith("• ") || /^\d+\.\s/.test(line)) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-red-400 shrink-0 mt-0.5 font-bold text-sm">•</span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: withBold.replace(/^[-•]\s|\d+\.\s/, "") }} />
            </div>
          );
        }
        return <p key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: withBold }} />;
      })}
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, content, icon: Icon, accent, copiedKey, onCopy, copyKey }: {
  title: string; content: string; icon: React.ElementType;
  accent: { bg: string; border: string; iconColor: string; titleColor: string; headerBorder: string };
  copiedKey: string | null; onCopy: (key: string, text: string) => void; copyKey: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className={`rounded-2xl border overflow-hidden ${accent.bg} ${accent.border}`}>
      <div className={`flex items-center justify-between px-5 py-3.5 border-b ${accent.headerBorder}`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${accent.iconColor}`} />
          <span className={`text-sm font-semibold ${accent.titleColor}`}>{title}</span>
        </div>
        <button data-testid={`button-copy-${copyKey}`} onClick={() => onCopy(copyKey, content)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-700/70 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          {copiedKey === copyKey ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          {copiedKey === copyKey ? "Copied" : "Copy"}
        </button>
        <InlineShareButtons />
      </div>
      <div className="p-5">
        <ScriptRenderer text={content} />
      </div>
    </motion.div>
  );
}

const SECTION_ACCENTS: Record<string, { bg: string; border: string; iconColor: string; titleColor: string; headerBorder: string }> = {
  hook:    { bg: "bg-red-50 dark:bg-red-900/10",     border: "border-red-200 dark:border-red-800/40",     iconColor: "text-red-500",    titleColor: "text-red-800 dark:text-red-200",    headerBorder: "border-red-100 dark:border-red-800/40"    },
  intro:   { bg: "bg-blue-50 dark:bg-blue-900/10",   border: "border-blue-200 dark:border-blue-800/40",   iconColor: "text-blue-500",   titleColor: "text-blue-800 dark:text-blue-200",  headerBorder: "border-blue-100 dark:border-blue-800/40"  },
  main:    { bg: "bg-white dark:bg-slate-800",        border: "border-slate-200 dark:border-slate-700",    iconColor: "text-slate-500",  titleColor: "text-slate-700 dark:text-slate-200", headerBorder: "border-slate-100 dark:border-slate-700"   },
  cta:     { bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-200 dark:border-purple-800/40", iconColor: "text-purple-500", titleColor: "text-purple-800 dark:text-purple-200", headerBorder: "border-purple-100 dark:border-purple-800/40" },
  titles:  { bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200 dark:border-amber-800/40", iconColor: "text-amber-500",  titleColor: "text-amber-800 dark:text-amber-200", headerBorder: "border-amber-100 dark:border-amber-800/40" },
  default: { bg: "bg-white dark:bg-slate-800",        border: "border-slate-200 dark:border-slate-700",    iconColor: "text-slate-500",  titleColor: "text-slate-700 dark:text-slate-200", headerBorder: "border-slate-100 dark:border-slate-700"   },
};

function getSectionAccent(title: string) {
  const t = title.toLowerCase();
  if (t.includes("hook"))  return SECTION_ACCENTS.hook;
  if (t.includes("intro")) return SECTION_ACCENTS.intro;
  if (t.includes("main") || t.includes("content") || t.includes("body")) return SECTION_ACCENTS.main;
  if (t.includes("cta") || t.includes("call"))   return SECTION_ACCENTS.cta;
  if (t.includes("title") || t.includes("idea") || t.includes("thumbnail")) return SECTION_ACCENTS.titles;
  return SECTION_ACCENTS.default;
}

function getSectionIcon(title: string): React.ElementType {
  const t = title.toLowerCase();
  if (t.includes("hook"))  return Zap;
  if (t.includes("intro")) return PlayCircle;
  if (t.includes("main") || t.includes("content") || t.includes("body")) return FileText;
  if (t.includes("cta") || t.includes("call"))   return Star;
  if (t.includes("title") || t.includes("idea") || t.includes("thumbnail")) return Lightbulb;
  return FileText;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────
const SYSTEM = "You are an expert YouTube content strategist and scriptwriter who creates high-retention, engaging video scripts. You write in an authentic creator voice that keeps viewers watching until the end.";

function buildPrompt(topic: string, audience: string, length: ScriptLength, style: ScriptStyle, tone: Tone, opts: Record<string, boolean>) {
  const len = LENGTHS[length];
  const optLines = [
    opts.hook && "- Strong viral hook that creates a curiosity gap in first 10 seconds",
    opts.cta  && "- Clear CTA asking viewers to subscribe, like, and comment with a specific question",
    opts.examples && "- Specific examples and case studies with real details",
    opts.story && "- Storytelling arc with a relatable problem/challenge",
    opts.timestamps && "- Timestamps in [MM:SS] format for each major section",
    opts.broll && "- B-roll suggestions in [brackets] after relevant sections",
  ].filter(Boolean).join("\n");

  return `Write a complete YouTube script.

Topic: ${topic}
Audience: ${audience}
Length: ${len.range} (${len.words})
Style: ${STYLES[style].label}
Tone: ${TONES[tone]}
${optLines ? `\nRequirements:\n${optLines}` : ""}

Output EXACTLY this format with these section markers:

## Hook
[First 10 seconds — bold, curiosity-inducing statement or question. 2-3 punchy sentences that promise value]

## Introduction
[0:10–0:45 — expand the hook, establish credibility, preview what's coming. Include early subscribe ask.]

## Main Content
[Full video body in ${STYLES[style].label} format. Use natural timestamps like [1:00], [2:30] etc. Cover topic thoroughly at ${len.range} pace. Each section has its own hook and value delivery.]

## CTA
[End card — ask for a specific comment, subscribe reminder, tease next video. 3–5 sentences.]

## Title Ideas
[3 compelling title options — include numbers and power words where possible]`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function YouTubeScriptGenerator() {
  const { state, progress, error: llmError, generateRaw } = useWebLLM();
  const { toast } = useToast();

  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("General audience");
  const [length, setLength] = useState<ScriptLength>("medium");
  const [style, setStyle] = useState<ScriptStyle>("list");
  const [tone, setTone] = useState<Tone>("energetic");
  const [opts, setOpts] = useState({ hook: true, cta: true, examples: true, story: false, timestamps: true, broll: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [output, setOutput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const streamRef = useRef("");
  const isReady = state === "ready" || state === "generating";
  const isModelLoading = state === "checking-gpu" || state === "downloading";

  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => setStreamText(streamRef.current), 33);
    return () => clearInterval(id);
  }, [isGenerating]);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || !isReady) return;
    streamRef.current = "";
    setStreamText("");
    setOutput("");
    setIsGenerating(true);

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(topic, audience, length, style, tone, opts) },
      ],
      temperature: 0.75,
      maxTokens: LENGTHS[length].maxTokens,
      onChunk: (t) => { streamRef.current = t; },
    });

    setOutput(result ?? streamRef.current ?? "");
    setIsGenerating(false);
  }, [topic, audience, length, style, tone, opts, isReady, generateRaw]);

  const copyText = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const toggleOpt = (k: keyof typeof opts) => setOpts(prev => ({ ...prev, [k]: !prev[k] }));

  const sections = output ? parseSections(output) : [];
  const hookSection  = sections.find(s => s.title.toLowerCase().includes("hook"));
  const introSection = sections.find(s => s.title.toLowerCase().includes("intro"));
  const mainSection  = sections.find(s => s.title.toLowerCase().includes("main") || s.title.toLowerCase().includes("content"));
  const ctaSection   = sections.find(s => s.title.toLowerCase().includes("cta") || s.title.toLowerCase().includes("call"));
  const titleSection = sections.find(s => s.title.toLowerCase().includes("title") || s.title.toLowerCase().includes("idea"));

  const fullScript = sections.map(s => `## ${s.title}\n\n${s.content}`).join("\n\n");
  const wordCount = fullScript.split(/\s+/).filter(Boolean).length;
  const speakingMins = Math.round(wordCount / 140);
  const speakingSecs = Math.round((wordCount / 140 - Math.floor(wordCount / 140)) * 60);
  const speakingTime = `${speakingMins}:${speakingSecs.toString().padStart(2, "0")}`;

  const vScore = hookSection && mainSection
    ? computeViralityScore(hookSection.content, mainSection.content, ctaSection?.content ?? "")
    : null;
  const vMeta = vScore !== null ? viralityMeta(vScore) : null;

  const OPT_LABELS: Record<string, string> = {
    hook: "Strong viral hook", cta: "Call to action (subscribe/like/comment)", examples: "Examples & case studies",
    story: "Storytelling elements", timestamps: "Timestamps for chapters", broll: "B-roll suggestions",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Inputs ── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-5">

            {/* Topic */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Video Topic / Idea <span className="text-red-400">*</span>
                </label>
                <button data-testid="button-load-example" onClick={() => setTopic(EXAMPLE_TOPIC)}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium">
                  Load example
                </button>
              </div>
              <textarea
                data-testid="input-topic"
                value={topic}
                onChange={e => setTopic(e.target.value.slice(0, 500))}
                placeholder={`What is your video about?\n\nExamples:\n• "How to make money online for beginners"\n• "10 best productivity apps in 2026"\n• "Why you should learn Python in 2026"`}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none transition-all"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{topic.length}/500</p>
            </div>

            {/* Audience */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 block">Target Audience</label>
              <select data-testid="select-audience" value={audience} onChange={e => setAudience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all">
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Video Length */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Video Length</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(LENGTHS) as ScriptLength[]).map(l => (
                  <button key={l} data-testid={`button-length-${l}`} onClick={() => setLength(l)}
                    className={`py-2.5 px-3 rounded-xl border text-left transition-all ${
                      length === l
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
                        : "border-slate-200 dark:border-slate-600 hover:border-red-200"
                    }`}>
                    <p className={`text-xs font-semibold ${length === l ? "text-red-700 dark:text-red-300" : "text-slate-700 dark:text-slate-200"}`}>{LENGTHS[l].label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{LENGTHS[l].range}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Style */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Script Style</label>
              <div className="space-y-2">
                {(Object.keys(STYLES) as ScriptStyle[]).map(s => {
                  const StyleIcon = STYLES[s].icon;
                  return (
                    <button key={s} data-testid={`button-style-${s}`} onClick={() => setStyle(s)}
                      className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl border text-left transition-all ${
                        style === s
                          ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
                          : "border-slate-200 dark:border-slate-600 hover:border-red-200"
                      }`}>
                      <StyleIcon className={`w-4 h-4 shrink-0 ${style === s ? "text-red-500" : "text-slate-400"}`} />
                      <div>
                        <p className={`text-xs font-semibold ${style === s ? "text-red-700 dark:text-red-300" : "text-slate-700 dark:text-slate-200"}`}>{STYLES[s].label}</p>
                        <p className="text-xs text-slate-400">{STYLES[s].best}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Tone / Voice</label>
              <div className="space-y-1.5">
                {(Object.keys(TONES) as Tone[]).map(t => (
                  <button key={t} data-testid={`button-tone-${t}`} onClick={() => setTone(t)}
                    className={`w-full flex items-center gap-3 py-2 px-4 rounded-xl border text-left transition-all ${
                      tone === t
                        ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
                        : "border-slate-200 dark:border-slate-600 hover:border-red-200"
                    }`}>
                    <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${tone === t ? "border-red-500 bg-red-500" : "border-slate-300 dark:border-slate-500"}`} />
                    <p className={`text-xs font-medium ${tone === t ? "text-red-700 dark:text-red-300" : "text-slate-600 dark:text-slate-300"}`}>{TONES[t]}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced options */}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 block">Include in Script</label>
              <div className="space-y-2">
                {(Object.keys(OPT_LABELS) as (keyof typeof opts)[]).map(k => (
                  <label key={k} data-testid={`checkbox-${k}`} className="flex items-center gap-3 cursor-pointer group">
                    <div onClick={() => toggleOpt(k)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        opts[k] ? "border-red-500 bg-red-500" : "border-slate-300 dark:border-slate-500 group-hover:border-red-300"
                      }`}>
                      {opts[k] && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300">{OPT_LABELS[k]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Model state */}
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

            <button data-testid="button-generate" onClick={handleGenerate}
              disabled={!topic.trim() || !isReady || isGenerating}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200/40 dark:shadow-red-900/30 flex items-center justify-center gap-2">
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" />Writing your script…</>
                : <><Clapperboard className="w-4 h-4" />Generate YouTube Script</>
              }
            </button>
          </div>
        </div>

        {/* ── Right: Output ── */}
        <div className="space-y-4">
          <AnimatePresence>
            {isGenerating && (
              <motion.div key="stream" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                  Writing your YouTube script…
                </div>
                <div className="p-5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[120px] max-h-[500px] overflow-y-auto">
                  {streamText
                    ? <>{streamText}<span className="inline-block w-0.5 h-4 bg-red-500 ml-0.5 align-middle animate-pulse" /></>
                    : <span className="flex items-center gap-2 text-slate-400 text-xs italic"><Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />Starting generation…</span>
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isGenerating && !output && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-10 text-center text-slate-400">
                <Clapperboard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Your YouTube script will appear here</p>
                <p className="text-xs mt-1">Enter your video topic and click Generate</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isGenerating && output && (
              <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">

                {/* Action row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button data-testid="button-regenerate" onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  {fullScript && (
                    <button data-testid="button-copy-full" onClick={() => copyText("full", fullScript)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors">
                      {copiedKey === "full" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === "full" ? "Copied!" : "Copy Full Script"}
                    </button>
                  )}
                </div>

                {/* Script Analysis */}
                {vScore !== null && vMeta && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      <Star className="w-4 h-4 text-amber-500" />
                      Script Analysis
                    </div>
                    <div className="p-5 flex items-start gap-5">
                      {/* Score ring */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-full ring-4 ${vMeta.ring} flex flex-col items-center justify-center bg-white dark:bg-slate-800`}>
                        <span className={`text-xl font-bold ${vMeta.color}`}>{vScore}</span>
                        <span className="text-xs text-slate-400">/10</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className={`text-sm font-semibold ${vMeta.color}`}>{vMeta.label}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Speaking time:</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{speakingTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Words:</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{wordCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Retention:</span>
                            <span className={`text-xs font-medium ${vMeta.retColor}`}>{vMeta.retention}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clapperboard className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Style:</span>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{STYLES[style].label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Section cards */}
                {sections.map((s, idx) => (
                  <SectionCard
                    key={idx}
                    title={s.title}
                    content={s.content}
                    icon={getSectionIcon(s.title)}
                    accent={getSectionAccent(s.title)}
                    copiedKey={copiedKey}
                    onCopy={copyText}
                    copyKey={`section-${idx}`}
                  />
                ))}

                {/* Raw fallback */}
                {sections.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Generated Script</span>
                      <button onClick={() => copyText("raw", output)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {copiedKey === "raw" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === "raw" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div data-testid="text-raw-output" className="p-5 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">{output}</div>
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
