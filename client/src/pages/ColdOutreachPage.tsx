import { ColdOutreachHero } from "@/components/ColdOutreachHero";
import { ColdOutreachGenerator } from "@/components/ColdOutreachGenerator";
import { ColdOutreachArticle } from "@/components/ColdOutreachArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { coldOutreachFAQs } from "@/lib/faqs-data";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ColdOutreachPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Cold Outreach Generator - Personalized Networking Messages | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered cold outreach generator. Get 5 personalized message variations for LinkedIn and email. Relationship-first approach with response scoring. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Cold Outreach Generator - Network Smarter | Browser AI Tools",
      "og:description": "Generate 5 personalized cold outreach messages for LinkedIn and email. Authentic, non-salesy approach with response probability scoring. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-cold-outreach-generator",
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
            "name": "AI Cold Outreach Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered cold outreach generator. Get 5 personalized message variations for LinkedIn and email with response scoring. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Cold Outreach Generator" icon={MessageSquare} />

      <div className="pb-12">
        <ColdOutreachHero />
        <AdBlock slot="cold-outreach-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ColdOutreachGenerator />
        </motion.div>
      </div>

      <AdBlock slot="cold-outreach-mid" format="horizontal" className="mb-10" />

      <ColdOutreachArticle />

      <ToolFAQ toolName="AI Cold Outreach Generator" faqs={coldOutreachFAQs} />

      <AdBlock slot="cold-outreach-bottom" format="horizontal" className="mt-10" />

      <ToolSchema faqs={coldOutreachFAQs} toolName="AI Cold Outreach Generator" toolDescription="AI-powered cold outreach message generator. Get 5 personalized variations for LinkedIn and email with response probability scoring. 100% private and free." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Cold Outreach Generator" currentCategory="BusinessApplication" />

      <ShareResultButtons toolName="AI Cold Outreach Generator" />
    </>
  );
}
