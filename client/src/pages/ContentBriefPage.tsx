import { ContentBriefHero } from "@/components/ContentBriefHero";
import { ContentBriefGenerator } from "@/components/ContentBriefGenerator";
import { ContentBriefArticle } from "@/components/ContentBriefArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { contentBriefFAQs } from "@/lib/faqs-data";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ContentBriefPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Content Brief Generator - SEO Content Briefs | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered content brief generator. Create complete SEO briefs with keyword research, content structure, competitor analysis, and writer guidelines. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Content Brief Generator - SEO Content Briefs | Browser AI Tools",
      "og:description": "Create complete, SEO-optimized content briefs in minutes. Generate keyword research, content structure, competitor analysis, and writer guidance instantly. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-content-brief-generator",
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
            "name": "AI Content Brief Generator",
            "applicationCategory": "SEOApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered content brief generator that creates complete SEO briefs with keyword research, content structure, competitor analysis, and writer guidelines. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Content Brief Generator" icon={BookOpen} />

      <div className="pb-12">
        <ContentBriefHero />
        <AdBlock slot="content-brief-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContentBriefGenerator />
        </motion.div>
      </div>

      <AdBlock slot="content-brief-mid" format="horizontal" className="mb-10" />

      <ContentBriefArticle />

      <ToolFAQ toolName="AI Content Brief Generator" faqs={contentBriefFAQs} />

      <AdBlock slot="content-brief-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={contentBriefFAQs} toolName="AI Content Brief Generator" toolDescription="AI-powered content brief generator. Create complete SEO briefs with keyword research, content structure, competitor analysis, and writer guidelines. 100% pri..." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Content Brief Generator" currentCategory="BusinessApplication" />
    </>
  );
}
