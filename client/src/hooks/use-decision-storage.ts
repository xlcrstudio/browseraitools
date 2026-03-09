import { useState, useEffect } from "react";
import { z } from "zod";

export interface DecisionResult {
  id: string;
  question: string;
  options: string;
  extraContext: string;
  confidenceScore: number;
  optionAnalyses: string;
  recommendation: string;
  rawText: string;
  createdAt: string;
}

const decisionResultSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.string(),
  extraContext: z.string(),
  confidenceScore: z.number(),
  optionAnalyses: z.string(),
  recommendation: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useDecisionStorage() {
  const [history, setHistory] = useState<DecisionResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-decision-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(decisionResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load decision storage", e);
    }
  }, []);

  const saveDecision = (decision: DecisionResult) => {
    const all = [decision, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-decision-history", JSON.stringify(all));
  };

  const deleteDecision = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-decision-history", JSON.stringify(updated));
  };

  return { history, saveDecision, deleteDecision };
}
