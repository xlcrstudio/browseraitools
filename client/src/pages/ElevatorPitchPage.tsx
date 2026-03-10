import { ElevatorPitchHero } from "@/components/ElevatorPitchHero";
import { ElevatorPitchGenerator } from "@/components/ElevatorPitchGenerator";
import { ElevatorPitchArticle } from "@/components/ElevatorPitchArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { elevatorPitchFAQs } from "@/lib/faqs-data";
import { Presentation } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ElevatorPitchPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Elevator Pitch Generator - Perfect Your 30-Second Pitch | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered elevator pitch generator. Get 5 pitch variations tailored to investors, customers, or partners with strength scoring, practice timer, and follow-up question prep. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Elevator Pitch Generator - Craft the Perfect Pitch | Browser AI Tools",
      "og:description": "Generate 5 elevator pitch variations with AI. Tailored to your audience with strength scoring, practice timer, and question anticipation. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-elevator-pitch-generator",
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
            "name": "AI Elevator Pitch Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered elevator pitch generator. Get 5 pitch variations tailored to investors, customers, or partners with strength scoring, practice timer, and follow-up question prep. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Elevator Pitch Generator" icon={Presentation} />

      <div className="pb-12">
        <ElevatorPitchHero />
        <AdBlock slot="elevator-pitch-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ElevatorPitchGenerator />
        </motion.div>
      </div>

      <AdBlock slot="elevator-pitch-mid" format="horizontal" className="mb-10" />

      <ElevatorPitchArticle />

      <ToolFAQ toolName="AI Elevator Pitch Generator" faqs={elevatorPitchFAQs} />

      <AdBlock slot="elevator-pitch-bottom" format="horizontal" className="mt-10" />

      <ToolSchema faqs={elevatorPitchFAQs} toolName="AI Elevator Pitch Generator" toolDescription="AI-powered elevator pitch generator. Get 5 pitch variations tailored to investors, customers, or partners with strength scoring, practice timer, and follow-up question prep. 100% private and free." category="BusinessApplication" />

      <RelatedTools currentToolName="AI Elevator Pitch Generator" currentCategory="BusinessApplication" />

      <ShareResultButtons toolName="AI Elevator Pitch Generator" />
    </>
  );
}
