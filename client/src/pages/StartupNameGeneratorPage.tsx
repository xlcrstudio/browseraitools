import { StartupNameHero } from "@/components/StartupNameHero";
import { StartupNameGenerator } from "@/components/StartupNameGenerator";
import { StartupNameArticle } from "@/components/StartupNameArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { startupNameGeneratorFAQs } from "@/lib/faqs-data";
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function StartupNameGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Startup Name Generator - Find Your Perfect Business Name | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate 10+ brandable startup names instantly. AI-powered name generator with meanings, domain insights, and naming analysis. Free and private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Startup Name Generator - Browser AI Tools",
      "og:description": "Generate 10+ brandable startup names instantly. AI-powered with meanings, domain insights, and naming analysis.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-startup-name-generator",
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
            "name": "AI Startup Name Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered startup name generator. Discover brandable, memorable names with domain insights. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Startup Name Generator" icon={Rocket} />

      <div className="pb-12">
        <StartupNameHero />
        <AdBlock slot="startup-name-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StartupNameGenerator />
        </motion.div>
      </div>

      <AdBlock slot="startup-name-mid" format="horizontal" className="mb-10" />

      <StartupNameArticle />

      <ToolFAQ toolName="AI Startup Name Generator" faqs={startupNameGeneratorFAQs} />

      <AdBlock slot="startup-name-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={startupNameGeneratorFAQs} toolName="AI Startup Name Generator" toolDescription="Generate 10+ brandable startup names instantly. AI-powered name generator with meanings, domain insights, and naming analysis. Free and private." />
    </>
  );
}
