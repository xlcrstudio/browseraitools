import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  Copy, Heart, RotateCcw, RefreshCw, Lightbulb, Award, FileCheck, Sparkles
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useResumeBulletStorage,
  type BulletOption,
  type ResumeBulletRecord,
} from "@/hooks/use-resume-bullet-storage";

const INDUSTRIES = [
  "Technology/Software", "Marketing/Advertising", "Sales", "Finance/Accounting",
  "Healthcare/Medical", "Education/Teaching", "Engineering", "Customer Service",
  "Human Resources", "Operations/Logistics", "Legal", "Real Estate",
  "Consulting", "Media/Entertainment", "Retail/E-Commerce", "Manufacturing",
  "Non-Profit", "Government", "Hospitality/Tourism", "Other",
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry-Level", desc: "0-2 years" },
  { value: "mid", label: "Mid-Level", desc: "3-5 years" },
  { value: "senior", label: "Senior", desc: "6-10 years" },
  { value: "executive", label: "Executive", desc: "10+ years" },
  { value: "career-changer", label: "Career Changer", desc: "Switching fields" },
];

const SYSTEM_PROMPT = `You are an expert resume writer with 15+ years helping professionals land interviews at top companies.

Your expertise includes:
- ATS (Applicant Tracking System) optimization
- Achievement-focused writing using STAR/CAR method
- Quantifying accomplishments with specific metrics
- Action verb selection matched to experience level
- Industry-specific language and keywords

You write resume bullets that:
- Start with strong action verbs (never "Responsible for")
- Quantify results with specific numbers, percentages, dollar amounts
- Demonstrate impact and business value
- Are ATS-friendly (no special characters)
- Are concise (1-2 lines, 15-25 words)
- Pass the "so what?" test`;

export function ResumeBulletGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveRecord, toggleFavorite } = useResumeBulletStorage();

  const [jobTitle, setJobTitle] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [achievements, setAchievements] = useState("");
  const [metrics, setMetrics] = useState("");
  const [skills, setSkills] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [targetJob, setTargetJob] = useState("");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bulletCount, setBulletCount] = useState(5);
  const [jobKeywords, setJobKeywords] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<ResumeBulletRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleReset = () => {
    setJobTitle("");
    setResponsibility("");
    setAchievements("");
    setMetrics("");
    setSkills("");
    setIndustry(INDUSTRIES[0]);
    setExperienceLevel("mid");
    setTargetJob("");
    setShowAdvanced(false);
    setBulletCount(5);
    setJobKeywords("");
    setStreamingText("");
    setCurrentRecord(null);
    setCopiedId(null);
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
    if (!jobTitle.trim() || !responsibility.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentRecord(null);

    const expLabel = EXPERIENCE_LEVELS.find((e) => e.value === experienceLevel)?.label || "Mid-Level";

    const userPrompt = `Generate ${bulletCount} powerful, ATS-optimized resume bullet points.

JOB DETAILS:
Role: ${jobTitle.trim()}
Responsibility: ${responsibility.trim()}
${achievements ? `Achievements: ${achievements.trim()}` : ""}
${metrics ? `Metrics/Numbers: ${metrics.trim()}` : ""}
${skills ? `Skills: ${skills.trim()}` : ""}
Industry: ${industry}
Experience Level: ${expLabel}
${targetJob ? `Target Job: ${targetJob.trim()}` : ""}
${jobKeywords ? `Must include keywords: ${jobKeywords.trim()}` : ""}

IMPORTANT RULES:
1. Each bullet MUST start with a strong action verb appropriate for ${expLabel} level
2. Each bullet MUST include at least one specific number, percentage, or dollar amount
3. Each bullet should be 1-2 lines, 15-25 words maximum
4. No special characters - ATS safe only
5. Do NOT start any bullet with "Responsible for"
6. Write ${bulletCount} DIFFERENT bullets, each with a different focus

Here is an example of the exact output format I need:

BULLET 1 (Achievement-Focused):
Increased quarterly sales revenue by 35% ($1.2M) through implementation of data-driven prospecting strategy targeting enterprise accounts

WHY IT WORKS:
- Starts with strong action verb "Increased"
- Includes specific metrics (35%, $1.2M)
- Shows methodology (data-driven prospecting)
- Demonstrates business impact

KEYWORDS: sales revenue, data-driven, prospecting, enterprise accounts

---

BULLET 2 (Skill-Focused):
Developed automated reporting dashboard using Python and Tableau, reducing weekly reporting time from 8 hours to 45 minutes for 12-person team

WHY IT WORKS:
- Names specific tools (Python, Tableau)
- Quantifies time savings (8 hours to 45 minutes)
- Shows scope (12-person team)

KEYWORDS: Python, Tableau, automated reporting, dashboard

---

BULLET 3 (Leadership-Focused):
Led cross-functional team of 8 engineers and designers to deliver mobile app 3 weeks ahead of schedule, achieving 4.7-star rating with 50K+ downloads

WHY IT WORKS:
- Shows team leadership (8 people)
- Demonstrates results (ahead of schedule)
- Includes quality metrics (4.7 stars, 50K downloads)

KEYWORDS: cross-functional, mobile app, team leadership

---

BULLET 4 (Efficiency-Focused):
Streamlined customer onboarding process by redesigning 5 workflow stages, cutting completion time by 40% and improving satisfaction scores to 94%

WHY IT WORKS:
- Shows process improvement
- Quantifies improvement (40% faster)
- Includes outcome metric (94% satisfaction)

KEYWORDS: onboarding, workflow, process improvement

---

BULLET 5 (Impact-Focused):
Launched content marketing program that generated 200+ qualified leads monthly, contributing $800K to annual sales pipeline within first 6 months

WHY IT WORKS:
- Clear business outcome
- Specific numbers (200+ leads, $800K)
- Timeframe included (6 months)

KEYWORDS: content marketing, qualified leads, sales pipeline

---

BEST COMBINATION:
1. Increased quarterly sales revenue by 35% ($1.2M) through implementation of data-driven prospecting strategy targeting enterprise accounts
2. Developed automated reporting dashboard using Python and Tableau, reducing weekly reporting time from 8 hours to 45 minutes for 12-person team
3. Led cross-functional team of 8 engineers and designers to deliver mobile app 3 weeks ahead of schedule, achieving 4.7-star rating with 50K+ downloads

COMBO EXPLANATION: This combination balances achievement, technical skill, and leadership to show a well-rounded candidate.

CONCISE VERSION:
Increased sales revenue by 35% ($1.2M) via data-driven prospecting strategy

DETAILED VERSION:
Increased quarterly sales revenue by 35% ($1.2M) through implementation and optimization of data-driven prospecting strategy targeting enterprise accounts across 3 regional markets, consistently exceeding quota for 4 consecutive quarters

IMPROVEMENT TIPS:
1. Add specific company or product names to make bullets more concrete
2. Include timeframes to show speed of impact
3. Mention team size or scope to demonstrate leadership capability

---

Now write REAL resume bullets for: ${jobTitle.trim()}
Responsibility: ${responsibility.trim()}
${achievements ? `Using these achievements: ${achievements.trim()}` : ""}
${metrics ? `Include these metrics: ${metrics.trim()}` : ""}

Generate ${bulletCount} distinct bullets with different focuses. Use the EXACT same format as above. Each bullet must have specific numbers. Do NOT use placeholder brackets.`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 3000,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseBulletOutput(result, bulletCount);
        const record: ResumeBulletRecord = {
          id: generateId(),
          jobTitle: jobTitle.trim(),
          responsibility: responsibility.trim(),
          achievements: achievements.trim(),
          metrics: metrics.trim(),
          industry,
          experienceLevel,
          bullets: parsed.bullets,
          bestCombo: parsed.bestCombo,
          comboExplanation: parsed.comboExplanation,
          conciseVersion: parsed.conciseVersion,
          detailedVersion: parsed.detailedVersion,
          improvementTips: parsed.improvementTips,
          favorites: [],
          createdAt: new Date().toISOString(),
        };
        setCurrentRecord(record);
        saveRecord(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && jobTitle.trim().length > 0 && responsibility.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-resume-bullet-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Your Job Title *
              </label>
              <input
                id="job-title"
                data-testid="input-job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value.slice(0, 100))}
                placeholder="e.g., Marketing Manager, Software Engineer"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Industry/Field *
              </label>
              <select
                id="industry"
                data-testid="select-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="responsibility" className="block text-sm font-semibold text-slate-700 mb-1.5">
              What Did You Do? (Responsibility) *
            </label>
            <textarea
              id="responsibility"
              data-testid="input-responsibility"
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value.slice(0, 500))}
              placeholder={"Describe what you were responsible for or what task you completed.\nExample: 'Managed social media marketing campaigns for B2B software company'"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Focus on one responsibility or project</span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">{responsibility.length}/500</span>
            </div>
          </div>

          <div>
            <label htmlFor="achievements" className="block text-sm font-semibold text-slate-700 mb-1.5">
              What Did You Achieve? (Results) <span className="text-xs font-normal text-slate-400">(recommended)</span>
            </label>
            <textarea
              id="achievements"
              data-testid="input-achievements"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value.slice(0, 300))}
              placeholder="What measurable results or outcomes did you achieve? Example: 'Increased LinkedIn engagement by 47%, generated 120 qualified leads'"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="metrics" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Metrics/Numbers
              </label>
              <input
                id="metrics"
                data-testid="input-metrics"
                type="text"
                value={metrics}
                onChange={(e) => setMetrics(e.target.value.slice(0, 200))}
                placeholder="e.g., 35% increase, $500k revenue, 1000+ customers"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
              <span className="text-xs text-slate-400 mt-1 block">Numbers make bullets 3x more powerful</span>
            </div>
            <div>
              <label htmlFor="skills" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Skills Demonstrated
              </label>
              <input
                id="skills"
                data-testid="input-skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value.slice(0, 150))}
                placeholder="e.g., Python, project management, data analysis"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Experience Level *
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-experience-level">
              {EXPERIENCE_LEVELS.map((exp) => (
                <button
                  key={exp.value}
                  data-testid={`toggle-exp-${exp.value}`}
                  onClick={() => setExperienceLevel(exp.value)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                    experienceLevel === exp.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  <div className="font-semibold">{exp.label}</div>
                  <div className="text-xs opacity-60">{exp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="target-job" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Target Job Title <span className="text-xs font-normal text-slate-400">(helps match keywords)</span>
            </label>
            <input
              id="target-job"
              data-testid="input-target-job"
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value.slice(0, 100))}
              placeholder="What job are you applying for?"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
            />
          </div>

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
                  <div className="pt-3 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Number of bullet points: {bulletCount}
                      </label>
                      <div className="flex gap-2" data-testid="container-bullet-count">
                        {[3, 4, 5, 6, 7].map((n) => (
                          <button
                            key={n}
                            data-testid={`toggle-count-${n}`}
                            onClick={() => setBulletCount(n)}
                            className={cn(
                              "w-10 h-10 rounded-xl text-sm font-bold border transition-all",
                              bulletCount === n
                                ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                                : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="job-keywords" className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Keywords from job description
                      </label>
                      <input
                        id="job-keywords"
                        data-testid="input-job-keywords"
                        type="text"
                        value={jobKeywords}
                        onChange={(e) => setJobKeywords(e.target.value.slice(0, 300))}
                        placeholder="Paste key requirements from the job posting"
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
                  Crafting powerful bullets...
                </>
              ) : (
                <>
                  <Briefcase className="w-5 h-5" />
                  Generate Resume Bullets
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
            <span className="text-sm font-medium text-purple-600">Generating ATS-optimized bullets...</span>
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
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Resume Bullet Points</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {currentRecord.jobTitle} | {EXPERIENCE_LEVELS.find((e) => e.value === currentRecord.experienceLevel)?.label}
              </p>
            </div>
          </div>

          {currentRecord.bullets.map((bullet, i) => (
            <BulletCard
              key={bullet.id}
              bullet={bullet}
              index={i}
              isFavorite={currentRecord.favorites.includes(bullet.id)}
              copiedId={copiedId}
              onCopy={(text, id) => copyToClipboard(text, id)}
              onFavorite={() => {
                toggleFavorite(currentRecord.id, bullet.id);
                setCurrentRecord((prev) => {
                  if (!prev) return prev;
                  const isFav = prev.favorites.includes(bullet.id);
                  return {
                    ...prev,
                    favorites: isFav
                      ? prev.favorites.filter((id) => id !== bullet.id)
                      : [...prev.favorites, bullet.id],
                  };
                });
              }}
            />
          ))}

          {currentRecord.bestCombo.length > 0 && (
            <div className="bg-white rounded-2xl border border-purple-200 shadow-sm p-5 md:p-6" data-testid="container-best-combo">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Best Combination (Top 3)</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">For maximum impact, use these together:</p>
              <div className="space-y-2 mb-4">
                {currentRecord.bestCombo.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" data-testid={`combo-item-${i}`}>
                    <span className="text-purple-500 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                    <span className="text-slate-700">{b}</span>
                  </div>
                ))}
              </div>
              {currentRecord.comboExplanation && (
                <p className="text-sm text-slate-500 italic" data-testid="text-combo-explanation">{currentRecord.comboExplanation}</p>
              )}
              <button
                data-testid="button-copy-combo"
                onClick={() => copyToClipboard(currentRecord.bestCombo.map((b, i) => `${i + 1}. ${b}`).join("\n"), "combo")}
                className={cn(
                  "mt-3 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "combo"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "combo" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "combo" ? "Copied!" : "Copy All 3"}
              </button>
            </div>
          )}

          {(currentRecord.conciseVersion || currentRecord.detailedVersion) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-variations">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Variations</h3>
              </div>
              {currentRecord.conciseVersion && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">More Concise (1 line)</p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-700" data-testid="text-concise-version">{currentRecord.conciseVersion}</p>
                    <button
                      data-testid="button-copy-concise"
                      onClick={() => copyToClipboard(currentRecord.conciseVersion, "concise")}
                      className="shrink-0"
                    >
                      {copiedId === "concise" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400 hover:text-purple-500" />}
                    </button>
                  </div>
                </div>
              )}
              {currentRecord.detailedVersion && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">More Detailed (2 lines)</p>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-700" data-testid="text-detailed-version">{currentRecord.detailedVersion}</p>
                    <button
                      data-testid="button-copy-detailed"
                      onClick={() => copyToClipboard(currentRecord.detailedVersion, "detailed")}
                      className="shrink-0"
                    >
                      {copiedId === "detailed" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400 hover:text-purple-500" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentRecord.improvementTips.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-tips">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Improvement Suggestions</h3>
              </div>
              <div className="space-y-2">
                {currentRecord.improvementTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" data-testid={`tip-item-${i}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
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

function BulletCard({
  bullet, index, isFavorite, copiedId, onCopy, onFavorite,
}: {
  bullet: BulletOption;
  index: number;
  isFavorite: boolean;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onFavorite: () => void;
}) {
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid={`card-bullet-${index}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Option {index + 1}</span>
          {bullet.focus && <span className="text-xs text-slate-400">({bullet.focus})</span>}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span data-testid={`stat-chars-${index}`}>{bullet.charCount} chars</span>
          <span className="flex items-center gap-1 text-emerald-600">
            <FileCheck className="w-3 h-3" />
            ATS-Safe
          </span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 my-3">
        <p className="text-sm text-slate-800 leading-relaxed font-medium" data-testid={`text-bullet-${index}`}>
          {bullet.text}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          data-testid={`button-copy-bullet-${index}`}
          onClick={() => onCopy(bullet.text, bullet.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            copiedId === bullet.id
              ? "bg-emerald-100 text-emerald-700"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
          )}
        >
          {copiedId === bullet.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedId === bullet.id ? "Copied!" : "Copy"}
        </button>
        <button
          data-testid={`button-fav-bullet-${index}`}
          onClick={onFavorite}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
        >
          <Heart className={cn("w-4 h-4", isFavorite ? "text-red-500 fill-red-500" : "")} />
          {isFavorite ? "Saved" : "Save"}
        </button>
        {bullet.whyItWorks.length > 0 && (
          <button
            data-testid={`button-why-${index}`}
            onClick={() => setShowWhy(!showWhy)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
          >
            <Lightbulb className="w-4 h-4" />
            Why it works
            <ChevronDown className={cn("w-3 h-3 transition-transform", showWhy && "rotate-180")} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showWhy && bullet.whyItWorks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-slate-100 space-y-1.5">
              {bullet.whyItWorks.map((reason, j) => (
                <div key={j} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{reason}</span>
                </div>
              ))}
              {bullet.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {bullet.keywords.map((kw, k) => (
                    <span key={k} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}

function parseBulletOutput(raw: string, expectedCount: number): {
  bullets: BulletOption[];
  bestCombo: string[];
  comboExplanation: string;
  conciseVersion: string;
  detailedVersion: string;
  improvementTips: string[];
} {
  const bullets: BulletOption[] = [];
  const bestCombo: string[] = [];
  let comboExplanation = "";
  let conciseVersion = "";
  let detailedVersion = "";
  const improvementTips: string[] = [];

  const bulletRegex = /BULLET\s*(\d+)\s*\(([^)]+)\):\s*\n([\s\S]*?)(?=\n---|\nBULLET\s*\d|\nBEST COMBINATION|\nCONCISE|\nDETAILED|\nIMPROVEMENT|$)/gi;
  let match;

  while ((match = bulletRegex.exec(raw)) !== null) {
    const focus = match[2].trim();
    const block = match[3];

    const bulletLines = block.split("\n");
    let bulletText = "";
    const whyItWorks: string[] = [];
    const keywords: string[] = [];
    let inWhy = false;
    let inKeywords = false;

    for (const line of bulletLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (/^WHY IT WORKS:?/i.test(trimmed)) {
        inWhy = true;
        inKeywords = false;
        continue;
      }
      if (/^KEYWORDS:?/i.test(trimmed)) {
        inKeywords = true;
        inWhy = false;
        const kwText = trimmed.replace(/^KEYWORDS:?\s*/i, "");
        if (kwText) kwText.split(/,/).map((k) => k.trim()).filter(Boolean).forEach((k) => keywords.push(k));
        continue;
      }

      if (inKeywords) {
        trimmed.split(/,/).map((k) => k.trim()).filter(Boolean).forEach((k) => keywords.push(k));
      } else if (inWhy) {
        const cleaned = trimmed.replace(/^[-*\u2022]\s*/, "").trim();
        if (cleaned.length > 5) whyItWorks.push(cleaned);
      } else if (!bulletText) {
        bulletText = trimmed.replace(/^[*\u2022]\s*/, "").trim();
      }
    }

    if (bulletText) {
      bullets.push({
        id: generateId(),
        text: bulletText,
        focus,
        whyItWorks,
        keywords,
        charCount: bulletText.length,
      });
    }
  }

  if (bullets.length === 0) {
    const optionRegex = /Option\s*(\d+)\s*\(([^)]+)\):\s*\n([\s\S]*?)(?=\nOption\s*\d|\nBEST|\nCONCISE|\nDETAILED|\nIMPROVEMENT|$)/gi;
    while ((match = optionRegex.exec(raw)) !== null) {
      const focus = match[2].trim();
      const block = match[3];
      const bulletLines = block.split("\n");
      let bulletText = "";
      const whyItWorks: string[] = [];
      const keywords: string[] = [];
      let inWhy = false;

      for (const line of bulletLines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (/^WHY IT WORKS:?/i.test(trimmed)) { inWhy = true; continue; }
        if (/^KEYWORDS:?/i.test(trimmed)) {
          inWhy = false;
          const kwText = trimmed.replace(/^KEYWORDS:?\s*/i, "");
          if (kwText) kwText.split(/,/).map((k) => k.trim()).filter(Boolean).forEach((k) => keywords.push(k));
          continue;
        }
        if (inWhy) {
          const cleaned = trimmed.replace(/^[-*\u2022]\s*/, "").trim();
          if (cleaned.length > 5) whyItWorks.push(cleaned);
        } else if (!bulletText) {
          bulletText = trimmed.replace(/^[*\u2022]\s*/, "").trim();
        }
      }

      if (bulletText) {
        bullets.push({ id: generateId(), text: bulletText, focus, whyItWorks, keywords, charCount: bulletText.length });
      }
    }
  }

  const comboMatch = raw.match(/BEST COMBINATION[:\s]*\n([\s\S]*?)(?=\nCOMBO EXPLANATION|\nCONCISE|\nDETAILED|\nIMPROVEMENT|$)/i);
  if (comboMatch) {
    const lines = comboMatch[1].split("\n");
    for (const line of lines) {
      const cleaned = line.trim().replace(/^\d+[.)]\s*/, "").replace(/^[*\u2022]\s*/, "").trim();
      if (cleaned.length > 10) bestCombo.push(cleaned);
      if (bestCombo.length >= 3) break;
    }
  }

  const comboExpMatch = raw.match(/COMBO EXPLANATION:?\s*(.*)/i);
  if (comboExpMatch) comboExplanation = comboExpMatch[1].trim();

  const conciseMatch = raw.match(/CONCISE VERSION:?\s*\n([\s\S]*?)(?=\nDETAILED|\nIMPROVEMENT|$)/i);
  if (conciseMatch) {
    const lines = conciseMatch[1].split("\n");
    for (const line of lines) {
      const cleaned = line.trim().replace(/^[*\u2022]\s*/, "").trim();
      if (cleaned.length > 10) { conciseVersion = cleaned; break; }
    }
  }

  const detailedMatch = raw.match(/DETAILED VERSION:?\s*\n([\s\S]*?)(?=\nIMPROVEMENT|$)/i);
  if (detailedMatch) {
    const lines = detailedMatch[1].split("\n");
    for (const line of lines) {
      const cleaned = line.trim().replace(/^[*\u2022]\s*/, "").trim();
      if (cleaned.length > 10) { detailedVersion = cleaned; break; }
    }
  }

  const tipsMatch = raw.match(/IMPROVEMENT TIPS?:?\s*\n([\s\S]*?)(?:$|---)/i);
  if (tipsMatch) {
    const lines = tipsMatch[1].split("\n");
    for (const line of lines) {
      const cleaned = line.trim().replace(/^\d+[.)]\s*/, "").replace(/^[-*\u2022]\s*/, "").trim();
      if (cleaned.length > 5) improvementTips.push(cleaned);
    }
  }

  return { bullets, bestCombo, comboExplanation, conciseVersion, detailedVersion, improvementTips };
}
