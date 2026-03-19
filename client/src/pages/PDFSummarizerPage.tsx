import { useEffect } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { PDFSummarizerHero } from "@/components/PDFSummarizerHero";
import { PDFSummarizerGenerator } from "@/components/PDFSummarizerGenerator";
import { PDFSummarizerArticle } from "@/components/PDFSummarizerArticle";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { pdfSummarizerFAQs } from "@/lib/faqs-data";

export default function PDFSummarizerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI PDF Summarizer — Summarize PDFs Privately | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered PDF summarizer that runs 100% in your browser. Upload any PDF and get instant summaries, key insights, and Q&A. Files never leave your device. Free and unlimited.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI PDF Summarizer — Private, Instant, Unlimited | Browser AI Tools",
      "og:description": "Summarize any PDF in seconds. Get key insights, bullet points, or executive summaries. Ask questions about your document. 100% private — files never uploaded.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-pdf-summarizer",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI PDF Summarizer",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0" },
        "description": "AI-powered PDF summarizer. Upload any PDF and get summaries, key insights, and Q&A — 100% private, files never leave your browser.",
      })}} />

      <ToolPageHeader toolName="AI PDF Summarizer" icon={FileText} />

      <div className="pb-12">
        <PDFSummarizerHero />
        <AdBlock slot="pdf-summarizer-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <PDFSummarizerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="pdf-summarizer-mid" format="horizontal" className="mb-10" />
      <PDFSummarizerArticle />
      <ToolFAQ toolName="AI PDF Summarizer" faqs={pdfSummarizerFAQs} />
      <AdBlock slot="pdf-summarizer-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={pdfSummarizerFAQs} toolName="AI PDF Summarizer" toolDescription="AI-powered PDF summarizer. Upload any PDF and get instant summaries, key insights, and Q&A — 100% private, files never leave your browser." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI PDF Summarizer" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI PDF Summarizer" />
    </>
  );
}
