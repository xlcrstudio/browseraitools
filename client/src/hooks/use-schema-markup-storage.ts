import { useState, useEffect } from "react";
import { z } from "zod";

export interface SchemaMarkup {
  id: string;
  pageTitle: string;
  pageUrl: string;
  schemaType: string;
  description: string;
  dynamicFields: string;
  jsonLdOutput: string;
  implementationGuide: string;
  rawText: string;
  createdAt: string;
}

const schemaMarkupSchema = z.object({
  id: z.string(),
  pageTitle: z.string(),
  pageUrl: z.string(),
  schemaType: z.string(),
  description: z.string(),
  dynamicFields: z.string(),
  jsonLdOutput: z.string(),
  implementationGuide: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useSchemaMarkupStorage() {
  const [history, setHistory] = useState<SchemaMarkup[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-schema-markup-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(schemaMarkupSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load schema markup storage", e);
    }
  }, []);

  const saveMarkup = (markup: SchemaMarkup) => {
    const all = [markup, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-schema-markup-history", JSON.stringify(all));
  };

  const deleteMarkup = (id: string) => {
    const updated = history.filter((m) => m.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-schema-markup-history", JSON.stringify(updated));
  };

  return { history, saveMarkup, deleteMarkup };
}
