import { useState, useEffect } from 'react';
import { z } from 'zod';

export interface GeneratedCaption {
  id: string;
  caption: string;
  angle: string;
  tone: string;
  charCount: number;
  hashtagCount: number;
  emojiCount: number;
  engagementRating: number;
  whyItWorks: string[];
  hashtags: string[];
}

export interface FirstComment {
  id: string;
  label: string;
  text: string;
}

export interface TikTokCaptionRecord {
  id: string;
  videoContent: string;
  niche: string;
  captions: GeneratedCaption[];
  firstComments: FirstComment[];
  favorites: string[];
  createdAt: string;
}

const captionSchema = z.object({
  id: z.string(),
  caption: z.string(),
  angle: z.string(),
  tone: z.string(),
  charCount: z.number(),
  hashtagCount: z.number(),
  emojiCount: z.number(),
  engagementRating: z.number(),
  whyItWorks: z.array(z.string()),
  hashtags: z.array(z.string()),
});

const firstCommentSchema = z.object({
  id: z.string(),
  label: z.string(),
  text: z.string(),
});

const recordSchema = z.object({
  id: z.string(),
  videoContent: z.string(),
  niche: z.string(),
  captions: z.array(captionSchema),
  firstComments: z.array(firstCommentSchema),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

const statsSchema = z.object({
  totalGenerated: z.number().default(0),
  generationsToday: z.number().default(0),
  lastDate: z.string().optional(),
});

type TikTokStats = z.infer<typeof statsSchema>;

export function useTikTokCaptionStorage() {
  const [history, setHistory] = useState<TikTokCaptionRecord[]>([]);
  const [stats, setStats] = useState<TikTokStats>({
    totalGenerated: 0,
    generationsToday: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-tiktok-caption-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(recordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-tiktok-caption-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = statsSchema.safeParse(parsed);
        if (validated.success) {
          const today = new Date().toDateString();
          if (validated.data.lastDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastDate = today;
            localStorage.setItem('ai-tiktok-caption-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load tiktok caption storage', e);
    }
  }, []);

  const saveGeneration = (record: TikTokCaptionRecord) => {
    const allRecords = [record, ...history].slice(0, 15);
    setHistory(allRecords);
    localStorage.setItem('ai-tiktok-caption-history', JSON.stringify(allRecords));

    const today = new Date().toDateString();
    const newStats: TikTokStats = {
      generationsToday: (stats.lastDate === today ? stats.generationsToday : 0) + 1,
      totalGenerated: stats.totalGenerated + 1,
      lastDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-tiktok-caption-stats', JSON.stringify(newStats));
  };

  const toggleFavorite = (recordId: string, captionId: string) => {
    const updated = history.map(record => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(captionId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter(id => id !== captionId)
          : [...record.favorites, captionId],
      };
    });
    setHistory(updated);
    localStorage.setItem('ai-tiktok-caption-history', JSON.stringify(updated));
  };

  return { history, stats, saveGeneration, toggleFavorite };
}
