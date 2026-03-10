import { TikTokCaptionHero } from "@/components/TikTokCaptionHero";
import { TikTokCaptionGenerator } from "@/components/TikTokCaptionGenerator";
import { TikTokCaptionArticle } from "@/components/TikTokCaptionArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { tiktokCaptionGeneratorFAQs } from "@/lib/faqs-data";
import { Music2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TikTokCaptionGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI TikTok Caption Generator - Go Viral with Perfect Captions | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate viral TikTok captions with AI-powered hooks, hashtags, and CTAs. 5 caption variations optimized for the FYP. Free, private, instant.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI TikTok Caption Generator - Browser AI Tools",
      "og:description": "Create viral TikTok captions that get you on the FYP. AI-powered hooks, strategic hashtags, and engagement triggers. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-tiktok-caption-generator",
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
            "name": "AI TikTok Caption Generator",
            "applicationCategory": "SocialMediaApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered TikTok caption generator. Create viral captions with hooks, hashtags, and CTAs optimized for the FYP. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI TikTok Caption Generator" icon={Music2} />

      <div className="pb-12">
        <TikTokCaptionHero />
        <AdBlock slot="tiktok-caption-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TikTokCaptionGenerator />
        </motion.div>
      </div>

      <AdBlock slot="tiktok-caption-mid" format="horizontal" className="mb-10" />

      <TikTokCaptionArticle />

      <ToolFAQ toolName="AI TikTok Caption Generator" faqs={tiktokCaptionGeneratorFAQs} />

      <AdBlock slot="tiktok-caption-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={tiktokCaptionGeneratorFAQs} toolName="AI TikTok Caption Generator" toolDescription="Generate viral TikTok captions with AI-powered hooks, hashtags, and CTAs. 5 caption variations optimized for the FYP. Free, private, instant." category="EntertainmentApplication" />
    </>
  );
}
