import { SimplifierHero } from "@/components/SimplifierHero";
import { SimplifierGenerator } from "@/components/SimplifierGenerator";
import { SimplifierArticle } from "@/components/SimplifierArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { sentenceSimplifierFAQs } from "@/lib/faqs-data";
import { AlignLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SimplifierPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Sentence Simplifier - Make Complex Text Easy to Understand | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered sentence simplifier. Convert complex sentences into easy-to-understand language with step-by-step explanations. 3 simplification levels, vocabulary learning, readability scoring. 100% private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Sentence Simplifier - Simplify Complex Text | Browser AI Tools",
      "og:description": "Make complex sentences easy to understand. 3 simplification levels from slight to ELI5. Step-by-step breakdown, vocabulary learning, readability analysis. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-sentence-simplifier",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Sentence Simplifier", "applicationCategory": "UtilitiesApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered sentence simplifier. Convert complex sentences into easy-to-understand language with readability analysis and vocabulary learning. 100% private." }) }} />

      <ToolPageHeader toolName="AI Sentence Simplifier" icon={AlignLeft} />

      <div className="pb-12">
        <SimplifierHero />
        <AdBlock slot="simplifier-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <SimplifierGenerator />
        </motion.div>
      </div>

      <AdBlock slot="simplifier-mid" format="horizontal" className="mb-10" />
      <SimplifierArticle />
      <ToolFAQ toolName="AI Sentence Simplifier" faqs={sentenceSimplifierFAQs} />
      <AdBlock slot="simplifier-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={sentenceSimplifierFAQs} toolName="AI Sentence Simplifier" toolDescription="AI-powered sentence simplifier. Convert complex sentences into easy-to-understand language with step-by-step explanations and vocabulary learning. 100% private and free." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Sentence Simplifier" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Sentence Simplifier" />
    </>
  );
}
