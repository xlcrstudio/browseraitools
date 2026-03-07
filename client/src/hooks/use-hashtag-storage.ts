import { useState, useEffect } from 'react';
import { z } from 'zod';

export type HashtagVolume = 'high' | 'medium' | 'low' | 'trending' | 'community' | 'branded';

export interface GeneratedHashtag {
  id: string;
  tag: string;
  volume: HashtagVolume;
  postCount: string;
}

export interface HashtagSet {
  id: string;
  platform: string;
  hashtags: GeneratedHashtag[];
  allTags: string;
  strategyNotes: string[];
}

export interface HashtagGenerationRecord {
  id: string;
  content: string;
  platforms: string[];
  niche: string;
  sets: HashtagSet[];
  favorites: string[];
  createdAt: string;
}

const hashtagSchema = z.object({
  id: z.string(),
  tag: z.string(),
  volume: z.enum(['high', 'medium', 'low', 'trending', 'community', 'branded']),
  postCount: z.string(),
});

const hashtagSetSchema = z.object({
  id: z.string(),
  platform: z.string(),
  hashtags: z.array(hashtagSchema),
  allTags: z.string(),
  strategyNotes: z.array(z.string()),
});

const recordSchema = z.object({
  id: z.string(),
  content: z.string(),
  platforms: z.array(z.string()),
  niche: z.string(),
  sets: z.array(hashtagSetSchema),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

const statsSchema = z.object({
  totalGenerated: z.number().default(0),
  generationsToday: z.number().default(0),
  lastDate: z.string().optional(),
});

type HashtagStats = z.infer<typeof statsSchema>;

export function useHashtagStorage() {
  const [history, setHistory] = useState<HashtagGenerationRecord[]>([]);
  const [stats, setStats] = useState<HashtagStats>({
    totalGenerated: 0,
    generationsToday: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-hashtag-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(recordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-hashtag-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = statsSchema.safeParse(parsed);
        if (validated.success) {
          const today = new Date().toDateString();
          if (validated.data.lastDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastDate = today;
            localStorage.setItem('ai-hashtag-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load hashtag storage', e);
    }
  }, []);

  const saveGeneration = (record: HashtagGenerationRecord) => {
    const allRecords = [record, ...history].slice(0, 15);
    setHistory(allRecords);
    localStorage.setItem('ai-hashtag-history', JSON.stringify(allRecords));

    const today = new Date().toDateString();
    const newStats: HashtagStats = {
      generationsToday: (stats.lastDate === today ? stats.generationsToday : 0) + 1,
      totalGenerated: stats.totalGenerated + 1,
      lastDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-hashtag-stats', JSON.stringify(newStats));
  };

  const toggleFavorite = (recordId: string, tagId: string) => {
    const updated = history.map(record => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(tagId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter(id => id !== tagId)
          : [...record.favorites, tagId],
      };
    });
    setHistory(updated);
    localStorage.setItem('ai-hashtag-history', JSON.stringify(updated));
  };

  const getFavorites = (): GeneratedHashtag[] => {
    const favTags: GeneratedHashtag[] = [];
    for (const record of history) {
      for (const set of record.sets) {
        for (const tag of set.hashtags) {
          if (record.favorites.includes(tag.id)) {
            favTags.push(tag);
          }
        }
      }
    }
    return favTags;
  };

  return { history, stats, saveGeneration, toggleFavorite, getFavorites };
}
