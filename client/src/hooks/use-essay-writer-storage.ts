import { useState, useEffect } from "react";
import { z } from "zod";

export interface Essay {
  id: string;
  topic: string;
  essayType: string;
  academicLevel: string;
  wordCount: number;
  citationStyle: string;
  keyPoints: string;
  outlineOnly: boolean;
  tone: string;
  includeCounterarguments: boolean;
  essayContent: string;
  rawText: string;
  createdAt: string;
}

const essaySchema = z.object({
  id: z.string(),
  topic: z.string(),
  essayType: z.string(),
  academicLevel: z.string(),
  wordCount: z.number(),
  citationStyle: z.string(),
  keyPoints: z.string(),
  outlineOnly: z.boolean(),
  tone: z.string(),
  includeCounterarguments: z.boolean(),
  essayContent: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useEssayWriterStorage() {
  const [history, setHistory] = useState<Essay[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-essay-writer-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(essaySchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load essay writer storage", e);
    }
  }, []);

  const saveEssay = (essay: Essay) => {
    const all = [essay, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-essay-writer-history", JSON.stringify(all));
  };

  const deleteEssay = (id: string) => {
    const updated = history.filter((e) => e.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-essay-writer-history", JSON.stringify(updated));
  };

  return { history, saveEssay, deleteEssay };
}
