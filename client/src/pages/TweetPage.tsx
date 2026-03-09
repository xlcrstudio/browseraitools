import { TweetHero } from "@/components/TweetHero";
import { TweetGenerator } from "@/components/TweetGenerator";
import { TweetArticle } from "@/components/TweetArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { tweetFAQs } from "@/lib/faqs-data";
import { Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TweetPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Tweet Generator - Write Viral X/Twitter Posts Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered tweet generator. Get 5 viral, engaging tweets with virality scoring and character limit control. Thought leadership, funny, informational, or motivational styles. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Tweet Generator - Write Viral X/Twitter Posts Instantly | Browser AI Tools",
      "og:description": "Write viral tweets in seconds. 5 tweets with virality scores, character counts, and X-style cards. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-tweet-generator",
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
            "name": "AI Tweet Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered tweet generator that creates 5 viral, engaging tweets with virality scoring and character limit control. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Tweet Generator" icon={Twitter} />

      <div className="pb-12">
        <TweetHero />
        <AdBlock slot="tweet-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TweetGenerator />
        </motion.div>
      </div>

      <AdBlock slot="tweet-mid" format="horizontal" className="mb-10" />

      <TweetArticle />

      <ToolFAQ toolName="AI Tweet Generator" faqs={tweetFAQs} />

      <AdBlock slot="tweet-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
