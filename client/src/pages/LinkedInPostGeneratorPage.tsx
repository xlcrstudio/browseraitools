import { LinkedInPostHero } from "@/components/LinkedInPostHero";
import { LinkedInPostGenerator } from "@/components/LinkedInPostGenerator";
import { LinkedInPostArticle } from "@/components/LinkedInPostArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { linkedInPostGeneratorFAQs } from "@/lib/faqs-data";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function LinkedInPostGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI LinkedIn Post Generator - Build Your Professional Brand | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Generate professional LinkedIn posts with AI. Thought leadership content, engagement-optimized hooks, and strategic hashtags. Free, private, instant.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI LinkedIn Post Generator - Browser AI Tools",
      "og:description": "Create professional LinkedIn posts that build your brand and drive engagement. AI-powered thought leadership content. Free, private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-linkedin-post-generator",
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
            "name": "AI LinkedIn Post Generator",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered LinkedIn post generator. Create professional, engagement-optimized posts with hooks, hashtags, and thought leadership content. Free, private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI LinkedIn Post Generator" icon={Briefcase} />

      <div className="pb-12">
        <LinkedInPostHero />
        <AdBlock slot="linkedin-post-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LinkedInPostGenerator />
        </motion.div>
      </div>

      <AdBlock slot="linkedin-post-mid" format="horizontal" className="mb-10" />

      <LinkedInPostArticle />

      <ToolFAQ toolName="AI LinkedIn Post Generator" faqs={linkedInPostGeneratorFAQs} />

      <AdBlock slot="linkedin-post-bottom" format="horizontal" className="mt-10" />
    </>
  );
}
