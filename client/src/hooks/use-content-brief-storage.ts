import { useState, useEffect } from "react";
import { z } from "zod";

export interface ContentBrief {
  id: string;
  primaryKeyword: string;
  additionalKeywords: string;
  targetAudience: string;
  contentType: string;
  searchIntent: string;
  wordCount: number;
  contentDepth: string;
  toneVoice: string;
  competitorUrls: string;
  brandVoice: string;
  companyName: string;
  options: string;
  overview: string;
  structure: string;
  keywords: string;
  questions: string;
  guidance: string;
  rawText: string;
  createdAt: string;
}

const contentBriefSchema = z.object({
  id: z.string(),
  primaryKeyword: z.string(),
  additionalKeywords: z.string(),
  targetAudience: z.string(),
  contentType: z.string(),
  searchIntent: z.string(),
  wordCount: z.number(),
  contentDepth: z.string(),
  toneVoice: z.string(),
  competitorUrls: z.string(),
  brandVoice: z.string(),
  companyName: z.string(),
  options: z.string(),
  overview: z.string(),
  structure: z.string(),
  keywords: z.string(),
  questions: z.string(),
  guidance: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useContentBriefStorage() {
  const [history, setHistory] = useState<ContentBrief[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-content-brief-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(contentBriefSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load content brief storage", e);
    }
  }, []);

  const saveBrief = (brief: ContentBrief) => {
    const all = [brief, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-content-brief-history", JSON.stringify(all));
  };

  const deleteBrief = (id: string) => {
    const updated = history.filter((b) => b.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-content-brief-history", JSON.stringify(updated));
  };

  return { history, saveBrief, deleteBrief };
}
