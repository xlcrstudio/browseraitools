import { PromptGeneratorHero } from "@/components/PromptGeneratorHero";
import { PromptGenerator } from "@/components/PromptGenerator";
import { PromptGeneratorArticle } from "@/components/PromptGeneratorArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { promptGeneratorFAQs } from "@/lib/faqs-data";
import { PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PromptGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Prompt Generator - Perfect Prompts for ChatGPT & Claude | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered prompt generator. Create expert-level prompts for ChatGPT, Claude, Midjourney, and more. 3 complexity levels: Short, Detailed, Expert. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Prompt Generator - Perfect Prompts for ChatGPT & Claude | Browser AI Tools",
      "og:description": "Turn any idea into a perfect, high-performance prompt for ChatGPT, Claude & more. 3 levels of complexity. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-prompt-generator",
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
            "name": "AI Prompt Generator",
            "applicationCategory": "DeveloperApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered prompt generator that creates expert-level prompts for ChatGPT, Claude, Midjourney, and more. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Prompt Generator" icon={PenTool} />

      <div className="pb-12">
        <PromptGeneratorHero />
        <AdBlock slot="prompt-gen-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PromptGenerator />
        </motion.div>
      </div>

      <AdBlock slot="prompt-gen-mid" format="horizontal" className="mb-10" />

      <PromptGeneratorArticle />

      <ToolFAQ toolName="AI Prompt Generator" faqs={promptGeneratorFAQs} />

      <AdBlock slot="prompt-gen-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={promptGeneratorFAQs} toolName="AI Prompt Generator" toolDescription="AI-powered prompt generator. Create expert-level prompts for ChatGPT, Claude, Midjourney, and more. 3 complexity levels: Short, Detailed, Expert. 100% privat..." />

      <RelatedTools currentToolName="AI Prompt Generator" currentCategory="ProductivityApplication" />

      <ShareResultButtons toolName="AI Prompt Generator" />
    </>
  );
}
