import { SeoTitleHero } from "@/components/SeoTitleHero";
import { SeoTitleGenerator } from "@/components/SeoTitleGenerator";
import { SeoTitleArticle } from "@/components/SeoTitleArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { seoTitleFAQs } from "@/lib/faqs-data";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SeoTitlePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI SEO Title Generator - Click-Worthy Headlines | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate 10 SEO-optimized titles that rank on Google and drive clicks. Headline scoring, power words, character optimization. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI SEO Title Generator - Click-Worthy Headlines | Browser AI Tools",
      "og:description": "AI-powered SEO title generator. Create 10 click-worthy headlines with scoring, power words, and character optimization. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-seo-title-generator",
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
            "name": "AI SEO Title Generator",
            "applicationCategory": "SEOApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered SEO title generator that creates 10 click-worthy, optimized headlines with scoring and character counting. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI SEO Title Generator" icon={Tag} />

      <div className="pb-12">
        <SeoTitleHero />
        <AdBlock slot="seo-title-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SeoTitleGenerator />
        </motion.div>
      </div>

      <AdBlock slot="seo-title-mid" format="horizontal" className="mb-10" />

      <SeoTitleArticle />

      <ToolFAQ toolName="AI SEO Title Generator" faqs={seoTitleFAQs} />

      <AdBlock slot="seo-title-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={seoTitleFAQs} toolName="AI SEO Title Generator" toolDescription="Generate 10 SEO-optimized titles that rank on Google and drive clicks. Headline scoring, power words, character optimization. 100% private and free." category="BusinessApplication" />

      <RelatedTools currentToolName="AI SEO Title Generator" currentCategory="BusinessApplication" />

      <ShareResultButtons toolName="AI SEO Title Generator" />
    </>
  );
}
