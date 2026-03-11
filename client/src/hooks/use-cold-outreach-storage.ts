import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface ColdOutreachFormData {
  yourRole: string;
  yourCompany: string;
  recipientRole: string;
  recipientCompany: string;
  howFound: string;
  purpose: string;
  valueContext: string;
  messageFormat: string;
  tone: string;
  messageLength: string;
}

export interface ColdOutreachDraft {
  id: string;
  recipientRole: string;
  purpose: string;
  outreachContent: string;
  formData: ColdOutreachFormData;
  createdAt: string;
  updatedAt: string;
}

const formDataSchema = z.object({
  yourRole: z.string(),
  yourCompany: z.string(),
  recipientRole: z.string(),
  recipientCompany: z.string(),
  howFound: z.string(),
  purpose: z.string(),
  valueContext: z.string(),
  messageFormat: z.string(),
  tone: z.string(),
  messageLength: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  recipientRole: z.string(),
  purpose: z.string(),
  outreachContent: z.string(),
  formData: formDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const STORAGE_KEY = 'ai-cold-outreach-v1';

export function useColdOutreachStorage() {
  const [drafts, setDrafts] = useState<ColdOutreachDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load cold outreach storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<ColdOutreachDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDraft: ColdOutreachDraft = { ...draft, id: generateId(), createdAt: now, updatedAt: now };
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
