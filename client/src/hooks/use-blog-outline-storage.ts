import { useState, useEffect } from "react";
import { z } from "zod";

export interface TitleOption {
  title: string;
  why: string;
}

export interface OutlineSection {
  id: string;
  heading: string;
  wordCount: string;
  keyPoints: string[];
  subsections: string[];
  contentNotes: string[];
  seoNotes: string[];
}

export interface OutlineIntro {
  hook: string;
  problem: string;
  promise: string;
  preview: string;
}

export interface OutlineConclusion {
  takeaways: string[];
  callToAction: string;
  finalThought: string;
}

export interface OutlineFAQ {
  question: string;
  answer: string;
}

export interface BlogOutlineRecord {
  id: string;
  topic: string;
  audience: string;
  contentType: string;
  wordCount: number;
  titleOptions: TitleOption[];
  metaDescriptions: string[];
  intro: OutlineIntro | null;
  sections: OutlineSection[];
  conclusion: OutlineConclusion | null;
  faqs: OutlineFAQ[];
  rawText: string;
  favorites: string[];
  createdAt: string;
}

const titleOptionSchema = z.object({ title: z.string(), why: z.string() });
const sectionSchema = z.object({
  id: z.string(), heading: z.string(), wordCount: z.string(),
  keyPoints: z.array(z.string()), subsections: z.array(z.string()),
  contentNotes: z.array(z.string()), seoNotes: z.array(z.string()),
});
const introSchema = z.object({ hook: z.string(), problem: z.string(), promise: z.string(), preview: z.string() });
const conclusionSchema = z.object({ takeaways: z.array(z.string()), callToAction: z.string(), finalThought: z.string() });
const faqSchema = z.object({ question: z.string(), answer: z.string() });

const recordSchema = z.object({
  id: z.string(), topic: z.string(), audience: z.string(),
  contentType: z.string(), wordCount: z.number(),
  titleOptions: z.array(titleOptionSchema), metaDescriptions: z.array(z.string()),
  intro: introSchema.nullable(), sections: z.array(sectionSchema),
  conclusion: conclusionSchema.nullable(), faqs: z.array(faqSchema),
  rawText: z.string().optional().default(""),
  favorites: z.array(z.string()), createdAt: z.string(),
});

export function useBlogOutlineStorage() {
  const [history, setHistory] = useState<BlogOutlineRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-blog-outline-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(recordSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load blog outline storage", e);
    }
  }, []);

  const saveRecord = (record: BlogOutlineRecord) => {
    const all = [record, ...history].slice(0, 20);
    setHistory(all);
    localStorage.setItem("ai-blog-outline-history", JSON.stringify(all));
  };

  const toggleFavorite = (recordId: string, sectionId: string) => {
    const updated = history.map((r) => {
      if (r.id !== recordId) return r;
      const isFav = r.favorites.includes(sectionId);
      return { ...r, favorites: isFav ? r.favorites.filter((id) => id !== sectionId) : [...r.favorites, sectionId] };
    });
    setHistory(updated);
    localStorage.setItem("ai-blog-outline-history", JSON.stringify(updated));
  };

  return { history, saveRecord, toggleFavorite };
}
