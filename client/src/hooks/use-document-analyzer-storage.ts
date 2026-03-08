import { useState, useEffect } from "react";
import { z } from "zod";

export interface DocumentAnalysis {
  id: string;
  documentTitle: string;
  documentType: string;
  charCount: number;
  analysisOptions: string[];
  readingLevel: string;
  lengthPref: string;
  rawText: string;
  summary: string;
  keyInsights: string[];
  simplifiedExplanation: string;
  importantQuotes: string[];
  keyStats: string[];
  actionItems: string[];
  studyQuestions: string[];
  createdAt: string;
}

const analysisSchema = z.object({
  id: z.string(),
  documentTitle: z.string(),
  documentType: z.string(),
  charCount: z.number(),
  analysisOptions: z.array(z.string()),
  readingLevel: z.string(),
  lengthPref: z.string(),
  rawText: z.string(),
  summary: z.string(),
  keyInsights: z.array(z.string()),
  simplifiedExplanation: z.string(),
  importantQuotes: z.array(z.string()),
  keyStats: z.array(z.string()),
  actionItems: z.array(z.string()),
  studyQuestions: z.array(z.string()),
  createdAt: z.string(),
});

export function useDocumentAnalyzerStorage() {
  const [history, setHistory] = useState<DocumentAnalysis[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-document-analyzer-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(analysisSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load document analyzer storage", e);
    }
  }, []);

  const saveAnalysis = (analysis: DocumentAnalysis) => {
    const all = [analysis, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-document-analyzer-history", JSON.stringify(all));
  };

  const deleteAnalysis = (id: string) => {
    const updated = history.filter((a) => a.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-document-analyzer-history", JSON.stringify(updated));
  };

  return { history, saveAnalysis, deleteAnalysis };
}
