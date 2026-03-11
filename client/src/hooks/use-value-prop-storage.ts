import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface ValuePropFormData {
  product: string;
  audience: string;
  benefit: string;
  differentiator: string;
  industry: string;
}

export interface ValuePropDraft {
  id: string;
  label: string;
  content: string;
  formData: ValuePropFormData;
  createdAt: string;
}

const formSchema = z.object({
  product: z.string(),
  audience: z.string(),
  benefit: z.string(),
  differentiator: z.string(),
  industry: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-value-prop-v1';

export function useValuePropStorage() {
  const [drafts, setDrafts] = useState<ValuePropDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load value prop storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<ValuePropDraft, 'id' | 'createdAt'>) => {
    const newDraft: ValuePropDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
