import { useState, useEffect } from "react";
import { z } from "zod";

export interface RoastResult {
  id: string;
  nameOrTopic: string;
  roastLevel: string;
  context: string;
  roasts: string;
  rawText: string;
  createdAt: string;
}

const roastResultSchema = z.object({
  id: z.string(),
  nameOrTopic: z.string(),
  roastLevel: z.string(),
  context: z.string(),
  roasts: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useRoastStorage() {
  const [history, setHistory] = useState<RoastResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-roast-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(roastResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load roast storage", e);
    }
  }, []);

  const saveRoast = (roast: RoastResult) => {
    const all = [roast, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-roast-history", JSON.stringify(all));
  };

  const deleteRoast = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-roast-history", JSON.stringify(updated));
  };

  return { history, saveRoast, deleteRoast };
}
