import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface MeetingFormData {
  notes: string;
  meetingType: string;
  meetingTitle: string;
  meetingDate: string;
  participants: string;
  summaryStyle: string;
  includeSections: string[];
}

export interface MeetingDraft {
  id: string;
  label: string;
  content: string;
  formData: MeetingFormData;
  createdAt: string;
}

const formSchema = z.object({
  notes: z.string(),
  meetingType: z.string(),
  meetingTitle: z.string(),
  meetingDate: z.string(),
  participants: z.string(),
  summaryStyle: z.string(),
  includeSections: z.array(z.string()),
});

const draftSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
  formData: formSchema,
  createdAt: z.string(),
});

const STORAGE_KEY = 'ai-meeting-summary-v1';

export function useMeetingStorage() {
  const [drafts, setDrafts] = useState<MeetingDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) setDrafts(validated.data);
      }
    } catch (e) {
      console.error('Failed to load meeting storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<MeetingDraft, 'id' | 'createdAt'>) => {
    const newDraft: MeetingDraft = { ...draft, id: generateId(), createdAt: new Date().toISOString() };
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
