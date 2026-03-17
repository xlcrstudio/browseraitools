import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface SimplifierFormData {
  sourceText: string;
  level: string;
  showExplanations: boolean;
}

export interface SimplifierDraft {
  id: string;
  label: string;
  content: string;
  formData: SimplifierFormData;
  createdAt: string;
}

const formSchema = z.object({
  sourceText: z.string(),
  level: z.string(),
  showExplanations: z.boolean(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-sentence-simplifier-v1';

export function useSimplifierStorage() {
  const [drafts, setDrafts] = useState<SimplifierDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load simplifier storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<SimplifierDraft, 'id' | 'createdAt'>) => {
    const newDraft: SimplifierDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
