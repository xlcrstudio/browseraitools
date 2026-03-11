import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface LandingPageFormData {
  productName: string;
  description: string;
  mainBenefit: string;
  audiences: string[];
  painPoint: string;
  pageType: string;
  tone: string;
  userCount: string;
  rating: string;
  testimonial: string;
  companyLogos: string;
  successStats: string;
  guarantee: string;
}

export interface LandingPageDraft {
  id: string;
  productName: string;
  pageType: string;
  content: string;
  formData: LandingPageFormData;
  createdAt: string;
  updatedAt: string;
}

const formDataSchema = z.object({
  productName: z.string(),
  description: z.string(),
  mainBenefit: z.string(),
  audiences: z.array(z.string()),
  painPoint: z.string(),
  pageType: z.string(),
  tone: z.string(),
  userCount: z.string(),
  rating: z.string(),
  testimonial: z.string(),
  companyLogos: z.string(),
  successStats: z.string(),
  guarantee: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  productName: z.string(),
  pageType: z.string(),
  content: z.string(),
  formData: formDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const STORAGE_KEY = 'ai-landing-page-v1';

export function useLandingPageStorage() {
  const [drafts, setDrafts] = useState<LandingPageDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load landing page storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<LandingPageDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDraft: LandingPageDraft = { ...draft, id: generateId(), createdAt: now, updatedAt: now };
    const updated = [newDraft, ...drafts].slice(0, 10);
    setDrafts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { drafts, saveDraft, deleteDraft };
}
