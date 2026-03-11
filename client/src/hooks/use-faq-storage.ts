import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface FAQFormData {
  topic: string;
  questionCount: number;
  answerLength: string;
  faqType: string;
}

export interface FAQDraft {
  id: string;
  label: string;
  content: string;
  formData: FAQFormData;
  createdAt: string;
}

const formSchema = z.object({
  topic: z.string(),
  questionCount: z.number(),
  answerLength: z.string(),
  faqType: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-faq-generator-v1';

export function useFAQStorage() {
  const [drafts, setDrafts] = useState<FAQDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load FAQ storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<FAQDraft, 'id' | 'createdAt'>) => {
    const newDraft: FAQDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
