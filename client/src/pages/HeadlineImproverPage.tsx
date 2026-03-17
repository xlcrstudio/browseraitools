import { HeadlineHero } from "@/components/HeadlineHero";
import { HeadlineGenerator } from "@/components/HeadlineGenerator";
import { HeadlineArticle } from "@/components/HeadlineArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { headlineImproverFAQs } from "@/lib/faqs-data";
import { Heading } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function HeadlineImproverPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Headline Improver - Turn Weak Headlines Into Click-Worthy Winners | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered headline improver. Transform boring headlines into compelling, high-engagement titles. 5 variations with click scores, emotional analysis, and A/B insights. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Headline Improver - Improve Any Headline | Browser AI Tools",
      "og:description": "Turn weak headlines into click-worthy winners. 6 headline styles, click scoring, emotional triggers, and platform optimization. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-headline-improver",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Headline Improver", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered headline improver. Transform weak headlines into compelling, high-engagement titles with click scoring and emotional analysis. 100% private." }) }} />

      <ToolPageHeader toolName="AI Headline Improver" icon={Heading} />

      <div className="pb-12">
        <HeadlineHero />
        <AdBlock slot="headline-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <HeadlineGenerator />
        </motion.div>
      </div>

      <AdBlock slot="headline-mid" format="horizontal" className="mb-10" />
      <HeadlineArticle />
      <ToolFAQ toolName="AI Headline Improver" faqs={headlineImproverFAQs} />
      <AdBlock slot="headline-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={headlineImproverFAQs} toolName="AI Headline Improver" toolDescription="AI-powered headline improver. Transform weak headlines into compelling, high-engagement titles with click scoring, emotional analysis, and A/B testing insights. 100% private and free." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Headline Improver" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Headline Improver" />
    </>
  );
}
