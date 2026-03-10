import { CoverLetterHero } from "@/components/CoverLetterHero";
import { CoverLetterGenerator } from "@/components/CoverLetterGenerator";
import { CoverLetterArticle } from "@/components/CoverLetterArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { coverLetterGeneratorFAQs } from "@/lib/faqs-data";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CoverLetterGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Cover Letter Generator - Create Professional Cover Letters | Browser AI Tools";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Generate personalized, professional cover letters instantly. AI-powered, ATS-optimized, 100% free and private. No signup required.");
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Cover Letter Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered cover letter generator. Create personalized, ATS-optimized cover letters for free. Runs in your browser for complete privacy.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Cover Letter Generator" icon={FileText} />

      <div className="pb-12">
        <CoverLetterHero />
        <AdBlock slot="cover-letter-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CoverLetterGenerator />
        </motion.div>
      </div>

      <AdBlock slot="cover-letter-mid" format="horizontal" className="mb-10" />

      <CoverLetterArticle />

      <ToolFAQ toolName="AI Cover Letter Generator" faqs={coverLetterGeneratorFAQs} />

      <AdBlock slot="cover-letter-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={coverLetterGeneratorFAQs} toolName="AI Cover Letter Generator" toolDescription="Generate professional cover letters tailored to any job description with AI. ATS-optimized, customizable tone. Free and private." category="BusinessApplication" />
    </>
  );
}
