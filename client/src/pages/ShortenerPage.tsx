import { ShortenerHero } from "@/components/ShortenerHero";
import { ShortenerGenerator } from "@/components/ShortenerGenerator";
import { ShortenerArticle } from "@/components/ShortenerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { sentenceShortenerFAQs } from "@/lib/faqs-data";
import { Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ShortenerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Sentence Shortener - Make Long Sentences Concise | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered sentence shortener. Make long sentences concise and clear. 3 shortening levels, tweet-length and headline versions, reduction analysis. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Sentence Shortener - Concise Writing Tool | Browser AI Tools",
      "og:description": "Shorten any sentence with AI. Standard, tweet-length, and headline versions. Wordiness detection and reduction tracking. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-sentence-shortener",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Sentence Shortener", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered sentence shortener. Make long sentences concise with multiple format outputs and reduction analysis. 100% private." }) }} />

      <ToolPageHeader toolName="AI Sentence Shortener" icon={Minimize2} />

      <div className="pb-12">
        <ShortenerHero />
        <AdBlock slot="shortener-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <ShortenerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="shortener-mid" format="horizontal" className="mb-10" />
      <ShortenerArticle />
      <ToolFAQ toolName="AI Sentence Shortener" faqs={sentenceShortenerFAQs} />
      <AdBlock slot="shortener-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={sentenceShortenerFAQs} toolName="AI Sentence Shortener" toolDescription="AI-powered sentence shortener. Make long sentences concise and clear with multiple format outputs and reduction analysis. 100% private and free." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Sentence Shortener" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Sentence Shortener" />
    </>
  );
}
