import { useState, useEffect } from 'react';
import { z } from 'zod';
import { generateId } from '@/lib/utils';

export interface CoverLetterFormData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  companyInfo: string;
  candidateName: string;
  currentJobTitle: string;
  yearsOfExperience: string;
  keySkills: string;
  whyThisJob: string;
  careerTransitionInfo: string;
  tone: string;
  length: string;
  specialConsiderations: string[];
  additionalNotes: string;
}

export interface CoverLetterDraft {
  id: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  letterContent: string;
  formData: CoverLetterFormData;
  createdAt: string;
  updatedAt: string;
}

const formDataSchema = z.object({
  jobTitle: z.string(),
  companyName: z.string(),
  jobDescription: z.string(),
  companyInfo: z.string(),
  candidateName: z.string(),
  currentJobTitle: z.string(),
  yearsOfExperience: z.string(),
  keySkills: z.string(),
  whyThisJob: z.string(),
  careerTransitionInfo: z.string(),
  tone: z.string(),
  length: z.string(),
  specialConsiderations: z.array(z.string()),
  additionalNotes: z.string(),
});

const draftSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  candidateName: z.string(),
  letterContent: z.string(),
  formData: formDataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const statsSchema = z.object({
  totalGenerated: z.number().default(0),
  generationsToday: z.number().default(0),
  lastDate: z.string().optional(),
});

type CoverLetterStats = z.infer<typeof statsSchema>;

export function useCoverLetterStorage() {
  const [drafts, setDrafts] = useState<CoverLetterDraft[]>([]);
  const [stats, setStats] = useState<CoverLetterStats>({
    totalGenerated: 0,
    generationsToday: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-cover-letter-drafts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(draftSchema).safeParse(parsed);
        if (validated.success) {
          setDrafts(validated.data);
        }
      }

      const storedStats = localStorage.getItem('ai-cover-letter-stats');
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        const validated = statsSchema.safeParse(parsed);
        if (validated.success) {
          const today = new Date().toDateString();
          if (validated.data.lastDate !== today) {
            validated.data.generationsToday = 0;
            validated.data.lastDate = today;
            localStorage.setItem('ai-cover-letter-stats', JSON.stringify(validated.data));
          }
          setStats(validated.data);
        }
      }
    } catch (e) {
      console.error('Failed to load cover letter storage', e);
    }
  }, []);

  const saveDraft = (draft: Omit<CoverLetterDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = new Date().toISOString();
    const existingIndex = draft.id ? drafts.findIndex(d => d.id === draft.id) : -1;

    let updatedDrafts: CoverLetterDraft[];

    if (existingIndex >= 0 && draft.id) {
      updatedDrafts = [...drafts];
      updatedDrafts[existingIndex] = {
        ...updatedDrafts[existingIndex],
        ...draft,
        id: draft.id,
        updatedAt: now,
      };
    } else {
      const newDraft: CoverLetterDraft = {
        ...draft,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      updatedDrafts = [newDraft, ...drafts].slice(0, 10);
    }

    setDrafts(updatedDrafts);
    localStorage.setItem('ai-cover-letter-drafts', JSON.stringify(updatedDrafts));

    const today = new Date().toDateString();
    const newStats: CoverLetterStats = {
      totalGenerated: stats.totalGenerated + (existingIndex >= 0 ? 0 : 1),
      generationsToday: (stats.lastDate === today ? stats.generationsToday : 0) + (existingIndex >= 0 ? 0 : 1),
      lastDate: today,
    };
    setStats(newStats);
    localStorage.setItem('ai-cover-letter-stats', JSON.stringify(newStats));
  };

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem('ai-cover-letter-drafts', JSON.stringify(updatedDrafts));
  };

  return { drafts, stats, saveDraft, deleteDraft };
}
