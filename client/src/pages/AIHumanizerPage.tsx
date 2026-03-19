import { useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { AIHumanizerHero } from "@/components/AIHumanizerHero";
import { AIHumanizerGenerator } from "@/components/AIHumanizerGenerator";
import { AIHumanizerArticle } from "@/components/AIHumanizerArticle";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { aiHumanizerFAQs } from "@/lib/faqs-data";

export default function AIHumanizerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Text Humanizer — Make AI Writing Sound Human | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI text humanizer. Transform ChatGPT, Claude, or Gemini text into natural, human-sounding writing. Live AI detection risk meter, 3 versions, before/after comparison. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Text Humanizer — Remove AI Writing Patterns | Browser AI Tools",
      "og:description": "Humanize AI-generated text in seconds. Get 3 natural versions, see before/after comparison, and track your AI detection risk. Private — text never uploaded.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-humanizer",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI Text Humanizer",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0" },
        "description": "Humanize AI-generated text in your browser. Get 3 natural versions with live detection risk meter. 100% private — text never uploaded.",
      })}} />

      <ToolPageHeader toolName="AI Text Humanizer" icon={Wand2} />

      <div className="pb-12">
        <AIHumanizerHero />
        <AdBlock slot="ai-humanizer-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <AIHumanizerGenerator />
        </motion.div>
      </div>

      <AdBlock slot="ai-humanizer-mid" format="horizontal" className="mb-10" />
      <AIHumanizerArticle />
      <ToolFAQ toolName="AI Text Humanizer" faqs={aiHumanizerFAQs} />
      <AdBlock slot="ai-humanizer-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={aiHumanizerFAQs} toolName="AI Text Humanizer" toolDescription="Free AI text humanizer. Transform AI-generated text into natural human writing. Live detection risk meter, 3 versions, before/after comparison. 100% private." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI Text Humanizer" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI Text Humanizer" />
    </>
  );
}
