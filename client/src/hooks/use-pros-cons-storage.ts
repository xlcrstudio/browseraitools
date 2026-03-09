import { useState, useEffect } from "react";
import { z } from "zod";

export interface ProsConsResult {
  id: string;
  topic: string;
  contextPurpose: string;
  extraContext: string;
  numberOfItems: number;
  decisionScore: number;
  pros: string;
  cons: string;
  recommendation: string;
  rawText: string;
  createdAt: string;
}

const prosConsResultSchema = z.object({
  id: z.string(),
  topic: z.string(),
  contextPurpose: z.string(),
  extraContext: z.string(),
  numberOfItems: z.number(),
  decisionScore: z.number(),
  pros: z.string(),
  cons: z.string(),
  recommendation: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useProsConsStorage() {
  const [history, setHistory] = useState<ProsConsResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-pros-cons-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(prosConsResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load pros cons storage", e);
    }
  }, []);

  const saveAnalysis = (analysis: ProsConsResult) => {
    const all = [analysis, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-pros-cons-history", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-pros-cons-history", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
