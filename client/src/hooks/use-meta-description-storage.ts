import { useState, useEffect } from "react";
import { z } from "zod";

export interface MetaDescription {
  id: string;
  pageTitle: string;
  targetKeywords: string;
  pageDescription: string;
  tone: string;
  contentType: string;
  options: string;
  descriptions: string;
  analysis: string;
  rawText: string;
  createdAt: string;
}

const metaDescriptionSchema = z.object({
  id: z.string(),
  pageTitle: z.string(),
  targetKeywords: z.string(),
  pageDescription: z.string(),
  tone: z.string(),
  contentType: z.string(),
  options: z.string(),
  descriptions: z.string(),
  analysis: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useMetaDescriptionStorage() {
  const [history, setHistory] = useState<MetaDescription[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-meta-description-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(metaDescriptionSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load meta description storage", e);
    }
  }, []);

  const saveDescription = (description: MetaDescription) => {
    const all = [description, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-meta-description-history", JSON.stringify(all));
  };

  const deleteDescription = (id: string) => {
    const updated = history.filter((d) => d.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-meta-description-history", JSON.stringify(updated));
  };

  return { history, saveDescription, deleteDescription };
}
