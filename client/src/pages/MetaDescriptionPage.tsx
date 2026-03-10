import { MetaDescriptionHero } from "@/components/MetaDescriptionHero";
import { MetaDescriptionGenerator } from "@/components/MetaDescriptionGenerator";
import { MetaDescriptionArticle } from "@/components/MetaDescriptionArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { metaDescriptionFAQs } from "@/lib/faqs-data";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function MetaDescriptionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Meta Description Generator - SEO Optimized | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate SEO-optimized meta descriptions that boost click-through rates. 5 variations per generation with character counting, keyword integration, and Google preview. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Meta Description Generator - SEO Optimized | Browser AI Tools",
      "og:description": "AI-powered meta description generator. Create 5 compelling variations with SEO scoring and Google preview. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-meta-description-generator",
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
            "name": "AI Meta Description Generator",
            "applicationCategory": "SEOApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered meta description generator that creates SEO-optimized descriptions with character counting, keyword integration, and Google preview. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Meta Description Generator" icon={Search} />

      <div className="pb-12">
        <MetaDescriptionHero />
        <AdBlock slot="meta-description-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MetaDescriptionGenerator />
        </motion.div>
      </div>

      <AdBlock slot="meta-description-mid" format="horizontal" className="mb-10" />

      <MetaDescriptionArticle />

      <ToolFAQ toolName="AI Meta Description Generator" faqs={metaDescriptionFAQs} />

      <AdBlock slot="meta-description-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={metaDescriptionFAQs} toolName="AI Meta Description Generator" toolDescription="Generate SEO-optimized meta descriptions that boost click-through rates. 5 variations per generation with character counting, keyword integration, and Google..." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Meta Description Generator" currentCategory="BusinessApplication" />
    </>
  );
}
