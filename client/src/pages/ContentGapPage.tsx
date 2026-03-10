import { ContentGapHero } from "@/components/ContentGapHero";
import { ContentGapGenerator } from "@/components/ContentGapGenerator";
import { ContentGapArticle } from "@/components/ContentGapArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { contentGapFAQs } from "@/lib/faqs-data";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ContentGapPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Content Gap Analyzer - Find Missing Topics & Outrank Competitors | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Paste your article + competitor content to discover missing topics, keyword gaps, and content opportunities. Better than paid SEO tools. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Content Gap Analyzer - Outrank Competitors | Browser AI Tools",
      "og:description": "AI-powered content gap analysis. Find missing topics, keyword opportunities, and get a ready-to-use content brief. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-content-gap-analyzer",
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
            "name": "AI Content Gap Analyzer",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered content gap analyzer that compares your article against competitors to find missing topics, keyword opportunities, and content improvements. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Content Gap Analyzer" icon={Search} />

      <div className="pb-12">
        <ContentGapHero />
        <AdBlock slot="content-gap-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContentGapGenerator />
        </motion.div>
      </div>

      <AdBlock slot="content-gap-mid" format="horizontal" className="mb-10" />

      <ContentGapArticle />

      <ToolFAQ toolName="AI Content Gap Analyzer" faqs={contentGapFAQs} />

      <AdBlock slot="content-gap-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={contentGapFAQs} toolName="AI Content Gap Analyzer" toolDescription="Paste your article + competitor content to discover missing topics, keyword gaps, and content opportunities. Better than paid SEO tools. 100% private and free." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Content Gap Analyzer" currentCategory="BusinessApplication" />

      <ShareResultButtons toolName="AI Content Gap Analyzer" />
    </>
  );
}
