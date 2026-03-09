import { useState, useEffect } from "react";
import { z } from "zod";

export interface ExcuseResult {
  id: string;
  situation: string;
  style: string;
  extraDetails: string;
  excuses: string;
  rawText: string;
  createdAt: string;
}

const excuseResultSchema = z.object({
  id: z.string(),
  situation: z.string(),
  style: z.string(),
  extraDetails: z.string(),
  excuses: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useExcuseStorage() {
  const [history, setHistory] = useState<ExcuseResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-excuse-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(excuseResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load excuse storage", e);
    }
  }, []);

  const saveExcuse = (excuse: ExcuseResult) => {
    const all = [excuse, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-excuse-history", JSON.stringify(all));
  };

  const deleteExcuse = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-excuse-history", JSON.stringify(updated));
  };

  return { history, saveExcuse, deleteExcuse };
}
