import { InternalLinkHero } from "@/components/InternalLinkHero";
import { InternalLinkGenerator } from "@/components/InternalLinkGenerator";
import { InternalLinkArticle } from "@/components/InternalLinkArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { internalLinkFAQs } from "@/lib/faqs-data";
import { Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function InternalLinkPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Internal Link Suggestion Tool - SEO Site Structure | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered internal link suggestion tool. Analyze your content and get strategic internal linking recommendations with anchor text, placement context, and relevance scoring. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Internal Link Suggestion Tool - SEO Site Structure | Browser AI Tools",
      "og:description": "Build powerful internal linking structures with AI. Get anchor text suggestions, topical relevance scoring, and PageRank distribution analysis. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-internal-link-suggestion-tool",
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
            "name": "AI Internal Link Suggestion Tool",
            "applicationCategory": "SEOApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered internal link suggestion tool that analyzes page content and suggests strategic internal links with optimized anchor text. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Internal Link Suggestion Tool" icon={Link2} />

      <div className="pb-12">
        <InternalLinkHero />
        <AdBlock slot="internal-link-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InternalLinkGenerator />
        </motion.div>
      </div>

      <AdBlock slot="internal-link-mid" format="horizontal" className="mb-10" />

      <InternalLinkArticle />

      <ToolFAQ toolName="AI Internal Link Suggestion Tool" faqs={internalLinkFAQs} />

      <AdBlock slot="internal-link-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={internalLinkFAQs} />
    </>
  );
}
