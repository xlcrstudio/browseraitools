import { useState, useEffect } from "react";
import { z } from "zod";

export interface MessageAnalysis {
  id: string;
  message: string;
  relationshipContext: string;
  mainQuestion: string;
  background: string;
  analysisOptions: string[];
  toneAnalysis: string;
  intentAnalysis: string;
  replySuggestions: string;
  redFlags: string;
  relationshipInsights: string;
  professionalAnalysis: string;
  scamDetection: string;
  rawText: string;
  createdAt: string;
}

const analysisSchema = z.object({
  id: z.string(),
  message: z.string(),
  relationshipContext: z.string(),
  mainQuestion: z.string(),
  background: z.string(),
  analysisOptions: z.array(z.string()),
  toneAnalysis: z.string(),
  intentAnalysis: z.string(),
  replySuggestions: z.string(),
  redFlags: z.string(),
  relationshipInsights: z.string(),
  professionalAnalysis: z.string(),
  scamDetection: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useMessageAnalyzerStorage() {
  const [history, setHistory] = useState<MessageAnalysis[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-message-analyzer-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(analysisSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load message analyzer storage", e);
    }
  }, []);

  const saveAnalysis = (analysis: MessageAnalysis) => {
    const all = [analysis, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-message-analyzer-history", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((a) => a.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-message-analyzer-history", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
