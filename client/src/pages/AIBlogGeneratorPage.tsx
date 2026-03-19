import { useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { AIBlogGeneratorHero } from "@/components/AIBlogGeneratorHero";
import { AIBlogGeneratorGenerator } from "@/components/AIBlogGeneratorGenerator";
import { AIBlogGeneratorArticle } from "@/components/AIBlogGeneratorArticle";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { aiBlogGeneratorFAQs } from "@/lib/faqs-data";

export default function AIBlogGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Blog Post Generator — SEO-Optimized Articles | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI blog post generator. Create complete SEO-optimized blog posts with title, meta description, and full article. Includes SEO score, keyword analysis, and export to Markdown or HTML. 100% private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Blog Post Generator — Create SEO Articles Instantly | Browser AI Tools",
      "og:description": "Generate complete, keyword-optimized blog posts with SEO title, meta description, and full article. Private — your content never leaves your device.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-blog-post-generator",
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
        "name": "AI Blog Post Generator",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0" },
        "description": "Free AI blog post generator. Create complete SEO-optimized articles with keyword analysis, SEO score, and export options. 100% private.",
      })}} />

      <ToolPageHeader toolName="AI Blog Post Generator" icon={Newspaper} />

      <div className="pb-12">
        <AIBlogGeneratorHero />
        <AdBlock slot="ai-blog-generator-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <AIBlogGeneratorGenerator />
        </motion.div>
      </div>

      <AdBlock slot="ai-blog-generator-mid" format="horizontal" className="mb-10" />
      <AIBlogGeneratorArticle />
      <ToolFAQ toolName="AI Blog Post Generator" faqs={aiBlogGeneratorFAQs} />
      <AdBlock slot="ai-blog-generator-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={aiBlogGeneratorFAQs} toolName="AI Blog Post Generator" toolDescription="Free AI blog post generator. Create SEO-optimized articles with keyword analysis, SEO score, and Markdown/HTML export. Private — content never uploaded." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Blog Post Generator" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Blog Post Generator" />
    </>
  );
}
