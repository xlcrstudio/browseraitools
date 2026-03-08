import { useState, useEffect } from "react";
import { z } from "zod";

export interface ToneConversion {
  id: string;
  content: string;
  angle: string;
  charCount: number;
  wordCount: number;
}

export interface ToneChange {
  original: string;
  converted: string;
  explanation: string;
}

export interface ToneUsageNotes {
  bestFor: string[];
  audienceFit: string[];
  adjustIf: string[];
}

export interface ToneConversionRecord {
  id: string;
  originalText: string;
  targetTone: string;
  currentTone: string;
  conversions: ToneConversion[];
  changes: ToneChange[];
  usageNotes: ToneUsageNotes | null;
  favorites: string[];
  createdAt: string;
}

const conversionSchema = z.object({
  id: z.string(),
  content: z.string(),
  angle: z.string(),
  charCount: z.number(),
  wordCount: z.number(),
});

const changeSchema = z.object({
  original: z.string(),
  converted: z.string(),
  explanation: z.string(),
});

const usageNotesSchema = z.object({
  bestFor: z.array(z.string()),
  audienceFit: z.array(z.string()),
  adjustIf: z.array(z.string()),
});

const recordSchema = z.object({
  id: z.string(),
  originalText: z.string(),
  targetTone: z.string(),
  currentTone: z.string(),
  conversions: z.array(conversionSchema),
  changes: z.array(changeSchema),
  usageNotes: usageNotesSchema.nullable(),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

export function useToneConverterStorage() {
  const [history, setHistory] = useState<ToneConversionRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-tone-converter-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(recordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }
    } catch (e) {
      console.error("Failed to load tone converter storage", e);
    }
  }, []);

  const saveConversion = (record: ToneConversionRecord) => {
    const allRecords = [record, ...history].slice(0, 15);
    setHistory(allRecords);
    localStorage.setItem("ai-tone-converter-history", JSON.stringify(allRecords));
  };

  const toggleFavorite = (recordId: string, conversionId: string) => {
    const updated = history.map((record) => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(conversionId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter((id) => id !== conversionId)
          : [...record.favorites, conversionId],
      };
    });
    setHistory(updated);
    localStorage.setItem("ai-tone-converter-history", JSON.stringify(updated));
  };

  return { history, saveConversion, toggleFavorite };
}
