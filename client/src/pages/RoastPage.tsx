import { RoastHero } from "@/components/RoastHero";
import { RoastGenerator } from "@/components/RoastGenerator";
import { RoastArticle } from "@/components/RoastArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { roastFAQs } from "@/lib/faqs-data";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function RoastPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Roast Generator - Get Hilariously Roasted by AI | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered roast generator. Get 3 clever, funny roasts instantly. Light, Medium, or Savage mode. Perfect for social media, group chats, and viral content. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Roast Generator - Get Hilariously Roasted by AI | Browser AI Tools",
      "og:description": "Get hilariously roasted by AI. Choose Light, Medium, or Savage and get 3 clever roasts instantly. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-roast-generator",
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
            "name": "AI Roast Generator",
            "applicationCategory": "EntertainmentApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered roast generator that creates 3 clever, funny roasts instantly. Light, Medium, or Savage mode. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Roast Generator" icon={Flame} />

      <div className="pb-12">
        <RoastHero />
        <AdBlock slot="roast-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <RoastGenerator />
        </motion.div>
      </div>

      <AdBlock slot="roast-mid" format="horizontal" className="mb-10" />

      <RoastArticle />

      <ToolFAQ toolName="AI Roast Generator" faqs={roastFAQs} />

      <AdBlock slot="roast-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={roastFAQs} />
    </>
  );
}
