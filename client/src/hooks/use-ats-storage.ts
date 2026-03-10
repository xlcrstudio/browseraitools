import { useState, useEffect } from "react";
import { z } from "zod";

export interface ATSResult {
  id: string;
  jobTitle: string;
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  recommendation: string;
  rawText: string;
  createdAt: string;
}

const atsResultSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  overallScore: z.number(),
  keywordScore: z.number(),
  skillsScore: z.number(),
  experienceScore: z.number(),
  missingKeywords: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestions: z.array(z.string()),
  recommendation: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useATSStorage() {
  const [history, setHistory] = useState<ATSResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-ats-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(atsResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load ATS storage", e);
    }
  }, []);

  const saveAnalysis = (result: ATSResult) => {
    const all = [result, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-ats-history", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-ats-history", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
