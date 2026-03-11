import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface BulletFormData {
  sourceText: string;
  bulletStyle: string;
  iconStyle: string;
  includeSubPoints: boolean;
}

export interface BulletDraft {
  id: string;
  label: string;
  content: string;
  formData: BulletFormData;
  createdAt: string;
}

const formSchema = z.object({
  sourceText: z.string(),
  bulletStyle: z.string(),
  iconStyle: z.string(),
  includeSubPoints: z.boolean(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-bullet-points-v1';

export function useBulletStorage() {
  const [drafts, setDrafts] = useState<BulletDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load bullet storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<BulletDraft, 'id' | 'createdAt'>) => {
    const newDraft: BulletDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
