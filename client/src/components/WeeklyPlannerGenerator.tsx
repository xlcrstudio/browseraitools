import { useState, useRef } from "react";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  ChevronDown, ChevronRight, Trash2, Clock, Flag,
  CalendarDays, Target, Download, Timer, Calendar,
  Zap, Dumbbell, CheckSquare, Square,
  Briefcase, GraduationCap, Heart, Scale, Rocket, Home,
  Sun, Cloud, Moon, Star, BarChart3,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useWeeklyPlannerStorage,
  type WeeklyPlan,
  type DayPlan,
  type TimeBlock,
} from "@/hooks/use-weekly-planner-storage";

const AVAILABLE_HOURS = [
  { value: "limited", label: "Limited", icon: Zap, desc: "1-2 hours/day", total: "7-14 hrs/week" },
  { value: "moderate", label: "Moderate", icon: Calendar, desc: "2-4 hours/day", total: "14-28 hrs/week" },
  { value: "focused", label: "Focused", icon: Target, desc: "4-6 hours/day", total: "28-42 hrs/week" },
  { value: "intensive", label: "Intensive", icon: Dumbbell, desc: "6-8+ hours/day", total: "42-56+ hrs/week" },
] as const;

const PEAK_TIMES = [
  { value: "morning", label: "Morning", desc: "6am-12pm", icon: Sun },
  { value: "afternoon", label: "Afternoon", desc: "12pm-6pm", icon: Cloud },
  { value: "evening", label: "Evening", desc: "6pm-10pm", icon: Moon },
  { value: "night", label: "Night", desc: "10pm+", icon: Star },
] as const;

const PRIORITY_FOCUS = [
  { value: "balanced", label: "Balanced", icon: Scale, desc: "50% work, 25% health, 25% personal" },
  { value: "work", label: "Work-Focused", icon: Briefcase, desc: "70% work, 15% health, 15% personal" },
  { value: "health", label: "Health & Wellness", icon: Heart, desc: "40% work, 40% health, 20% personal" },
  { value: "personal", label: "Personal Growth", icon: Rocket, desc: "40% work, 20% health, 40% personal" },
] as const;

const TASK_CHUNKING = [
  { value: "small", label: "Small", desc: "30-60 min tasks" },
  { value: "medium", label: "Medium", desc: "1-2 hour tasks" },
  { value: "large", label: "Large", desc: "2-4 hour blocks" },
] as const;

const QUICK_TEMPLATES = [
  { label: "Work-Focused Week", icon: Briefcase, example: "Finish quarterly report\nPrepare client presentation\nClear email backlog\nTeam meeting prep\nSkill development reading" },
  { label: "Student Week", icon: GraduationCap, example: "Study for midterm exam\nWrite research paper draft\nComplete math assignments\nAttend study group\nReview lecture notes" },
  { label: "Health & Fitness", icon: Heart, example: "Gym workout 4 times\nMeal prep for the week\nMorning yoga routine\n30-min walk daily\nMeditation practice" },
  { label: "Balanced Lifestyle", icon: Scale, example: "Complete work project\nExercise 3 times\nRead 2 chapters of book\nCook healthy dinners\nCall family and friends" },
  { label: "Side Project Sprint", icon: Rocket, example: "Build landing page\nWrite 3 blog posts\nSet up email marketing\nDesign social media graphics\nLaunch MVP feature" },
  { label: "Life Admin Week", icon: Home, example: "Organize home office\nSchedule doctor appointment\nFile taxes\nGrocery shopping and meal prep\nPay bills and budget review" },
] as const;

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const SPECIAL_CONSIDERATIONS = [
  { key: "groupSimilar", label: "Group similar tasks together" },
  { key: "morningsFree", label: "Leave mornings free" },
  { key: "eveningsFree", label: "Leave evenings free" },
  { key: "mealPrep", label: "Include meal prep time" },
  { key: "commute", label: "Include commute/transition time" },
  { key: "breaks", label: "Schedule regular breaks" },
] as const;

const STEP_LABELS = [
  "Analyzing your goals...",
  "Optimizing schedule...",
  "Balancing workload...",
  "Adding buffer time...",
  "Planning your week...",
  "Finalizing schedule...",
  "Almost done...",
];

const SYSTEM_PROMPT = `You are an expert productivity coach and time management specialist. You create optimized weekly schedules that balance goals, energy levels, and available time. Tasks should be distributed realistically across days with proper time estimates. You are practical, organized, and focused on sustainable productivity.`;

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

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(work|project|report|meeting|email|client|presentation|proposal|deadline|office)\b/.test(lower)) return "Work";
  if (/\b(health|gym|workout|exercise|fitness|run|yoga|stretch|walk|cardio|strength)\b/.test(lower)) return "Health";
  if (/\b(learn|study|read|course|tutorial|practice|chapter|book|research|python|coding)\b/.test(lower)) return "Learning";
  if (/\b(break|rest|coffee|lunch|relax|recharge|nap)\b/.test(lower)) return "Break";
  if (/\b(plan|review|reflect|organize|schedule|prep)\b/.test(lower)) return "Planning";
  if (/\b(personal|family|call|friend|home|clean|cook|meal|grocery|errands|organize|declutter)\b/.test(lower)) return "Personal";
  return "Work";
}

function detectPriority(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(high|urgent|critical|important|top|must|essential)\b/.test(lower)) return "High";
  if (/\b(low|optional|flexible|light|easy|if time)\b/.test(lower)) return "Low";
  return "Medium";
}

function parseDayPlan(raw: string, dayName: string): DayPlan {
  const lines = raw.split("\n");
  let totalHours = 0;
  let energyLevel = "Medium";
  let summary = "";
  const tasks: TimeBlock[] = [];
  let currentTask: Partial<TimeBlock> | null = null;
  let inSummary = false;

  const flushTask = () => {
    if (currentTask && currentTask.title && currentTask.title.length > 2) {
      if (!currentTask.category) currentTask.category = detectCategory(currentTask.title + " " + (currentTask.description || ""));
      if (!currentTask.priority || currentTask.priority === "Medium") {
        const detected = detectPriority(currentTask.title + " " + (currentTask.description || ""));
        if (detected !== "Medium") currentTask.priority = detected;
      }
      tasks.push(finalizeBlock(currentTask));
    }
    currentTask = null;
  };

  for (const line of lines) {
    const trimmed = line.replace(/\*\*/g, "").replace(/__/g, "").replace(/^#+\s*/, "").trim();
    if (!trimmed) {
      if (inSummary) continue;
      flushTask();
      continue;
    }

    if (/^(?:MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)[:\s,]/i.test(trimmed) && !trimmed.match(/call|meet|schedule/i)) continue;

    const energyMatch = trimmed.match(/Energy[:\s]*(High|Medium|Low|Rest|Variable|Medium-High|Medium-Low)/i);
    if (energyMatch) { energyLevel = energyMatch[1]; continue; }

    const totalMatch = trimmed.match(/Total[:\s]*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);
    if (totalMatch) { totalHours = parseFloat(totalMatch[1]); continue; }

    if (/^(?:Day\s+Summary|Summary|Accomplishments|What.*accomplished|Key.*wins)[:\s]*/i.test(trimmed)) {
      inSummary = true;
      flushTask();
      continue;
    }

    if (inSummary) {
      const item = trimmed.replace(/^[\-*•✅⚠️✓\d.]+[\s.)]*/, "").trim();
      if (item.length > 3 && !isJunkLine(item)) {
        summary = summary ? `${summary}; ${item}` : item;
      }
      continue;
    }

    if (/^(?:MORNING|AFTERNOON|EVENING|NIGHT|LATE\s+MORNING|EARLY\s+MORNING|MID-MORNING|MID-DAY|MIDDAY)[:\s]*/i.test(trimmed)) {
      flushTask();
      continue;
    }

    const timeMatch = trimmed.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*\|?\s*(.+)?/i);
    if (timeMatch) {
      flushTask();
      const timeStr = `${timeMatch[1]} - ${timeMatch[2]}`;
      const rest = timeMatch[3]?.trim() || "";
      const durMatch = rest.match(/^(\d+(?:\.\d+)?\s*(?:hours?|hrs?|min(?:utes?)?|h))/i);
      const duration = durMatch ? durMatch[1] : "";
      currentTask = { time: timeStr, duration, title: "", category: "", priority: "Medium", description: "" };
      continue;
    }

    const catTaskMatch = trimmed.match(/^(?:[-*•\d.)\s]*)?(WORK|HEALTH|PERSONAL|LEARNING|BREAK|PLANNING|FITNESS|STUDY|EXERCISE|SELF-CARE|ADMIN|HOME)[:\s]+(.+)/i);
    if (catTaskMatch) {
      flushTask();
      const rawCat = catTaskMatch[1].trim();
      let cat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase();
      if (["Study", "Exercise", "Self-care", "Admin", "Home"].includes(cat)) {
        if (cat === "Study") cat = "Learning";
        else if (cat === "Exercise") cat = "Health";
        else if (cat === "Self-care") cat = "Health";
        else if (cat === "Admin" || cat === "Home") cat = "Personal";
      }
      currentTask = { time: "", duration: "", category: cat, title: catTaskMatch[2].trim(), priority: "Medium", description: "" };
      continue;
    }

    const prioMatch = trimmed.match(/^Priority[:\s]*(High|Medium|Low)/i);
    if (prioMatch && currentTask) {
      currentTask.priority = prioMatch[1].charAt(0).toUpperCase() + prioMatch[1].slice(1).toLowerCase();
      continue;
    }

    const durLineMatch = trimmed.match(/^(?:Duration|Time|Estimated)[:\s]*(.+)/i);
    if (durLineMatch && currentTask && !currentTask.duration) {
      currentTask.duration = durLineMatch[1].trim();
      continue;
    }

    const bulletTask = trimmed.replace(/^[\-*•\d.)\s]+/, "").trim();
    if (!bulletTask || bulletTask.length < 4) continue;
    if (isJunkLine(bulletTask)) continue;

    const inlineTime = bulletTask.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    const inlineDur = bulletTask.match(/\((\d+(?:\.\d+)?\s*(?:hours?|hrs?|h|min(?:utes?)?))\)/i);
    const inlinePrio = bulletTask.match(/\[(High|Medium|Low)\]/i) || bulletTask.match(/Priority[:\s]*(High|Medium|Low)/i);
    const inlineCat = bulletTask.match(/^(WORK|HEALTH|PERSONAL|LEARNING|BREAK|PLANNING|FITNESS)[:\s]+/i);

    if (inlineTime || inlineDur || inlineCat || (bulletTask.length > 5 && /[a-zA-Z]/.test(bulletTask))) {
      if (currentTask && currentTask.title) {
        if (!currentTask.description && !inlineTime && !inlineCat && bulletTask.length > 10) {
          currentTask.description = bulletTask;
          continue;
        }
        flushTask();
      }

      let time = "";
      let duration = "";
      let title = bulletTask;
      let category = "";
      let priority = "Medium";

      if (inlineTime) {
        time = `${inlineTime[1]} - ${inlineTime[2]}`;
        title = title.replace(inlineTime[0], "").trim();
      }
      if (inlineDur) {
        duration = inlineDur[1];
        title = title.replace(inlineDur[0], "").trim();
      }
      if (inlinePrio) {
        priority = inlinePrio[1].charAt(0).toUpperCase() + inlinePrio[1].slice(1).toLowerCase();
        title = title.replace(inlinePrio[0], "").trim();
      }
      if (inlineCat) {
        category = inlineCat[1].charAt(0).toUpperCase() + inlineCat[1].slice(1).toLowerCase();
        title = title.replace(inlineCat[0], "").trim();
      }

      title = title.replace(/^[\-–:|\s]+/, "").replace(/[\-–:|\s]+$/, "").trim();

      if (title.length > 2) {
        currentTask = { time, duration, category, title, priority, description: "" };
      }
    }
  }

  flushTask();

  if (totalHours === 0 && tasks.length > 0) {
    totalHours = tasks.reduce((acc, t) => {
      const hm = t.duration.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)/i);
      const mm = t.duration.match(/(\d+)\s*min/i);
      return acc + (hm ? parseFloat(hm[1]) : 0) + (mm ? parseInt(mm[1], 10) / 60 : 0);
    }, 0);
    if (totalHours === 0) totalHours = tasks.length;
    totalHours = Math.round(totalHours * 10) / 10;
  }

  return { dayName, totalHours, energyLevel, tasks, summary, done: false };
}

function finalizeBlock(partial: Partial<TimeBlock>): TimeBlock {
  return {
    time: partial.time || "",
    duration: partial.duration || "",
    category: partial.category || "Work",
    title: partial.title || "Task",
    priority: partial.priority || "Medium",
    description: partial.description || "",
    done: false,
  };
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Work: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-700/50" },
  Health: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-700/50" },
  Fitness: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-700/50" },
  Personal: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-700/50" },
  Learning: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-700/50" },
  Break: { bg: "bg-slate-100 dark:bg-slate-800/50", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700/50" },
  Planning: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-700/50" },
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Work;
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    High: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50",
    Medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50",
    Low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border", styles[priority] || styles.Medium)}>
      <Flag className="w-2.5 h-2.5" />
      {priority}
    </span>
  );
}

function DayCard({
  day,
  dayIndex,
  expanded,
  onToggleExpand,
  onToggleTask,
}: {
  day: DayPlan;
  dayIndex: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleTask: (taskIndex: number) => void;
}) {
  const completedTasks = day.tasks.filter((t) => t.done).length;
  const totalTasks = day.tasks.length;
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      data-testid={`card-day-${dayIndex}`}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={expanded}
        data-testid={`button-expand-day-${dayIndex}`}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{day.dayName}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{day.totalHours} hrs</span>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded font-medium",
              day.energyLevel === "High" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
              day.energyLevel === "Low" || day.energyLevel === "Rest" ? "bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400" :
              "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
            )}>
              {day.energyLevel}
            </span>
          </div>
          {totalTasks > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{completedTasks}/{totalTasks}</span>
            </div>
          )}
        </div>
        <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform flex-shrink-0", expanded && "rotate-90")} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
          {day.tasks.map((task, ti) => {
            const colors = getCategoryColor(task.category);
            return (
              <div
                key={ti}
                data-testid={`card-task-${dayIndex}-${ti}`}
                className={cn(
                  "rounded-lg border p-3 transition-all",
                  task.done ? "opacity-60" : "",
                  colors.border, colors.bg
                )}
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.done}
                    onClick={() => onToggleTask(ti)}
                    data-testid={`button-toggle-task-${dayIndex}-${ti}`}
                    className="mt-0.5 flex-shrink-0"
                    aria-label={`${task.title}`}
                  >
                    {task.done ? (
                      <CheckSquare className="w-4 h-4 text-green-500" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-[10px] font-bold uppercase", colors.text)}>{task.category}</span>
                      <PriorityBadge priority={task.priority} />
                      {task.time && <span className="text-[10px] text-slate-400 dark:text-slate-500"><Clock className="w-2.5 h-2.5 inline mr-0.5" />{task.time}</span>}
                      {task.duration && <span className="text-[10px] text-slate-400 dark:text-slate-500"><Timer className="w-2.5 h-2.5 inline mr-0.5" />{task.duration}</span>}
                    </div>
                    <p className={cn("text-sm font-semibold mt-0.5", task.done ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-100")}>{task.title}</p>
                    {task.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{task.description}</p>}
                  </div>
                </div>
              </div>
            );
          })}
          {day.summary && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-3 mt-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Day Summary</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{day.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WeeklyPlannerGenerator() {
  const { state: status, generateRaw } = useWebLLM();
  const { history, savePlan, deletePlan, toggleTask } = useWeeklyPlannerStorage();

  const [goals, setGoals] = useState("");
  const [availableHours, setAvailableHours] = useState("moderate");
  const [peakTimes, setPeakTimes] = useState<string[]>(["morning"]);
  const [priorityFocus, setPriorityFocus] = useState("work");
  const [includeRest, setIncludeRest] = useState(true);
  const [activeDays, setActiveDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  const [taskChunking, setTaskChunking] = useState("medium");

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [commitments, setCommitments] = useState("");
  const [considerations, setConsiderations] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    SPECIAL_CONSIDERATIONS.forEach((c) => { defaults[c.key] = false; });
    return defaults;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [streamingText, setStreamingText] = useState("");
  const [result, setResult] = useState<WeeklyPlan | null>(null);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [emptyError, setEmptyError] = useState("");
  const abortRef = useRef(false);

  const canGenerate = goals.trim().length > 5;
  const goalCount = goals.trim().split("\n").filter((l) => l.trim().length > 0).length;

  const handleReset = () => {
    abortRef.current = true;
    setGoals("");
    setAvailableHours("moderate");
    setPeakTimes(["morning"]);
    setPriorityFocus("work");
    setIncludeRest(true);
    setActiveDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
    setTaskChunking("medium");
    setAdvancedOpen(false);
    setCommitments("");
    setConsiderations(() => {
      const defaults: Record<string, boolean> = {};
      SPECIAL_CONSIDERATIONS.forEach((c) => { defaults[c.key] = false; });
      return defaults;
    });
    setStreamingText("");
    setResult(null);
    setCopiedPlan(false);
    setExpandedDays(new Set());
    setEmptyError("");
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const togglePeakTime = (val: string) => {
    setPeakTimes((prev) => prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]);
  };

  const toggleDay = (day: string) => {
    setActiveDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const applyTemplate = (t: typeof QUICK_TEMPLATES[number]) => {
    setGoals(t.example);
  };

  const buildDayPrompt = (dayName: string, dayIndex: number, totalDays: number, prevContext: string) => {
    const hoursLabel = AVAILABLE_HOURS.find((h) => h.value === availableHours)?.desc || "2-4 hours/day";
    const focusLabel = PRIORITY_FOCUS.find((f) => f.value === priorityFocus)?.label || "Work-Focused";
    const peakLabel = peakTimes.map((p) => PEAK_TIMES.find((pt) => pt.value === p)?.label || p).join(", ");
    const chunkLabel = TASK_CHUNKING.find((c) => c.value === taskChunking)?.desc || "1-2 hour tasks";

    const considLines: string[] = [];
    if (considerations.groupSimilar) considLines.push("Group similar tasks together.");
    if (considerations.morningsFree) considLines.push("Leave mornings free for personal time.");
    if (considerations.eveningsFree) considLines.push("Leave evenings free for rest.");
    if (considerations.mealPrep) considLines.push("Include meal prep or cooking time.");
    if (considerations.commute) considLines.push("Include commute or transition time between tasks.");
    if (considerations.breaks) considLines.push("Schedule regular breaks between tasks.");

    const commitLine = commitments.trim() ? `\nExisting Commitments: ${commitments.trim()}` : "";
    const restLine = includeRest ? "\nInclude buffer/rest time between intense tasks." : "";
    const prevLine = prevContext ? `\nPrevious days covered: ${prevContext}` : "";

    return `Generate the ${dayName} schedule for this weekly plan.

Goals and Tasks for the Week:
${goals.trim().slice(0, 1000)}

Available Hours: ${hoursLabel}
Peak Productivity: ${peakLabel}
Priority Focus: ${focusLabel}
Task Size: ${chunkLabel}
Day ${dayIndex + 1} of ${totalDays}: ${dayName}${commitLine}${restLine}${prevLine}
${considLines.length > 0 ? "\nSpecial Considerations:\n" + considLines.join("\n") : ""}

Distribute appropriate tasks for ${dayName}. Schedule harder tasks during peak productivity times (${peakLabel}).

Use this EXACT format:

${dayName.toUpperCase()}:
Total: (X hours planned for this day)
Energy: (High, Medium, Low, or Rest)

(time range) | (duration)
(CATEGORY): (task title)
Priority: (High, Medium, or Low)
(1-2 sentence description of what to do and why it is scheduled at this time)

(continue for all time blocks)

Day Summary:
- (what gets accomplished today)
- (key wins for the day)

Write the ${dayName} schedule now:`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setResult(null);
    setCopiedPlan(false);
    setExpandedDays(new Set());
    setEmptyError("");
    setCurrentStep(0);
    abortRef.current = false;

    const daysToGenerate = ALL_DAYS.filter((d) => activeDays.includes(d));
    const allDays: DayPlan[] = [];
    let allRawText = "";
    let prevContext = "";

    try {
      for (let i = 0; i < daysToGenerate.length; i++) {
        if (abortRef.current) return;
        setCurrentStep(Math.min(i, STEP_LABELS.length - 1));
        setStreamingText("");

        const dayName = daysToGenerate[i];
        const prompt = buildDayPrompt(dayName, i, daysToGenerate.length, prevContext);

        const raw = await generateRaw({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          maxTokens: 1500,
          onChunk: (text) => setStreamingText(text),
        });

        if (abortRef.current) return;
        if (raw === null) {
          console.error(`[WeeklyPlanner] generateRaw returned null for ${dayName} — engine may have lost GPU connection`);
          if (allDays.length === 0) {
            setEmptyError("AI engine connection was lost. Please refresh the page and try again.");
            setIsGenerating(false);
            setCurrentStep(0);
            return;
          }
          break;
        }
        const dayText = typeof raw === "string" ? raw : "";
        allRawText += `\n${dayText}\n`;
        console.log(`[WeeklyPlanner] Raw output for ${dayName}:`, dayText.slice(0, 500));

        const dayPlan = parseDayPlan(dayText, dayName);
        console.log(`[WeeklyPlanner] Parsed ${dayName}: ${dayPlan.tasks.length} tasks`);

        if (dayPlan.tasks.length > 0) {
          allDays.push(dayPlan);
          const taskTitles = dayPlan.tasks.map((t) => t.title).join(", ");
          prevContext += `${dayName} (${dayPlan.totalHours}hrs: ${taskTitles.slice(0, 80)}), `;
        } else if (dayText.trim().length > 20) {
          const fallbackLines = dayText.split("\n").map((l) => l.replace(/\*\*/g, "").replace(/^#+\s*/, "").replace(/^[\-*•\d.)\s]+/, "").trim()).filter((l) => l.length > 5 && !isJunkLine(l));
          const fallbackTasks: TimeBlock[] = fallbackLines.slice(0, 8).map((l) => ({
            time: "",
            duration: "",
            category: detectCategory(l),
            title: l.slice(0, 100),
            priority: detectPriority(l),
            description: "",
            done: false,
          }));
          if (fallbackTasks.length > 0) {
            allDays.push({ dayName, totalHours: fallbackTasks.length, energyLevel: "Medium", tasks: fallbackTasks, summary: "", done: false });
            prevContext += `${dayName} (${fallbackTasks.length} tasks), `;
          }
        }
      }

      if (abortRef.current) return;

      if (allDays.length === 0) {
        setEmptyError("Unable to generate a weekly plan. Please try rephrasing your goals or try again.");
        setIsGenerating(false);
        setCurrentStep(0);
        return;
      }

      const record: WeeklyPlan = {
        id: generateId(),
        goals: goals.trim().slice(0, 1000),
        availableHours,
        priorityFocus,
        peakTimes,
        days: allDays,
        rawText: allRawText,
        createdAt: new Date().toISOString(),
      };
      setResult(record);
      savePlan(record);
    } catch (err) {
      console.error("Weekly planner generation error:", err);
    }
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const handleToggleTask = (dayIndex: number, taskIndex: number) => {
    if (!result) return;
    const updated = toggleTask(result.id, dayIndex, taskIndex);
    if (updated) setResult(updated);
  };

  const toggleExpandDay = (idx: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allTasks = result?.days.flatMap((d) => d.tasks) || [];
  const completedTasks = allTasks.filter((t) => t.done).length;
  const progressPercent = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
  const totalPlannedHours = result?.days.reduce((acc, d) => acc + d.totalHours, 0) || 0;

  const categoryBreakdown = () => {
    if (!result) return [];
    const cats: Record<string, number> = {};
    for (const day of result.days) {
      for (const task of day.tasks) {
        const cat = task.category || "Other";
        const hm = task.duration.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)/i);
        const mm = task.duration.match(/(\d+)\s*min/i);
        const hrs = (hm ? parseFloat(hm[1]) : 0) + (mm ? parseInt(mm[1], 10) / 60 : 0);
        cats[cat] = (cats[cat] || 0) + (hrs || 1);
      }
    }
    const total = Object.values(cats).reduce((a, b) => a + b, 0);
    return Object.entries(cats).map(([cat, hrs]) => ({ cat, hrs: Math.round(hrs * 10) / 10, pct: total > 0 ? Math.round((hrs / total) * 100) : 0 }));
  };

  const exportPlan = () => {
    if (!result) return "";
    let text = `Weekly Plan\n${"=".repeat(40)}\n\n`;
    for (const day of result.days) {
      text += `${day.dayName} (${day.totalHours} hrs | ${day.energyLevel})\n${"-".repeat(30)}\n`;
      for (const task of day.tasks) {
        text += `${task.done ? "[x]" : "[ ]"} ${task.time ? task.time + " | " : ""}${task.category}: ${task.title}`;
        if (task.priority) text += ` [${task.priority}]`;
        if (task.duration) text += ` (${task.duration})`;
        text += "\n";
        if (task.description) text += `    ${task.description}\n`;
      }
      text += "\n";
    }
    return text;
  };

  const exportMarkdown = () => {
    if (!result) return "";
    let md = `# Weekly Plan\n\n`;
    md += `**Goals:** ${result.goals.split("\n").join(", ")}\n\n`;
    for (const day of result.days) {
      md += `## ${day.dayName} (${day.totalHours} hrs)\n`;
      md += `*Energy: ${day.energyLevel}*\n\n`;
      for (const task of day.tasks) {
        md += `- ${task.done ? "~~" : ""}**${task.category}**: ${task.title}${task.done ? "~~" : ""}`;
        if (task.time) md += ` (${task.time})`;
        md += ` — ${task.priority} priority\n`;
        if (task.description) md += `  - ${task.description}\n`;
      }
      md += "\n";
    }
    return md;
  };

  const exportCSV = () => {
    if (!result) return "";
    let csv = "Day,Time,Duration,Category,Task,Priority,Description,Status\n";
    for (const day of result.days) {
      for (const task of day.tasks) {
        csv += `"${day.dayName}","${task.time}","${task.duration}","${task.category}","${task.title}","${task.priority}","${task.description.replace(/"/g, '""')}",${task.done ? "Done" : "Todo"}\n`;
      }
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
          Plan Your Perfect Week
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="weekly-goals" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              What Do You Want to Accomplish This Week? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="weekly-goals"
              data-testid="input-goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value.slice(0, 1000))}
              placeholder={"List your goals, tasks, or priorities:\n\n\u2022 Finish project proposal\n\u2022 Exercise 3 times\n\u2022 Study for exam\n\u2022 Meal prep for the week\n\u2022 Read 2 chapters of book\n\u2022 Organize home office"}
              rows={5}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
              <span>{goalCount > 0 ? `${goalCount} goal${goalCount > 1 ? "s" : ""} listed` : "List one goal per line"}</span>
              <span>{goals.length}/1000</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Quick Templates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  data-testid={`button-template-${t.label.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
                  onClick={() => applyTemplate(t)}
                  className="text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <t.icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{t.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Available Hours per Day</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="container-hours">
              {AVAILABLE_HOURS.map(({ value, label, icon: Icon, desc, total }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={availableHours === value}
                  data-testid={`toggle-hours-${value}`}
                  onClick={() => setAvailableHours(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all",
                    availableHours === value
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  <Icon className={cn("w-5 h-5", availableHours === value ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                  <span className={cn("text-sm font-semibold", availableHours === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{desc}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{total}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">When Are You Most Productive?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="container-peak-times">
              {PEAK_TIMES.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={peakTimes.includes(value)}
                  data-testid={`toggle-peak-${value}`}
                  onClick={() => togglePeakTime(value)}
                  className={cn(
                    "flex items-center gap-2 py-2.5 px-3 rounded-xl border text-left transition-all",
                    peakTimes.includes(value)
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  <Icon className={cn("w-4 h-4", peakTimes.includes(value) ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                  <div>
                    <span className={cn("text-sm font-semibold block", peakTimes.includes(value) ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Priority Focus</label>
              <div className="space-y-2" data-testid="container-priority">
                {PRIORITY_FOCUS.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={priorityFocus === value}
                    data-testid={`toggle-priority-${value}`}
                    onClick={() => setPriorityFocus(value)}
                    className={cn(
                      "w-full flex items-center gap-2 py-2.5 px-3 rounded-xl border text-left transition-all",
                      priorityFocus === value
                        ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", priorityFocus === value ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")} />
                    <div className="flex-1 min-w-0">
                      <span className={cn("text-sm font-semibold block", priorityFocus === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Task Size</label>
                <div className="flex gap-2" data-testid="container-chunking">
                  {TASK_CHUNKING.map(({ value, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={taskChunking === value}
                      data-testid={`toggle-chunk-${value}`}
                      onClick={() => setTaskChunking(value)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border text-center transition-all",
                        taskChunking === value
                          ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-600"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600"
                      )}
                    >
                      <span className={cn("text-sm font-semibold block", taskChunking === value ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Include Rest & Buffer Time</label>
                  <button
                    type="button"
                    aria-pressed={includeRest}
                    data-testid="toggle-rest"
                    onClick={() => setIncludeRest(!includeRest)}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors",
                      includeRest ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                      includeRest && "translate-x-5"
                    )} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {includeRest ? "Includes breaks and buffer time for unexpected tasks" : "Pack schedule more tightly (not recommended)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Days to Plan</label>
                <div className="flex flex-wrap gap-1.5" data-testid="container-days">
                  {ALL_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={activeDays.includes(day)}
                      data-testid={`toggle-day-${day.toLowerCase()}`}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all",
                        activeDays.includes(day)
                          ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
                  <label htmlFor="commitments" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Existing Commitments <span className="text-xs font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="commitments"
                    data-testid="input-commitments"
                    value={commitments}
                    onChange={(e) => setCommitments(e.target.value.slice(0, 300))}
                    placeholder="Fixed commitments this week? e.g., 'Meeting Tuesday 2-3pm', 'Gym class Thursday 7am'"
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    maxLength={300}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Special Considerations</p>
                  <div className="grid grid-cols-2 gap-2" data-testid="container-considerations">
                    {SPECIAL_CONSIDERATIONS.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        aria-pressed={considerations[item.key]}
                        data-testid={`toggle-consider-${item.key}`}
                        onClick={() => setConsiderations((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={cn(
                          "flex items-center gap-2 py-2 px-3 rounded-lg border text-left text-sm transition-all",
                          considerations[item.key]
                            ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        )}
                      >
                        {considerations[item.key] ? (
                          <CheckSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                        {item.label}
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

          <div className="flex gap-3">
            <button
              type="button"
              data-testid="button-generate"
              disabled={!canGenerate || isGenerating || status === "error"}
              onClick={handleGenerate}
              className={cn(
                "flex-1 py-3.5 rounded-xl font-bold text-white text-base transition-all shadow-md",
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
                  <CalendarDays className="w-5 h-5" />
                  Generate My Weekly Plan
                </span>
              )}
            </button>
            <button
              type="button"
              data-testid="button-reset-form"
              onClick={handleReset}
              disabled={isGenerating}
              className={cn(
                "px-4 py-3.5 rounded-xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2",
                isGenerating
                  ? "border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              )}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {emptyError && !isGenerating && (
          <div className="mt-6 flex items-center gap-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-sm" data-testid="alert-empty-result">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{emptyError}</span>
          </div>
        )}

        {isGenerating && streamingText && (
          <div className="mt-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50" aria-live="polite">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Planning {ALL_DAYS.filter((d) => activeDays.includes(d))[currentStep] || ""}...
            </p>
            <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">{streamingText}</pre>
          </div>
        )}

        {hasResults && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100" data-testid="text-results-heading">
                Your Weekly Plan
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
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.round(totalPlannedHours)} hrs total
                </span>
                <span className="inline-flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {allTasks.length} tasks
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {result!.days.length} days
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Progress: {completedTasks}/{allTasks.length} tasks
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

              {categoryBreakdown().length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  {categoryBreakdown().map(({ cat, hrs, pct }) => {
                    const colors = getCategoryColor(cat);
                    return (
                      <div key={cat} className={cn("rounded-lg p-2 text-center border", colors.bg, colors.border)}>
                        <p className={cn("text-sm font-bold", colors.text)}>{hrs}h</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{cat} ({pct}%)</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {result!.days.map((day, idx) => (
                <DayCard
                  key={idx}
                  day={day}
                  dayIndex={idx}
                  expanded={expandedDays.has(idx)}
                  onToggleExpand={() => toggleExpandDay(idx)}
                  onToggleTask={(taskIndex) => handleToggleTask(idx, taskIndex)}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                data-testid="button-copy-plan"
                onClick={() => copyText(exportPlan())}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                {copiedPlan ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copiedPlan ? "Copied!" : "Copy Plan"}
              </button>
              <button
                type="button"
                data-testid="button-download-md"
                onClick={() => downloadFile(exportMarkdown(), "weekly-plan.md", "text/markdown")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Markdown
              </button>
              <button
                type="button"
                data-testid="button-download-csv"
                onClick={() => downloadFile(exportCSV(), "weekly-plan.csv", "text/csv")}
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
              Saved Weekly Plans ({history.length})
            </h3>
            <div className="space-y-2">
              {history.map((plan) => {
                const done = plan.days.flatMap((d) => d.tasks).filter((t) => t.done).length;
                const total = plan.days.flatMap((d) => d.tasks).length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    data-testid={`card-history-${plan.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors cursor-pointer w-full text-left"
                    onClick={() => { setResult(plan); setExpandedDays(new Set()); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{plan.goals.split("\n")[0]}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(plan.createdAt).toLocaleDateString()} | {plan.days.length} days | {pct}% done
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
