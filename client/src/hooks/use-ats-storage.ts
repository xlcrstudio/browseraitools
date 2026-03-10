import { useState, useEffect } from "react";
import { z } from "zod";

export interface SkillItem {
  name: string;
  found: boolean;
}

export interface ATSResult {
  id: string;
  jobTitle: string;
  overallScore: number;
  hardSkills: SkillItem[];
  softSkills: SkillItem[];
  otherKeywords: SkillItem[];
  suggestions: string[];
  recruiterTips: string[];
  recommendation: string;
  rawText: string;
  createdAt: string;
}

const skillItemSchema = z.object({
  name: z.string(),
  found: z.boolean(),
});

const atsResultSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  overallScore: z.number(),
  hardSkills: z.array(skillItemSchema),
  softSkills: z.array(skillItemSchema),
  otherKeywords: z.array(skillItemSchema),
  suggestions: z.array(z.string()),
  recruiterTips: z.array(z.string()),
  recommendation: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useATSStorage() {
  const [history, setHistory] = useState<ATSResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-ats-history-v2");
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
    localStorage.setItem("ai-ats-history-v2", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-ats-history-v2", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
