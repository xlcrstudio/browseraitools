import { ValuePropHero } from "@/components/ValuePropHero";
import { ValuePropGenerator } from "@/components/ValuePropGenerator";
import { ValuePropArticle } from "@/components/ValuePropArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { valuePropFAQs } from "@/lib/faqs-data";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ValuePropPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Value Proposition Generator - Nail Your Core Message | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered value proposition generator. Get 5 variations in tagline, one-liner, detailed, problem-solution, and comparison formats with clarity scoring. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Value Proposition Generator - 5 Formats with Clarity Scoring | Browser AI Tools",
      "og:description": "Generate compelling value propositions in 5 formats with clarity scores and competitive differentiation analysis. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-value-proposition-generator",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Value Proposition Generator", "applicationCategory": "BusinessApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered value proposition generator. Get 5 variations with clarity scoring and competitive differentiation. 100% private, runs locally in your browser." }) }} />

      <ToolPageHeader toolName="AI Value Proposition Generator" icon={Target} />

      <div className="pb-12">
        <ValuePropHero />
        <AdBlock slot="value-prop-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <ValuePropGenerator />
        </motion.div>
      </div>

      <AdBlock slot="value-prop-mid" format="horizontal" className="mb-10" />
      <ValuePropArticle />
      <ToolFAQ toolName="AI Value Proposition Generator" faqs={valuePropFAQs} />
      <AdBlock slot="value-prop-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={valuePropFAQs} toolName="AI Value Proposition Generator" toolDescription="AI-powered value proposition generator. Get 5 variations in tagline, one-liner, detailed, problem-solution, and comparison formats with clarity scoring. 100% private and free." category="BusinessApplication" />
      <RelatedTools currentToolName="AI Value Proposition Generator" currentCategory="BusinessApplication" />
      <ShareResultButtons toolName="AI Value Proposition Generator" />
    </>
  );
}
