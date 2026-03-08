import { useState, useEffect } from "react";
import { z } from "zod";

export interface DatingProfile {
  id: string;
  age: number;
  gender: string;
  apps: string[];
  vibe: string;
  prompts: string;
  interests: string;
  lookingFor: string;
  photoDescriptions: string;
  tone: string;
  profileContent: string;
  openingLines: string;
  photoCaptions: string;
  rawText: string;
  createdAt: string;
}

const datingProfileSchema = z.object({
  id: z.string(),
  age: z.number(),
  gender: z.string(),
  apps: z.array(z.string()),
  vibe: z.string(),
  prompts: z.string(),
  interests: z.string(),
  lookingFor: z.string(),
  photoDescriptions: z.string(),
  tone: z.string(),
  profileContent: z.string(),
  openingLines: z.string(),
  photoCaptions: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useDatingProfileStorage() {
  const [history, setHistory] = useState<DatingProfile[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-dating-profile-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(datingProfileSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load dating profile storage", e);
    }
  }, []);

  const saveDatingProfile = (profile: DatingProfile) => {
    const all = [profile, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-dating-profile-history", JSON.stringify(all));
  };

  const deleteDatingProfile = (id: string) => {
    const updated = history.filter((p) => p.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-dating-profile-history", JSON.stringify(updated));
  };

  return { history, saveDatingProfile, deleteDatingProfile };
}
