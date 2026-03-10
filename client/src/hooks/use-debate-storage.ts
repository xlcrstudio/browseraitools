import { useState, useEffect } from "react";
import { z } from "zod";

export interface DebateResult {
  id: string;
  topic: string;
  level: string;
  argStyle: string;
  argCount: number;
  debateFormat: string;
  includeRebuttals: boolean;
  includeEvidence: boolean;
  includeFallacies: boolean;
  proArgs: string;
  conArgs: string;
  rawText: string;
  createdAt: string;
}

const debateResultSchema = z.object({
  id: z.string(),
  topic: z.string(),
  level: z.string(),
  argStyle: z.string(),
  argCount: z.number(),
  debateFormat: z.string(),
  includeRebuttals: z.boolean(),
  includeEvidence: z.boolean(),
  includeFallacies: z.boolean(),
  proArgs: z.string(),
  conArgs: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useDebateStorage() {
  const [history, setHistory] = useState<DebateResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-debate-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(debateResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load debate storage", e);
    }
  }, []);

  const saveDebate = (result: DebateResult) => {
    const all = [result, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-debate-history", JSON.stringify(all));
  };

  const deleteDebate = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-debate-history", JSON.stringify(updated));
  };

  return { history, saveDebate, deleteDebate };
}
