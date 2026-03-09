import { useState, useEffect } from "react";
import { z } from "zod";

export interface TweetResult {
  id: string;
  topic: string;
  style: string;
  maxLength: number;
  keywords: string;
  tweets: string;
  rawText: string;
  createdAt: string;
}

const tweetResultSchema = z.object({
  id: z.string(),
  topic: z.string(),
  style: z.string(),
  maxLength: z.number(),
  keywords: z.string(),
  tweets: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useTweetStorage() {
  const [history, setHistory] = useState<TweetResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-tweet-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(tweetResultSchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load tweet storage", e);
    }
  }, []);

  const saveTweet = (tweet: TweetResult) => {
    const all = [tweet, ...history].slice(0, 15);
    setHistory(all);
    localStorage.setItem("ai-tweet-history", JSON.stringify(all));
  };

  const deleteTweet = (id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-tweet-history", JSON.stringify(updated));
  };

  return { history, saveTweet, deleteTweet };
}
