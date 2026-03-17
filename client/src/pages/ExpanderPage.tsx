import { ExpanderHero } from "@/components/ExpanderHero";
import { ExpanderGenerator } from "@/components/ExpanderGenerator";
import { ExpanderArticle } from "@/components/ExpanderArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { sentenceExpanderFAQs } from "@/lib/faqs-data";
import { Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ExpanderPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Sentence Expander - Turn Short Sentences Into Detailed Writing | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered sentence expander. Turn short sentences into detailed, comprehensive writing. 3 expansion levels, multiple versions, enhancement options. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Sentence Expander - Expand Short Sentences | Browser AI Tools",
      "og:description": "Transform brief ideas into comprehensive writing. 3 expansion levels, optional examples, context, and statistics. Multiple versions with length tracking. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-sentence-expander",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Sentence Expander", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered sentence expander. Turn short sentences into detailed writing with context, examples, and multiple versions. 100% private." }) }} />

      <ToolPageHeader toolName="AI Sentence Expander" icon={Maximize2} />

      <div className="pb-12">
        <ExpanderHero />
        <AdBlock slot="expander-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <ExpanderGenerator />
        </motion.div>
      </div>

      <AdBlock slot="expander-mid" format="horizontal" className="mb-10" />
      <ExpanderArticle />
      <ToolFAQ toolName="AI Sentence Expander" faqs={sentenceExpanderFAQs} />
      <AdBlock slot="expander-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={sentenceExpanderFAQs} toolName="AI Sentence Expander" toolDescription="AI-powered sentence expander. Turn short sentences into detailed, comprehensive writing with multiple versions and expansion analysis. 100% private and free." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Sentence Expander" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Sentence Expander" />
    </>
  );
}
