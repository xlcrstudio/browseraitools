import { useState, useEffect } from "react";
import { z } from "zod";

export interface YTTitleResult {
  id: string;
  topic: string;
  category: string;
  style: string;
  keywords: string;
  maxLength: number;
  includeNumbers: boolean;
  includeEmotionalWords: boolean;
  titles: string;
  rawText: string;
  createdAt: string;
}

const ytTitleResultSchema = z.object({
  id: z.string(),
  topic: z.string(),
  category: z.string(),
  style: z.string(),
  keywords: z.string(),
  maxLength: z.number(),
  includeNumbers: z.boolean(),
  includeEmotionalWords: z.boolean(),
  titles: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useYTTitleStorage() {
  const [history, setHistory] = useState<YTTitleResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-yt-title-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(ytTitleResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load yt title storage", e);
    }
  }, []);

  const saveTitle = (result: YTTitleResult) => {
    const all = [result, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-yt-title-history", JSON.stringify(all));
  };

  const deleteTitle = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-yt-title-history", JSON.stringify(updated));
  };

  return { history, saveTitle, deleteTitle };
}
