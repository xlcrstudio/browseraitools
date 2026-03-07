import { useState, useEffect } from 'react';
import { z } from 'zod';

export interface GeneratedKeyword {
  id: string;
  keyword: string;
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  volume: string;
  difficulty: number;
  difficultyLabel: 'Low' | 'Medium' | 'High';
  cpcEstimate: string;
  cluster: string;
}

export interface KeywordGenerationRecord {
  id: string;
  seedKeyword: string;
  industry: string;
  keywords: GeneratedKeyword[];
  favorites: string[];
  createdAt: string;
}

const generatedKeywordSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  intent: z.enum(['Informational', 'Commercial', 'Transactional', 'Navigational']),
  volume: z.string(),
  difficulty: z.number(),
  difficultyLabel: z.enum(['Low', 'Medium', 'High']),
  cpcEstimate: z.string(),
  cluster: z.string(),
});

const keywordRecordSchema = z.object({
  id: z.string(),
  seedKeyword: z.string(),
  industry: z.string(),
  keywords: z.array(generatedKeywordSchema),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

const statsSchema = z.object({
  totalGenerated: z.number().default(0),
  generationsToday: z.number().default(0),
  lastDate: z.string().optional(),
});

type KeywordStats = z.infer<typeof statsSchema>;

export function useKeywordStorage() {
  const [history, setHistory] = useState<KeywordGenerationRecord[]>([]);
  const [stats, setStats] = useState<KeywordStats>({
    totalGenerated: 0,
    generationsToday: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-keyword-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(keywordRecordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-keyword-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = statsSchema.safeParse(parsed);
        if (validated.success) {
          const today = new Date().toDateString();
          if (validated.data.lastDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastDate = today;
            localStorage.setItem('ai-keyword-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load keyword storage', e);
    }
  }, []);

  const saveGeneration = (record: KeywordGenerationRecord) => {
    const allRecords = [record, ...history].slice(0, 10);
    setHistory(allRecords);
    localStorage.setItem('ai-keyword-history', JSON.stringify(allRecords));

    const today = new Date().toDateString();
    const newStats: KeywordStats = {
      generationsToday: (stats.lastDate === today ? stats.generationsToday : 0) + 1,
      totalGenerated: stats.totalGenerated + 1,
      lastDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-keyword-stats', JSON.stringify(newStats));
  };

  const toggleFavorite = (recordId: string, keywordId: string) => {
    const updated = history.map(record => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(keywordId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter(id => id !== keywordId)
          : [...record.favorites, keywordId],
      };
    });
    setHistory(updated);
    localStorage.setItem('ai-keyword-history', JSON.stringify(updated));
  };

  const getFavorites = (): GeneratedKeyword[] => {
    const favKeywords: GeneratedKeyword[] = [];
    for (const record of history) {
      for (const kw of record.keywords) {
        if (record.favorites.includes(kw.id)) {
          favKeywords.push(kw);
        }
      }
    }
    return favKeywords;
  };

  return { history, stats, saveGeneration, toggleFavorite, getFavorites };
}
