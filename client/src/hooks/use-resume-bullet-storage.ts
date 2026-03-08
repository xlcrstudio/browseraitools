import { useState, useEffect } from "react";
import { z } from "zod";

export interface BulletOption {
  id: string;
  text: string;
  focus: string;
  whyItWorks: string[];
  keywords: string[];
  charCount: number;
}

export interface ResumeBulletRecord {
  id: string;
  jobTitle: string;
  responsibility: string;
  achievements: string;
  metrics: string;
  industry: string;
  experienceLevel: string;
  bullets: BulletOption[];
  bestCombo: string[];
  comboExplanation: string;
  conciseVersion: string;
  detailedVersion: string;
  improvementTips: string[];
  favorites: string[];
  createdAt: string;
}

const bulletSchema = z.object({
  id: z.string(),
  text: z.string(),
  focus: z.string(),
  whyItWorks: z.array(z.string()),
  keywords: z.array(z.string()),
  charCount: z.number(),
});

const recordSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  responsibility: z.string(),
  achievements: z.string(),
  metrics: z.string(),
  industry: z.string(),
  experienceLevel: z.string(),
  bullets: z.array(bulletSchema),
  bestCombo: z.array(z.string()),
  comboExplanation: z.string(),
  conciseVersion: z.string(),
  detailedVersion: z.string(),
  improvementTips: z.array(z.string()),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

export function useResumeBulletStorage() {
  const [history, setHistory] = useState<ResumeBulletRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-resume-bullet-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(recordSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load resume bullet storage", e);
    }
  }, []);

  const saveRecord = (record: ResumeBulletRecord) => {
    const all = [record, ...history].slice(0, 20);
    setHistory(all);
    localStorage.setItem("ai-resume-bullet-history", JSON.stringify(all));
  };

  const toggleFavorite = (recordId: string, bulletId: string) => {
    const updated = history.map((r) => {
      if (r.id !== recordId) return r;
      const isFav = r.favorites.includes(bulletId);
      return {
        ...r,
        favorites: isFav ? r.favorites.filter((id) => id !== bulletId) : [...r.favorites, bulletId],
      };
    });
    setHistory(updated);
    localStorage.setItem("ai-resume-bullet-history", JSON.stringify(updated));
  };

  return { history, saveRecord, toggleFavorite };
}
