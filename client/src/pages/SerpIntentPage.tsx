import { SerpIntentHero } from "@/components/SerpIntentHero";
import { SerpIntentGenerator } from "@/components/SerpIntentGenerator";
import { SerpIntentArticle } from "@/components/SerpIntentArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { serpIntentFAQs } from "@/lib/faqs-data";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SerpIntentPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI SERP Intent Analyzer - Search Intent Classification | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Analyze any keyword's search intent instantly. Classify as Informational, Navigational, Commercial, or Transactional. Get SERP patterns, title ideas, and People Also Ask insights. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI SERP Intent Analyzer - Search Intent Classification | Browser AI Tools",
      "og:description": "AI-powered SERP intent analyzer. Classify search intent, discover content patterns, get winning title ideas. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-serp-intent-analyzer",
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
            "name": "AI SERP Intent Analyzer",
            "applicationCategory": "SEOApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered SERP intent analyzer that classifies search intent, identifies content patterns, and generates winning title ideas. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI SERP Intent Analyzer" icon={Target} />

      <div className="pb-12">
        <SerpIntentHero />
        <AdBlock slot="serp-intent-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SerpIntentGenerator />
        </motion.div>
      </div>

      <AdBlock slot="serp-intent-mid" format="horizontal" className="mb-10" />

      <SerpIntentArticle />

      <ToolFAQ toolName="AI SERP Intent Analyzer" faqs={serpIntentFAQs} />

      <AdBlock slot="serp-intent-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={serpIntentFAQs} />
    </>
  );
}
