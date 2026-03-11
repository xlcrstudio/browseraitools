import { TargetAudienceHero } from "@/components/TargetAudienceHero";
import { TargetAudienceGenerator } from "@/components/TargetAudienceGenerator";
import { TargetAudienceArticle } from "@/components/TargetAudienceArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { targetAudienceFAQs } from "@/lib/faqs-data";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TargetAudiencePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Target Audience Generator - Buyer Personas | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered target audience generator. Get detailed buyer personas with demographics, psychographics, pain points, goals, and marketing strategies. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Target Audience Generator - Understand Your Ideal Customer | Browser AI Tools",
      "og:description": "Generate detailed buyer personas with demographics, psychographics, pain points, goals, and marketing channel recommendations. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-target-audience-generator",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Target Audience Generator", "applicationCategory": "BusinessApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered target audience generator. Get detailed buyer personas with demographics, psychographics, and marketing strategies. 100% private, runs locally in your browser." }) }} />

      <ToolPageHeader toolName="AI Target Audience Generator" icon={Users} />

      <div className="pb-12">
        <TargetAudienceHero />
        <AdBlock slot="target-audience-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <TargetAudienceGenerator />
        </motion.div>
      </div>

      <AdBlock slot="target-audience-mid" format="horizontal" className="mb-10" />
      <TargetAudienceArticle />
      <ToolFAQ toolName="AI Target Audience Generator" faqs={targetAudienceFAQs} />
      <AdBlock slot="target-audience-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={targetAudienceFAQs} toolName="AI Target Audience Generator" toolDescription="AI-powered target audience generator. Get detailed buyer personas with demographics, psychographics, pain points, goals, and marketing strategies. 100% private and free." category="BusinessApplication" />
      <RelatedTools currentToolName="AI Target Audience Generator" currentCategory="BusinessApplication" />
      <ShareResultButtons toolName="AI Target Audience Generator" />
    </>
  );
}
