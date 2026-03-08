import { DocumentAnalyzerHero } from "@/components/DocumentAnalyzerHero";
import { DocumentAnalyzerGenerator } from "@/components/DocumentAnalyzerGenerator";
import { DocumentAnalyzerArticle } from "@/components/DocumentAnalyzerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { documentAnalyzerFAQs } from "@/lib/faqs-data";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function DocumentAnalyzerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Document Analyzer - Private PDF Summarizer | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Analyze PDFs and documents privately with AI. Get instant summaries, key insights, quotes, statistics, and study questions. 100% local, no uploads. Free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Document Analyzer - Private PDF Summarizer | Browser AI Tools",
      "og:description": "Upload PDFs or paste text for instant private analysis. Summaries, insights, quotes, action items. No server uploads. Runs 100% in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-document-analyzer",
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
            "name": "AI Document Analyzer",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered private document analyzer. Summarize PDFs, extract insights, quotes, statistics, and generate study questions. 100% local, no server uploads.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Document Analyzer" icon={FileText} />

      <div className="pb-12">
        <DocumentAnalyzerHero />
        <AdBlock slot="document-analyzer-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DocumentAnalyzerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="document-analyzer-mid" format="horizontal" className="mb-10" />

      <DocumentAnalyzerArticle />

      <ToolFAQ toolName="AI Document Analyzer" faqs={documentAnalyzerFAQs} />

      <AdBlock slot="document-analyzer-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
