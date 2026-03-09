import { useState, useEffect } from "react";
import { z } from "zod";

export interface StoryResult {
  id: string;
  genre: string;
  tone: string;
  character: string;
  extraFlavor: string;
  starters: string;
  rawText: string;
  createdAt: string;
}

const storyResultSchema = z.object({
  id: z.string(),
  genre: z.string(),
  tone: z.string(),
  character: z.string(),
  extraFlavor: z.string(),
  starters: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useStoryStorage() {
  const [history, setHistory] = useState<StoryResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-story-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(storyResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load story storage", e);
    }
  }, []);

  const saveStory = (story: StoryResult) => {
    const all = [story, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-story-history", JSON.stringify(all));
  };

  const deleteStory = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-story-history", JSON.stringify(updated));
  };

  return { history, saveStory, deleteStory };
}
