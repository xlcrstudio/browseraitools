import { Hero } from "@/components/Hero";
import { HookGenerator } from "@/components/HookGenerator";
import { HistoryPanel } from "@/components/HistorySidebar";
import { motion } from "framer-motion";

export default function HookGeneratorPage() {
  return (
    <>
      <div className="pb-24">
        <Hero />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HookGenerator />
        </motion.div>
      </div>
      <HistoryPanel />
    </>
  );
}
