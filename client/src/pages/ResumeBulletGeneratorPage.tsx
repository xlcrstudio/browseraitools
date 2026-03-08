import { ResumeBulletHero } from "@/components/ResumeBulletHero";
import { ResumeBulletGenerator } from "@/components/ResumeBulletGenerator";
import { ResumeBulletArticle } from "@/components/ResumeBulletArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { resumeBulletGeneratorFAQs } from "@/lib/faqs-data";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ResumeBulletGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Resume Bullet Generator - ATS-Optimized Resume Points | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate powerful, ATS-optimized resume bullet points with AI. Quantified achievements, strong action verbs, CAR method. Free, private, instant.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Resume Bullet Generator - Browser AI Tools",
      "og:description": "Turn your experience into interview-winning resume bullets. ATS-optimized with quantified results. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-resume-bullet-generator",
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
            "name": "AI Resume Bullet Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered resume bullet point generator. ATS-optimized, achievement-focused with quantified metrics. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Resume Bullet Generator" icon={Briefcase} />

      <div className="pb-12">
        <ResumeBulletHero />
        <AdBlock slot="resume-bullet-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ResumeBulletGenerator />
        </motion.div>
      </div>

      <AdBlock slot="resume-bullet-mid" format="horizontal" className="mb-10" />

      <ResumeBulletArticle />

      <ToolFAQ toolName="AI Resume Bullet Generator" faqs={resumeBulletGeneratorFAQs} />

      <AdBlock slot="resume-bullet-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
