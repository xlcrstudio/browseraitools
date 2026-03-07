import { BusinessIdeaHero } from "@/components/BusinessIdeaHero";
import { BusinessIdeaGenerator } from "@/components/BusinessIdeaGenerator";
import { BusinessIdeaArticle } from "@/components/BusinessIdeaArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { businessIdeaGeneratorFAQs } from "@/lib/faqs-data";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function BusinessIdeaGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Business Idea Generator - Discover Profitable Ideas | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate 15+ personalized business ideas with viability scores and action plans. AI-powered, free, and private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Business Idea Generator - Browser AI Tools",
      "og:description": "Generate personalized business ideas with viability scores, action plans, and revenue models. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-business-idea-generator",
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
            "name": "AI Business Idea Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered business idea generator. Get personalized, viable business ideas with action plans. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Business Idea Generator" icon={Lightbulb} />

      <div className="pb-12">
        <BusinessIdeaHero />
        <AdBlock slot="business-idea-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BusinessIdeaGenerator />
        </motion.div>
      </div>

      <AdBlock slot="business-idea-mid" format="horizontal" className="mb-10" />

      <BusinessIdeaArticle />

      <ToolFAQ toolName="AI Business Idea Generator" faqs={businessIdeaGeneratorFAQs} />

      <AdBlock slot="business-idea-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
