import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface ExpanderFormData {
  sourceText: string;
  level: string;
  includeExamples: boolean;
  addContext: boolean;
  includeStats: boolean;
  addExpertPerspective: boolean;
}

export interface ExpanderDraft {
  id: string;
  label: string;
  content: string;
  formData: ExpanderFormData;
  createdAt: string;
}

const formSchema = z.object({
  sourceText: z.string(),
  level: z.string(),
  includeExamples: z.boolean(),
  addContext: z.boolean(),
  includeStats: z.boolean(),
  addExpertPerspective: z.boolean(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-sentence-expander-v1';

export function useExpanderStorage() {
  const [drafts, setDrafts] = useState<ExpanderDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load expander storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<ExpanderDraft, 'id' | 'createdAt'>) => {
    const newDraft: ExpanderDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
