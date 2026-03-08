import { BlogOutlineHero } from "@/components/BlogOutlineHero";
import { BlogOutlineGenerator } from "@/components/BlogOutlineGenerator";
import { BlogOutlineArticle } from "@/components/BlogOutlineArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { blogOutlineGeneratorFAQs } from "@/lib/faqs-data";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function BlogOutlineGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Blog Outline Generator - SEO-Optimized Content Structure | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Create SEO-optimized blog outlines in seconds with AI. Get title options, structured sections, meta descriptions, and content guidance. Free, private, instant.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Blog Outline Generator - Browser AI Tools",
      "og:description": "Create comprehensive blog outlines with AI. SEO-optimized title options, H2/H3 structure, meta descriptions, and FAQ sections. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-blog-outline-generator",
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
            "name": "AI Blog Outline Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered blog outline generator. Create SEO-optimized content structures with title options, meta descriptions, and section guidance. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Blog Outline Generator" icon={FileText} />

      <div className="pb-12">
        <BlogOutlineHero />
        <AdBlock slot="blog-outline-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BlogOutlineGenerator />
        </motion.div>
      </div>

      <AdBlock slot="blog-outline-mid" format="horizontal" className="mb-10" />

      <BlogOutlineArticle />

      <ToolFAQ toolName="AI Blog Outline Generator" faqs={blogOutlineGeneratorFAQs} />

      <AdBlock slot="blog-outline-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
