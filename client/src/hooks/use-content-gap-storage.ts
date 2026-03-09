import { useState, useEffect } from "react";
import { z } from "zod";

export interface ContentGapAnalysis {
  id: string;
  userArticle: string;
  niche: string;
  targetKeywords: string;
  competitorCount: number;
  analysisDepth: string;
  focusAreas: string[];
  missingTopics: string;
  keywordGaps: string;
  recommendedHeadings: string;
  contentBrief: string;
  rawText: string;
  createdAt: string;
}

const contentGapSchema = z.object({
  id: z.string(),
  userArticle: z.string(),
  niche: z.string(),
  targetKeywords: z.string(),
  competitorCount: z.number(),
  analysisDepth: z.string(),
  focusAreas: z.array(z.string()),
  missingTopics: z.string(),
  keywordGaps: z.string(),
  recommendedHeadings: z.string(),
  contentBrief: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useContentGapStorage() {
  const [history, setHistory] = useState<ContentGapAnalysis[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-content-gap-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(contentGapSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load content gap storage", e);
    }
  }, []);

  const saveAnalysis = (analysis: ContentGapAnalysis) => {
    const truncated = {
      ...analysis,
      userArticle: analysis.userArticle.slice(0, 500),
    };
    const all = [truncated, ...history].slice(0, 10);
    setHistory(all);
    localStorage.setItem("ai-content-gap-history", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((a) => a.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-content-gap-history", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
