import { useState, useRef } from "react";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  ChevronDown, ChevronRight, Trash2, Clock, Flag,
  Target, Calendar, CalendarDays, Timer,
  Download, CheckSquare, Square, Star,
  Briefcase, Rocket, Dumbbell, BookOpen, DollarSign,
  Palette, Users, Sprout, Trophy, AlertCircle, PartyPopper,
  ListChecks, BarChart3,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";
import {
  useGoalStorage,
  type GoalPlan,
  type Milestone,
  type WeekAction,
  type ObstacleItem,
} from "@/hooks/use-goal-storage";

const TIMEFRAMES = [
  { value: "3", label: "3 Months", icon: Timer, desc: "Short-term sprint, focused push", milestones: 3 },
  { value: "6", label: "6 Months", icon: Calendar, desc: "Balanced timeline for significant change", milestones: 5 },
  { value: "12", label: "1 Year", icon: CalendarDays, desc: "Major transformation, sustained effort", milestones: 6 },
] as const;

const GOAL_TYPES = [
  { value: "career", label: "Career", icon: Briefcase },
  { value: "business", label: "Business", icon: Rocket },
  { value: "health", label: "Health & Fitness", icon: Dumbbell },
  { value: "learning", label: "Learning", icon: BookOpen },
  { value: "financial", label: "Financial", icon: DollarSign },
  { value: "creative", label: "Creative", icon: Palette },
  { value: "relationships", label: "Relationships", icon: Users },
  { value: "personal", label: "Personal Growth", icon: Sprout },
] as const;

const QUICK_GOALS = [
  { label: "Career Advancement", example: "Get promoted to senior manager within my company" },
  { label: "Start a Business", example: "Launch an online store selling handmade products" },
  { label: "Health & Fitness", example: "Lose 30 pounds and run a 5K race" },
  { label: "Learn New Skill", example: "Learn web development and build a portfolio" },
  { label: "Financial Goal", example: "Save $10,000 for a down payment on a house" },
  { label: "Creative Project", example: "Write and publish my first book" },
  { label: "Personal Growth", example: "Build a daily meditation and journaling habit" },
] as const;

const PLAN_INCLUDES = [
  { key: "celebrations", label: "Milestone celebrations", default: true },
  { key: "obstacles", label: "Obstacle planning", default: true },
  { key: "resources", label: "Resource recommendations", default: true },
  { key: "skills", label: "Skill development needs", default: true },
  { key: "accountability", label: "Accountability checkpoints", default: false },
  { key: "budgetBreakdown", label: "Budget breakdown", default: false },
  { key: "networking", label: "Networking suggestions", default: false },
] as const;

const PLANNING_STYLES = [
  { value: "aggressive", label: "Aggressive", desc: "Fast-paced, ambitious" },
  { value: "balanced", label: "Balanced", desc: "Realistic, sustainable" },
  { value: "conservative", label: "Conservative", desc: "Slower, more certainty" },
] as const;

const STEP_LABELS = [
  "Analyzing your goal...",
  "Creating milestones...",
  "Planning action steps...",
  "Identifying resources...",
  "Building your roadmap...",
  "Finalizing your plan...",
];

const SYSTEM_PROMPT = `You are an expert goal achievement coach and strategic planner. You break big goals into achievable milestones with realistic timelines, weekly actions, and resource planning. You anticipate obstacles and include celebration milestones. You are thorough, motivating, and practical.`;

const JUNK_PATTERNS = [
  /^\(.*\)$/,
  /^note:/i,
  /^here\s/i,
  /^based\s+on/i,
  /^the\s+following/i,
  /^below/i,
  /^n\/a$/i,
  /^none$/i,
  /^for\s+each/i,
  /^output\s+format/i,
  /^quality\s+check/i,
  /^\[.*\]$/,
];

function isJunkLine(s: string): boolean {
  return JUNK_PATTERNS.some((p) => p.test(s));
}

function parseMilestone(raw: string, idx: number): Milestone {
  const lines = raw.split("\n");
  let name = `Milestone ${idx + 1}`;
  let timeline = "";
  let goal = "";
  const keyOutcomes: string[] = [];
  const weeklyActions: WeekAction[] = [];
  const resources: string[] = [];
  const obstacles: ObstacleItem[] = [];
  let celebration = "";

  let inOutcomes = false;
  let inWeekActions = false;
  let inResources = false;
  let inObstacles = false;
  let inCelebration = false;
  let currentWeek: WeekAction | null = null;
  let currentObstacle: Partial<ObstacleItem> | null = null;

  for (const line of lines) {
    const trimmed = line.replace(/\*\*/g, "").replace(/__/g, "").trim();
    if (!trimmed) {
      inOutcomes = false;
      inWeekActions = false;
      inResources = false;
      inCelebration = false;
      if (currentWeek && currentWeek.tasks.length > 0) {
        weeklyActions.push(currentWeek);
        currentWeek = null;
      }
      if (currentObstacle && currentObstacle.name) {
        obstacles.push({ name: currentObstacle.name, solution: currentObstacle.solution || "" });
        currentObstacle = null;
      }
      continue;
    }

    const milestoneMatch = trimmed.match(/^(?:MILESTONE\s*\d+|Milestone\s*\d+)[:\s]*(.+)/i);
    if (milestoneMatch) {
      name = milestoneMatch[1].trim();
      inOutcomes = false; inWeekActions = false; inResources = false; inObstacles = false; inCelebration = false;
      continue;
    }

    const timelineMatch = trimmed.match(/^Timeline[:\s]*(.+)/i);
    if (timelineMatch) { timeline = timelineMatch[1].trim(); continue; }

    const goalMatch = trimmed.match(/^Goal[:\s]*(.+)/i);
    if (goalMatch && !inWeekActions) { goal = goalMatch[1].trim(); continue; }

    if (/^(?:KEY\s+OUTCOMES?|OUTCOMES?|DELIVERABLES?)[:\s]*/i.test(trimmed)) {
      inOutcomes = true; inWeekActions = false; inResources = false; inObstacles = false; inCelebration = false;
      continue;
    }

    if (/^(?:WEEKLY\s+ACTIONS?|WEEK\s+\d|ACTION\s+STEPS?)[:\s]*/i.test(trimmed)) {
      inWeekActions = true; inOutcomes = false; inResources = false; inObstacles = false; inCelebration = false;
      const weekMatch = trimmed.match(/^Week\s+(\d+(?:\s*[-–]\s*\d+)?(?:\s*\(.*?\))?)[:\s]*/i);
      if (weekMatch) {
        if (currentWeek && currentWeek.tasks.length > 0) weeklyActions.push(currentWeek);
        currentWeek = { week: `Week ${weekMatch[1]}`, tasks: [] };
      }
      continue;
    }

    if (/^(?:RESOURCES?\s*(?:NEEDED)?|TOOLS?\s*(?:NEEDED)?)[:\s]*/i.test(trimmed)) {
      inResources = true; inOutcomes = false; inWeekActions = false; inObstacles = false; inCelebration = false;
      continue;
    }

    if (/^(?:POTENTIAL\s+OBSTACLES?|OBSTACLES?\s*(?:&|AND)?\s*SOLUTIONS?|CHALLENGES?)[:\s]*/i.test(trimmed)) {
      inObstacles = true; inOutcomes = false; inWeekActions = false; inResources = false; inCelebration = false;
      continue;
    }

    if (/^(?:MILESTONE\s+CELEBRATION|CELEBRATION|REWARD|FINAL\s+CELEBRATION)[:\s]*/i.test(trimmed)) {
      inCelebration = true; inOutcomes = false; inWeekActions = false; inResources = false; inObstacles = false;
      continue;
    }

    if (inOutcomes) {
      const item = trimmed.replace(/^[\-*•✓✔☑]+\s*/, "").trim();
      if (item.length > 3 && item.length < 300 && !isJunkLine(item)) {
        keyOutcomes.push(item);
      }
      continue;
    }

    if (inWeekActions) {
      const weekMatch = trimmed.match(/^Week\s+(\d+(?:\s*[-–]\s*\d+)?(?:\s*\(.*?\))?)[:\s]*/i);
      if (weekMatch) {
        if (currentWeek && currentWeek.tasks.length > 0) weeklyActions.push(currentWeek);
        currentWeek = { week: `Week ${weekMatch[1]}`, tasks: [] };
        continue;
      }
      if (currentWeek) {
        const task = trimmed.replace(/^[\-*•\d.)]+\s*/, "").trim();
        if (task.length > 3 && task.length < 300 && !isJunkLine(task)) {
          currentWeek.tasks.push(task);
        }
      }
      continue;
    }

    if (inResources) {
      const res = trimmed.replace(/^[\-*•]+\s*/, "").trim();
      if (res.length > 2 && res.length < 200 && !isJunkLine(res)) {
        resources.push(res);
      }
      continue;
    }

    if (inObstacles) {
      const obstacleMatch = trimmed.match(/^(?:OBSTACLE\s*#?\d*|Problem|Challenge)[:\s]*(.+)/i);
      if (obstacleMatch) {
        if (currentObstacle && currentObstacle.name) {
          obstacles.push({ name: currentObstacle.name, solution: currentObstacle.solution || "" });
        }
        currentObstacle = { name: obstacleMatch[1].trim(), solution: "" };
        continue;
      }
      const solutionMatch = trimmed.match(/^Solution[:\s]*(.+)/i);
      if (solutionMatch && currentObstacle) {
        currentObstacle.solution = solutionMatch[1].trim();
        continue;
      }
      if (!currentObstacle && trimmed.length > 5) {
        const item = trimmed.replace(/^[\-*•⚠️]+\s*/, "").trim();
        if (item.length > 3 && !isJunkLine(item)) {
          currentObstacle = { name: item, solution: "" };
        }
      } else if (currentObstacle && !currentObstacle.solution && trimmed.length > 5) {
        const sol = trimmed.replace(/^[\-*•]+\s*/, "").trim();
        if (!isJunkLine(sol)) {
          currentObstacle.solution = sol;
        }
      }
      continue;
    }

    if (inCelebration) {
      const cel = trimmed.replace(/^[\-*•🎉🎊]+\s*/, "").trim();
      if (cel.length > 3 && !isJunkLine(cel)) {
        celebration = celebration ? `${celebration} ${cel}` : cel;
      }
      continue;
    }
  }

  if (currentWeek && currentWeek.tasks.length > 0) weeklyActions.push(currentWeek);
  if (currentObstacle && currentObstacle.name) {
    obstacles.push({ name: currentObstacle.name, solution: currentObstacle.solution || "" });
  }

  return { name, timeline, goal, keyOutcomes, weeklyActions, resources, obstacles, celebration, done: false };
}

function getTimeLabel(hrs: number): string {
  if (hrs <= 5) return "Part-time commitment";
  if (hrs <= 10) return "Solid weekly progress";
  if (hrs <= 20) return "Serious dedication";
  return "Full-time focus";
}

function MilestoneCard({
  milestone,
  index,
  total,
  expanded,
  onToggleExpand,
  onToggleComplete,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: () => void;
}) {
  return (
    <div
      data-testid={`card-milestone-${index}`}
      className={cn(
        "rounded-xl border transition-all overflow-hidden",
        milestone.done
          ? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={milestone.done}
          onClick={onToggleComplete}
          data-testid={`button-toggle-milestone-${index}`}
          className="mt-0.5 flex-shrink-0 transition-colors"
          aria-label={`Milestone ${index + 1}: ${milestone.name}`}
        >
          {milestone.done ? (
            <CheckSquare className="w-5 h-5 text-green-500 dark:text-green-400" />
          ) : (
            <Square className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={expanded}
            className="w-full text-left flex items-center gap-2"
            data-testid={`button-expand-milestone-${index}`}
          >
            <span className={cn(
              "text-sm font-semibold flex-1",
              milestone.done ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"
            )}>
              {milestone.name}
            </span>
            <ChevronRight className={cn(
              "w-4 h-4 text-slate-400 transition-transform flex-shrink-0",
              expanded && "rotate-90"
            )} />
          </button>

          <div className="flex flex-wrap gap-2 mt-1">
            {milestone.timeline && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                {milestone.timeline}
              </span>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {index + 1} of {total}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-3">
          {milestone.goal && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Goal</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{milestone.goal}</p>
            </div>
          )}

          {milestone.keyOutcomes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Key Outcomes</p>
              <ul className="space-y-1">
                {milestone.keyOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Target className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {milestone.weeklyActions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Weekly Actions</p>
              <div className="space-y-3">
                {milestone.weeklyActions.map((wa, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">{wa.week}</p>
                    <ul className="space-y-0.5">
                      {wa.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <ListChecks className="w-3 h-3 text-slate-400 dark:text-slate-500 mt-1 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {milestone.resources.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Resources Needed</p>
              <ul className="space-y-0.5">
                {milestone.resources.map((res, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Star className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />
                    {res}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {milestone.obstacles.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Potential Obstacles</p>
              <div className="space-y-2">
                {milestone.obstacles.map((obs, i) => (
                  <div key={i} className="rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 p-3">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {obs.name}
                    </p>
                    {obs.solution && (
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                        <span className="font-semibold">Solution:</span> {obs.solution}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {milestone.celebration && (
            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/40 p-3">
              <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <PartyPopper className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span className="font-semibold">Celebration:</span> {milestone.celebration}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function GoalPlannerGenerator() {
  const { state: status, generateRaw } = useWebLLM();
  const { history, savePlan, deletePlan, toggleMilestone } = useGoalStorage();

  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("6");
  const [goalType, setGoalType] = useState("business");
  const [startingPoint, setStartingPoint] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [budget, setBudget] = useState("");
  const [constraints, setConstraints] = useState("");

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [planIncludes, setPlanIncludes] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    PLAN_INCLUDES.forEach((p) => { defaults[p.key] = p.default; });
    return defaults;
  });
  const [planningStyle, setPlanningStyle] = useState("balanced");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [streamingText, setStreamingText] = useState("");
  const [result, setResult] = useState<GoalPlan | null>(null);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<number>>(new Set());
  const abortRef = useRef(false);

  const canGenerate = goal.trim().length > 5;

  const handleReset = () => {
    abortRef.current = true;
    setGoal("");
    setTimeframe("6");
    setGoalType("business");
    setStartingPoint("");
    setWeeklyHours(10);
    setBudget("");
    setConstraints("");
    setAdvancedOpen(false);
    setPlanIncludes(() => {
      const defaults: Record<string, boolean> = {};
      PLAN_INCLUDES.forEach((p) => { defaults[p.key] = p.default; });
      return defaults;
    });
    setPlanningStyle("balanced");
    setStreamingText("");
    setResult(null);
    setCopiedPlan(false);
    setExpandedMilestones(new Set());
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const toggleInclude = (key: string) => {
    setPlanIncludes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyQuickGoal = (q: typeof QUICK_GOALS[number]) => {
    setGoal(q.example);
  };

  const getMilestoneCount = () => {
    const tf = TIMEFRAMES.find((t) => t.value === timeframe);
    return tf?.milestones || 5;
  };

  const buildMilestonePrompt = (msNum: number, totalMs: number, prevContext: string) => {
    const typeLabel = GOAL_TYPES.find((t) => t.value === goalType)?.label || "General";
    const tfLabel = TIMEFRAMES.find((t) => t.value === timeframe)?.label || "6 Months";
    const styleLabel = PLANNING_STYLES.find((s) => s.value === planningStyle)?.label || "Balanced";

    const includeLines: string[] = [];
    if (planIncludes.celebrations) includeLines.push("Include a Milestone Celebration section with a specific reward.");
    if (planIncludes.obstacles) includeLines.push("Include Potential Obstacles section with Problem and Solution for each.");
    if (planIncludes.resources) includeLines.push("Include Resources Needed section with specific tools, courses, or materials.");
    if (planIncludes.skills) includeLines.push("Include skills to develop during this milestone.");
    if (planIncludes.accountability) includeLines.push("Include accountability checkpoints.");
    if (planIncludes.budgetBreakdown) includeLines.push(`Include budget allocation for this milestone. Total budget: ${budget || "not specified"}.`);
    if (planIncludes.networking) includeLines.push("Include networking and mentorship suggestions.");

    const startLine = startingPoint.trim() ? `\nStarting Point: ${startingPoint.trim()}` : "";
    const budgetLine = budget.trim() ? `\nBudget: $${budget.trim()}` : "";
    const constraintLine = constraints.trim() ? `\nConstraints: ${constraints.trim()}` : "";
    const prevLine = prevContext ? `\nPrevious milestones covered: ${prevContext}` : "";

    return `Generate Milestone ${msNum} of ${totalMs} for this goal achievement roadmap.

Goal: ${goal.trim().slice(0, 500)}
Goal Type: ${typeLabel}
Timeframe: ${tfLabel}
Available Time: ${weeklyHours} hours/week
Planning Style: ${styleLabel}${startLine}${budgetLine}${constraintLine}${prevLine}

${includeLines.join("\n")}

Each milestone should cover approximately ${Math.round(parseInt(timeframe) / totalMs)} month(s).

Use this EXACT format:

MILESTONE ${msNum}: (descriptive name for this phase)
Timeline: (which month or months this covers)
Goal: (what completing this milestone achieves)

Key Outcomes:
- (specific measurable outcome)
- (specific measurable outcome)
- (continue, 3-5 outcomes)

Weekly Actions:

Week ${(msNum - 1) * Math.ceil(parseInt(timeframe) * 4 / totalMs) + 1} (brief date description):
- (specific actionable task with time estimate)
- (specific actionable task)
- (3-5 tasks per week)

Week ${(msNum - 1) * Math.ceil(parseInt(timeframe) * 4 / totalMs) + 2}:
- (tasks)

(continue for ${Math.ceil(parseInt(timeframe) * 4 / totalMs)} weeks)

${planIncludes.resources ? "Resources Needed:\n- (specific resource with cost if applicable)\n- (continue)\n" : ""}
${planIncludes.obstacles ? "Potential Obstacles:\nObstacle: (name)\nSolution: (how to overcome)\n\nObstacle: (name)\nSolution: (how to overcome)\n" : ""}
${planIncludes.celebrations ? "Milestone Celebration:\n(specific reward for completing this milestone)\n" : ""}
Write Milestone ${msNum} now:`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setResult(null);
    setCopiedPlan(false);
    setExpandedMilestones(new Set());
    setCurrentStep(0);
    abortRef.current = false;

    const totalMilestones = getMilestoneCount();
    const allMilestones: Milestone[] = [];
    let allRawText = "";
    let prevContext = "";

    try {
      for (let i = 0; i < totalMilestones; i++) {
        if (abortRef.current) return;
        setCurrentStep(Math.min(i, STEP_LABELS.length - 1));
        setStreamingText("");

        const prompt = buildMilestonePrompt(i + 1, totalMilestones, prevContext);

        const raw = await generateRaw({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          maxTokens: 1800,
          onChunk: (text) => setStreamingText(text),
        });

        if (abortRef.current) return;
        const msText = typeof raw === "string" ? raw : "";
        allRawText += `\n${msText}\n`;

        const milestone = parseMilestone(msText, i);
        if (milestone.keyOutcomes.length > 0 || milestone.weeklyActions.length > 0) {
          allMilestones.push(milestone);
          prevContext += `${milestone.name} (${milestone.timeline}), `;
        }
      }

      if (abortRef.current) return;

      if (allMilestones.length === 0) {
        setStreamingText("Unable to generate a goal roadmap. Please try rephrasing your goal or try again.");
        setIsGenerating(false);
        setCurrentStep(0);
        return;
      }

      const record: GoalPlan = {
        id: generateId(),
        goal: goal.trim().slice(0, 500),
        goalType,
        timeframe,
        startingPoint: startingPoint.trim(),
        weeklyHours,
        budget: budget.trim(),
        constraints: constraints.trim(),
        milestones: allMilestones,
        rawText: allRawText,
        createdAt: new Date().toISOString(),
      };
      setResult(record);
      savePlan(record);
    } catch (err) {
      console.error("Goal planner generation error:", err);
    }
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const handleToggleMilestone = (milestoneIndex: number) => {
    if (!result) return;
    const updated = toggleMilestone(result.id, milestoneIndex);
    if (updated) setResult(updated);
  };

  const toggleExpand = (idx: number) => {
    setExpandedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const completedCount = result?.milestones.filter((m) => m.done).length || 0;
  const totalCount = result?.milestones.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalWeeks = result?.milestones.reduce((acc, m) => acc + m.weeklyActions.length, 0) || 0;

  const exportRoadmap = () => {
    if (!result) return "";
    let text = `Goal Roadmap: ${result.goal}\n${"=".repeat(40)}\n\n`;
    text += `Timeframe: ${TIMEFRAMES.find((t) => t.value === result.timeframe)?.label || result.timeframe}\n`;
    text += `Goal Type: ${GOAL_TYPES.find((t) => t.value === result.goalType)?.label || result.goalType}\n\n`;
    for (const ms of result.milestones) {
      text += `${ms.done ? "[x]" : "[ ]"} ${ms.name}\n`;
      text += `    Timeline: ${ms.timeline}\n`;
      text += `    Goal: ${ms.goal}\n\n`;
      if (ms.keyOutcomes.length > 0) {
        text += `    Key Outcomes:\n`;
        ms.keyOutcomes.forEach((o) => { text += `      - ${o}\n`; });
        text += "\n";
      }
      for (const wa of ms.weeklyActions) {
        text += `    ${wa.week}:\n`;
        wa.tasks.forEach((t) => { text += `      - ${t}\n`; });
        text += "\n";
      }
    }
    return text;
  };

  const exportMarkdown = () => {
    if (!result) return "";
    let md = `# Goal Roadmap: ${result.goal}\n\n`;
    md += `**Timeframe:** ${TIMEFRAMES.find((t) => t.value === result.timeframe)?.label || result.timeframe}\n`;
    md += `**Type:** ${GOAL_TYPES.find((t) => t.value === result.goalType)?.label || result.goalType}\n\n`;
    for (const ms of result.milestones) {
      md += `## ${ms.done ? "~~" : ""}${ms.name}${ms.done ? "~~" : ""}\n`;
      md += `**Timeline:** ${ms.timeline}\n\n`;
      if (ms.goal) md += `> ${ms.goal}\n\n`;
      if (ms.keyOutcomes.length > 0) {
        md += `### Key Outcomes\n`;
        ms.keyOutcomes.forEach((o) => { md += `- ${o}\n`; });
        md += "\n";
      }
      if (ms.weeklyActions.length > 0) {
        md += `### Weekly Actions\n`;
        for (const wa of ms.weeklyActions) {
          md += `**${wa.week}:**\n`;
          wa.tasks.forEach((t) => { md += `- ${t}\n`; });
          md += "\n";
        }
      }
      if (ms.resources.length > 0) {
        md += `### Resources\n`;
        ms.resources.forEach((r) => { md += `- ${r}\n`; });
        md += "\n";
      }
      if (ms.obstacles.length > 0) {
        md += `### Obstacles\n`;
        ms.obstacles.forEach((o) => { md += `- **${o.name}**: ${o.solution}\n`; });
        md += "\n";
      }
      if (ms.celebration) md += `*Celebration: ${ms.celebration}*\n\n`;
    }
    return md;
  };

  const exportCSV = () => {
    if (!result) return "";
    let csv = "Milestone,Timeline,Goal,Key Outcomes,Status\n";
    for (const ms of result.milestones) {
      csv += `"${ms.name}","${ms.timeline}","${ms.goal}","${ms.keyOutcomes.join("; ")}",${ms.done ? "Done" : "Pending"}\n`;
    }
    return csv;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlan(true);
      setTimeout(() => setCopiedPlan(false), 2000);
    } catch {}
  };

  const hasResults = result !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6" data-testid="text-generator-heading">
          Plan Your Goal Achievement
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="goal-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              What's Your Goal? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="goal-input"
              data-testid="input-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value.slice(0, 500))}
              placeholder={"Describe your goal in detail:\n\nExamples:\n\u2022 Start an online business selling handmade jewelry\n\u2022 Lose 30 pounds and run a 5K\n\u2022 Learn web development and get a tech job\n\u2022 Save $10,000 for a down payment\n\u2022 Write and publish my first book"}
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
              maxLength={500}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{goal.length}/500</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Quick Goal Examples</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUICK_GOALS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  data-testid={`button-template-${q.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => applyQuickGoal(q)}
                  className="text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Timeframe</label>
            <div className="grid grid-cols-3 gap-2" data-testid="container-timeframe">
              {TIMEFRAMES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={timeframe === value}
                  data-testid={`toggle-timeframe-${value}`}
                  onClick={() => setTimeframe(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all",
                    timeframe === value
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  <Icon className={cn("w-5 h-5", timeframe === value ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className={cn("text-sm font-semibold", timeframe === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Goal Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="container-goal-type">
              {GOAL_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={goalType === value}
                  data-testid={`toggle-type-${value}`}
                  onClick={() => setGoalType(value)}
                  className={cn(
                    "flex items-center gap-2 py-2.5 px-3 rounded-xl border text-left transition-all",
                    goalType === value
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  <Icon className={cn("w-4 h-4 flex-shrink-0", goalType === value ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className={cn("text-sm font-semibold", goalType === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="starting-point" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Starting Point <span className="text-xs font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="starting-point"
                data-testid="input-starting-point"
                value={startingPoint}
                onChange={(e) => setStartingPoint(e.target.value.slice(0, 300))}
                placeholder="Where are you starting from? e.g., 'Complete beginner' or 'Have basic knowledge'"
                rows={3}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                maxLength={300}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{startingPoint.length}/300</p>
            </div>

            <div>
              <label htmlFor="weekly-hours" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Available Time per Week: <span className="text-indigo-600 dark:text-indigo-400">{weeklyHours} hrs</span>
              </label>
              <input
                id="weekly-hours"
                type="range"
                min={2}
                max={40}
                step={1}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value, 10))}
                data-testid="slider-weekly-hours"
                className="w-full accent-indigo-500 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                <span>2 hrs</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{getTimeLabel(weeklyHours)}</span>
                <span>40 hrs</span>
              </div>

              <div className="mt-4">
                <label htmlFor="budget-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Budget <span className="text-xs font-normal text-slate-400">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">$</span>
                  <input
                    id="budget-input"
                    type="number"
                    data-testid="input-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., 500"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-7 pr-4 py-2.5 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="constraints-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Constraints <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="constraints-input"
              data-testid="input-constraints"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value.slice(0, 200))}
              placeholder="Any limitations? e.g., 'Full-time job', 'Limited budget', 'No prior experience'"
              rows={2}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
              maxLength={200}
            />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              type="button"
              data-testid="toggle-advanced"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              aria-expanded={advancedOpen}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", advancedOpen && "rotate-180")} />
              Advanced Options
            </button>

            {advancedOpen && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Include in Plan</p>
                  <div className="grid grid-cols-2 gap-2" data-testid="container-includes">
                    {PLAN_INCLUDES.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        aria-pressed={planIncludes[item.key]}
                        data-testid={`toggle-include-${item.key}`}
                        onClick={() => toggleInclude(item.key)}
                        className={cn(
                          "flex items-center gap-2 py-2 px-3 rounded-lg border text-left text-sm transition-all",
                          planIncludes[item.key]
                            ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        )}
                      >
                        {planIncludes[item.key] ? (
                          <CheckSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Planning Style</p>
                  <div className="flex gap-2" data-testid="container-planning-style">
                    {PLANNING_STYLES.map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={planningStyle === value}
                        data-testid={`toggle-style-${value}`}
                        onClick={() => setPlanningStyle(value)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border text-center transition-all",
                          planningStyle === value
                            ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                        )}
                      >
                        <span className={cn("text-sm font-semibold block", planningStyle === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm" data-testid="alert-gpu-error">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>WebGPU is not available in this browser. Please use Chrome or Edge on a device with a GPU.</span>
            </div>
          )}

          <button
            type="button"
            data-testid="button-generate"
            disabled={!canGenerate || isGenerating || status === "error"}
            onClick={handleGenerate}
            className={cn(
              "w-full py-3.5 rounded-xl font-bold text-white text-base transition-all shadow-md",
              canGenerate && !isGenerating && status !== "error"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                : "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
            )}
          >
            {isGenerating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {STEP_LABELS[currentStep]}
              </span>
            ) : status === "downloading" ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Downloading AI model...
              </span>
            ) : status === "checking-gpu" ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking GPU compatibility...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Target className="w-5 h-5" />
                Create My Goal Roadmap
              </span>
            )}
          </button>
        </div>

        {isGenerating && streamingText && (
          <div className="mt-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50" aria-live="polite">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Building Milestone {currentStep + 1}...
            </p>
            <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">{streamingText}</pre>
          </div>
        )}

        {hasResults && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100" data-testid="text-results-heading">
                Your Goal Roadmap
              </h3>
              <button
                type="button"
                data-testid="button-reset"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start Over
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-5">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1" data-testid="text-goal-title">{result!.goal}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {TIMEFRAMES.find((t) => t.value === result!.timeframe)?.label || result!.timeframe}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  {GOAL_TYPES.find((t) => t.value === result!.goalType)?.label || result!.goalType}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {result!.weeklyHours} hrs/week
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Progress: {completedCount}/{totalCount} milestones
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                    data-testid="progress-bar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-white/70 dark:bg-slate-800/50 p-2">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400" data-testid="stat-milestones">{totalCount}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Milestones</p>
                </div>
                <div className="rounded-lg bg-white/70 dark:bg-slate-800/50 p-2">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400" data-testid="stat-weeks">{totalWeeks}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Weeks Planned</p>
                </div>
                <div className="rounded-lg bg-white/70 dark:bg-slate-800/50 p-2">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400" data-testid="stat-hours">{result!.weeklyHours * parseInt(result!.timeframe) * 4}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Est. Hours</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {result!.milestones.map((ms, idx) => (
                <MilestoneCard
                  key={idx}
                  milestone={ms}
                  index={idx}
                  total={totalCount}
                  expanded={expandedMilestones.has(idx)}
                  onToggleExpand={() => toggleExpand(idx)}
                  onToggleComplete={() => handleToggleMilestone(idx)}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                data-testid="button-copy-roadmap"
                onClick={() => copyText(exportRoadmap())}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                {copiedPlan ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copiedPlan ? "Copied!" : "Copy Roadmap"}
              </button>
              <InlineShareButtons />
              <button
                type="button"
                data-testid="button-download-md"
                onClick={() => downloadFile(exportMarkdown(), "goal-roadmap.md", "text/markdown")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Markdown
              </button>
              <button
                type="button"
                data-testid="button-download-csv"
                onClick={() => downloadFile(exportCSV(), "goal-roadmap.csv", "text/csv")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-sm font-display font-bold text-slate-700 dark:text-slate-300 mb-3" data-testid="text-history-heading">
              <BarChart3 className="w-4 h-4 inline mr-1.5" />
              Saved Goal Plans ({history.length})
            </h3>
            <div className="space-y-2">
              {history.map((plan) => {
                const done = plan.milestones.filter((m) => m.done).length;
                const total = plan.milestones.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    data-testid={`card-history-${plan.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors cursor-pointer w-full text-left"
                    onClick={() => { setResult(plan); setExpandedMilestones(new Set()); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{plan.goal}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(plan.createdAt).toLocaleDateString()} | {TIMEFRAMES.find((t) => t.value === plan.timeframe)?.label || plan.timeframe} | {pct}% complete
                      </p>
                    </div>
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      data-testid={`button-delete-${plan.id}`}
                      onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); if (result?.id === plan.id) setResult(null); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); deletePlan(plan.id); if (result?.id === plan.id) setResult(null); } }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                      aria-label="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
