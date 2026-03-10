import { ProsConsHero } from "@/components/ProsConsHero";
import { ProsConsGenerator } from "@/components/ProsConsGenerator";
import { ProsConsArticle } from "@/components/ProsConsArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { prosConsFAQs } from "@/lib/faqs-data";
import { ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ProsConsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Pros & Cons Generator - Make Smarter Decisions | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered pros and cons generator. Get balanced, objective analysis with Decision Score for any topic or choice. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Pros & Cons Generator - Make Smarter Decisions | Browser AI Tools",
      "og:description": "Get a perfectly balanced pros & cons analysis for any decision in seconds. Visual Decision Score, context-aware, 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-pros-and-cons-generator",
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
            "name": "AI Pros & Cons Generator",
            "applicationCategory": "UtilityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered pros and cons generator that creates balanced, objective analysis with a Decision Score for any topic. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Pros & Cons Generator" icon={ThumbsUp} />

      <div className="pb-12">
        <ProsConsHero />
        <AdBlock slot="proscons-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProsConsGenerator />
        </motion.div>
      </div>

      <AdBlock slot="proscons-mid" format="horizontal" className="mb-10" />

      <ProsConsArticle />

      <ToolFAQ toolName="AI Pros & Cons Generator" faqs={prosConsFAQs} />

      <AdBlock slot="proscons-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={prosConsFAQs} />
    </>
  );
}
