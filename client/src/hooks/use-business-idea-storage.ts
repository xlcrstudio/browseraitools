import { useState, useEffect } from 'react';
import { z } from 'zod';

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  viabilityScore: number;
  viabilityLabel: 'Excellent' | 'Good' | 'Moderate';
  startupCost: string;
  timeToLaunch: string;
  revenueMonthly: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  whyItWorks: string[];
  targetMarket: string;
  revenueModel: string;
  competition: string;
  nextSteps: string[];
  category: 'service' | 'digital' | 'product' | 'innovative';
}

export interface IdeaGenerationRecord {
  id: string;
  skills: string;
  interests: string;
  budget: string;
  ideas: BusinessIdea[];
  favorites: string[];
  createdAt: string;
}

const businessIdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  viabilityScore: z.number(),
  viabilityLabel: z.enum(['Excellent', 'Good', 'Moderate']),
  startupCost: z.string(),
  timeToLaunch: z.string(),
  revenueMonthly: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  whyItWorks: z.array(z.string()),
  targetMarket: z.string(),
  revenueModel: z.string(),
  competition: z.string(),
  nextSteps: z.array(z.string()),
  category: z.enum(['service', 'digital', 'product', 'innovative']),
});

const ideaRecordSchema = z.object({
  id: z.string(),
  skills: z.string(),
  interests: z.string(),
  budget: z.string(),
  ideas: z.array(businessIdeaSchema),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

const statsSchema = z.object({
  totalGenerated: z.number().default(0),
  generationsToday: z.number().default(0),
  lastDate: z.string().optional(),
});

type BusinessIdeaStats = z.infer<typeof statsSchema>;

export function useBusinessIdeaStorage() {
  const [history, setHistory] = useState<IdeaGenerationRecord[]>([]);
  const [stats, setStats] = useState<BusinessIdeaStats>({
    totalGenerated: 0,
    generationsToday: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-business-idea-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(ideaRecordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-business-idea-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = statsSchema.safeParse(parsed);
        if (validated.success) {
          const today = new Date().toDateString();
          if (validated.data.lastDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastDate = today;
            localStorage.setItem('ai-business-idea-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load business idea storage', e);
    }
  }, []);

  const saveGeneration = (record: IdeaGenerationRecord) => {
    const allRecords = [record, ...history].slice(0, 10);
    setHistory(allRecords);
    localStorage.setItem('ai-business-idea-history', JSON.stringify(allRecords));

    const today = new Date().toDateString();
    const newStats: BusinessIdeaStats = {
      generationsToday: (stats.lastDate === today ? stats.generationsToday : 0) + 1,
      totalGenerated: stats.totalGenerated + 1,
      lastDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-business-idea-stats', JSON.stringify(newStats));
  };

  const toggleFavorite = (recordId: string, ideaId: string) => {
    const updated = history.map(record => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(ideaId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter(id => id !== ideaId)
          : [...record.favorites, ideaId],
      };
    });
    setHistory(updated);
    localStorage.setItem('ai-business-idea-history', JSON.stringify(updated));
  };

  const getFavorites = (): BusinessIdea[] => {
    const favIdeas: BusinessIdea[] = [];
    for (const record of history) {
      for (const idea of record.ideas) {
        if (record.favorites.includes(idea.id)) {
          favIdeas.push(idea);
        }
      }
    }
    return favIdeas;
  };

  return { history, stats, saveGeneration, toggleFavorite, getFavorites };
}
