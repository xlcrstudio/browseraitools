import { useEffect } from "react";
import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { YouTubeScriptHero } from "@/components/YouTubeScriptHero";
import { YouTubeScriptGenerator } from "@/components/YouTubeScriptGenerator";
import { YouTubeScriptArticle } from "@/components/YouTubeScriptArticle";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { youtubeScriptFAQs } from "@/lib/faqs-data";

export default function YouTubeScriptPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI YouTube Script Generator — High-Retention Scripts | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI YouTube script generator. Create complete, high-retention video scripts with viral hooks, timestamped sections, CTAs, virality score, and title ideas. 100% private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI YouTube Script Generator — Viral Hooks & High-Retention Scripts | Browser AI Tools",
      "og:description": "Generate complete YouTube scripts with viral hooks, timestamps, and CTAs. Includes virality score and title ideas. Private — never uploaded to any server.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-youtube-script-generator",
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
        "name": "AI YouTube Script Generator",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0" },
        "description": "Free AI YouTube script generator. Create high-retention video scripts with viral hooks, timestamped sections, virality score, and title ideas. 100% private.",
      })}} />

      <ToolPageHeader toolName="AI YouTube Script Generator" icon={Clapperboard} />

      <div className="pb-12">
        <YouTubeScriptHero />
        <AdBlock slot="youtube-script-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <YouTubeScriptGenerator />
        </motion.div>
      </div>

      <AdBlock slot="youtube-script-mid" format="horizontal" className="mb-10" />
      <YouTubeScriptArticle />
      <ToolFAQ toolName="AI YouTube Script Generator" faqs={youtubeScriptFAQs} />
      <AdBlock slot="youtube-script-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={youtubeScriptFAQs} toolName="AI YouTube Script Generator" toolDescription="Free AI YouTube script generator. Create high-retention video scripts with viral hooks, timestamps, virality score, and title ideas. Private — content never uploaded." category="UtilitiesApplication" />
      <RelatedTools currentToolName="AI YouTube Script Generator" currentCategory="UtilitiesApplication" />
      <ShareResultButtons toolName="AI YouTube Script Generator" />
    </>
  );
}
