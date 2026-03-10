import { useState, useMemo } from "react";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw, BarChart3,
  Key, Wrench, TrendingUp, ChevronDown, ScanSearch, Trash2,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useATSStorage, type ATSResult } from "@/hooks/use-ats-storage";

const INDUSTRIES = [
  "Auto-Detect",
  "Technology / Software",
  "Healthcare / Medical",
  "Finance / Accounting",
  "Marketing / Advertising",
  "Sales / Business Development",
  "Engineering / Manufacturing",
  "Education / Academia",
  "Consulting / Advisory",
  "Legal / Compliance",
  "Human Resources",
  "Data / Analytics",
  "Design / Creative",
  "Operations / Supply Chain",
  "Other",
] as const;

const TARGET_SCORES = [
  { value: 70, label: "70%", description: "Minimum viable" },
  { value: 80, label: "80%", description: "Recommended" },
  { value: 90, label: "90%", description: "Competitive" },
] as const;

const ANALYZE_MODES = [
  { value: "full", label: "Full Resume" },
  { value: "experience", label: "Experience Only" },
] as const;

const SYSTEM_PROMPT = `You are an expert ATS resume optimizer and recruiter with 10+ years experience. You analyze resumes against job descriptions with perfect accuracy. You are extremely thorough: you extract EVERY keyword, technology, tool, methodology, certification, and skill from the job description, then check each one against the resume. You never say "no gaps detected" when the match score is below 100%. If skills match is 85%, you list the 15% worth of missing skills. If keyword match is 76%, you list every missing keyword that accounts for that 24% gap. You are strict, detailed, and honest.`;

const JUNK_PATTERNS = [
  /^\(.*\)$/,
  /^list\s/i,
  /^missing\s/i,
  /^keyword\s*match/i,
  /^skill[s]?\s*match/i,
  /^score/i,
  /^overall/i,
  /^experience/i,
  /^actionable/i,
  /^suggestion/i,
  /^final\s*recommendation/i,
  /^note:/i,
  /^here\s/i,
  /^based\s+on/i,
  /^the\s+following/i,
  /^below/i,
  /^n\/a$/i,
  /^none$/i,
  /^write\s/i,
  /^for\s+each/i,
  /percentage\s+here/i,
  /one\s+per\s+line/i,
  /from\s+the\s+job\s+description/i,
  /from\s+your\s+analysis/i,
  /no\s+significant/i,
  /no\s+gaps?\s+detected/i,
  /no\s+missing/i,
  /all\s+skills?\s+(?:are\s+)?(?:present|covered|matched)/i,
  /^percentage/i,
  /^be\s+thorough/i,
  /^list\s+every/i,
  /at\s+least\s+5-10/i,
];

function isJunkLine(s: string): boolean {
  return JUNK_PATTERNS.some((p) => p.test(s));
}

function parseScore(text: string): { overall: number; keyword: number; skills: number; experience: number } {
  const clean = text.replace(/\*\*/g, "").replace(/__/g, "");
  const getNum = (patterns: RegExp[]) => {
    for (const p of patterns) {
      const m = clean.match(p);
      if (m) return Math.min(100, Math.max(0, parseInt(m[1], 10)));
    }
    return 0;
  };

  return {
    overall: getNum([/overall\s*(?:match\s*)?score[:\s]*(\d+)/i, /match\s*score[:\s]*(\d+)/i]),
    keyword: getNum([/keyword\s*(?:match\s*)?[%:\s]*(\d+)/i]),
    skills: getNum([/skills?\s*(?:match\s*)?[%:\s]*(\d+)/i]),
    experience: getNum([/experience\s*(?:alignment|match|relevance)?[%:\s]*(\d+)/i]),
  };
}

function parseList(text: string, sectionStart: RegExp, maxItems: number = 15): string[] {
  const clean = text.replace(/\*\*/g, "").replace(/__/g, "");
  const match = clean.match(sectionStart);
  if (!match) return [];
  const startIdx = match.index! + match[0].length;
  const remaining = clean.slice(startIdx, startIdx + 1500);

  const sectionEnd = remaining.search(/\n\s*(?:\d+\.\s(?:overall|keyword|skill|experience|action|suggest|final|recommend))|(?:#{1,3}\s)|(?:={3,})|(?:missing\s+(?:skill|keyword)s?\s*(?:\(|:))|(?:actionable\s+suggest)|(?:final\s+recommend)|(?:experience\s+align)/i);
  const section = sectionEnd > 0 ? remaining.slice(0, sectionEnd) : remaining.slice(0, 800);

  const items: string[] = [];
  const lines = section.split("\n");
  for (const line of lines) {
    const cleaned = line.replace(/^[\s\-*•\d.)+]+/, "").trim();
    if (cleaned.length > 3 && cleaned.length < 200 && !isJunkLine(cleaned)) {
      items.push(cleaned);
    }
    if (items.length >= maxItems) break;
  }
  return items;
}

function parseSuggestions(text: string): string[] {
  return parseList(text, /(?:actionable|suggestion|improvement|tip)[s]?[:\s]*/i, 10);
}

function parseRecommendation(text: string): string {
  const clean = text.replace(/\*\*/g, "").replace(/__/g, "");
  const match = clean.match(/(?:final\s+)?recommendation[s]?[:\s]*([\s\S]{20,500}?)(?:\n\s*\n|$)/i);
  return match ? match[1].replace(/^[\s\-*•]+/, "").trim() : "";
}

function ScoreGauge({ score, label, size = "lg" }: { score: number; label: string; size?: "sm" | "lg" }) {
  const color = score >= 80 ? "text-green-500 dark:text-green-400" : score >= 60 ? "text-amber-500 dark:text-amber-400" : "text-red-500 dark:text-red-400";
  const bgColor = score >= 80 ? "stroke-green-500" : score >= 60 ? "stroke-amber-500" : "stroke-red-500";
  const radius = size === "lg" ? 54 : 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = size === "lg" ? 140 : 80;
  const strokeWidth = size === "lg" ? 10 : 6;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle cx={svgSize / 2} cy={svgSize / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-slate-200 dark:stroke-slate-700" />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(bgColor, "transition-all duration-1000")}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-display font-extrabold", color, size === "lg" ? "text-3xl" : "text-lg")}>
            {score}%
          </span>
        </div>
      </div>
      <span className={cn("font-medium text-slate-600 dark:text-slate-400", size === "lg" ? "text-sm" : "text-xs")}>{label}</span>
    </div>
  );
}

export function ATSGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveAnalysis, deleteAnalysis } = useATSStorage();

  const [jobDesc, setJobDesc] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [industry, setIndustry] = useState("Auto-Detect");
  const [targetScore, setTargetScore] = useState(80);
  const [analyzeMode, setAnalyzeMode] = useState("full");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const canGenerate = jobDesc.trim().length > 20 && resumeText.trim().length > 20;

  const handleReset = () => {
    setJobDesc("");
    setResumeText("");
    setIndustry("Auto-Detect");
    setTargetScore(80);
    setAnalyzeMode("full");
    setAdvancedOpen(false);
    setStreamingText("");
    setResult(null);
    setCopiedReport(false);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch {}
  };

  const buildPrompt = () => {
    const industryLine = industry !== "Auto-Detect" ? `\nIndustry/Role Category: ${industry}` : "";
    const modeLine = analyzeMode === "experience" ? "\nNote: The candidate has provided only their experience section. Focus analysis on work experience keywords and skills." : "";

    return `You must carefully compare this job description against this resume. Extract every important term from the job description and check if it appears in the resume.${industryLine}${modeLine}

JOB DESCRIPTION:
${jobDesc.trim().slice(0, 4500)}

RESUME:
${resumeText.trim().slice(0, 4500)}

IMPORTANT INSTRUCTIONS:
- Keywords are specific terms, phrases, tools, technologies, methodologies, certifications, domain knowledge, and industry jargon mentioned in the job description.
- Skills are abilities and competencies the job requires: technical skills (programming languages, software, platforms), soft skills (leadership, communication), and domain expertise.
- Keywords and skills are DIFFERENT categories. A keyword might be "Enterprise Architecture" while a skill might be "cross-functional team leadership."
- You MUST list every keyword from the job description that does NOT appear anywhere in the resume. Be thorough. Most job descriptions contain 15-30 important keywords. Check each one.
- You MUST list every skill from the job description that the resume does NOT demonstrate. If skills match is below 100%, there MUST be missing skills listed.
- A score below 100% means there ARE gaps. List them all.

Write your analysis now:

Overall Match Score: (percentage, be strict and realistic)

Keyword Match: (percentage)
Missing Keywords:
- (list EVERY important keyword/term/phrase from the job description not found in the resume, one per line, be thorough and list at least 5-10 if the keyword match is below 90%)

Skills Match: (percentage)
Missing Skills:
- (list EVERY skill required by the job that the resume does not demonstrate, one per line, if skills match is below 100% you MUST list the missing skills here)

Experience Alignment: (percentage)

Actionable Suggestions:
- (write 5 specific improvements the candidate should make)

Final Recommendation:
(2-3 sentence summary with next steps)`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setResult(null);
    setCopiedReport(false);

    try {
      const raw = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt() },
        ],
        temperature: 0.4,
        maxTokens: 2500,
        onChunk: (text) => setStreamingText(text),
      });

      const fullText = raw?.trim() || "";
      if (fullText) {
        const scores = parseScore(fullText);
        const missingKeywords = parseList(fullText, /missing\s+keyword[s]?[:\s]*/i);
        const missingSkills = parseList(fullText, /missing\s+skill[s]?[:\s]*/i);
        const suggestions = parseSuggestions(fullText);
        const recommendation = parseRecommendation(fullText);

        const jobTitleMatch = jobDesc.match(/(?:job\s*title|position|role)[:\s]*([^\n]{5,60})/i);
        const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : jobDesc.trim().split("\n")[0].slice(0, 60);

        const record: ATSResult = {
          id: generateId(),
          jobTitle,
          overallScore: scores.overall,
          keywordScore: scores.keyword,
          skillsScore: scores.skills,
          experienceScore: scores.experience,
          missingKeywords,
          missingSkills,
          suggestions,
          recommendation,
          rawText: fullText,
          createdAt: new Date().toISOString(),
        };
        setResult(record);
        saveAnalysis(record);
      }
    } catch (err) {
      console.error("ATS analysis error:", err);
    }

    setStreamingText("");
    setIsGenerating(false);
  };

  const hasResults = result !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6" data-testid="text-generator-heading">
          Analyze Your Resume Match
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                data-testid="input-job-description"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value.slice(0, 10000))}
                placeholder="Paste the full job description or job ad here..."
                rows={10}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                maxLength={10000}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{jobDesc.length}/10,000</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Resume <span className="text-red-500">*</span>
              </label>
              <textarea
                data-testid="input-resume"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value.slice(0, 10000))}
                placeholder="Paste your full resume (or just the experience section) here..."
                rows={10}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                maxLength={10000}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{resumeText.length}/10,000</p>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              data-testid="toggle-advanced"
              aria-expanded={advancedOpen}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Options
              <ChevronDown className={cn("w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform", advancedOpen && "rotate-180")} />
            </button>

            {advancedOpen && (
              <div className="px-4 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Industry / Role</label>
                  <select
                    data-testid="select-industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Target Score Goal: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{targetScore}%</span>
                  </label>
                  <div className="flex gap-2" data-testid="container-target-score">
                    {TARGET_SCORES.map(({ value, label, description }) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={targetScore === value}
                        data-testid={`toggle-target-${value}`}
                        onClick={() => setTargetScore(value)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border text-center transition-all",
                          targetScore === value
                            ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                        )}
                      >
                        <span className={cn("text-sm font-semibold block", targetScore === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Analyze</label>
                  <div className="flex gap-2" data-testid="container-analyze-mode">
                    {ANALYZE_MODES.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={analyzeMode === value}
                        data-testid={`toggle-mode-${value}`}
                        onClick={() => setAnalyzeMode(value)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border text-center font-semibold text-sm transition-all",
                          analyzeMode === value
                            ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-600"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {state !== "ready" && state !== "generating" && (
            <div data-testid="container-engine-status">
              {state === "error" ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50" data-testid="container-error">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50" data-testid="container-loading">
                  <div className="flex items-center gap-3 mb-2">
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                      {state === "checking-gpu" ? "Checking GPU support..." : "Loading AI model..."}
                    </p>
                  </div>
                  <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} data-testid="bar-engine-progress" />
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1.5" data-testid="text-engine-progress">{progress.text}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              data-testid="button-generate"
              disabled={!canGenerate || isGenerating || state !== "ready"}
              onClick={handleGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2",
                canGenerate && !isGenerating && state === "ready"
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scanning requirements and comparing...
                </>
              ) : (
                <>
                  <ScanSearch className="w-5 h-5" />
                  Analyze My Match Score
                </>
              )}
            </button>
            {(hasResults || streamingText) && (
              <button
                data-testid="button-reset"
                onClick={handleReset}
                className="px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>

        {isGenerating && streamingText && (
          <div className="mt-6" data-testid="container-streaming">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Analyzing match...</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-streaming">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {hasResults && result && (
          <div className="mt-8" data-testid="container-results">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">
                Your Match Report
              </h3>
              <button
                type="button"
                data-testid="button-copy-report"
                onClick={() => copyText(result.rawText)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedReport ? "Copied!" : "Copy Report"}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" data-testid="container-scores">
              <ScoreGauge score={result.overallScore} label="Overall Match" size="lg" />
              <div className="flex gap-6">
                <ScoreGauge score={result.keywordScore} label="Keywords" size="sm" />
                <ScoreGauge score={result.skillsScore} label="Skills" size="sm" />
                <ScoreGauge score={result.experienceScore} label="Experience" size="sm" />
              </div>
            </div>

            {result.overallScore < targetScore && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50" data-testid="container-target-warning">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Below target:</strong> Your score is {result.overallScore}% vs your target of {targetScore}%. Review the missing keywords and skills below to improve your match.
                </p>
              </div>
            )}

            {result.overallScore >= targetScore && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50" data-testid="container-target-success">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Target reached!</strong> Your score of {result.overallScore}% meets or exceeds your {targetScore}% target. Review the suggestions below for further optimization.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-red-200 dark:border-red-700/50 overflow-hidden" data-testid="panel-missing-keywords">
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-700/50">
                  <Key className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-bold text-red-700 dark:text-red-300">
                    Missing Keywords ({result.missingKeywords.length})
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/80">
                  {result.missingKeywords.length > 0 ? (
                    <ul className="space-y-1.5">
                      {result.missingKeywords.map((kw, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 dark:bg-red-500 flex-shrink-0" />
                          {kw}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No significant keyword gaps detected.</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-orange-200 dark:border-orange-700/50 overflow-hidden" data-testid="panel-missing-skills">
                <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-900/30 border-b border-orange-200 dark:border-orange-700/50">
                  <Wrench className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    Missing Skills ({result.missingSkills.length})
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/80">
                  {result.missingSkills.length > 0 ? (
                    <ul className="space-y-1.5">
                      {result.missingSkills.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-orange-400 dark:bg-orange-500 flex-shrink-0" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No significant skill gaps detected.</p>
                  )}
                </div>
              </div>
            </div>

            {result.suggestions.length > 0 && (
              <div className="mb-6 rounded-xl border border-green-200 dark:border-green-700/50 overflow-hidden" data-testid="panel-suggestions">
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700/50">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-bold text-green-700 dark:text-green-300">
                    Actionable Suggestions ({result.suggestions.length})
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/80">
                  <ul className="space-y-2">
                    {result.suggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-green-400 dark:bg-green-500 flex-shrink-0" />
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {result.recommendation && (
              <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50" data-testid="container-recommendation">
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Final Recommendation</p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{result.recommendation}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                data-testid="toggle-raw-output"
                onClick={() => {
                  const el = document.getElementById("ats-raw-output");
                  if (el) el.classList.toggle("hidden");
                }}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Show/Hide Full AI Output
              </button>
              <div id="ats-raw-output" className="hidden mt-3">
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{result.rawText}</p>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && !isGenerating && (
          <div className="mt-10" data-testid="container-history">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Analyses</h3>
            <div className="space-y-3">
              {history.slice(0, 5).map((record) => {
                const scoreColor = record.overallScore >= 80 ? "text-green-600 dark:text-green-400" : record.overallScore >= 60 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
                return (
                  <div
                    key={record.id}
                    data-testid={`card-history-${record.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{record.jobTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Score: <span className={cn("font-bold", scoreColor)}>{record.overallScore}%</span> | {record.missingKeywords.length} missing keywords | {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      data-testid={`button-delete-history-${record.id}`}
                      onClick={() => deleteAnalysis(record.id)}
                      className="ml-3 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
