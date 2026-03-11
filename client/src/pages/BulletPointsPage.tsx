import { BulletPointsHero } from "@/components/BulletPointsHero";
import { BulletPointsGenerator } from "@/components/BulletPointsGenerator";
import { BulletPointsArticle } from "@/components/BulletPointsArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { bulletPointsFAQs } from "@/lib/faqs-data";
import { List } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function BulletPointsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Bullet Points Generator - Convert Text to Bullet Lists | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered bullet points generator. Convert any text into clear, scannable bullet lists. 4 styles, 5 icon options, nested sub-points. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Bullet Points Generator - Text to Bullet Lists | Browser AI Tools",
      "og:description": "Convert paragraphs into organized bullet point lists instantly. Key points, step-by-step, pros & cons, or summary format. Export as Markdown or HTML. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-bullet-points-generator",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Bullet Points Generator", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered bullet points generator. Convert text into organized bullet lists with 4 styles and 5 icon options. 100% private." }) }} />

      <ToolPageHeader toolName="AI Bullet Points Generator" icon={List} />

      <div className="pb-12">
        <BulletPointsHero />
        <AdBlock slot="bullet-points-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <BulletPointsGenerator />
        </motion.div>
      </div>

      <AdBlock slot="bullet-points-mid" format="horizontal" className="mb-10" />
      <BulletPointsArticle />
      <ToolFAQ toolName="AI Bullet Points Generator" faqs={bulletPointsFAQs} />
      <AdBlock slot="bullet-points-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={bulletPointsFAQs} toolName="AI Bullet Points Generator" toolDescription="AI-powered bullet points generator. Convert any text into clear, scannable bullet lists with 4 styles and 5 icon options. 100% private and free." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Bullet Points Generator" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Bullet Points Generator" />
    </>
  );
}
