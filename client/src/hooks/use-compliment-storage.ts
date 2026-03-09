import { useState, useEffect } from "react";
import { z } from "zod";

export interface ComplimentResult {
  id: string;
  recipient: string;
  tone: string;
  context: string;
  compliments: string;
  rawText: string;
  createdAt: string;
}

const complimentResultSchema = z.object({
  id: z.string(),
  recipient: z.string(),
  tone: z.string(),
  context: z.string(),
  compliments: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useComplimentStorage() {
  const [history, setHistory] = useState<ComplimentResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-compliment-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(complimentResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load compliment storage", e);
    }
  }, []);

  const saveCompliment = (compliment: ComplimentResult) => {
    const all = [compliment, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-compliment-history", JSON.stringify(all));
  };

  const deleteCompliment = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-compliment-history", JSON.stringify(updated));
  };

  return { history, saveCompliment, deleteCompliment };
}
