import { BusinessNameHero } from "@/components/BusinessNameHero";
import { BusinessNameGenerator } from "@/components/BusinessNameGenerator";
import { BusinessNameArticle } from "@/components/BusinessNameArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { businessNameFAQs } from "@/lib/faqs-data";
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function BusinessNamePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Business Name Generator - Brand Name Ideas | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered business name generator. Get 20+ creative name suggestions with brandability scores, pronunciation guides, and domain recommendations. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Business Name Generator - 20+ Brand Name Ideas | Browser AI Tools",
      "og:description": "Generate creative business names with brandability scoring, pronunciation guides, and domain suggestions. 5 naming styles. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-business-name-generator",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Business Name Generator", "applicationCategory": "BusinessApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered business name generator. Get 20+ creative name suggestions with brandability scores and domain recommendations. 100% private, runs locally in your browser." }) }} />

      <ToolPageHeader toolName="AI Business Name Generator" icon={Building2} />

      <div className="pb-12">
        <BusinessNameHero />
        <AdBlock slot="business-name-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <BusinessNameGenerator />
        </motion.div>
      </div>

      <AdBlock slot="business-name-mid" format="horizontal" className="mb-10" />
      <BusinessNameArticle />
      <ToolFAQ toolName="AI Business Name Generator" faqs={businessNameFAQs} />
      <AdBlock slot="business-name-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={businessNameFAQs} toolName="AI Business Name Generator" toolDescription="AI-powered business name generator. Get 20+ creative name suggestions with brandability scores, pronunciation guides, and domain recommendations. 100% private and free." category="BusinessApplication" />
      <RelatedTools currentToolName="AI Business Name Generator" currentCategory="BusinessApplication" />
      <ShareResultButtons toolName="AI Business Name Generator" />
    </>
  );
}
