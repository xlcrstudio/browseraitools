import { CaptionHero } from "@/components/CaptionHero";
import { CaptionGenerator } from "@/components/CaptionGenerator";
import { CaptionArticle } from "@/components/CaptionArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { captionFAQs } from "@/lib/faqs-data";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CaptionPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Instagram Caption Generator - Viral Captions Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered Instagram caption generator. Get 5 viral, engaging captions with emojis, hashtags, and virality scoring. Funny, inspirational, promotional, casual, or aesthetic styles. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Instagram Caption Generator - Viral Captions Instantly | Browser AI Tools",
      "og:description": "Create scroll-stopping Instagram captions in seconds. 5 captions with virality scores, emojis, and hashtags. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-instagram-caption-generator",
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
            "name": "AI Instagram Caption Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered Instagram caption generator that creates 5 viral, engaging captions with emojis, hashtags, and virality scoring. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Instagram Caption Generator" icon={Instagram} />

      <div className="pb-12">
        <CaptionHero />
        <AdBlock slot="caption-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CaptionGenerator />
        </motion.div>
      </div>

      <AdBlock slot="caption-mid" format="horizontal" className="mb-10" />

      <CaptionArticle />

      <ToolFAQ toolName="AI Instagram Caption Generator" faqs={captionFAQs} />

      <AdBlock slot="caption-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={captionFAQs} toolName="AI Instagram Caption Generator" toolDescription="AI-powered Instagram caption generator. Get 5 viral, engaging captions with emojis, hashtags, and virality scoring. Funny, inspirational, promotional, casual..." category="EntertainmentApplication" />

      <RelatedTools currentToolName="AI Instagram Caption Generator" currentCategory="EntertainmentApplication" />
    </>
  );
}
