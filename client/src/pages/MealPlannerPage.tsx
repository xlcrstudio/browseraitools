import { MealPlannerHero } from "@/components/MealPlannerHero";
import { MealPlannerGenerator } from "@/components/MealPlannerGenerator";
import { MealPlannerArticle } from "@/components/MealPlannerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { mealPlannerFAQs } from "@/lib/faqs-data";
import { UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function MealPlannerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Meal Planner & Grocery List Generator | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate personalized 7-day meal plans with recipes and organized grocery lists. Supports any diet, budget, and family size. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Meal Planner & Grocery List Generator | Browser AI Tools",
      "og:description": "AI-powered weekly meal plans with recipes and aisle-organized grocery lists. Keto, vegan, gluten-free, and more. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-meal-planner",
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
            "name": "AI Meal Planner & Grocery List Generator",
            "applicationCategory": "LifestyleApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered meal planner that generates personalized 7-day meal plans with recipes and organized grocery lists. Supports any diet. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Meal Planner" icon={UtensilsCrossed} />

      <div className="pb-12">
        <MealPlannerHero />
        <AdBlock slot="meal-planner-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MealPlannerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="meal-planner-mid" format="horizontal" className="mb-10" />

      <MealPlannerArticle />

      <ToolFAQ toolName="AI Meal Planner" faqs={mealPlannerFAQs} />

      <AdBlock slot="meal-planner-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={mealPlannerFAQs} toolName="AI Meal Planner" toolDescription="Generate personalized 7-day meal plans with recipes and organized grocery lists. Supports any diet, budget, and family size. 100% private and free." />

      <RelatedTools currentToolName="AI Meal Planner" currentCategory="ProductivityApplication" />

      <ShareResultButtons toolName="AI Meal Planner" />
    </>
  );
}
