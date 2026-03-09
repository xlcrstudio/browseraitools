import { useState, useEffect } from "react";
import { z } from "zod";

export interface TravelItinerary {
  id: string;
  destination: string;
  duration: number;
  budget: string;
  groupSize: number;
  interests: string[];
  travelStyle: string;
  mustSees: string;
  arrivalTime: string;
  itineraryContent: string;
  packingList: string;
  budgetBreakdown: string;
  rawText: string;
  createdAt: string;
}

const travelItinerarySchema = z.object({
  id: z.string(),
  destination: z.string(),
  duration: z.number(),
  budget: z.string(),
  groupSize: z.number(),
  interests: z.array(z.string()),
  travelStyle: z.string(),
  mustSees: z.string(),
  arrivalTime: z.string(),
  itineraryContent: z.string(),
  packingList: z.string(),
  budgetBreakdown: z.string(),
  rawText: z.string(),
  createdAt: z.string(),
});

export function useTravelPlannerStorage() {
  const [history, setHistory] = useState<TravelItinerary[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ai-travel-planner-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        const validated = z.array(travelItinerarySchema).safeParse(parsed);
        if (validated.success) setHistory(validated.data);
      }
    } catch (e) {
      console.error("Failed to load travel planner storage", e);
    }
  }, []);

  const saveTravelItinerary = (itinerary: TravelItinerary) => {
    const all = [itinerary, ...history].slice(0, 10);
    setHistory(all);
    localStorage.setItem("ai-travel-planner-history", JSON.stringify(all));
  };

  const deleteTravelItinerary = (id: string) => {
    const updated = history.filter((i) => i.id !== id);
    setHistory(updated);
    localStorage.setItem("ai-travel-planner-history", JSON.stringify(updated));
  };

  return { history, saveTravelItinerary, deleteTravelItinerary };
}
