import { MeetingSummaryHero } from "@/components/MeetingSummaryHero";
import { MeetingSummaryGenerator } from "@/components/MeetingSummaryGenerator";
import { MeetingSummaryArticle } from "@/components/MeetingSummaryArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { meetingSummaryFAQs } from "@/lib/faqs-data";
import { ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function MeetingSummaryPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Meeting Summary Generator - Action Items & Decisions | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered meeting summary generator. Turn messy notes into structured summaries with action items, decisions, key points, and follow-up emails. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Meeting Summary Generator - Extract Action Items & Decisions | Browser AI Tools",
      "og:description": "Transform raw meeting notes into professional summaries with action items, decisions, deadlines, and follow-up emails. 6 meeting types. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-meeting-summary-generator",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "AI Meeting Summary Generator", "applicationCategory": "BusinessApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "AI-powered meeting summary generator. Turn messy notes into structured summaries with action items, decisions, and follow-ups. 100% private, runs locally in your browser." }) }} />

      <ToolPageHeader toolName="AI Meeting Summary Generator" icon={ClipboardList} />

      <div className="pb-12">
        <MeetingSummaryHero />
        <AdBlock slot="meeting-summary-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <MeetingSummaryGenerator />
        </motion.div>
      </div>

      <AdBlock slot="meeting-summary-mid" format="horizontal" className="mb-10" />
      <MeetingSummaryArticle />
      <ToolFAQ toolName="AI Meeting Summary Generator" faqs={meetingSummaryFAQs} />
      <AdBlock slot="meeting-summary-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={meetingSummaryFAQs} toolName="AI Meeting Summary Generator" toolDescription="AI-powered meeting summary generator. Turn messy notes into structured summaries with action items, decisions, key points, and follow-up emails. 100% private and free." category="BusinessApplication" />
      <RelatedTools currentToolName="AI Meeting Summary Generator" currentCategory="BusinessApplication" />
      <ShareResultButtons toolName="AI Meeting Summary Generator" />
    </>
  );
}
