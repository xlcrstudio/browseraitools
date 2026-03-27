import { useState, useRef } from "react";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  ChevronDown, ScanSearch, Trash2, CheckCircle2, XCircle,
  Cpu, Heart, Tag, TrendingUp, UserCheck, Lightbulb,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { useATSStorage, type ATSResult, type SkillItem } from "@/hooks/use-ats-storage";
import { InlineShareButtons } from "@/components/InlineShareButtons";

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

const SYSTEM_PROMPT = `You are an expert ATS resume optimizer and recruiter with 10+ years experience. You analyze resumes against job descriptions with perfect accuracy. You follow the exact output format requested. Each item goes on its own line. You never skip items or combine multiple items into one line.`;

const JUNK_PATTERNS = [
  /^\(.*\)$/,
  /^list\s/i,
  /^missing\s/i,
  /^found\s/i,
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
  /at\s+least\s+\d/i,
  /^hard\s+skills/i,
  /^soft\s+skills/i,
  /^other\s+keywords/i,
  /^recruiter/i,
  /^formatting/i,
  /^section/i,
];

function isJunkLine(s: string): boolean {
  return JUNK_PATTERNS.some((p) => p.test(s));
}

function parseTaggedList(text: string, sectionRegex: RegExp): SkillItem[] {
  const clean = text.replace(/\*\*/g, "").replace(/__/g, "");
  const match = clean.match(sectionRegex);
  if (!match) return [];
  const startIdx = match.index! + match[0].length;
  const remaining = clean.slice(startIdx, startIdx + 2000);

  const sectionEnd = remaining.search(/\n\s*(?:#{1,3}\s|(?:HARD\s+SKILLS?|SOFT\s+SKILLS?|OTHER\s+KEYWORDS?|RECRUITER|OVERALL|SUGGESTION|RECOMMENDATION|TIP|SCORE|EXPERIENCE)[A-Z\s]*:)/i);
  const section = sectionEnd > 0 ? remaining.slice(0, sectionEnd) : remaining.slice(0, 1200);

  const items: SkillItem[] = [];
  const lines = section.split("\n");
  for (const line of lines) {
    const trimmed = line.replace(/^[\s\-*•\d.)+]+/, "").trim();
    if (trimmed.length < 2 || trimmed.length > 200 || isJunkLine(trimmed)) continue;

    const foundMatch = trimmed.match(/^\[FOUND\]\s*(.+)/i) || trimmed.match(/^FOUND:\s*(.+)/i) || trimmed.match(/^\u2705\s*(.+)/);
    const missingMatch = trimmed.match(/^\[MISSING\]\s*(.+)/i) || trimmed.match(/^MISSING:\s*(.+)/i) || trimmed.match(/^\u274c\s*(.+)/);

    if (foundMatch) {
      const name = foundMatch[1].replace(/\s*[-–]\s*(?:found|present|included|matched|in resume).*$/i, "").trim();
      if (name.length > 1 && !isJunkLine(name)) items.push({ name, found: true });
    } else if (missingMatch) {
      const name = missingMatch[1].replace(/\s*[-–]\s*(?:missing|not found|absent|not in resume).*$/i, "").trim();
      if (name.length > 1 && !isJunkLine(name)) items.push({ name, found: false });
    }

    if (items.length >= 25) break;
  }
  return items;
}

function parseSimpleList(text: string, sectionRegex: RegExp, maxItems = 10): string[] {
  const clean = text.replace(/\*\*/g, "").replace(/__/g, "");
  const match = clean.match(sectionRegex);
  if (!match) return [];
  const startIdx = match.index! + match[0].length;
  const remaining = clean.slice(startIdx, startIdx + 1500);

  const sectionEnd = remaining.search(/\n\s*(?:#{1,3}\s|(?:FOUND|MISSING|HARD|SOFT|OTHER|RECRUITER|OVERALL|SUGGESTION|RECOMMENDATION|TIP|SCORE)[A-Z\s]*:)/i);
  const section = sectionEnd > 0 ? remaining.slice(0, sectionEnd) : remaining.slice(0, 800);

  const items: string[] = [];
  for (const line of section.split("\n")) {
    const cleaned = line.replace(/^[\s\-*•\d.)+]+/, "").trim();
    if (cleaned.length > 3 && cleaned.length < 300 && !isJunkLine(cleaned)) {
      items.push(cleaned);
    }
    if (items.length >= maxItems) break;
  }
  return items;
}

function parseScore(text: string): number {
  const clean = text.replace(/\*\*/g, "").replace(/__/g, "");
  const m = clean.match(/overall\s*(?:match\s*)?score[:\s]*(\d+)/i) || clean.match(/match\s*score[:\s]*(\d+)/i) || clean.match(/score[:\s]*(\d+)/i);
  return m ? Math.min(100, Math.max(0, parseInt(m[1], 10))) : 0;
}

function parseRecommendation(text: string): string {
  const clean = text.replace(/\*\*/g, "").replace(/__/g, "");
  const match = clean.match(/(?:final\s+)?recommendation[s]?[:\s]*([\s\S]{20,500}?)(?:\n\s*\n|$)/i);
  return match ? match[1].replace(/^[\s\-*•]+/, "").trim() : "";
}

function ScoreGauge({ score, label, size = "lg", target }: { score: number; label: string; size?: "sm" | "lg"; target?: number }) {
  const threshold = target ?? 80;
  const isGreen = score >= threshold;
  const isAmber = !isGreen && score >= threshold - 20;
  const color = isGreen ? "text-green-500 dark:text-green-400" : isAmber ? "text-amber-500 dark:text-amber-400" : "text-red-500 dark:text-red-400";
  const bgColor = isGreen ? "stroke-green-500" : isAmber ? "stroke-amber-500" : "stroke-red-500";
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

function SkillTag({ item }: { item: SkillItem }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors",
        item.found
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-300"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300"
      )}
    >
      {item.found ? (
        <CheckCircle2 className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-3 h-3 text-red-500 dark:text-red-400 flex-shrink-0" />
      )}
      {item.name}
    </span>
  );
}

function SkillSection({
  title,
  icon,
  items,
  testId,
}: {
  title: string;
  icon: React.ReactNode;
  items: SkillItem[];
  testId: string;
}) {
  const found = items.filter((i) => i.found);
  const missing = items.filter((i) => !i.found);
  const total = items.length;
  const matchPercent = total > 0 ? Math.round((found.length / total) * 100) : 0;
  const barColor = matchPercent >= 80 ? "bg-green-500" : matchPercent >= 60 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden" data-testid={testId}>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {found.length}/{total} found
          </span>
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            matchPercent >= 80
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : matchPercent >= 60
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          )}>
            {matchPercent}%
          </span>
        </div>
      </div>

      <div className="px-4 pt-2 pb-1">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${matchPercent}%` }} />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900/60">
        {items.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {found.map((item, i) => (
              <SkillTag key={`f-${i}`} item={item} />
            ))}
            {missing.map((item, i) => (
              <SkillTag key={`m-${i}`} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">No items detected in this category.</p>
        )}
      </div>
    </div>
  );
}

const STEP_LABELS = [
  "Analyzing hard skills...",
  "Analyzing soft skills & keywords...",
  "Scoring & generating recommendations...",
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [streamingText, setStreamingText] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [rawOutputOpen, setRawOutputOpen] = useState(false);
  const abortRef = useRef(false);

  const canGenerate = jobDesc.trim().length > 20 && resumeText.trim().length > 20;

  const handleReset = () => {
    abortRef.current = true;
    setJobDesc("");
    setResumeText("");
    setIndustry("Auto-Detect");
    setTargetScore(80);
    setAnalyzeMode("full");
    setAdvancedOpen(false);
    setStreamingText("");
    setResult(null);
    setCopiedReport(false);
    setRawOutputOpen(false);
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch {}
  };

  const buildContext = () => {
    const industryLine = industry !== "Auto-Detect" ? `\nIndustry: ${industry}` : "";
    const modeLine = analyzeMode === "experience" ? "\nNote: Candidate provided only their experience section." : "";
    return `${industryLine}${modeLine}

JOB DESCRIPTION:
${jobDesc.trim().slice(0, 6000)}

RESUME:
${resumeText.trim().slice(0, 6000)}`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setResult(null);
    setCopiedReport(false);
    setCurrentStep(0);
    abortRef.current = false;

    const context = buildContext();
    let allRawText = "";

    try {
      setCurrentStep(0);
      setStreamingText("");
      const hardSkillsRaw = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${context}

TASK: Extract all HARD SKILLS (technical skills, tools, technologies, programming languages, frameworks, methodologies, certifications, platforms, software) mentioned in the job description. For EACH hard skill, check if it appears in the resume.

CRITICAL RULES:
1. Before marking any skill as FOUND, verify it actually appears in the resume text.
2. Before marking any skill as MISSING, verify it does NOT appear anywhere in the resume.
3. Check abbreviations and synonyms (e.g., JS = JavaScript, K8s = Kubernetes).
4. List each skill on its own line. Do not combine multiple skills into one line.

Output format - use exactly this format for each item:
[FOUND] Skill Name
[MISSING] Skill Name

List every hard skill from the job description now:`,
          },
        ],
        temperature: 0.3,
        maxTokens: 1200,
        onChunk: (text) => setStreamingText(text),
      });
      allRawText += "=== HARD SKILLS ===\n" + (hardSkillsRaw || "") + "\n\n";

      if (abortRef.current) return;

      setCurrentStep(1);
      setStreamingText("");
      const softKeywordsRaw = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${context}

TASK: Do TWO analyses:

PART 1 - SOFT SKILLS: Extract all soft skills (communication, leadership, teamwork, problem-solving, etc.) from the job description. For each, check the resume.

PART 2 - OTHER KEYWORDS: Extract other important keywords from the job description that are NOT technical skills or soft skills. These include: industry jargon, company-specific terms, methodologies, business concepts, domain knowledge, regulatory terms, specific processes.

CRITICAL RULES:
1. Verify each item against the actual resume text before marking FOUND or MISSING.
2. One item per line. Do not combine items.

SOFT SKILLS:
[FOUND] Skill Name
[MISSING] Skill Name

OTHER KEYWORDS:
[FOUND] Keyword
[MISSING] Keyword

Write your analysis now:`,
          },
        ],
        temperature: 0.3,
        maxTokens: 1200,
        onChunk: (text) => setStreamingText(text),
      });
      allRawText += "=== SOFT SKILLS & KEYWORDS ===\n" + (softKeywordsRaw || "") + "\n\n";

      if (abortRef.current) return;

      setCurrentStep(2);
      setStreamingText("");
      const scoresRaw = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${context}

TASK: Provide an overall assessment of this resume against the job description.

Write your analysis in this exact format:

Overall Match Score: (a number from 0-100, be strict and realistic)

Actionable Suggestions:
- (write 5-7 specific, actionable improvements the candidate should make to increase their ATS score)

Recruiter Tips:
- (write 3-5 tips about resume formatting, quantifiable achievements, action verbs, and presentation that would impress a human recruiter)

Final Recommendation:
(2-3 sentence summary with concrete next steps)

Write your analysis now:`,
          },
        ],
        temperature: 0.4,
        maxTokens: 1500,
        onChunk: (text) => setStreamingText(text),
      });
      allRawText += "=== SCORES & RECOMMENDATIONS ===\n" + (scoresRaw || "") + "\n\n";

      if (abortRef.current) return;

      const hardSkills = parseTaggedList(hardSkillsRaw || "", /^/);
      const softRaw = softKeywordsRaw || "";
      const softSplit = softRaw.search(/OTHER\s+KEYWORDS?\s*:/i);
      const softSection = softSplit >= 0 ? softRaw.slice(0, softSplit) : softRaw;
      const keywordsSection = softSplit >= 0 ? softRaw.slice(softSplit) : "";

      const softSkills = parseTaggedList(softSection, /(?:SOFT\s+SKILLS?\s*:|^)/i);
      const otherKeywords = parseTaggedList(keywordsSection, /OTHER\s+KEYWORDS?\s*:/i);

      const overallScore = parseScore(scoresRaw || "");
      const suggestions = parseSimpleList(scoresRaw || "", /(?:actionable\s+)?suggestion[s]?[:\s]*/i, 10);
      const recruiterTips = parseSimpleList(scoresRaw || "", /recruiter\s+tip[s]?[:\s]*/i, 8);
      const recommendation = parseRecommendation(scoresRaw || "");

      const jobTitleMatch = jobDesc.match(/(?:job\s*title|position|role)[:\s]*([^\n]{5,60})/i);
      const jobTitle = jobTitleMatch ? jobTitleMatch[1].trim() : jobDesc.trim().split("\n")[0].slice(0, 60);

      const record: ATSResult = {
        id: generateId(),
        jobTitle,
        overallScore,
        hardSkills,
        softSkills,
        otherKeywords,
        suggestions,
        recruiterTips,
        recommendation,
        rawText: allRawText,
        createdAt: new Date().toISOString(),
      };
      setResult(record);
      saveAnalysis(record);
    } catch (err) {
      console.error("ATS analysis error:", err);
    }

    setStreamingText("");
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const hasResults = result !== null;

  const getScoreLabel = (score: number) => {
    if (score >= targetScore) return { text: "Target reached!", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50", fg: "text-green-700 dark:text-green-300" };
    if (score >= targetScore - 20) return { text: "Close to target", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50", fg: "text-amber-700 dark:text-amber-300" };
    return { text: "Below target", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50", fg: "text-red-700 dark:text-red-300" };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6" data-testid="text-generator-heading">
          Analyze Your Resume Match
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ats-job-desc" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="ats-job-desc"
                data-testid="input-job-description"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value.slice(0, 15000))}
                placeholder="Paste the full job description or job ad here..."
                rows={10}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                maxLength={15000}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{jobDesc.length}/15,000</p>
            </div>
            <div>
              <label htmlFor="ats-resume" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Resume <span className="text-red-500">*</span>
              </label>
              <textarea
                id="ats-resume"
                data-testid="input-resume"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value.slice(0, 15000))}
                placeholder="Paste your full resume (or just the experience section) here..."
                rows={10}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                maxLength={15000}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{resumeText.length}/15,000</p>
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
                  <label htmlFor="ats-industry" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Industry / Role</label>
                  <select
                    id="ats-industry"
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
                  {streamingText ? "Streaming results below..." : "Starting analysis..."}
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

        {isGenerating && (
          <div className="mt-6" data-testid="container-streaming" aria-live="polite">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                {STEP_LABELS.map((label, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                      i < currentStep
                        ? "bg-green-500 border-green-500 text-white"
                        : i === currentStep
                          ? "bg-indigo-500 border-indigo-500 text-white animate-pulse"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                    )}>
                      {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5 rounded-full",
                        i < currentStep ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"
                      )} />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {STEP_LABELS[currentStep] || "Analyzing..."}
              </p>
            </div>

            <div
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto"
              ref={(el) => { if (el) el.scrollTop = el.scrollHeight; }}
            >
              {streamingText ? (
                <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-streaming">
                  {streamingText}
                  <span className="inline-block w-2 h-4 ml-0.5 bg-indigo-500 animate-pulse rounded-sm" />
                </p>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing AI model for analysis...
                </div>
              )}
            </div>
          </div>
        )}

        {hasResults && result && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">
                Match Report
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
              <InlineShareButtons />
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" data-testid="container-scores">
              <ScoreGauge score={result.overallScore} label="Overall Match" size="lg" target={targetScore} />
              {(() => {
                const sl = getScoreLabel(result.overallScore);
                return (
                  <div className={cn("px-4 py-2 rounded-lg border text-sm font-medium", sl.bg, sl.fg)} data-testid="container-score-status">
                    <strong>{sl.text}</strong> — Your score is {result.overallScore}% vs your target of {targetScore}%
                  </div>
                );
              })()}
            </div>

            <SkillSection
              title="Hard Skills"
              icon={<Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              items={result.hardSkills}
              testId="panel-hard-skills"
            />

            <SkillSection
              title="Soft Skills"
              icon={<Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />}
              items={result.softSkills}
              testId="panel-soft-skills"
            />

            <SkillSection
              title="Other Keywords"
              icon={<Tag className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
              items={result.otherKeywords}
              testId="panel-other-keywords"
            />

            {result.suggestions.length > 0 && (
              <div className="rounded-xl border border-green-200 dark:border-green-700/50 overflow-hidden" data-testid="panel-suggestions">
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-700/50">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-bold text-green-700 dark:text-green-300">
                    Actionable Suggestions ({result.suggestions.length})
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900/60">
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

            {result.recruiterTips.length > 0 && (
              <div className="rounded-xl border border-indigo-200 dark:border-indigo-700/50 overflow-hidden" data-testid="panel-recruiter-tips">
                <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-200 dark:border-indigo-700/50">
                  <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    Recruiter Tips ({result.recruiterTips.length})
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900/60">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Human-focused feedback that goes beyond ATS matching</p>
                  <ul className="space-y-2">
                    {result.recruiterTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <Lightbulb className="w-3.5 h-3.5 mt-0.5 text-indigo-400 dark:text-indigo-500 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {result.recommendation && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" data-testid="container-recommendation">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Final Recommendation</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{result.recommendation}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                data-testid="toggle-raw-output"
                aria-expanded={rawOutputOpen}
                aria-controls="ats-raw-output"
                onClick={() => setRawOutputOpen(!rawOutputOpen)}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {rawOutputOpen ? "Hide" : "Show"} Full AI Output
              </button>
              {rawOutputOpen && (
                <div id="ats-raw-output" className="mt-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{result.rawText}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && !isGenerating && (
          <div className="mt-10" data-testid="container-history">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Analyses</h3>
            <div className="space-y-3">
              {history.slice(0, 5).map((record) => {
                const scoreColor = record.overallScore >= targetScore ? "text-green-600 dark:text-green-400" : record.overallScore >= targetScore - 20 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";
                const totalMissing = (record.hardSkills?.filter(s => !s.found).length || 0) + (record.softSkills?.filter(s => !s.found).length || 0);
                return (
                  <div
                    key={record.id}
                    data-testid={`card-history-${record.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{record.jobTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Score: <span className={cn("font-bold", scoreColor)}>{record.overallScore}%</span> | {totalMissing} missing items | {new Date(record.createdAt).toLocaleDateString()}
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
