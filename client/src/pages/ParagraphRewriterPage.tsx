import { ParagraphRewriterHero } from "@/components/ParagraphRewriterHero";
import { ParagraphRewriterGenerator } from "@/components/ParagraphRewriterGenerator";
import { ParagraphRewriterArticle } from "@/components/ParagraphRewriterArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { paragraphRewriterFAQs } from "@/lib/faqs-data";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ParagraphRewriterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Paragraph Rewriter - Rewrite Any Paragraph Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered paragraph rewriter. Rewrite any paragraph to improve clarity, tone, and readability. Get 3 variations with 5 writing styles. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Paragraph Rewriter - 3 Variations, 5 Styles | Browser AI Tools",
      "og:description": "Rewrite any paragraph instantly. Get 3 versions with readability analysis. Choose from formal, casual, academic, creative, or professional styles. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-paragraph-rewriter",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Paragraph Rewriter", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered paragraph rewriter. Rewrite paragraphs to improve clarity, tone, and readability. 3 variations, 5 writing styles. 100% private." }) }} />

      <ToolPageHeader toolName="AI Paragraph Rewriter" icon={RefreshCw} />

      <div className="pb-12">
        <ParagraphRewriterHero />
        <AdBlock slot="paragraph-rewriter-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <ParagraphRewriterGenerator />
        </motion.div>
      </div>

      <AdBlock slot="paragraph-rewriter-mid" format="horizontal" className="mb-10" />
      <ParagraphRewriterArticle />
      <ToolFAQ toolName="AI Paragraph Rewriter" faqs={paragraphRewriterFAQs} />
      <AdBlock slot="paragraph-rewriter-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={paragraphRewriterFAQs} toolName="AI Paragraph Rewriter" toolDescription="AI-powered paragraph rewriter. Rewrite paragraphs to improve clarity, tone, and readability. Get 3 variations with 5 writing styles. 100% private and free." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Paragraph Rewriter" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Paragraph Rewriter" />
    </>
  );
}
