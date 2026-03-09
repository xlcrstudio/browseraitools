import { useState, useEffect } from "react";
import { z } from "zod";

export interface SerpIntentAnalysis {
  id: string;
  keyword: string;
  niche: string;
  country: string;
  depth: string;
  extraInsights: string;
  intentReport: string;
  contentTypes: string;
  articleFormat: string;
  titleIdeas: string;
  peopleAlsoAsk: string;
  contentDepth: string;
  rawText: string;
  createdAt: string;
}

const serpIntentSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  niche: z.string(),
  country: z.string(),
  depth: z.string(),
  extraInsights: z.string(),
  intentReport: z.string(),
  contentTypes: z.string(),
  articleFormat: z.string(),
  titleIdeas: z.string(),
  peopleAlsoAsk: z.string(),
  contentDepth: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useSerpIntentStorage() {
  const [history, setHistory] = useState<SerpIntentAnalysis[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-serp-intent-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(serpIntentSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load SERP intent storage", e);
    }
  }, []);

  const saveAnalysis = (analysis: SerpIntentAnalysis) => {
    const all = [analysis, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-serp-intent-history", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((a) => a.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-serp-intent-history", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
