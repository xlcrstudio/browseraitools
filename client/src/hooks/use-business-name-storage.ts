import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface BusinessNameFormData {
  businessType: string;
  namingStyle: string;
  keywords: string;
  lengthPref: string;
  domainExts: string[];
}

export interface BusinessNameDraft {
  id: string;
  label: string;
  content: string;
  formData: BusinessNameFormData;
  createdAt: string;
}

const formSchema = z.object({
  businessType: z.string(),
  namingStyle: z.string(),
  keywords: z.string(),
  lengthPref: z.string(),
  domainExts: z.array(z.string()),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-business-name-v1';

export function useBusinessNameStorage() {
  const [drafts, setDrafts] = useState<BusinessNameDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load business name storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<BusinessNameDraft, 'id' | 'createdAt'>) => {
    const newDraft: BusinessNameDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
