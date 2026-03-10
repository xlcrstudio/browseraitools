import { HashtagHero } from "@/components/HashtagHero";
import { HashtagGenerator } from "@/components/HashtagGenerator";
import { HashtagArticle } from "@/components/HashtagArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { hashtagGeneratorFAQs } from "@/lib/faqs-data";
import { Hash } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function HashtagGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Hashtag Generator - Instagram, TikTok, LinkedIn & Twitter | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate 30 optimized hashtags for Instagram, TikTok, LinkedIn, and Twitter in seconds. Platform-specific strategies, volume categories, copy-paste ready. Free and private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Hashtag Generator - Browser AI Tools",
      "og:description": "Generate platform-optimized hashtag sets for Instagram, TikTok, LinkedIn & Twitter. Categorized by volume, copy-paste ready. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-hashtag-generator",
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
            "name": "AI Hashtag Generator",
            "applicationCategory": "SocialMediaApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered hashtag generator for Instagram, TikTok, LinkedIn & Twitter. Get platform-optimized hashtag sets categorized by volume. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Hashtag Generator" icon={Hash} />

      <div className="pb-12">
        <HashtagHero />
        <AdBlock slot="hashtag-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HashtagGenerator />
        </motion.div>
      </div>

      <AdBlock slot="hashtag-mid" format="horizontal" className="mb-10" />

      <HashtagArticle />

      <ToolFAQ toolName="AI Hashtag Generator" faqs={hashtagGeneratorFAQs} />

      <AdBlock slot="hashtag-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={hashtagGeneratorFAQs} toolName="AI Hashtag Generator" toolDescription="Generate 30 optimized hashtags for Instagram, TikTok, LinkedIn, and Twitter in seconds. Platform-specific strategies, volume categories, copy-paste ready. Fr..." />

      <RelatedTools currentToolName="AI Hashtag Generator" currentCategory="ProductivityApplication" />

      <ShareResultButtons toolName="AI Hashtag Generator" />
    </>
  );
}
