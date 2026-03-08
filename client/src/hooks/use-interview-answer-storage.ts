import { useState, useEffect } from "react";
import { z } from "zod";

export interface InterviewAnswer {
  id: string;
  content: string;
  speakingTime: string;
  wordCount: number;
}

export interface StarBreakdown {
  situation: string;
  task: string;
  action: string;
  result: string;
  skillsDemonstrated: string[];
  metrics: string[];
}

export interface FollowUpQuestion {
  question: string;
  approach: string;
}

export interface DeliveryTip {
  category: string;
  tips: string[];
}

export interface InterviewAnswerRecord {
  id: string;
  question: string;
  jobTitle: string;
  industry: string;
  experienceLevel: string;
  answer: InterviewAnswer;
  starBreakdown: StarBreakdown | null;
  alternativeAngle: string;
  followUpQuestions: FollowUpQuestion[];
  deliveryTips: DeliveryTip[];
  strengthsShown: string[];
  favorites: string[];
  createdAt: string;
}

const answerSchema = z.object({
  id: z.string(),
  content: z.string(),
  speakingTime: z.string(),
  wordCount: z.number(),
});

const starSchema = z.object({
  situation: z.string(),
  task: z.string(),
  action: z.string(),
  result: z.string(),
  skillsDemonstrated: z.array(z.string()),
  metrics: z.array(z.string()),
});

const followUpSchema = z.object({
  question: z.string(),
  approach: z.string(),
});

const deliveryTipSchema = z.object({
  category: z.string(),
  tips: z.array(z.string()),
});

const recordSchema = z.object({
  id: z.string(),
  question: z.string(),
  jobTitle: z.string(),
  industry: z.string(),
  experienceLevel: z.string(),
  answer: answerSchema,
  starBreakdown: starSchema.nullable(),
  alternativeAngle: z.string(),
  followUpQuestions: z.array(followUpSchema),
  deliveryTips: z.array(deliveryTipSchema),
  strengthsShown: z.array(z.string()),
  favorites: z.array(z.string()),
  createdAt: z.string(),
});

export function useInterviewAnswerStorage() {
  const [history, setHistory] = useState<InterviewAnswerRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-interview-answer-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(recordSchema).safeParse(parsed);
        if (validated.success) {
          setHistory(validated.data);
        }
      }
    } catch (e) {
      console.error("Failed to load interview answer storage", e);
    }
  }, []);

  const saveAnswer = (record: InterviewAnswerRecord) => {
    const allRecords = [record, ...history].slice(0, 20);
    setHistory(allRecords);
    localStorage.setItem("ai-interview-answer-history", JSON.stringify(allRecords));
  };

  const toggleFavorite = (recordId: string, answerId: string) => {
    const updated = history.map((record) => {
      if (record.id !== recordId) return record;
      const isFav = record.favorites.includes(answerId);
      return {
        ...record,
        favorites: isFav
          ? record.favorites.filter((id) => id !== answerId)
          : [...record.favorites, answerId],
      };
    });
    setHistory(updated);
    localStorage.setItem("ai-interview-answer-history", JSON.stringify(updated));
  };

  return { history, saveAnswer, toggleFavorite };
}
