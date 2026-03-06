import { useState, useEffect } from 'react';
import { z } from 'zod';

export interface GeneratedCTA {
  id: string;
  text: string;
  category: 'urgency' | 'benefit' | 'curiosity' | 'risk-free' | 'action';
  charCount: number;
  wordCount: number;
}

export interface CTAGenerationRecord {
  id: string;
  product: string;
  audience: string;
  goal: string;
  platform: string;
  tone: string;
  ctas: GeneratedCTA[];
  createdAt: string;
}

const ctaRecordSchema = z.object({
  id: z.string(),
  product: z.string(),
  audience: z.string(),
  goal: z.string(),
  platform: z.string(),
  tone: z.string(),
  ctas: z.array(z.object({
    id: z.string(),
    text: z.string(),
    category: z.enum(['urgency', 'benefit', 'curiosity', 'risk-free', 'action']),
    charCount: z.number(),
    wordCount: z.number(),
  })),
  createdAt: z.string(),
});

const statsSchema = z.object({
  generationsToday: z.number().default(0),
  totalGenerations: z.number().default(0),
  totalCTAs: z.number().default(0),
  lastGenerationDate: z.string().optional(),
});

type CTAStats = z.infer<typeof statsSchema>;

export function categorizeCTA(text: string): GeneratedCTA['category'] {
  const lower = text.toLowerCase();

  const urgencyWords = ['now', 'today', 'limited', 'hurry', 'before', 'last chance', "don't miss", 'expires', 'ending', 'act fast'];
  if (urgencyWords.some(w => lower.includes(w))) return 'urgency';

  const riskFreeWords = ['free', 'trial', 'guarantee', 'risk-free', 'no obligation', 'cancel', 'no credit card', 'money-back'];
  if (riskFreeWords.some(w => lower.includes(w))) return 'risk-free';

  const curiosityWords = ['discover', 'see how', 'find out', 'learn', 'secret', 'reveal', 'unlock', 'why'];
  if (curiosityWords.some(w => lower.includes(w))) return 'curiosity';

  const benefitWords = ['get', 'grow', 'boost', 'increase', 'improve', 'save', 'earn', 'achieve', 'better', 'more'];
  if (benefitWords.some(w => lower.includes(w))) return 'benefit';

  return 'action';
}

export function useCTAStorage() {
  const [history, setHistory] = useState<CTAGenerationRecord[]>([]);
  const [stats, setStats] = useState<CTAStats>({
    generationsToday: 0,
    totalGenerations: 0,
    totalCTAs: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-cta-history');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(ctaRecordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-cta-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = statsSchema.safeParse(parsed);
        if (validated.success) {
          const today = new Date().toDateString();
          if (validated.data.lastGenerationDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastGenerationDate = today;
            localStorage.setItem('ai-cta-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load CTA storage', e);
    }
  }, []);

  const saveGeneration = (record: CTAGenerationRecord) => {
    const allRecords = [record, ...history].slice(0, 20);
    setHistory(allRecords);
    localStorage.setItem('ai-cta-history', JSON.stringify(allRecords));

    const today = new Date().toDateString();
    const newStats: CTAStats = {
      generationsToday: (stats.lastGenerationDate === today ? stats.generationsToday : 0) + 1,
      totalGenerations: stats.totalGenerations + 1,
      totalCTAs: stats.totalCTAs + record.ctas.length,
      lastGenerationDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-cta-stats', JSON.stringify(newStats));
  };

  return { history, stats, saveGeneration };
}
