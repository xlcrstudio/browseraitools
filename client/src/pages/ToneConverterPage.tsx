import { ToneConverterHero } from "@/components/ToneConverterHero";
import { ToneConverterGenerator } from "@/components/ToneConverterGenerator";
import { ToneConverterArticle } from "@/components/ToneConverterArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { toneConverterFAQs } from "@/lib/faqs-data";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ToneConverterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Tone Converter - Perfect Your Message Tone Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Convert text between professional, casual, friendly, formal, and 10+ tones instantly with AI. Free, private, runs in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Tone Converter - Browser AI Tools",
      "og:description": "Transform your message tone instantly. Convert between professional, casual, friendly, formal, and more. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-tone-converter",
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
            "name": "AI Tone Converter",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered tone converter. Convert text between professional, casual, friendly, formal, and 10+ tones. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Tone Converter" icon={RefreshCw} />

      <div className="pb-12">
        <ToneConverterHero />
        <AdBlock slot="tone-converter-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ToneConverterGenerator />
        </motion.div>
      </div>

      <AdBlock slot="tone-converter-mid" format="horizontal" className="mb-10" />

      <ToneConverterArticle />

      <ToolFAQ toolName="AI Tone Converter" faqs={toneConverterFAQs} />

      <AdBlock slot="tone-converter-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={toneConverterFAQs} />
    </>
  );
}
