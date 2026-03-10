import { KeywordHero } from "@/components/KeywordHero";
import { KeywordGenerator } from "@/components/KeywordGenerator";
import { KeywordArticle } from "@/components/KeywordArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { keywordGeneratorFAQs } from "@/lib/faqs-data";
import { Key } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function KeywordGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Keyword Generator - Find SEO Keywords Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate 100+ SEO keyword ideas with search volume, difficulty scores, intent classification, and CPC estimates. AI-powered, free, and private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Keyword Generator - Browser AI Tools",
      "og:description": "Find high-value SEO keywords with search volume, difficulty, and intent analysis. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-keyword-generator",
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
            "name": "AI Keyword Generator",
            "applicationCategory": "SEOApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered keyword research tool. Get SEO keywords with search volume, difficulty scores, and intent classification. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Keyword Generator" icon={Key} />

      <div className="pb-12">
        <KeywordHero />
        <AdBlock slot="keyword-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <KeywordGenerator />
        </motion.div>
      </div>

      <AdBlock slot="keyword-mid" format="horizontal" className="mb-10" />

      <KeywordArticle />

      <ToolFAQ toolName="AI Keyword Generator" faqs={keywordGeneratorFAQs} />

      <AdBlock slot="keyword-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={keywordGeneratorFAQs} toolName="AI Keyword Generator" toolDescription="Generate 100+ SEO keyword ideas with search volume, difficulty scores, intent classification, and CPC estimates. AI-powered, free, and private." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Keyword Generator" currentCategory="BusinessApplication" />
    </>
  );
}
