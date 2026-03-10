import { DatingProfileHero } from "@/components/DatingProfileHero";
import { DatingProfileGenerator } from "@/components/DatingProfileGenerator";
import { DatingProfileArticle } from "@/components/DatingProfileArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { datingProfileFAQs } from "@/lib/faqs-data";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function DatingProfilePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Dating Profile Generator - Get More Matches | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Create irresistible dating profiles and opening lines for Tinder, Bumble, and Hinge. App-specific bios, prompt answers, photo captions, and first messages. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Dating Profile Generator - Get More Matches | Browser AI Tools",
      "og:description": "Generate authentic, high-response dating profiles and openers for Tinder, Bumble, and Hinge. 100% private in your browser. No signup required.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-dating-profile-generator",
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
            "name": "AI Dating Profile Generator",
            "applicationCategory": "LifestyleApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered dating profile generator for Tinder, Bumble, and Hinge. Create authentic bios, prompt answers, opening lines, and photo captions. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Dating Profile Generator" icon={Heart} />

      <div className="pb-12">
        <DatingProfileHero />
        <AdBlock slot="dating-profile-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DatingProfileGenerator />
        </motion.div>
      </div>

      <AdBlock slot="dating-profile-mid" format="horizontal" className="mb-10" />

      <DatingProfileArticle />

      <ToolFAQ toolName="AI Dating Profile Generator" faqs={datingProfileFAQs} />

      <AdBlock slot="dating-profile-bottom" format="horizontal" className="mt-10" />
    
      <ToolSchema faqs={datingProfileFAQs} toolName="AI Dating Profile Generator" toolDescription="Create irresistible dating profiles and opening lines for Tinder, Bumble, and Hinge. App-specific bios, prompt answers, photo captions, and first messages. 1..." category="EntertainmentApplication" />

      <RelatedTools currentToolName="AI Dating Profile Generator" currentCategory="EntertainmentApplication" />

      <ShareResultButtons toolName="AI Dating Profile Generator" />
    </>
  );
}
