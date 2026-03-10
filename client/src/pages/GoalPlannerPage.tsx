import { GoalPlannerHero } from "@/components/GoalPlannerHero";
import { GoalPlannerGenerator } from "@/components/GoalPlannerGenerator";
import { GoalPlannerArticle } from "@/components/GoalPlannerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { goalPlannerFAQs } from "@/lib/faqs-data";
import { Flag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function GoalPlannerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Goal Planner - Turn Ambitions Into Action Plans | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered goal planner. Break any ambition into milestones, timelines, and weekly actions. Get a complete roadmap for achieving your biggest goals. 100% private and free - runs in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Goal Planner - Milestone Roadmaps | Browser AI Tools",
      "og:description": "Turn any goal into a step-by-step roadmap with milestones, weekly actions, and progress tracking. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-goal-planner",
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
            "name": "AI Goal Planner",
            "applicationCategory": "ProductivityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered goal planner that transforms ambitious goals into structured roadmaps with milestones, weekly actions, and progress tracking. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Goal Planner" icon={Flag} />

      <div className="pb-12">
        <GoalPlannerHero />
        <AdBlock slot="goal-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GoalPlannerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="goal-mid" format="horizontal" className="mb-10" />

      <GoalPlannerArticle />

      <ToolFAQ toolName="AI Goal Planner" faqs={goalPlannerFAQs} />

      <AdBlock slot="goal-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={goalPlannerFAQs} />
    </>
  );
}
