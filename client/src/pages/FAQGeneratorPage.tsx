import { FAQGeneratorHero } from "@/components/FAQGeneratorHero";
import { FAQGeneratorComponent } from "@/components/FAQGeneratorComponent";
import { FAQGeneratorArticle } from "@/components/FAQGeneratorArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { faqGeneratorFAQs } from "@/lib/faqs-data";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function FAQGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI FAQ Generator - Create SEO-Friendly FAQs with Schema Markup | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered FAQ generator. Create SEO-optimized FAQs with JSON-LD schema markup. 5-20 questions, 3 answer lengths, 4 FAQ types. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI FAQ Generator - SEO-Friendly FAQs with Schema | Browser AI Tools",
      "og:description": "Generate comprehensive FAQs for websites with JSON-LD schema markup. Choose question count, answer length, and FAQ type. Export as HTML or JSON. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-faq-generator",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI FAQ Generator", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered FAQ generator. Create SEO-optimized FAQs with JSON-LD schema markup for your website. 100% private." }) }} />

      <ToolPageHeader toolName="AI FAQ Generator" icon={HelpCircle} />

      <div className="pb-12">
        <FAQGeneratorHero />
        <AdBlock slot="faq-gen-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <FAQGeneratorComponent />
        </motion.div>
      </div>

      <AdBlock slot="faq-gen-mid" format="horizontal" className="mb-10" />
      <FAQGeneratorArticle />
      <ToolFAQ toolName="AI FAQ Generator" faqs={faqGeneratorFAQs} />
      <AdBlock slot="faq-gen-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={faqGeneratorFAQs} toolName="AI FAQ Generator" toolDescription="AI-powered FAQ generator. Create SEO-optimized FAQs with JSON-LD schema markup for your website. 100% private and free." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI FAQ Generator" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI FAQ Generator" />
    </>
  );
}
