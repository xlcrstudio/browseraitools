import { SchemaMarkupHero } from "@/components/SchemaMarkupHero";
import { SchemaMarkupGenerator } from "@/components/SchemaMarkupGenerator";
import { SchemaMarkupArticle } from "@/components/SchemaMarkupArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { schemaMarkupFAQs } from "@/lib/faqs-data";
import { Code } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SchemaMarkupPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Schema Markup Generator - JSON-LD for Rich Results | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate valid JSON-LD schema markup for any page type. FAQ, Article, Product, Recipe, HowTo & more. Copy-paste ready. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Schema Markup Generator - JSON-LD for Rich Results | Browser AI Tools",
      "og:description": "AI-powered schema markup generator. Create valid JSON-LD structured data for Google rich results. 15+ schema types. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-schema-markup-generator",
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
            "name": "AI Schema Markup Generator",
            "applicationCategory": "DeveloperApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered schema markup generator that creates valid JSON-LD structured data for Google rich results. Supports FAQ, Article, Product, Recipe, HowTo, and more. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Schema Markup Generator" icon={Code} />

      <div className="pb-12">
        <SchemaMarkupHero />
        <AdBlock slot="schema-markup-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SchemaMarkupGenerator />
        </motion.div>
      </div>

      <AdBlock slot="schema-markup-mid" format="horizontal" className="mb-10" />

      <SchemaMarkupArticle />

      <ToolFAQ toolName="AI Schema Markup Generator" faqs={schemaMarkupFAQs} />

      <AdBlock slot="schema-markup-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
