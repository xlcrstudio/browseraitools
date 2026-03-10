import { YTTitleHero } from "@/components/YTTitleHero";
import { YTTitleGenerator } from "@/components/YTTitleGenerator";
import { YTTitleArticle } from "@/components/YTTitleArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { ytTitleFAQs } from "@/lib/faqs-data";
import { Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function YTTitlePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI YouTube Title Generator - Click-Worthy Titles That Rank | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered YouTube title generator. Get 10 SEO-optimized, click-worthy titles with SEO scores and CTR predictions. Clickbait, informational, list, or curiosity styles. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI YouTube Title Generator - Click-Worthy Titles That Rank | Browser AI Tools",
      "og:description": "Generate viral YouTube titles instantly. 10 titles with SEO scores and CTR predictions. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-youtube-title-generator",
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
            "name": "AI YouTube Title Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered YouTube title generator that creates 10 SEO-optimized, click-worthy titles with SEO scores and CTR predictions. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI YouTube Title Generator" icon={Youtube} />

      <div className="pb-12">
        <YTTitleHero />
        <AdBlock slot="yttitle-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <YTTitleGenerator />
        </motion.div>
      </div>

      <AdBlock slot="yttitle-mid" format="horizontal" className="mb-10" />

      <YTTitleArticle />

      <ToolFAQ toolName="AI YouTube Title Generator" faqs={ytTitleFAQs} />

      <AdBlock slot="yttitle-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={ytTitleFAQs} toolName="AI YouTube Title Generator" toolDescription="AI-powered YouTube title generator. Get 10 SEO-optimized, click-worthy titles with SEO scores and CTR predictions. Clickbait, informational, list, or curiosi..." />

      <RelatedTools currentToolName="AI YouTube Title Generator" currentCategory="ProductivityApplication" />
    </>
  );
}
