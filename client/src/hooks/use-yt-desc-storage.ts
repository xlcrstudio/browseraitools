import { useState, useEffect } from "react";
import { z } from "zod";

export interface YTDescResult {
  id: string;
  topic: string;
  summary: string;
  keywords: string;
  videoType: string;
  channelType: string;
  descLength: string;
  includeTimestamps: boolean;
  numSections: number;
  videoDuration: string;
  links: string;
  ctas: string[];
  includeHashtags: boolean;
  includeEmoji: boolean;
  channelName: string;
  descriptions: string;
  rawText: string;
  createdAt: string;
}

const ytDescResultSchema = z.object({
  id: z.string(),
  topic: z.string(),
  summary: z.string(),
  keywords: z.string(),
  videoType: z.string(),
  channelType: z.string(),
  descLength: z.string(),
  includeTimestamps: z.boolean(),
  numSections: z.number(),
  videoDuration: z.string(),
  links: z.string(),
  ctas: z.array(z.string()),
  includeHashtags: z.boolean(),
  includeEmoji: z.boolean(),
  channelName: z.string(),
  descriptions: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useYTDescStorage() {
  const [history, setHistory] = useState<YTDescResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-yt-desc-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(ytDescResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load yt desc storage", e);
    }
  }, []);

  const saveDesc = (result: YTDescResult) => {
    const all = [result, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-yt-desc-history", JSON.stringify(all));
  };

  const deleteDesc = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-yt-desc-history", JSON.stringify(updated));
  };

  return { history, saveDesc, deleteDesc };
}
