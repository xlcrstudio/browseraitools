import { LinkedInSummaryHero } from "@/components/LinkedInSummaryHero";
import { LinkedInSummaryGenerator } from "@/components/LinkedInSummaryGenerator";
import { LinkedInSummaryArticle } from "@/components/LinkedInSummaryArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { linkedInSummaryFAQs } from "@/lib/faqs-data";
import { UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function LinkedInSummaryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI LinkedIn Summary Generator - Write Your About Section | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered LinkedIn summary generator. Create a powerful LinkedIn About section with 3 optimized versions, keyword integration, and LinkedIn scoring. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI LinkedIn Summary Generator - Write Your About Section | Browser AI Tools",
      "og:description": "Create a powerful LinkedIn About section that gets you noticed. Step-by-step profile builder generates 3 keyword-optimized versions. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-linkedin-summary-generator",
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
            "name": "AI LinkedIn Summary Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered LinkedIn summary generator that creates 3 optimized versions of your LinkedIn About section with keyword integration and scoring. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI LinkedIn Summary Generator" icon={UserCheck} />

      <div className="pb-12">
        <LinkedInSummaryHero />
        <AdBlock slot="linkedin-summary-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LinkedInSummaryGenerator />
        </motion.div>
      </div>

      <AdBlock slot="linkedin-summary-mid" format="horizontal" className="mb-10" />

      <LinkedInSummaryArticle />

      <ToolFAQ toolName="AI LinkedIn Summary Generator" faqs={linkedInSummaryFAQs} />

      <AdBlock slot="linkedin-summary-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={linkedInSummaryFAQs} toolName="AI LinkedIn Summary Generator" toolDescription="AI-powered LinkedIn summary generator. Create a powerful LinkedIn About section with 3 optimized versions, keyword integration, and LinkedIn scoring. 100% pr..." category="BusinessApplication" />
    </>
  );
}
