import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface RewriterFormData {
  originalText: string;
  rewriteStyle: string;
  rewriteStrength: string;
}

export interface RewriterDraft {
  id: string;
  label: string;
  content: string;
  formData: RewriterFormData;
  createdAt: string;
}

const formSchema = z.object({
  originalText: z.string(),
  rewriteStyle: z.string(),
  rewriteStrength: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-paragraph-rewriter-v1';

export function useRewriterStorage() {
  const [drafts, setDrafts] = useState<RewriterDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load rewriter storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<RewriterDraft, 'id' | 'createdAt'>) => {
    const newDraft: RewriterDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
