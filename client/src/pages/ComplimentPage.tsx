import { ComplimentHero } from "@/components/ComplimentHero";
import { ComplimentGenerator } from "@/components/ComplimentGenerator";
import { ComplimentArticle } from "@/components/ComplimentArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { complimentFAQs } from "@/lib/faqs-data";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ComplimentPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Compliment Generator - Heartfelt Compliments Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered compliment generator. Get 5 genuine, tailored compliments for any person and tone. Heartfelt, funny, professional, or motivational. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Compliment Generator - Heartfelt Compliments Instantly | Browser AI Tools",
      "og:description": "Give the perfect compliment in seconds. 5 tailored compliments for friends, partners, coworkers, or yourself. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-compliment-generator",
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
            "name": "AI Compliment Generator",
            "applicationCategory": "LifestyleApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered compliment generator that creates 5 genuine, tailored compliments for any recipient and tone. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Compliment Generator" icon={Heart} />

      <div className="pb-12">
        <ComplimentHero />
        <AdBlock slot="compliment-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ComplimentGenerator />
        </motion.div>
      </div>

      <AdBlock slot="compliment-mid" format="horizontal" className="mb-10" />

      <ComplimentArticle />

      <ToolFAQ toolName="AI Compliment Generator" faqs={complimentFAQs} />

      <AdBlock slot="compliment-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={complimentFAQs} />
    </>
  );
}
