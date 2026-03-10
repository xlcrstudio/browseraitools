import { InterviewAnswerHero } from "@/components/InterviewAnswerHero";
import { InterviewAnswerGenerator } from "@/components/InterviewAnswerGenerator";
import { InterviewAnswerArticle } from "@/components/InterviewAnswerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import { interviewAnswerGeneratorFAQs } from "@/lib/faqs-data";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function InterviewAnswerGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Interview Answer Generator - STAR Method Answers | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate professional interview answers using the STAR method with AI. Get structured answers, delivery tips, and follow-up prep. Free, private, instant.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Interview Answer Generator - Browser AI Tools",
      "og:description": "Prepare winning interview answers using the STAR method. AI-powered answers with delivery tips and follow-up prep. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-interview-answer-generator",
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
            "name": "AI Interview Answer Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered interview answer generator using the STAR method. Get structured answers with delivery tips and follow-up prep. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Interview Answer Generator" icon={Mic} />

      <div className="pb-12">
        <InterviewAnswerHero />
        <AdBlock slot="interview-answer-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InterviewAnswerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="interview-answer-mid" format="horizontal" className="mb-10" />

      <InterviewAnswerArticle />

      <ToolFAQ toolName="AI Interview Answer Generator" faqs={interviewAnswerGeneratorFAQs} />

      <AdBlock slot="interview-answer-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={interviewAnswerGeneratorFAQs} toolName="AI Interview Answer Generator" toolDescription="Generate professional interview answers using the STAR method with AI. Get structured answers, delivery tips, and follow-up prep. Free, private, instant." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Interview Answer Generator" currentCategory="BusinessApplication" />
    </>
  );
}
