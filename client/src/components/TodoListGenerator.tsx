import { useState, useRef } from "react";
import {
  Loader2, AlertTriangle, Copy, Check, RotateCcw,
  ChevronDown, ListChecks, Trash2, Clock, Flag,
  Zap, Calendar, CalendarDays, Target, Download,
  CheckSquare, Square, ChevronRight, Star,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";
import {
  useTodoStorage,
  type TodoList,
  type TodoPhase,
  type TodoTask,
} from "@/hooks/use-todo-storage";

const TIMEFRAMES = [
  { value: "today", label: "Today", icon: Zap, desc: "3-8 tasks for the next 8 hours", tasks: "3-8" },
  { value: "week", label: "This Week", icon: Calendar, desc: "8-15 tasks across 7 days", tasks: "8-15" },
  { value: "month", label: "This Month", icon: CalendarDays, desc: "15-30 tasks over 30 days", tasks: "15-30" },
  { value: "long-term", label: "Long-term", icon: Target, desc: "30-50+ tasks across 3-6 months", tasks: "30-50+" },
] as const;

const DETAIL_LEVELS = [
  { value: "simple", label: "Simple", desc: "Basic task descriptions" },
  { value: "detailed", label: "Detailed", desc: "Specific action steps" },
  { value: "very-detailed", label: "Very Detailed", desc: "Step-by-step instructions" },
] as const;

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Complete Beginner" },
  { value: "some", label: "Some Experience" },
  { value: "experienced", label: "Experienced" },
  { value: "expert", label: "Expert" },
] as const;

const QUICK_TEMPLATES = [
  { label: "Business / Career", icon: "briefcase", examples: "Launch a blog, Start a side business, Get a promotion" },
  { label: "Learning / Education", icon: "book", examples: "Learn Python, Study for exam, Get certified" },
  { label: "Home / Life", icon: "home", examples: "Organize home, Plan a move, Declutter" },
  { label: "Health / Fitness", icon: "heart", examples: "Train for marathon, Start meal prep, Build gym habit" },
  { label: "Financial", icon: "dollar", examples: "Create budget, Start investing, Pay off debt" },
  { label: "Creative Project", icon: "palette", examples: "Write a book, Start podcast, Build portfolio" },
] as const;

const TASK_PREFS = [
  { key: "groupByCategory", label: "Group by phase", default: true },
  { key: "includeTime", label: "Time estimates", default: true },
  { key: "showPriority", label: "Priority levels", default: true },
  { key: "showDependencies", label: "Dependencies", default: false },
  { key: "includeResources", label: "Resources needed", default: false },
  { key: "showDifficulty", label: "Difficulty ratings", default: false },
] as const;

const SYSTEM_PROMPT = `You are an expert productivity coach and project management specialist. You break large goals into manageable, actionable tasks. Each task starts with a clear action verb and has a specific deliverable. You are thorough, realistic, and practical.`;

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
  /^task\s+structure/i,
  /^output\s+format/i,
  /^quality\s+check/i,
];

function isJunkLine(s: string): boolean {
  return JUNK_PATTERNS.some((p) => p.test(s));
}

function parsePhase(raw: string, phaseIdx: number, startNum: number): TodoPhase {
  const lines = raw.split("\n");
  let phaseName = `Phase ${phaseIdx + 1}`;
  let phaseTime = "";
  let phaseGoal = "";
  const tasks: TodoTask[] = [];
  let currentTask: Partial<TodoTask> | null = null;
  let inSteps = false;
  let inResources = false;
  let taskNum = startNum;

  for (const line of lines) {
    const trimmed = line.replace(/\*\*/g, "").replace(/__/g, "").trim();
    if (!trimmed) { inSteps = false; inResources = false; continue; }

    const phaseMatch = trimmed.match(/^(?:PHASE\s*\d+|Phase\s*\d+)[:\s]*(.+)/i);
    if (phaseMatch) {
      phaseName = phaseMatch[1].trim();
      continue;
    }

    const estTimeMatch = trimmed.match(/^Estimated\s+Time[:\s]*(.+)/i);
    if (estTimeMatch) { phaseTime = estTimeMatch[1].trim(); continue; }

    const goalMatch = trimmed.match(/^Goal[:\s]*(.+)/i);
    if (goalMatch) { phaseGoal = goalMatch[1].trim(); continue; }

    const taskMatch = trimmed.match(/^TASK\s*#?\d*[:\s]*(.+)/i) || trimmed.match(/^(?:\d+[\.)]\s*)(.{10,})/);
    if (taskMatch && !trimmed.match(/^(?:what to do|action steps|resources|steps)/i)) {
      if (currentTask && currentTask.title) {
        tasks.push(finalizeTask(currentTask, taskNum++));
      }
      currentTask = {
        title: taskMatch[1].replace(/^\s*[-–]\s*/, "").trim(),
        priority: "medium",
        timeEstimate: "",
        difficulty: 0,
        dependencies: "None",
        description: "",
        steps: [],
        resources: [],
      };
      inSteps = false;
      inResources = false;
      continue;
    }

    if (!currentTask) continue;

    const prioMatch = trimmed.match(/^Priority[:\s]*(high|medium|low)/i);
    if (prioMatch) {
      currentTask.priority = prioMatch[1].toLowerCase() as "high" | "medium" | "low";
      continue;
    }

    const timeMatch = trimmed.match(/^Time[:\s]*(.+)/i) || trimmed.match(/^Estimated?\s+Time[:\s]*(.+)/i);
    if (timeMatch) { currentTask.timeEstimate = timeMatch[1].trim(); continue; }

    const diffMatch = trimmed.match(/^Difficulty[:\s]*(\d)/i);
    if (diffMatch) { currentTask.difficulty = parseInt(diffMatch[1], 10); continue; }
    const starMatch = trimmed.match(/Difficulty[:\s]*([\u2B50\u2606\u2605]+)/);
    if (starMatch) { currentTask.difficulty = (starMatch[1].match(/[\u2B50\u2605]/g) || []).length; continue; }

    const depMatch = trimmed.match(/^Dependenc(?:y|ies)[:\s]*(.+)/i);
    if (depMatch) { currentTask.dependencies = depMatch[1].trim(); continue; }

    if (/^(?:what to do|action steps|steps)[:\s]*/i.test(trimmed)) { inSteps = true; inResources = false; continue; }
    if (/^(?:resources?|tools?)\s*(?:needed|required)?[:\s]*/i.test(trimmed)) { inResources = true; inSteps = false; continue; }

    if (inSteps) {
      const step = trimmed.replace(/^[\d.)\-*•]+\s*/, "").trim();
      if (step.length > 3 && step.length < 300 && !isJunkLine(step)) {
        currentTask.steps = [...(currentTask.steps || []), step];
      }
      continue;
    }

    if (inResources) {
      const res = trimmed.replace(/^[\-*•]+\s*/, "").trim();
      if (res.length > 2 && res.length < 200 && !isJunkLine(res)) {
        currentTask.resources = [...(currentTask.resources || []), res];
      }
      continue;
    }

    if (!currentTask.description && trimmed.length > 15 && !trimmed.match(/^(?:TASK|Phase|PHASE|Priority|Time|Difficulty|Depend)/i)) {
      currentTask.description = trimmed;
    }
  }

  if (currentTask && currentTask.title) {
    tasks.push(finalizeTask(currentTask, taskNum++));
  }

  return { name: phaseName, estimatedTime: phaseTime, goal: phaseGoal, tasks };
}

function finalizeTask(partial: Partial<TodoTask>, num: number): TodoTask {
  return {
    id: generateId(),
    number: num,
    title: partial.title || `Task ${num}`,
    priority: (partial.priority as "high" | "medium" | "low") || "medium",
    timeEstimate: partial.timeEstimate || "",
    difficulty: partial.difficulty || 0,
    dependencies: partial.dependencies || "None",
    description: partial.description || "",
    steps: partial.steps || [],
    resources: partial.resources || [],
    done: false,
    subTasks: [],
  };
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles = {
    high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50",
    medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700/50",
    low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border", styles[priority as keyof typeof styles] || styles.medium)}>
      <Flag className="w-3 h-3" />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function DifficultyStars({ level }: { level: number }) {
  if (level <= 0) return null;
  return (
    <span className="inline-flex items-center gap-0.5" title={`Difficulty: ${level}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-3 h-3", i < level ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600")} />
      ))}
    </span>
  );
}

function TaskCard({
  task,
  onToggle,
  expanded,
  onToggleExpand,
}: {
  task: TodoTask;
  onToggle: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <div
      data-testid={`card-task-${task.number}`}
      className={cn(
        "rounded-xl border transition-all",
        task.done
          ? "border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={task.done}
          onClick={onToggle}
          data-testid={`button-toggle-task-${task.number}`}
          className="mt-0.5 flex-shrink-0 transition-colors"
          aria-label={`Task ${task.number}: ${task.title}`}
        >
          {task.done ? (
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
            data-testid={`button-expand-task-${task.number}`}
          >
            <span className={cn(
              "text-sm font-semibold flex-1",
              task.done ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-slate-100"
            )}>
              #{task.number}. {task.title}
            </span>
            <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform flex-shrink-0", expanded && "rotate-90")} />
          </button>

          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <PriorityBadge priority={task.priority} />
            {task.timeEstimate && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                {task.timeEstimate}
              </span>
            )}
            {task.difficulty > 0 && <DifficultyStars level={task.difficulty} />}
            {task.dependencies && task.dependencies !== "None" && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Depends: {task.dependencies}
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-8 space-y-3 border-t border-slate-100 dark:border-slate-800 mt-0 pt-3">
          {task.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{task.description}</p>
          )}

          {task.steps.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">What to Do</p>
              <ol className="space-y-1 list-decimal list-inside">
                {task.steps.map((step, i) => (
                  <li key={i} className="text-sm text-slate-600 dark:text-slate-300">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {task.resources.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Resources Needed</p>
              <ul className="space-y-1">
                {task.resources.map((res, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {res}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const STEP_LABELS = ["Generating tasks...", "Organizing phases...", "Adding details..."];

export function TodoListGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { history, saveList, deleteList, toggleTask } = useTodoStorage();

  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("week");
  const [detailLevel, setDetailLevel] = useState("detailed");
  const [experience, setExperience] = useState("some");
  const [dailyTime, setDailyTime] = useState(2);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    TASK_PREFS.forEach((p) => { defaults[p.key] = p.default; });
    return defaults;
  });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [streamingText, setStreamingText] = useState("");
  const [result, setResult] = useState<TodoList | null>(null);
  const [copiedList, setCopiedList] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const abortRef = useRef(false);

  const canGenerate = goal.trim().length > 5;

  const handleReset = () => {
    abortRef.current = true;
    setGoal("");
    setTimeframe("week");
    setDetailLevel("detailed");
    setExperience("some");
    setDailyTime(2);
    setPrefs(() => {
      const defaults: Record<string, boolean> = {};
      TASK_PREFS.forEach((p) => { defaults[p.key] = p.default; });
      return defaults;
    });
    setAdvancedOpen(false);
    setAdditionalContext("");
    setStreamingText("");
    setResult(null);
    setCopiedList(false);
    setExpandedTasks(new Set());
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const togglePref = (key: string) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyTemplate = (template: typeof QUICK_TEMPLATES[number]) => {
    const example = template.examples.split(", ")[0];
    setGoal(example);
  };

  const getPhaseCount = () => {
    if (timeframe === "today") return 1;
    if (timeframe === "week") return 2;
    if (timeframe === "month") return 3;
    return 4;
  };

  const getTasksPerPhase = () => {
    if (timeframe === "today") return "3-8";
    if (timeframe === "week") return "4-7";
    if (timeframe === "month") return "5-10";
    return "8-12";
  };

  const buildPhasePrompt = (phaseNum: number, totalPhases: number, prevContext: string) => {
    const expLabel = EXPERIENCE_LEVELS.find((e) => e.value === experience)?.label || "Some Experience";
    const detailLabel = DETAIL_LEVELS.find((d) => d.value === detailLevel)?.label || "Detailed";
    const tfLabel = TIMEFRAMES.find((t) => t.value === timeframe)?.label || "This Week";

    const prefLines: string[] = [];
    if (prefs.showPriority) prefLines.push("Include Priority level (High, Medium, or Low) for each task.");
    if (prefs.includeTime) prefLines.push("Include Time estimate for each task.");
    if (prefs.showDifficulty) prefLines.push("Include Difficulty rating 1-5 for each task.");
    if (prefs.showDependencies) prefLines.push("Include Dependencies (which task numbers must be done first, or None).");
    if (prefs.includeResources) prefLines.push("Include Resources Needed section for each task.");

    const detailInstr = detailLevel === "simple"
      ? "Keep task descriptions brief, 1-2 sentences."
      : detailLevel === "very-detailed"
        ? "Include detailed step-by-step instructions under 'What to Do:' with 5-7 numbered steps per task."
        : "Include 'What to Do:' section with 3-5 numbered action steps per task.";

    const contextLine = additionalContext.trim() ? `\nAdditional context: ${additionalContext.trim()}` : "";
    const prevLine = prevContext ? `\nPrevious phases covered: ${prevContext}` : "";

    return `Generate Phase ${phaseNum} of ${totalPhases} for this to-do list.

Goal: ${goal.trim().slice(0, 500)}
Timeframe: ${tfLabel}
Experience Level: ${expLabel}
Available Time Per Day: ${dailyTime} hours
Detail Level: ${detailLabel}${contextLine}${prevLine}

Write ${getTasksPerPhase()} tasks for Phase ${phaseNum}.
${prefLines.join("\n")}
${detailInstr}

Each task MUST start with a clear action verb. No vague tasks like "Think about X" — instead write "Research X and list 3 options".

Use this EXACT format for each task:

PHASE ${phaseNum}: (give this phase a descriptive name)
Estimated Time: (total for this phase)
Goal: (what completing this phase achieves)

TASK #(number): (title starting with action verb)
Priority: (High, Medium, or Low)
Time: (realistic estimate)
${prefs.showDifficulty ? "Difficulty: (1-5)\n" : ""}${prefs.showDependencies ? "Dependencies: (task numbers or None)\n" : ""}
(2-3 sentence description of what to do and why)

${detailLevel !== "simple" ? "What to Do:\n1. (step)\n2. (step)\n(continue)\n" : ""}${prefs.includeResources ? "\nResources Needed:\n- (resource)\n- (resource)\n" : ""}
Write Phase ${phaseNum} now:`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStreamingText("");
    setResult(null);
    setCopiedList(false);
    setExpandedTasks(new Set());
    setCurrentStep(0);
    abortRef.current = false;

    const totalPhases = getPhaseCount();
    const allPhases: TodoPhase[] = [];
    let allRawText = "";
    let taskCounter = 1;
    let prevContext = "";

    try {
      for (let i = 0; i < totalPhases; i++) {
        if (abortRef.current) return;
        setCurrentStep(Math.min(i, STEP_LABELS.length - 1));
        setStreamingText("");

        const prompt = buildPhasePrompt(i + 1, totalPhases, prevContext);

        const raw = await generateRaw({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          maxTokens: 1800,
          onChunk: (text) => setStreamingText(text),
        });

        const phaseText = raw?.trim() || "";
        allRawText += `\n${phaseText}\n`;

        const phase = parsePhase(phaseText, i, taskCounter);
        if (phase.tasks.length > 0) {
          allPhases.push(phase);
          taskCounter += phase.tasks.length;
          prevContext += `${phase.name} (${phase.tasks.length} tasks), `;
        }
      }

      if (abortRef.current) return;

      const allTasks = allPhases.flatMap((p) => p.tasks);

      if (allTasks.length === 0) {
        console.error("No tasks parsed from AI output");
        setStreamingText("");
        setIsGenerating(false);
        setCurrentStep(0);
        return;
      }

      const totalTime = allTasks
        .map((t) => {
          const m = t.timeEstimate.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/i);
          const minM = t.timeEstimate.match(/(\d+)\s*min/i);
          return (m ? parseFloat(m[1]) : 0) + (minM ? parseInt(minM[1], 10) / 60 : 0);
        })
        .reduce((a, b) => a + b, 0);

      const record: TodoList = {
        id: generateId(),
        goal: goal.trim().slice(0, 200),
        timeframe,
        totalTasks: allTasks.length,
        estimatedTotalTime: totalTime > 0 ? `${Math.round(totalTime)} hours` : "",
        phases: allPhases,
        rawText: allRawText,
        createdAt: new Date().toISOString(),
      };
      setResult(record);
      saveList(record);
    } catch (err) {
      console.error("Todo generation error:", err);
    }

    setStreamingText("");
    setIsGenerating(false);
    setCurrentStep(0);
  };

  const handleToggleTask = (taskId: string) => {
    if (!result) return;
    const updated = toggleTask(result.id, taskId);
    if (updated) setResult(updated);
  };

  const toggleExpand = (taskNum: number) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskNum)) next.delete(taskNum);
      else next.add(taskNum);
      return next;
    });
  };

  const allTasks = result?.phases.flatMap((p) => p.tasks) || [];
  const completedCount = allTasks.filter((t) => t.done).length;
  const progressPercent = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;
  const highCount = allTasks.filter((t) => t.priority === "high").length;
  const medCount = allTasks.filter((t) => t.priority === "medium").length;
  const lowCount = allTasks.filter((t) => t.priority === "low").length;

  const exportChecklist = () => {
    if (!result) return "";
    let text = `Action Plan: ${result.goal}\n${"=".repeat(40)}\n\n`;
    for (const phase of result.phases) {
      text += `${phase.name}\n${"-".repeat(30)}\n`;
      for (const task of phase.tasks) {
        text += `${task.done ? "[x]" : "[ ]"} #${task.number}. ${task.title}`;
        if (task.priority) text += ` [${task.priority.toUpperCase()}]`;
        if (task.timeEstimate) text += ` (${task.timeEstimate})`;
        text += "\n";
        if (task.description) text += `    ${task.description}\n`;
        if (task.steps.length > 0) {
          task.steps.forEach((s, i) => { text += `    ${i + 1}. ${s}\n`; });
        }
        text += "\n";
      }
    }
    return text;
  };

  const exportMarkdown = () => {
    if (!result) return "";
    let md = `# Action Plan: ${result.goal}\n\n`;
    if (result.estimatedTotalTime) md += `**Total Estimated Time:** ${result.estimatedTotalTime}\n\n`;
    for (const phase of result.phases) {
      md += `## ${phase.name}\n`;
      if (phase.goal) md += `> ${phase.goal}\n\n`;
      for (const task of phase.tasks) {
        md += `### ${task.done ? "~~" : ""}${task.number}. ${task.title}${task.done ? "~~" : ""}\n`;
        md += `- **Priority:** ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}\n`;
        if (task.timeEstimate) md += `- **Time:** ${task.timeEstimate}\n`;
        if (task.dependencies !== "None") md += `- **Dependencies:** ${task.dependencies}\n`;
        md += "\n";
        if (task.description) md += `${task.description}\n\n`;
        if (task.steps.length > 0) {
          md += `**Steps:**\n`;
          task.steps.forEach((s, i) => { md += `${i + 1}. ${s}\n`; });
          md += "\n";
        }
      }
    }
    return md;
  };

  const exportCSV = () => {
    if (!result) return "";
    let csv = "Task #,Title,Priority,Time Estimate,Dependencies,Description,Status\n";
    for (const phase of result.phases) {
      for (const task of phase.tasks) {
        csv += `${task.number},"${task.title}",${task.priority},"${task.timeEstimate}","${task.dependencies}","${task.description.replace(/"/g, '""')}",${task.done ? "Done" : "Todo"}\n`;
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
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2000);
    } catch {}
  };

  const hasResults = result !== null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg p-6 md:p-8">
        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6" data-testid="text-generator-heading">
          Create Your Action Plan
        </h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="todo-goal" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              What Do You Want to Accomplish? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="todo-goal"
              data-testid="input-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value.slice(0, 500))}
              placeholder={"Enter your goal or project:\n\nExamples:\n\u2022 Launch a blog\n\u2022 Learn Python programming\n\u2022 Organize home office\n\u2022 Start a podcast\n\u2022 Build a mobile app"}
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
              maxLength={500}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{goal.length}/500</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Quick Templates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {QUICK_TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  data-testid={`button-template-${t.label.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => applyTemplate(t)}
                  className="text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">{t.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{t.examples}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Timeframe</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="container-timeframe">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Detail Level</label>
              <div className="flex gap-2" data-testid="container-detail-level">
                {DETAIL_LEVELS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={detailLevel === value}
                    data-testid={`toggle-detail-${value}`}
                    onClick={() => setDetailLevel(value)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl border text-center font-semibold text-sm transition-all",
                      detailLevel === value
                        ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-600"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="todo-experience" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Experience Level</label>
              <select
                id="todo-experience"
                data-testid="select-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              >
                {EXPERIENCE_LEVELS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Task Preferences</label>
            <div className="flex flex-wrap gap-2" data-testid="container-prefs">
              {TASK_PREFS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={prefs[key]}
                  data-testid={`toggle-pref-${key}`}
                  onClick={() => togglePref(key)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                    prefs[key]
                      ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-300 dark:ring-indigo-600"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="todo-daily-time" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Available Time per Day: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{dailyTime}h</span>
            </label>
            <input
              id="todo-daily-time"
              data-testid="slider-daily-time"
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={dailyTime}
              onChange={(e) => setDailyTime(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              <span>30 min</span>
              <span>8 hours</span>
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
              Advanced Options
              <ChevronDown className={cn("w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform", advancedOpen && "rotate-180")} />
            </button>

            {advancedOpen && (
              <div className="px-4 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <label htmlFor="todo-context" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Additional Context</label>
                  <textarea
                    id="todo-context"
                    data-testid="input-context"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value.slice(0, 200))}
                    placeholder="Any constraints, preferences, or additional info? e.g., 'I have $500 budget', 'I work full-time'"
                    rows={2}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    maxLength={200}
                  />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{additionalContext.length}/200</p>
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
                  {streamingText ? "Generating tasks..." : "Starting..."}
                </>
              ) : (
                <>
                  <ListChecks className="w-5 h-5" />
                  Generate My To-Do List
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
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {STEP_LABELS[currentStep] || "Generating..."}
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
                  Preparing AI model...
                </div>
              )}
            </div>
          </div>
        )}

        {hasResults && result && (
          <div className="mt-8 space-y-6" data-testid="container-results">
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" data-testid="container-overview">
              <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4">
                Action Plan: {result.goal}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.totalTasks}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Tasks</p>
                </div>
                {result.estimatedTotalTime && (
                  <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{result.estimatedTotalTime.replace(" hours", "h")}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Est. Time</p>
                  </div>
                )}
                <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.phases.length}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Phases</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-bold text-red-500">{highCount}H</span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-xs font-bold text-amber-500">{medCount}M</span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-xs font-bold text-green-500">{lowCount}L</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Priorities</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{completedCount}/{allTasks.length} ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                    data-testid="bar-progress"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  data-testid="button-copy-checklist"
                  onClick={() => copyText(exportChecklist())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {copiedList ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedList ? "Copied!" : "Copy Checklist"}
                </button>
                <InlineShareButtons />
                <button
                  type="button"
                  data-testid="button-export-md"
                  onClick={() => downloadFile(exportMarkdown(), `todo-${result.id}.md`, "text/markdown")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Markdown
                </button>
                <button
                  type="button"
                  data-testid="button-export-csv"
                  onClick={() => downloadFile(exportCSV(), `todo-${result.id}.csv`, "text/csv")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {result.phases.map((phase, phaseIdx) => (
              <div key={phaseIdx} className="space-y-3" data-testid={`container-phase-${phaseIdx}`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    {phaseIdx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-slate-800 dark:text-slate-100">{phase.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {phase.estimatedTime && <span>{phase.estimatedTime}</span>}
                      {phase.goal && <span>{phase.estimatedTime ? " \u2022 " : ""}{phase.goal}</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 ml-4">
                  {phase.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggleTask(task.id)}
                      expanded={expandedTasks.has(task.number)}
                      onToggleExpand={() => toggleExpand(task.number)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && !isGenerating && (
          <div className="mt-10" data-testid="container-history">
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100 mb-4">Saved Lists</h3>
            <div className="space-y-3">
              {history.slice(0, 5).map((record) => {
                const recTasks = record.phases.flatMap((p) => p.tasks);
                const recDone = recTasks.filter((t) => t.done).length;
                const recPct = recTasks.length > 0 ? Math.round((recDone / recTasks.length) * 100) : 0;
                return (
                  <div
                    key={record.id}
                    data-testid={`card-history-${record.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{record.goal}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{record.totalTasks} tasks</span>
                        <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                        <span className={cn("text-xs font-bold", recPct === 100 ? "text-green-500" : "text-indigo-500 dark:text-indigo-400")}>{recPct}% done</span>
                        <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-testid={`button-delete-history-${record.id}`}
                      onClick={() => deleteList(record.id)}
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
