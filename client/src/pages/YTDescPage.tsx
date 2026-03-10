import { YTDescHero } from "@/components/YTDescHero";
import { YTDescGenerator } from "@/components/YTDescGenerator";
import { YTDescArticle } from "@/components/YTDescArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { ytDescFAQs } from "@/lib/faqs-data";
import { FileEdit } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function YTDescPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI YouTube Description Generator - SEO-Optimized Descriptions | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered YouTube description generator. Get 3 SEO-optimized descriptions with timestamps, hashtags, and CTAs. Multiple lengths and video types. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI YouTube Description Generator - SEO-Optimized Descriptions | Browser AI Tools",
      "og:description": "Generate complete YouTube descriptions instantly. SEO scores, timestamps, hashtags, CTAs. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-youtube-description-generator",
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
            "name": "AI YouTube Description Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered YouTube description generator that creates SEO-optimized descriptions with timestamps, hashtags, and CTAs. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI YouTube Description Generator" icon={FileEdit} />

      <div className="pb-12">
        <YTDescHero />
        <AdBlock slot="ytdesc-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <YTDescGenerator />
        </motion.div>
      </div>

      <AdBlock slot="ytdesc-mid" format="horizontal" className="mb-10" />

      <YTDescArticle />

      <ToolFAQ toolName="AI YouTube Description Generator" faqs={ytDescFAQs} />

      <AdBlock slot="ytdesc-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={ytDescFAQs} toolName="AI YouTube Description Generator" toolDescription="AI-powered YouTube description generator. Get 3 SEO-optimized descriptions with timestamps, hashtags, and CTAs. Multiple lengths and video types. 100% privat..." />
    </>
  );
}
