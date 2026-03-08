import { EssayWriterHero } from "@/components/EssayWriterHero";
import { EssayWriterGenerator } from "@/components/EssayWriterGenerator";
import { EssayWriterArticle } from "@/components/EssayWriterArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { essayWriterFAQs } from "@/lib/faqs-data";
import { ScrollText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function EssayWriterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Essay Writer - Generate A+ Essays Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Write complete, well-structured essays in seconds with AI. Argumentative, expository, narrative, and more. Proper citations, academic levels from high school to PhD. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Essay Writer - Generate A+ Essays Instantly | Browser AI Tools",
      "og:description": "Generate complete essays with proper structure, thesis statements, and citations. Works for all academic levels. 100% private in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-essay-writer",
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
            "name": "AI Essay Writer",
            "applicationCategory": "EducationalApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered essay writer that generates complete, well-structured essays with proper citations. Supports all academic levels and essay types. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Essay Writer" icon={ScrollText} />

      <div className="pb-12">
        <EssayWriterHero />
        <AdBlock slot="essay-writer-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EssayWriterGenerator />
        </motion.div>
      </div>

      <AdBlock slot="essay-writer-mid" format="horizontal" className="mb-10" />

      <EssayWriterArticle />

      <ToolFAQ toolName="AI Essay Writer" faqs={essayWriterFAQs} />

      <AdBlock slot="essay-writer-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
