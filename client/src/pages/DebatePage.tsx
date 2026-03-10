import { DebateHero } from "@/components/DebateHero";
import { DebateGenerator } from "@/components/DebateGenerator";
import { DebateArticle } from "@/components/DebateArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { debateFAQs } from "@/lib/faqs-data";
import { Swords } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function DebatePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Debate Generator - Balanced Pro & Con Arguments | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered debate argument generator. Get balanced Pro and Con arguments, rebuttals, and evidence suggestions for any topic. School to professional levels. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Debate Generator - Pro & Con Arguments | Browser AI Tools",
      "og:description": "Generate balanced debate arguments instantly. Pro and Con perspectives, rebuttals, evidence suggestions. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-debate-generator",
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
            "name": "AI Debate Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered debate generator that creates balanced Pro and Con arguments with rebuttals and evidence suggestions. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Debate Generator" icon={Swords} />

      <div className="pb-12">
        <DebateHero />
        <AdBlock slot="debate-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DebateGenerator />
        </motion.div>
      </div>

      <AdBlock slot="debate-mid" format="horizontal" className="mb-10" />

      <DebateArticle />

      <ToolFAQ toolName="AI Debate Generator" faqs={debateFAQs} />

      <AdBlock slot="debate-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={debateFAQs} toolName="AI Debate Generator" toolDescription="AI-powered debate argument generator. Get balanced Pro and Con arguments, rebuttals, and evidence suggestions for any topic. School to professional levels. 1..." />

      <RelatedTools currentToolName="AI Debate Generator" currentCategory="ProductivityApplication" />
    </>
  );
}
