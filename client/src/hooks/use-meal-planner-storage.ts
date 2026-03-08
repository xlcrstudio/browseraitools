import { useState, useEffect } from "react";
import { z } from "zod";

export interface MealPlan {
  id: string;
  dietaryRestrictions: string[];
  familySize: number;
  budget: string;
  ingredientsOnHand: string;
  daysOfWeek: string[];
  cuisinePrefs: string[];
  calorieGoal: number | null;
  mealPrepTimeLimit: string;
  mealPlanContent: string;
  groceryList: string;
  nutritionSummary: string;
  rawText: string;
  createdAt: string;
}

const mealPlanSchema = z.object({
  id: z.string(),
  dietaryRestrictions: z.array(z.string()),
  familySize: z.number(),
  budget: z.string(),
  ingredientsOnHand: z.string(),
  daysOfWeek: z.array(z.string()),
  cuisinePrefs: z.array(z.string()),
  calorieGoal: z.number().nullable(),
  mealPrepTimeLimit: z.string(),
  mealPlanContent: z.string(),
  groceryList: z.string(),
  nutritionSummary: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useMealPlannerStorage() {
  const [history, setHistory] = useState<MealPlan[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-meal-planner-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(mealPlanSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load meal planner storage", e);
    }
  }, []);

  const saveMealPlan = (plan: MealPlan) => {
    const all = [plan, ...history].slice(0, 10);
    setHistory(all);
    localStorage.setItem("ai-meal-planner-history", JSON.stringify(all));
  };

  const deleteMealPlan = (id: string) => {
    const updated = history.filter((p) => p.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-meal-planner-history", JSON.stringify(updated));
  };

  return { history, saveMealPlan, deleteMealPlan };
}
