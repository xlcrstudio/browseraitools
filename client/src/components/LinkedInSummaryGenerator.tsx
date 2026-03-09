import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Loader2, AlertTriangle, CheckCircle2,
  Copy, RefreshCw, RotateCcw, GraduationCap, Award,
  Star, Smile, Sparkles, Shield, PenTool, Type,
  TrendingUp, Target
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useLinkedInSummaryStorage, type LinkedInSummary } from "@/hooks/use-linkedin-summary-storage";

interface SummaryVersion {
  text: string;
  wordCount: number;
  score: number;
}

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level", icon: GraduationCap },
  { value: "mid", label: "Mid-Level", icon: Briefcase },
  { value: "senior", label: "Senior", icon: Award },
  { value: "executive", label: "Executive/Leadership", icon: Star },
];

const TONES = [
  { value: "professional", label: "Professional", icon: Briefcase },
  { value: "friendly", label: "Friendly & Approachable", icon: Smile },
  { value: "inspirational", label: "Inspirational", icon: Sparkles },
  { value: "executive", label: "Executive", icon: Shield },
  { value: "creative", label: "Creative/Storyteller", icon: PenTool },
];

const VERSION_COLORS = [
  { bg: "bg-emerald-50", border: "border-emerald-200", label: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700", tag: "Recommended" },
  { bg: "bg-blue-50", border: "border-blue-200", label: "text-blue-700", badge: "bg-blue-100 text-blue-700", tag: "Alternative" },
  { bg: "bg-purple-50", border: "border-purple-200", label: "text-purple-700", badge: "bg-purple-100 text-purple-700", tag: "Creative" },
];

const SYSTEM_PROMPT = `You are a LinkedIn profile strategist and personal branding expert who specializes in writing powerful LinkedIn "About" sections that attract recruiters, clients, and professional opportunities.

Your expertise includes:
- Personal branding and professional positioning
- LinkedIn SEO and keyword optimization
- Storytelling that builds trust and authority
- Writing compelling hooks that stop the scroll
- Crafting CTAs that drive profile engagement

You create LinkedIn summaries that:
- Open with a strong, attention-grabbing hook
- Are written in first person
- Include relevant industry keywords naturally
- Highlight achievements with specific results
- End with a clear call-to-action
- Are between 120-220 words each
- Sound authentic, not robotic or AI-generated`;

export function LinkedInSummaryGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveSummary } = useLinkedInSummaryStorage();

  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [skills, setSkills] = useState("");
  const [achievements, setAchievements] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetGoal, setTargetGoal] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [versions, setVersions] = useState<SummaryVersion[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleReset = () => {
    setRole("");
    setExperienceLevel("mid");
    setSkills("");
    setAchievements("");
    setTone("professional");
    setTargetGoal("");
    setStreamingText("");
    setVersions([]);
    setCopiedId(null);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const copyAll = async () => {
    const allText = versions.map((v, i) => `--- Version ${i + 1} ---\n${v.text}`).join("\n\n");
    await copyToClipboard(allText, "all");
  };

  const handleGenerate = async () => {
    if (!role.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setVersions([]);

    const expLabel = EXPERIENCE_LEVELS.find((e) => e.value === experienceLevel)?.label || "Mid-Level";
    const toneLabel = TONES.find((t) => t.value === tone)?.label || "Professional";

    const userPrompt = `Write 3 LinkedIn "About" section versions for the following professional:

Current Role: ${role.trim()}
Experience Level: ${expLabel}
${skills.trim() ? `Key Skills: ${skills.trim()}` : ""}
${achievements.trim() ? `Key Achievements: ${achievements.trim()}` : ""}
Tone & Style: ${toneLabel}
${targetGoal.trim() ? `Target Audience / Goal: ${targetGoal.trim()}` : ""}

IMPORTANT RULES:
1. Each version must be 120-220 words
2. Write in first person
3. Start with a strong opening hook that stops the scroll
4. Weave in relevant keywords naturally
5. End with a clear call-to-action (e.g., "Let's connect", "Reach out", etc.)
6. Each version should have a different angle or hook style
7. Do NOT include commentary or analysis - just the summary text

Use this EXACT format:

VERSION 1
SCORE: 92

[Full LinkedIn About section text here, 120-220 words, first person, with hook and CTA]

VERSION 2
SCORE: 88

[Full LinkedIn About section text here, 120-220 words, first person, different angle]

VERSION 3
SCORE: 85

[Full LinkedIn About section text here, 120-220 words, first person, creative approach]`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 1200,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseVersions(result);
        setVersions(parsed);

        const record: LinkedInSummary = {
          id: generateId(),
          role: role.trim(),
          experienceLevel,
          skills: skills.trim(),
          achievements: achievements.trim(),
          tone,
          targetGoal: targetGoal.trim(),
          versions: JSON.stringify(parsed),
          rawText: result,
          createdAt: new Date().toISOString(),
        };
        saveSummary(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && role.trim().length > 0 && !isGenerating;

  const avgWordCount = versions.length > 0
    ? Math.round(versions.reduce((sum, v) => sum + v.wordCount, 0) / versions.length)
    : 0;

  const keywordStrength = versions.length > 0
    ? (skills.trim().split(/[,;]+/).filter(Boolean).length > 3 ? "Strong" : skills.trim().length > 0 ? "Moderate" : "Low")
    : null;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-linkedin-summary-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Current Role *
            </label>
            <input
              id="role"
              data-testid="input-role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value.slice(0, 100))}
              placeholder="e.g., Software Engineer, Marketing Manager, Product Designer"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-role-char-count" className="text-xs text-slate-400">{role.length}/100</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Experience Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2" data-testid="container-experience-level">
              {EXPERIENCE_LEVELS.map((exp) => {
                const Icon = exp.icon;
                return (
                  <button
                    key={exp.value}
                    data-testid={`toggle-exp-${exp.value}`}
                    onClick={() => setExperienceLevel(exp.value)}
                    className={cn(
                      "p-3 rounded-xl text-left border transition-all flex items-center gap-2",
                      experienceLevel === exp.value
                        ? "bg-purple-50 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-semibold leading-tight">{exp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Key Skills
            </label>
            <textarea
              id="skills"
              data-testid="input-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value.slice(0, 300))}
              placeholder="e.g., SEO, Python, Data Analysis, Leadership, Content Strategy"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Separate skills with commas</span>
              <span data-testid="text-skills-char-count" className="text-xs text-slate-400">{skills.length}/300</span>
            </div>
          </div>

          <div>
            <label htmlFor="achievements" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Key Achievements
            </label>
            <textarea
              id="achievements"
              data-testid="input-achievements"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value.slice(0, 500))}
              placeholder={"Share your top achievements, e.g.:\n- Increased revenue by 40% through new marketing strategy\n- Led a team of 12 engineers to deliver product 2 weeks early\n- Published 3 research papers in top-tier journals"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-achievements-char-count" className="text-xs text-slate-400">{achievements.length}/500</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tone & Style *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2" data-testid="container-tone">
              {TONES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    data-testid={`toggle-tone-${t.value}`}
                    onClick={() => setTone(t.value)}
                    className={cn(
                      "p-3 rounded-xl text-center border transition-all",
                      tone === t.value
                        ? "bg-purple-50 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                    )}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-semibold leading-tight block">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="target-goal" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Audience / Goal
            </label>
            <input
              id="target-goal"
              data-testid="input-target-goal"
              type="text"
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value.slice(0, 200))}
              placeholder="e.g., Attract recruiters in tech, Land next role at FAANG"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
            <div className="flex justify-end mt-1">
              <span data-testid="text-goal-char-count" className="text-xs text-slate-400">{targetGoal.length}/200</span>
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
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Crafting your LinkedIn summary...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" />
                  Generate LinkedIn Summary
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
            <span className="text-sm font-medium text-purple-600">Writing your LinkedIn summary... Optimizing keywords... Scoring versions...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {versions.length > 0 && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm" data-testid="container-stats">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2" data-testid="stat-avg-words">
                <Type className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Avg. Words: <span className="font-bold text-slate-800">{avgWordCount}</span></span>
              </div>
              {keywordStrength && (
                <div className="flex items-center gap-2" data-testid="stat-keyword-strength">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">Keyword Strength: <span className={cn("font-bold", keywordStrength === "Strong" ? "text-emerald-600" : keywordStrength === "Moderate" ? "text-amber-600" : "text-slate-500")}>{keywordStrength}</span></span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                data-testid="button-copy-all"
                onClick={copyAll}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
              <button
                data-testid="button-regenerate-all"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-purple-200 text-purple-700 hover:bg-purple-50 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="container-versions">
            {versions.map((version, i) => {
              const colors = VERSION_COLORS[i] || VERSION_COLORS[2];
              const versionId = `v${i + 1}`;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn("rounded-2xl border shadow-sm overflow-hidden", colors.border)}
                  data-testid={`card-version-${i + 1}`}
                >
                  <div className={cn("px-4 py-3 flex flex-wrap items-center justify-between gap-2", colors.bg)}>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-bold", colors.label)}>Version {i + 1}</span>
                      {i === 0 && (
                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", colors.badge)} data-testid="badge-recommended">
                          {colors.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 bg-white/70 px-2 py-0.5 rounded-full" data-testid={`badge-words-${i + 1}`}>
                        {version.wordCount} words
                      </span>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1", colors.badge)} data-testid={`badge-score-${i + 1}`}>
                        <Target className="w-3 h-3" />
                        {version.score}/100
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap" data-testid={`text-version-${i + 1}`}>
                      {version.text}
                    </p>
                  </div>
                  <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center gap-2">
                    <button
                      data-testid={`button-copy-${i + 1}`}
                      onClick={() => copyToClipboard(version.text, versionId)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        copiedId === versionId
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      )}
                    >
                      {copiedId === versionId ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedId === versionId ? "Copied!" : "Copy"}
                    </button>
                    <button
                      data-testid={`button-regenerate-${i + 1}`}
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
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

function parseVersions(raw: string): SummaryVersion[] {
  const versions: SummaryVersion[] = [];

  const versionRegex = /VERSION\s+(\d+)/gi;
  const matches: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = versionRegex.exec(raw)) !== null) {
    matches.push(m);
  }

  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const startIdx = matches[i].index! + matches[i][0].length;
      const endIdx = i < matches.length - 1 ? matches[i + 1].index! : raw.length;

      const sectionText = raw.slice(startIdx, endIdx).trim();

      const scoreMatch = sectionText.match(/SCORE:?\s*(\d+)/i);
      const score = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : 90 - i * 2;

      let text = sectionText;
      text = text.replace(/^SCORE:?\s*\d+\s*/im, "");
      text = text.replace(/^---+\s*$/gm, "");
      text = text.trim();

      if (text.length < 20) continue;

      const wordCount = text.split(/\s+/).filter(Boolean).length;

      versions.push({ text, wordCount, score });
    }
  }

  if (versions.length === 0) {
    const sections = raw.split(/\n---+\n/).filter((s) => s.trim().length > 30);
    if (sections.length > 0) {
      for (let i = 0; i < Math.min(sections.length, 3); i++) {
        const text = sections[i].trim();
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        versions.push({ text, wordCount, score: 90 - i * 2 });
      }
    } else {
      const text = raw.trim();
      if (text.length > 20) {
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        versions.push({ text, wordCount, score: 90 });
      }
    }
  }

  return versions;
}
