import { WeeklyPlannerHero } from "@/components/WeeklyPlannerHero";
import { WeeklyPlannerGenerator } from "@/components/WeeklyPlannerGenerator";
import { WeeklyPlannerArticle } from "@/components/WeeklyPlannerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { weeklyPlannerFAQs } from "@/lib/faqs-data";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function WeeklyPlannerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Weekly Planner Generator - Plan Your Perfect Week | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered weekly planner generator. Create balanced, optimized weekly schedules with intelligent task distribution, energy optimization, and work-life balance. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Weekly Planner Generator - Optimized Schedules | Browser AI Tools",
      "og:description": "Create your perfect week with AI. Get balanced schedules, time-blocked tasks, and energy-optimized planning. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-weekly-planner-generator",
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
            "name": "AI Weekly Planner Generator",
            "applicationCategory": "ProductivityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered weekly planner that creates optimized schedules with intelligent task distribution, energy optimization, and work-life balance. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Weekly Planner Generator" icon={CalendarDays} />

      <div className="pb-12">
        <WeeklyPlannerHero />
        <AdBlock slot="weekly-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <WeeklyPlannerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="weekly-mid" format="horizontal" className="mb-10" />

      <WeeklyPlannerArticle />

      <ToolFAQ toolName="AI Weekly Planner Generator" faqs={weeklyPlannerFAQs} />

      <AdBlock slot="weekly-bottom" format="horizontal" className="mt-10" />

      <ToolSchema faqs={weeklyPlannerFAQs} toolName="AI Weekly Planner Generator" toolDescription="AI-powered weekly planner generator. Create balanced, optimized weekly schedules with intelligent task distribution, energy optimization, and work-life balan..." />

      <RelatedTools currentToolName="AI Weekly Planner Generator" currentCategory="ProductivityApplication" />
    </>
  );
}
