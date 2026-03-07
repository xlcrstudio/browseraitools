import { useState, useEffect } from 'react';
import { z } from 'zod';

export type NameCategory = 'compound' | 'invented' | 'descriptive' | 'portmanteau' | 'single-word' | 'metaphorical';
export type DomainLikelihood = 'likely-available' | 'possibly-available' | 'likely-taken';

export interface GeneratedName {
  id: string;
  name: string;
  category: NameCategory;
  meaning: string;
  whyItWorks: string[];
  letterCount: number;
  syllableCount: number;
  domainLikelihood: DomainLikelihood;
}

export interface NameGenerationRecord {
  id: string;
  description: string;
  industry: string;
  names: GeneratedName[];
  favorites: string[];
  createdAt: string;
}

const generatedNameSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['compound', 'invented', 'descriptive', 'portmanteau', 'single-word', 'metaphorical']),
  meaning: z.string(),
  whyItWorks: z.array(z.string()),
  letterCount: z.number(),
  syllableCount: z.number(),
  domainLikelihood: z.enum(['likely-available', 'possibly-available', 'likely-taken']),
});

const nameRecordSchema = z.object({
  id: z.string(),
  description: z.string(),
  industry: z.string(),
  names: z.array(generatedNameSchema),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

const statsSchema = z.object({
  totalGenerated: z.number().default(0),
  generationsToday: z.number().default(0),
  lastDate: z.string().optional(),
});

type StartupNameStats = z.infer<typeof statsSchema>;

const commonWords = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'app', 'web', 'net', 'hub',
  'box', 'pay', 'buy', 'shop', 'tech', 'data', 'code', 'link', 'chat',
  'mail', 'map', 'car', 'fit', 'run', 'fly', 'fast', 'go', 'pro', 'top',
  'big', 'red', 'blue', 'green', 'gold', 'star', 'sun', 'sky', 'fire',
  'air', 'ice', 'zen', 'bit', 'byte', 'cloud', 'smart', 'quick', 'snap',
]);

export function estimateDomainAvailability(name: string): DomainLikelihood {
  const cleaned = name.toLowerCase().replace(/[^a-z]/g, '');

  if (cleaned.length < 6 && commonWords.has(cleaned)) {
    return 'likely-taken';
  }

  if (cleaned.length < 5) {
    return 'likely-taken';
  }

  const hasVowels = /[aeiou]/.test(cleaned);
  const hasConsonants = /[^aeiou]/.test(cleaned);
  const isPronounceable = hasVowels && hasConsonants;

  if (cleaned.length > 7 && isPronounceable && !commonWords.has(cleaned)) {
    return 'likely-available';
  }

  return 'possibly-available';
}

export function estimateSyllables(name: string): number {
  const cleaned = name.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length === 0) return 0;
  if (cleaned.length <= 3) return 1;

  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < cleaned.length; i++) {
    const isVowel = vowels.includes(cleaned[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }

  if (cleaned.endsWith('e') && count > 1) {
    count--;
  }

  if (cleaned.endsWith('le') && cleaned.length > 2 && !vowels.includes(cleaned[cleaned.length - 3])) {
    count++;
  }

  return Math.max(1, count);
}

export function useStartupNameStorage() {
  const [history, setHistory] = useState<NameGenerationRecord[]>([]);
  const [stats, setStats] = useState<StartupNameStats>({
    totalGenerated: 0,
    generationsToday: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-startup-name-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(nameRecordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-startup-name-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = statsSchema.safeParse(parsed);
        if (validated.success) {
          const today = new Date().toDateString();
          if (validated.data.lastDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastDate = today;
            localStorage.setItem('ai-startup-name-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load startup name storage', e);
    }
  }, []);

  const saveGeneration = (record: NameGenerationRecord) => {
    const allRecords = [record, ...history].slice(0, 10);
    setHistory(allRecords);
    localStorage.setItem('ai-startup-name-history', JSON.stringify(allRecords));

    const today = new Date().toDateString();
    const newStats: StartupNameStats = {
      generationsToday: (stats.lastDate === today ? stats.generationsToday : 0) + 1,
      totalGenerated: stats.totalGenerated + 1,
      lastDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-startup-name-stats', JSON.stringify(newStats));
  };

  const toggleFavorite = (recordId: string, nameId: string) => {
    const updated = history.map(record => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(nameId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter(id => id !== nameId)
          : [...record.favorites, nameId],
      };
    });
    setHistory(updated);
    localStorage.setItem('ai-startup-name-history', JSON.stringify(updated));
  };

  const getFavorites = (): GeneratedName[] => {
    const favNames: GeneratedName[] = [];
    for (const record of history) {
      for (const name of record.names) {
        if (record.favorites.includes(name.id)) {
          favNames.push(name);
        }
      }
    }
    return favNames;
  };

  return { history, stats, saveGeneration, toggleFavorite, getFavorites };
}
