import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface AdCopyFormData {
  product: string;
  usp: string;
  audience: string;
  painPoint: string;
  platform: string;
  adFormat: string;
  tone: string;
  goal: string;
  specialOffer: string;
}

export interface AdCopyDraft {
  id: string;
  product: string;
  platform: string;
  adContent: string;
  formData: AdCopyFormData;
  createdAt: string;
  updatedAt: string;
}

const formDataSchema = z.object({
  product: z.string(),
  usp: z.string(),
  audience: z.string(),
  painPoint: z.string(),
  platform: z.string(),
  adFormat: z.string(),
  tone: z.string(),
  goal: z.string(),
  specialOffer: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  product: z.string(),
  platform: z.string(),
  adContent: z.string(),
  formData: formDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const STORAGE_KEY = 'ai-ad-copy-v1';

export function useAdCopyStorage() {
  const [drafts, setDrafts] = useState<AdCopyDraft[]>([]);

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
      console.error('Failed to load ad copy storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<AdCopyDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDraft: AdCopyDraft = {
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
