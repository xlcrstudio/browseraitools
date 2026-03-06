import { z } from "zod";

// We define our pure client-side types here
export const hookSchema = z.object({
  id: z.string(),
  topic: z.string(),
  type: z.string(),
  tone: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export type GeneratedHook = z.infer<typeof hookSchema>;

export const userStatsSchema = z.object({
  generationsToday: z.number().default(0),
  totalGenerations: z.number().default(0),
  lastGenerationDate: z.string().optional(),
});

export type UserStats = z.infer<typeof userStatsSchema>;

// Dummy Drizzle definitions to keep any template imports happy without a real DB
import { pgTable, serial } from "drizzle-orm/pg-core";
export const dummyTable = pgTable("dummy", {
  id: serial("id").primaryKey(),
});
