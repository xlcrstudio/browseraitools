import { useState, useEffect } from "react";
import { z } from "zod";

export interface TimeBlock {
  time: string;
  duration: string;
  category: string;
  title: string;
  priority: string;
  description: string;
  done: boolean;
}

export interface DayPlan {
  dayName: string;
  totalHours: number;
  energyLevel: string;
  tasks: TimeBlock[];
  summary: string;
  done: boolean;
}

export interface WeeklyPlan {
  id: string;
  goals: string;
  availableHours: string;
  priorityFocus: string;
  peakTimes: string[];
  days: DayPlan[];
  rawText: string;
  createdAt: string;
}

const timeBlockSchema = z.object({
  time: z.string(),
  duration: z.string(),
  category: z.string(),
  title: z.string(),
  priority: z.string(),
  description: z.string(),
  done: z.boolean(),
});

const dayPlanSchema = z.object({
  dayName: z.string(),
  totalHours: z.number(),
  energyLevel: z.string(),
  tasks: z.array(timeBlockSchema),
  summary: z.string(),
  done: z.boolean(),
});

const weeklyPlanSchema = z.object({
  id: z.string(),
  goals: z.string(),
  availableHours: z.string(),
  priorityFocus: z.string(),
  peakTimes: z.array(z.string()),
  days: z.array(dayPlanSchema),
  rawText: z.string(),
  createdAt: z.string(),
});

const STORAGE_KEY = "ai-weekly-plans-v1";

export function useWeeklyPlannerStorage() {
  const [history, setHistory] = useState<WeeklyPlan[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(weeklyPlanSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load weekly planner storage", e);
    }
  }, []);

  const persist = (plans: WeeklyPlan[]) => {
    setHistory(plans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  };

  const savePlan = (plan: WeeklyPlan) => {
    persist([plan, ...history].slice(0, 10));
  };

  const deletePlan = (id: string) => {
    persist(history.filter((p) => p.id !== id));
  };

  const toggleDay = (planId: string, dayIndex: number) => {
    const updated = history.map((plan) => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        days: plan.days.map((d, i) =>
          i === dayIndex ? { ...d, done: !d.done } : d
        ),
      };
    });
    persist(updated);
    return updated.find((p) => p.id === planId) || null;
  };

  const toggleTask = (planId: string, dayIndex: number, taskIndex: number) => {
    const updated = history.map((plan) => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        days: plan.days.map((d, di) =>
          di === dayIndex
            ? {
                ...d,
                tasks: d.tasks.map((t, ti) =>
                  ti === taskIndex ? { ...t, done: !t.done } : t
                ),
              }
            : d
        ),
      };
    });
    persist(updated);
    return updated.find((p) => p.id === planId) || null;
  };

  return { history, savePlan, deletePlan, toggleDay, toggleTask };
}
