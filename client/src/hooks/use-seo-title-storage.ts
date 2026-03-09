import { useState, useEffect } from "react";
import { z } from "zod";

export interface SeoTitle {
  id: string;
  topic: string;
  targetKeyword: string;
  secondaryKeywords: string;
  contentType: string;
  titleStyles: string;
  tone: string;
  targetAudience: string;
  options: string;
  titles: string;
  analysis: string;
  rawText: string;
  createdAt: string;
}

const seoTitleSchema = z.object({
  id: z.string(),
  topic: z.string(),
  targetKeyword: z.string(),
  secondaryKeywords: z.string(),
  contentType: z.string(),
  titleStyles: z.string(),
  tone: z.string(),
  targetAudience: z.string(),
  options: z.string(),
  titles: z.string(),
  analysis: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useSeoTitleStorage() {
  const [history, setHistory] = useState<SeoTitle[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-seo-title-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(seoTitleSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load SEO title storage", e);
    }
  }, []);

  const saveTitle = (title: SeoTitle) => {
    const all = [title, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-seo-title-history", JSON.stringify(all));
  };

  const deleteTitle = (id: string) => {
    const updated = history.filter((t) => t.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-seo-title-history", JSON.stringify(updated));
  };

  return { history, saveTitle, deleteTitle };
}
