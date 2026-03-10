import { MessageAnalyzerHero } from "@/components/MessageAnalyzerHero";
import { MessageAnalyzerGenerator } from "@/components/MessageAnalyzerGenerator";
import { MessageAnalyzerArticle } from "@/components/MessageAnalyzerArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { messageAnalyzerFAQs } from "@/lib/faqs-data";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function MessageAnalyzerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Message Analyzer - Private Text & Email Analyzer | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Analyze any message privately with AI. Detect tone, decode intent, get reply suggestions, check for scams and red flags. 100% local, no uploads. Free and unlimited.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Message Analyzer - Private Text & Email Analyzer | Browser AI Tools",
      "og:description": "Understand any message instantly. Analyze tone, decode hidden meaning, get reply suggestions. 100% private in your browser. No tracking.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-message-analyzer",
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
            "name": "AI Message Analyzer",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered private message analyzer. Detect tone, decode intent, get reply suggestions, check for scams and manipulation. 100% local, no server uploads.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Message Analyzer" icon={MessageSquare} />

      <div className="pb-12">
        <MessageAnalyzerHero />
        <AdBlock slot="message-analyzer-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MessageAnalyzerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="message-analyzer-mid" format="horizontal" className="mb-10" />

      <MessageAnalyzerArticle />

      <ToolFAQ toolName="AI Message Analyzer" faqs={messageAnalyzerFAQs} />

      <AdBlock slot="message-analyzer-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={messageAnalyzerFAQs} toolName="AI Message Analyzer" toolDescription="Analyze any message privately with AI. Detect tone, decode intent, get reply suggestions, check for scams and red flags. 100% local, no uploads. Free and unl..." />

      <RelatedTools currentToolName="AI Message Analyzer" currentCategory="ProductivityApplication" />

      <ShareResultButtons toolName="AI Message Analyzer" />
    </>
  );
}
