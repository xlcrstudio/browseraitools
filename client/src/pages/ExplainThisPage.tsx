import { ExplainThisHero } from "@/components/ExplainThisHero";
import { ExplainThisGenerator } from "@/components/ExplainThisGenerator";
import { ExplainThisArticle } from "@/components/ExplainThisArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { explainThisFAQs } from "@/lib/faqs-data";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ExplainThisPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Explain This - Universal Text Explainer | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Understand any complex text instantly with AI. Get simple, ELI5, step-by-step, analogy, technical, or academic explanations. 100% private in your browser. Free and unlimited.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Explain This - Universal Text Explainer | Browser AI Tools",
      "og:description": "Paste any confusing text and get instant, clear explanations. Works for textbooks, contracts, medical info, technical docs - anything. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/explain-this-ai",
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
            "name": "AI Explain This",
            "applicationCategory": "EducationalApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered universal text explainer. Get simple, ELI5, step-by-step, analogy, technical, or academic explanations of any text. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Explain This" icon={Lightbulb} />

      <div className="pb-12">
        <ExplainThisHero />
        <AdBlock slot="explain-this-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ExplainThisGenerator />
        </motion.div>
      </div>

      <AdBlock slot="explain-this-mid" format="horizontal" className="mb-10" />

      <ExplainThisArticle />

      <ToolFAQ toolName="AI Explain This" faqs={explainThisFAQs} />

      <AdBlock slot="explain-this-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
