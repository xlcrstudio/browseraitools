import { useState, useEffect } from "react";
import { z } from "zod";

export interface ObstacleItem {
  name: string;
  solution: string;
}

export interface WeekAction {
  week: string;
  tasks: string[];
}

export interface Milestone {
  name: string;
  timeline: string;
  goal: string;
  keyOutcomes: string[];
  weeklyActions: WeekAction[];
  resources: string[];
  obstacles: ObstacleItem[];
  celebration: string;
  done: boolean;
}

export interface GoalPlan {
  id: string;
  goal: string;
  goalType: string;
  timeframe: string;
  startingPoint: string;
  weeklyHours: number;
  budget: string;
  constraints: string;
  milestones: Milestone[];
  rawText: string;
  createdAt: string;
}

const obstacleItemSchema = z.object({
  name: z.string(),
  solution: z.string(),
});

const weekActionSchema = z.object({
  week: z.string(),
  tasks: z.array(z.string()),
});

const milestoneSchema = z.object({
  name: z.string(),
  timeline: z.string(),
  goal: z.string(),
  keyOutcomes: z.array(z.string()),
  weeklyActions: z.array(weekActionSchema),
  resources: z.array(z.string()),
  obstacles: z.array(obstacleItemSchema),
  celebration: z.string(),
  done: z.boolean(),
});

const goalPlanSchema = z.object({
  id: z.string(),
  goal: z.string(),
  goalType: z.string(),
  timeframe: z.string(),
  startingPoint: z.string(),
  weeklyHours: z.number(),
  budget: z.string(),
  constraints: z.string(),
  milestones: z.array(milestoneSchema),
  rawText: z.string(),
  createdAt: z.string(),
});

const STORAGE_KEY = "ai-goal-plans-v1";

export function useGoalStorage() {
  const [history, setHistory] = useState<GoalPlan[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(goalPlanSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load goal storage", e);
    }
  }, []);

  const persist = (plans: GoalPlan[]) => {
    setHistory(plans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  };

  const savePlan = (plan: GoalPlan) => {
    persist([plan, ...history].slice(0, 10));
  };

  const deletePlan = (id: string) => {
    persist(history.filter((p) => p.id !== id));
  };

  const toggleMilestone = (planId: string, milestoneIndex: number) => {
    const updated = history.map((plan) => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        milestones: plan.milestones.map((m, i) =>
          i === milestoneIndex ? { ...m, done: !m.done } : m
        ),
      };
    });
    persist(updated);
    return updated.find((p) => p.id === planId) || null;
  };

  return { history, savePlan, deletePlan, toggleMilestone };
}
