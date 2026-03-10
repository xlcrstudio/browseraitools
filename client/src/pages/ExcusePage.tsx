import { ExcuseHero } from "@/components/ExcuseHero";
import { ExcuseGenerator } from "@/components/ExcuseGenerator";
import { ExcuseArticle } from "@/components/ExcuseArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { excuseFAQs } from "@/lib/faqs-data";
import { ShieldQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ExcusePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Excuse Generator - Funny, Professional & Dramatic Excuses | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered excuse generator. Get 5 creative, believable excuses for any situation. Funny, professional, or dramatic styles. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Excuse Generator - Funny, Professional & Dramatic Excuses | Browser AI Tools",
      "og:description": "Need a quick excuse? Get 5 hilarious, professional, or dramatic excuses instantly. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-excuse-generator",
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
            "name": "AI Excuse Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered excuse generator that creates 5 creative, believable excuses for any situation. Funny, professional, or dramatic styles. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Excuse Generator" icon={ShieldQuestion} />

      <div className="pb-12">
        <ExcuseHero />
        <AdBlock slot="excuse-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ExcuseGenerator />
        </motion.div>
      </div>

      <AdBlock slot="excuse-mid" format="horizontal" className="mb-10" />

      <ExcuseArticle />

      <ToolFAQ toolName="AI Excuse Generator" faqs={excuseFAQs} />

      <AdBlock slot="excuse-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={excuseFAQs} toolName="AI Excuse Generator" toolDescription="AI-powered excuse generator. Get 5 creative, believable excuses for any situation. Funny, professional, or dramatic styles. 100% private and free." category="EntertainmentApplication" />

      <RelatedTools currentToolName="AI Excuse Generator" currentCategory="EntertainmentApplication" />
    </>
  );
}
