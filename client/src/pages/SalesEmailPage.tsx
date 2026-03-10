import { SalesEmailHero } from "@/components/SalesEmailHero";
import { SalesEmailGenerator } from "@/components/SalesEmailGenerator";
import { SalesEmailArticle } from "@/components/SalesEmailArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { salesEmailFAQs } from "@/lib/faqs-data";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SalesEmailPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Sales Email Generator - Write Cold Emails That Get Responses | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered sales email generator. Create 5 personalized cold outreach emails with subject line optimization, spam risk scoring, and response predictions. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Sales Email Generator - Cold Outreach That Converts | Browser AI Tools",
      "og:description": "Generate 5 personalized sales email variations with AI. Subject line optimization, spam analysis, response probability. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-sales-email-generator",
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
            "name": "AI Sales Email Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered sales email generator. Create personalized cold outreach emails with subject line optimization, spam risk scoring, and response predictions. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Sales Email Generator" icon={Mail} />

      <div className="pb-12">
        <SalesEmailHero />
        <AdBlock slot="sales-email-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SalesEmailGenerator />
        </motion.div>
      </div>

      <AdBlock slot="sales-email-mid" format="horizontal" className="mb-10" />

      <SalesEmailArticle />

      <ToolFAQ toolName="AI Sales Email Generator" faqs={salesEmailFAQs} />

      <AdBlock slot="sales-email-bottom" format="horizontal" className="mt-10" />

      <ToolSchema faqs={salesEmailFAQs} toolName="AI Sales Email Generator" toolDescription="AI-powered sales email generator. Create 5 personalized cold outreach emails with subject line optimization, spam risk scoring, and response predictions. 100% private and free." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Sales Email Generator" currentCategory="BusinessApplication" />

      <ShareResultButtons toolName="AI Sales Email Generator" />
    </>
  );
}
