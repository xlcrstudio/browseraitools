import { useState, useEffect } from "react";
import { z } from "zod";

export interface LinkedInPostVersion {
  id: string;
  content: string;
  angle: string;
  tone: string;
  wordCount: number;
  readTime: string;
  hookStrength: number;
  engagementPotential: string;
  whyItWorks: string[];
  hashtags: string[];
}

export interface LinkedInFirstComment {
  id: string;
  text: string;
}

export interface LinkedInPostRecord {
  id: string;
  topic: string;
  postType: string;
  tone: string;
  versions: LinkedInPostVersion[];
  firstComment: LinkedInFirstComment | null;
  favorites: string[];
  createdAt: string;
}

const versionSchema = z.object({
  id: z.string(),
  content: z.string(),
  angle: z.string(),
  tone: z.string(),
  wordCount: z.number(),
  readTime: z.string(),
  hookStrength: z.number(),
  engagementPotential: z.string(),
  whyItWorks: z.array(z.string()),
  hashtags: z.array(z.string()),
});

const firstCommentSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const recordSchema = z.object({
  id: z.string(),
  topic: z.string(),
  postType: z.string(),
  tone: z.string(),
  versions: z.array(versionSchema),
  firstComment: firstCommentSchema.nullable(),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

export function useLinkedInPostStorage() {
  const [history, setHistory] = useState<LinkedInPostRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-linkedin-post-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(recordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }
    } catch (e) {
      console.error("Failed to load linkedin post storage", e);
    }
  }, []);

  const saveGeneration = (record: LinkedInPostRecord) => {
    const allRecords = [record, ...history].slice(0, 15);
    setHistory(allRecords);
    localStorage.setItem("ai-linkedin-post-history", JSON.stringify(allRecords));
  };

  const toggleFavorite = (recordId: string, versionId: string) => {
    const updated = history.map((record) => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(versionId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter((id) => id !== versionId)
          : [...record.favorites, versionId],
      };
    });
    setHistory(updated);
    localStorage.setItem("ai-linkedin-post-history", JSON.stringify(updated));
  };

  return { history, saveGeneration, toggleFavorite };
}
