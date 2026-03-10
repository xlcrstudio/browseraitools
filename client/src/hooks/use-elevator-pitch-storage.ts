import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface ElevatorPitchFormData {
  business: string;
  audience: string;
  stage: string;
  uniqueAngle: string;
  traction: string;
  desiredOutcome: string;
}

export interface ElevatorPitchDraft {
  id: string;
  business: string;
  audience: string;
  pitchContent: string;
  formData: ElevatorPitchFormData;
  createdAt: string;
  updatedAt: string;
}

const formDataSchema = z.object({
  business: z.string(),
  audience: z.string(),
  stage: z.string(),
  uniqueAngle: z.string(),
  traction: z.string(),
  desiredOutcome: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  business: z.string(),
  audience: z.string(),
  pitchContent: z.string(),
  formData: formDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const STORAGE_KEY = 'ai-elevator-pitch-v1';

export function useElevatorPitchStorage() {
  const [drafts, setDrafts] = useState<ElevatorPitchDraft[]>([]);

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
      console.error('Failed to load elevator pitch storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<ElevatorPitchDraft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDraft: ElevatorPitchDraft = {
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
