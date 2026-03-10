import { ATSHero } from "@/components/ATSHero";
import { ATSGenerator } from "@/components/ATSGenerator";
import { ATSArticle } from "@/components/ATSArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { atsFAQs } from "@/lib/faqs-data";
import { ScanSearch } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ATSMatcherPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI ATS Resume Matcher - Exact Match Score & Missing Keywords | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered ATS resume matcher. Get your exact match score, missing keywords, missing skills, and actionable improvement tips. 100% private and free - runs in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI ATS Resume Matcher - Score & Keywords | Browser AI Tools",
      "og:description": "See your exact ATS match percentage, missing keywords and skills instantly. 100% private, runs in your browser. Free with no limits.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-ats-resume-matcher",
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
            "name": "AI ATS Resume Matcher",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered ATS resume matcher that shows your exact match score, missing keywords, missing skills, and actionable improvement suggestions. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI ATS Resume Matcher" icon={ScanSearch} />

      <div className="pb-12">
        <ATSHero />
        <AdBlock slot="ats-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ATSGenerator />
        </motion.div>
      </div>

      <AdBlock slot="ats-mid" format="horizontal" className="mb-10" />

      <ATSArticle />

      <ToolFAQ toolName="AI ATS Resume Matcher" faqs={atsFAQs} />

      <AdBlock slot="ats-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
