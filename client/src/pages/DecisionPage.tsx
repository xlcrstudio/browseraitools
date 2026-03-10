import { DecisionHero } from "@/components/DecisionHero";
import { DecisionGenerator } from "@/components/DecisionGenerator";
import { DecisionArticle } from "@/components/DecisionArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { decisionFAQs } from "@/lib/faqs-data";
import { Scale } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function DecisionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Decision Maker - Make Better Choices Faster | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered decision maker. Enter your options and get instant pros/cons analysis, confidence scoring, and a clear recommendation. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Decision Maker - Make Better Choices Faster | Browser AI Tools",
      "og:description": "Struggling with a choice? Get instant AI analysis with pros/cons, scoring, and recommendations. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-decision-maker",
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
            "name": "AI Decision Maker",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered decision maker that analyzes your options with pros/cons, confidence scoring, and clear recommendations. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Decision Maker" icon={Scale} />

      <div className="pb-12">
        <DecisionHero />
        <AdBlock slot="decision-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DecisionGenerator />
        </motion.div>
      </div>

      <AdBlock slot="decision-mid" format="horizontal" className="mb-10" />

      <DecisionArticle />

      <ToolFAQ toolName="AI Decision Maker" faqs={decisionFAQs} />

      <AdBlock slot="decision-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={decisionFAQs} toolName="AI Decision Maker" toolDescription="AI-powered decision maker. Enter your options and get instant pros/cons analysis, confidence scoring, and a clear recommendation. 100% private and free." />
    </>
  );
}
