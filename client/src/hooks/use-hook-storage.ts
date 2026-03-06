import { useState, useEffect } from 'react';
import { z } from 'zod';
import { hookSchema, userStatsSchema, type GeneratedHook, type UserStats } from '@shared/schema';

// Local schema types to guarantee availability if shared isn't resolved
const localHookSchema = z.object({
  id: z.string(),
  topic: z.string(),
  type: z.string(),
  tone: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

const localStatsSchema = z.object({
  generationsToday: z.number().default(0),
  totalGenerations: z.number().default(0),
  lastGenerationDate: z.string().optional(),
});

export function useHookStorage() {
  const [hooks, setHooks] = useState<GeneratedHook[]>([]);
  const [stats, setStats] = useState<UserStats>({
    generationsToday: 0,
    totalGenerations: 0,
  });

  // Load initial data
  useEffect(() => {
    try {
      const storedHooks = localStorage.getItem('ai-hooks-history');
      if (storedHooks) {
        const parsed = JSON.parse(storedHooks);
        const validated = z.array(localHookSchema).safeParse(parsed);
        if (validated.success) {
          setHooks(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-hooks-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = localStatsSchema.safeParse(parsed);
        if (validated.success) {
          // Check if it's a new day to reset generationsToday
          const today = new Date().toDateString();
          if (validated.data.lastGenerationDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastGenerationDate = today;
            localStorage.setItem('ai-hooks-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load local storage data', e);
    }
  }, []);

  const saveHooks = (newHooks: GeneratedHook[]) => {
    // Keep only last 50 hooks to prevent local storage bloat
    const allHooks = [...newHooks, ...hooks].slice(0, 50);
    setHooks(allHooks);
    localStorage.setItem('ai-hooks-history', JSON.stringify(allHooks));
    
    // Update stats
    const today = new Date().toDateString();
    const newStats = {
      ...stats,
      generationsToday: (stats.lastGenerationDate === today ? stats.generationsToday : 0) + 1,
      totalGenerations: stats.totalGenerations + 1,
      lastGenerationDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-hooks-stats', JSON.stringify(newStats));
  };

  const deleteHook = (id: string) => {
    const newHooks = hooks.filter(h => h.id !== id);
    setHooks(newHooks);
    localStorage.setItem('ai-hooks-history', JSON.stringify(newHooks));
  };

  return {
    hooks,
    stats,
    saveHooks,
    deleteHook
  };
}
