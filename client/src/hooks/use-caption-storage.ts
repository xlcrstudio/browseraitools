import { useState, useEffect } from "react";
import { z } from "zod";

export interface CaptionResult {
  id: string;
  topic: string;
  style: string;
  audience: string;
  keywords: string;
  includeEmojis: boolean;
  includeHashtags: boolean;
  captionLength: string;
  captions: string;
  rawText: string;
  createdAt: string;
}

const captionResultSchema = z.object({
  id: z.string(),
  topic: z.string(),
  style: z.string(),
  audience: z.string(),
  keywords: z.string(),
  includeEmojis: z.boolean(),
  includeHashtags: z.boolean(),
  captionLength: z.string(),
  captions: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useCaptionStorage() {
  const [history, setHistory] = useState<CaptionResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-caption-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(captionResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load caption storage", e);
    }
  }, []);

  const saveCaption = (caption: CaptionResult) => {
    const all = [caption, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-caption-history", JSON.stringify(all));
  };

  const deleteCaption = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-caption-history", JSON.stringify(updated));
  };

  return { history, saveCaption, deleteCaption };
}
