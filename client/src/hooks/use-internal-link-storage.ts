import { useState, useEffect } from "react";
import { z } from "zod";

export interface InternalLinkAnalysis {
  id: string;
  pageContent: string;
  pageUrl: string;
  targetKeywords: string;
  sitePages: string;
  currentLinks: string;
  linkingGoal: string;
  linkCount: number;
  options: string;
  suggestions: string;
  overview: string;
  rawText: string;
  createdAt: string;
}

const internalLinkAnalysisSchema = z.object({
  id: z.string(),
  pageContent: z.string(),
  pageUrl: z.string(),
  targetKeywords: z.string(),
  sitePages: z.string(),
  currentLinks: z.string(),
  linkingGoal: z.string(),
  linkCount: z.number(),
  options: z.string(),
  suggestions: z.string(),
  overview: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useInternalLinkStorage() {
  const [history, setHistory] = useState<InternalLinkAnalysis[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-internal-link-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(internalLinkAnalysisSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load internal link storage", e);
    }
  }, []);

  const saveAnalysis = (analysis: InternalLinkAnalysis) => {
    const all = [analysis, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-internal-link-history", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((a) => a.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-internal-link-history", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
