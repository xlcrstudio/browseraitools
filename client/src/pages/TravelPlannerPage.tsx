import { TravelPlannerHero } from "@/components/TravelPlannerHero";
import { TravelPlannerGenerator } from "@/components/TravelPlannerGenerator";
import { TravelPlannerArticle } from "@/components/TravelPlannerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { travelPlannerFAQs } from "@/lib/faqs-data";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TravelPlannerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Travel Itinerary Planner - Perfect Trip Plan | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate complete day-by-day travel itineraries with timings, packing lists, and budget breakdowns. Works for any destination. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Travel Itinerary Planner - Perfect Trip Plan | Browser AI Tools",
      "og:description": "AI-powered travel planner that creates detailed day-by-day itineraries with transport, meals, packing lists, and budgets. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-travel-itinerary-planner",
    };

    for (const [name, content] of Object.entries(metaUpdates)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogUpdates)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Travel Itinerary Planner",
            "applicationCategory": "TravelApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered travel planner that generates complete day-by-day itineraries with transport, meals, packing lists, and budget breakdowns. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Travel Planner" icon={MapPin} />

      <div className="pb-12">
        <TravelPlannerHero />
        <AdBlock slot="travel-planner-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TravelPlannerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="travel-planner-mid" format="horizontal" className="mb-10" />

      <TravelPlannerArticle />

      <ToolFAQ toolName="AI Travel Planner" faqs={travelPlannerFAQs} />

      <AdBlock slot="travel-planner-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={travelPlannerFAQs} toolName="AI Travel Planner" toolDescription="Generate complete day-by-day travel itineraries with timings, packing lists, and budget breakdowns. Works for any destination. 100% private and free." />
    </>
  );
}
