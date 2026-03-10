import { useState, useEffect } from "react";
import { z } from "zod";

export interface IGBioResult {
  id: string;
  name: string;
  whatYouDo: string;
  niche: string;
  bioStyle: string;
  emojiUsage: string;
  location: string;
  locationPin: boolean;
  uniqueQualities: string;
  includeElements: string[];
  linkInBioText: string;
  useLineBreaks: boolean;
  useSymbols: boolean;
  bios: string;
  rawText: string;
  createdAt: string;
}

const igBioResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  whatYouDo: z.string(),
  niche: z.string(),
  bioStyle: z.string(),
  emojiUsage: z.string(),
  location: z.string(),
  locationPin: z.boolean(),
  uniqueQualities: z.string(),
  includeElements: z.array(z.string()),
  linkInBioText: z.string(),
  useLineBreaks: z.boolean(),
  useSymbols: z.boolean(),
  bios: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useIGBioStorage() {
  const [history, setHistory] = useState<IGBioResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-ig-bio-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(igBioResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load ig bio storage", e);
    }
  }, []);

  const saveBio = (result: IGBioResult) => {
    const all = [result, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-ig-bio-history", JSON.stringify(all));
  };

  const deleteBio = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-ig-bio-history", JSON.stringify(updated));
  };

  return { history, saveBio, deleteBio };
}
