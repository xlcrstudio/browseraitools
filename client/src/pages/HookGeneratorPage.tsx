import { Hero } from "@/components/Hero";
import { HookGenerator } from "@/components/HookGenerator";
import { HistoryPanel } from "@/components/HistorySidebar";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import { hookGeneratorFAQs } from "@/lib/faqs-data";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HookGeneratorPage() {
  return (
    <>
      <ToolPageHeader toolName="AI Hook Generator" icon={Sparkles} />

      <div className="pb-12">
        <Hero />
        <AdBlock slot="hook-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HookGenerator />
        </motion.div>
      </div>

      <AdBlock slot="hook-mid" format="horizontal" className="mb-10" />

      <ToolFAQ toolName="AI Hook Generator" faqs={hookGeneratorFAQs} />

      <AdBlock slot="hook-bottom" format="horizontal" className="mt-10" />

      <HistoryPanel />
    </>
  );
}
