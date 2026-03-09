import { useState, useEffect } from "react";
import { z } from "zod";

export interface PromptResult {
  id: string;
  topic: string;
  purpose: string;
  outputType: string;
  extraDetails: string;
  prompts: string;
  rawText: string;
  createdAt: string;
}

const promptResultSchema = z.object({
  id: z.string(),
  topic: z.string(),
  purpose: z.string(),
  outputType: z.string(),
  extraDetails: z.string(),
  prompts: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function usePromptStorage() {
  const [history, setHistory] = useState<PromptResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-prompt-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(promptResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load prompt storage", e);
    }
  }, []);

  const savePrompt = (prompt: PromptResult) => {
    const all = [prompt, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-prompt-history", JSON.stringify(all));
  };

  const deletePrompt = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-prompt-history", JSON.stringify(updated));
  };

  return { history, savePrompt, deletePrompt };
}
