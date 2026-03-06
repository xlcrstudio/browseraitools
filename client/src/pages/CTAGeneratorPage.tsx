import { CTAHero } from "@/components/CTAHero";
import { CTAGenerator } from "@/components/CTAGenerator";
import { CTAArticle } from "@/components/CTAArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { ctaGeneratorFAQs } from "@/lib/faqs-data";
import { MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CTAGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Call-to-Action Generator - Create High-Converting CTAs | Browser AI Tools";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Generate high-converting CTAs for emails, ads, and landing pages instantly. AI-powered CTA generator. Free, private, no signup required.");
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Call-to-Action Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered call-to-action generator for marketing campaigns. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Call-to-Action Generator" icon={MousePointerClick} />

      <div className="pb-12">
        <CTAHero />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CTAGenerator />
        </motion.div>
      </div>

      <CTAArticle />

      <ToolFAQ toolName="AI Call-to-Action Generator" faqs={ctaGeneratorFAQs} />
    </>
  );
}
