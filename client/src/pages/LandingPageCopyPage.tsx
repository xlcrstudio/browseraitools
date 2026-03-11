import { LandingPageHero } from "@/components/LandingPageHero";
import { LandingPageGenerator } from "@/components/LandingPageGenerator";
import { LandingPageArticle } from "@/components/LandingPageArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { landingPageFAQs } from "@/lib/faqs-data";
import { Layout } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function LandingPageCopyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Landing Page Copy Generator - High-Converting Copy | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered landing page copy generator. Get complete hero sections, features, benefits, social proof, FAQs, and CTAs optimized for conversions. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Landing Page Copy Generator - Build Pages That Convert | Browser AI Tools",
      "og:description": "Generate complete, conversion-optimized landing page copy with AI. Hero headlines, features, benefits, social proof, FAQs, and CTAs. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-landing-page-copy-generator",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Landing Page Copy Generator", "applicationCategory": "BusinessApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered landing page copy generator. Get complete sections optimized for conversions. 100% private, runs locally in your browser." }) }} />

      <ToolPageHeader toolName="AI Landing Page Copy Generator" icon={Layout} />

      <div className="pb-12">
        <LandingPageHero />
        <AdBlock slot="landing-page-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <LandingPageGenerator />
        </motion.div>
      </div>

      <AdBlock slot="landing-page-mid" format="horizontal" className="mb-10" />
      <LandingPageArticle />
      <ToolFAQ toolName="AI Landing Page Copy Generator" faqs={landingPageFAQs} />
      <AdBlock slot="landing-page-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={landingPageFAQs} toolName="AI Landing Page Copy Generator" toolDescription="AI-powered landing page copy generator. Get complete hero sections, features, benefits, social proof, FAQs, and CTAs optimized for conversions. 100% private and free." category="BusinessApplication" />
      <RelatedTools currentToolName="AI Landing Page Copy Generator" currentCategory="BusinessApplication" />
      <ShareResultButtons toolName="AI Landing Page Copy Generator" />
    </>
  );
}
