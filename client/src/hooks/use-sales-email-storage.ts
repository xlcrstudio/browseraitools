import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface SalesEmailFormData {
  product: string;
  targetCustomer: string;
  objective: string;
  tone: string;
  emailLength: string;
  personalizationFields: string;
}

export interface SalesEmailDraft {
  id: string;
  product: string;
  objective: string;
  emailContent: string;
  formData: SalesEmailFormData;
  createdAt: string;
  updatedAt: string;
}

const formDataSchema = z.object({
  product: z.string(),
  targetCustomer: z.string(),
  objective: z.string(),
  tone: z.string(),
  emailLength: z.string(),
  personalizationFields: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  product: z.string(),
  objective: z.string(),
  emailContent: z.string(),
  formData: formDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const STORAGE_KEY = 'ai-sales-emails-v1';

export function useSalesEmailStorage() {
  const [drafts, setDrafts] = useState<SalesEmailDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) {
          setDrafts(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load sales email storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<SalesEmailDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDraft: SalesEmailDraft = {
      ...draft,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const updatedDrafts = [newDraft, ...drafts].slice(0, 10);
    setDrafts(updatedDrafts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts));
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDrafts));
  };

  return { drafts, saveDraft, deleteDraft };
}
