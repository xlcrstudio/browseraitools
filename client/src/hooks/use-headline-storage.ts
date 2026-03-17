import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface HeadlineFormData {
  originalHeadline: string;
  style: string;
  platform: string;
}

export interface HeadlineDraft {
  id: string;
  label: string;
  content: string;
  formData: HeadlineFormData;
  createdAt: string;
}

const formSchema = z.object({
  originalHeadline: z.string(),
  style: z.string(),
  platform: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-headline-improver-v1';

export function useHeadlineStorage() {
  const [drafts, setDrafts] = useState<HeadlineDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load headline storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<HeadlineDraft, 'id' | 'createdAt'>) => {
    const newDraft: HeadlineDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
