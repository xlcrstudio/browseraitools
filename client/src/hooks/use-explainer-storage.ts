import { useState, useEffect } from "react";
import { z } from "zod";

export interface Explanation {
  id: string;
  inputText: string;
  explanationModes: string[];
  readingLevel: string;
  subjectArea: string;
  additionalContext: string;
  specificConfusion: string;
  defineTerms: boolean;
  visualDiagram: boolean;
  relatedConcepts: boolean;
  simpleExplanation: string;
  eli5Explanation: string;
  stepByStepExplanation: string;
  analogyExplanation: string;
  technicalExplanation: string;
  academicExplanation: string;
  keyTerms: string;
  rawText: string;
  createdAt: string;
}

const explanationSchema = z.object({
  id: z.string(),
  inputText: z.string(),
  explanationModes: z.array(z.string()),
  readingLevel: z.string(),
  subjectArea: z.string(),
  additionalContext: z.string(),
  specificConfusion: z.string(),
  defineTerms: z.boolean(),
  visualDiagram: z.boolean(),
  relatedConcepts: z.boolean(),
  simpleExplanation: z.string(),
  eli5Explanation: z.string(),
  stepByStepExplanation: z.string(),
  analogyExplanation: z.string(),
  technicalExplanation: z.string(),
  academicExplanation: z.string(),
  keyTerms: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useExplainerStorage() {
  const [history, setHistory] = useState<Explanation[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-explainer-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(explanationSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load explainer storage", e);
    }
  }, []);

  const saveExplanation = (explanation: Explanation) => {
    const all = [explanation, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-explainer-history", JSON.stringify(all));
  };

  const deleteExplanation = (id: string) => {
    const updated = history.filter((a) => a.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-explainer-history", JSON.stringify(updated));
  };

  return { history, saveExplanation, deleteExplanation };
}
