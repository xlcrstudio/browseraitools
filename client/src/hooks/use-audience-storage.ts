import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface AudienceFormData {
  productDescription: string;
  valueProp: string;
  marketType: string;
  industry: string;
  pricePoint: string;
  productStage: string;
  customerInsights: string;
  competitors: string;
}

export interface AudienceDraft {
  id: string;
  label: string;
  content: string;
  formData: AudienceFormData;
  createdAt: string;
}

const formSchema = z.object({
  productDescription: z.string(),
  valueProp: z.string(),
  marketType: z.string(),
  industry: z.string(),
  pricePoint: z.string(),
  productStage: z.string(),
  customerInsights: z.string(),
  competitors: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-target-audience-v1';

export function useAudienceStorage() {
  const [drafts, setDrafts] = useState<AudienceDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load audience storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<AudienceDraft, 'id' | 'createdAt'>) => {
    const newDraft: AudienceDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
