import { useState, useEffect } from "react";
import { z } from "zod";

export interface LinkedInSummary {
  id: string;
  role: string;
  experienceLevel: string;
  skills: string;
  achievements: string;
  tone: string;
  targetGoal: string;
  versions: string;
  rawText: string;
  createdAt: string;
}

const linkedInSummarySchema = z.object({
  id: z.string(),
  role: z.string(),
  experienceLevel: z.string(),
  skills: z.string(),
  achievements: z.string(),
  tone: z.string(),
  targetGoal: z.string(),
  versions: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useLinkedInSummaryStorage() {
  const [history, setHistory] = useState<LinkedInSummary[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-linkedin-summary-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(linkedInSummarySchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load LinkedIn summary storage", e);
    }
  }, []);

  const saveSummary = (summary: LinkedInSummary) => {
    const all = [summary, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-linkedin-summary-history", JSON.stringify(all));
  };

  const deleteSummary = (id: string) => {
    const updated = history.filter((s) => s.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-linkedin-summary-history", JSON.stringify(updated));
  };

  return { history, saveSummary, deleteSummary };
}
