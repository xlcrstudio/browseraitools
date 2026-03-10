import { IGBioHero } from "@/components/IGBioHero";
import { IGBioGenerator } from "@/components/IGBioGenerator";
import { IGBioArticle } from "@/components/IGBioArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { igBioFAQs } from "@/lib/faqs-data";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function IGBioPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Instagram Bio Generator - Create Perfect Bios in Seconds | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered Instagram bio generator. Create 5 unique bios with perfect emoji placement, aesthetic formatting, and 150-character optimization. Niche-specific, multiple styles. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Instagram Bio Generator - Create Perfect Bios | Browser AI Tools",
      "og:description": "Generate 5 unique Instagram bios instantly. 150-character optimized, emoji-smart, niche-specific. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-instagram-bio-generator",
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
            "name": "AI Instagram Bio Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered Instagram bio generator that creates 5 unique, 150-character optimized bios with perfect emoji placement, aesthetic formatting, and niche-specific language. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Instagram Bio Generator" icon={User} />

      <div className="pb-12">
        <IGBioHero />
        <AdBlock slot="igbio-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <IGBioGenerator />
        </motion.div>
      </div>

      <AdBlock slot="igbio-mid" format="horizontal" className="mb-10" />

      <IGBioArticle />

      <ToolFAQ toolName="AI Instagram Bio Generator" faqs={igBioFAQs} />

      <AdBlock slot="igbio-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={igBioFAQs} toolName="AI Instagram Bio Generator" toolDescription="AI-powered Instagram bio generator. Create 5 unique bios with perfect emoji placement, aesthetic formatting, and 150-character optimization. Niche-specific, ..." category="EntertainmentApplication" />

      <RelatedTools currentToolName="AI Instagram Bio Generator" currentCategory="EntertainmentApplication" />

      <ShareResultButtons toolName="AI Instagram Bio Generator" />
    </>
  );
}
