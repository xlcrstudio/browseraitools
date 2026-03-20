import { ImageAnalyzer } from "@/components/ImageAnalyzer";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { AdBlock } from "@/components/AdBlock";
import { ToolFAQ } from "@/components/ToolFAQ";
import RelatedTools from "@/components/RelatedTools";
import ToolSchema from "@/components/ToolSchema";
import { motion } from "framer-motion";
import { ScanEye } from "lucide-react";

const IMAGE_ANALYZER_FAQS = [
  {
    question: "What types of images can I analyze?",
    answer: "You can analyze any image in JPG, PNG, WebP, or GIF format up to 8MB. This includes photos, screenshots, artwork, product images, documents, memes, social media images, and more.",
  },
  {
    question: "Is my image kept private?",
    answer: "Your image is sent to the AI only for analysis — it is never stored, saved, or used for any other purpose. Once the analysis is returned, the data exists only in your browser. We do not retain any copies of your images.",
  },
  {
    question: "How accurate is the text detection?",
    answer: "The AI can read most clearly visible text in images, including signs, labels, captions, and printed documents. Heavily stylized fonts, very small text, or text at extreme angles may have lower accuracy.",
  },
  {
    question: "Can it analyze sensitive or NSFW images?",
    answer: "The AI will decline to analyze or describe content that violates safety guidelines. For general professional use — photos, product images, infographics, screenshots, artwork — it works well.",
  },
  {
    question: "What can I do with the analysis results?",
    answer: "You can copy any part of the analysis with one click, export the full analysis as a Markdown file, or use the Quick Copy buttons to grab specific elements like tags, colors, or descriptions for use in captions, alt text, social posts, or content strategies.",
  },
];

export default function ImageAnalyzerPage() {

  return (
    <>
      <ToolPageHeader toolName="AI Image Analyzer" icon={ScanEye} />

      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Image{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Analyzer
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Understand what's in any image — objects, text, mood, colors, and composition — powered by SmolVLM, running 100% in your browser. Free and private.
        </p>
      </section>

      <AdBlock />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <ImageAnalyzer />
      </motion.div>

      <AdBlock />

      {/* About section */}
      <section className="mb-10 prose prose-slate dark:prose-invert max-w-none">
        <h2 className="font-display font-bold text-2xl text-slate-800 dark:text-slate-100 mb-4">
          The Private AI Vision Tool That Runs in Your Browser
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          The AI Image Analyzer runs SmolVLM, a compact vision-language model, directly in your browser using WebGPU — no servers, no uploads, no cloud. Upload a photo, screenshot, artwork, or product image and get instant, detailed analysis covering detected objects, visible text, emotional tone, color palette, and more.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Because the model runs locally on your device, your images never leave your browser. You get actionable insights you can copy and use directly — perfect for content creators, marketers, designers, and anyone who works with visual content.
        </p>
        <h3 className="font-semibold text-xl text-slate-800 dark:text-slate-100 mt-6 mb-3">What does the AI analyze?</h3>
        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong className="text-slate-700 dark:text-slate-300">Description</strong> — A clear, detailed description of what's in the image</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Objects</strong> — All significant elements, people, and things detected</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Text</strong> — Any readable text visible in the image (signs, labels, captions)</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Mood & Emotions</strong> — The emotional tone and atmosphere of the image</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Context</strong> — The likely purpose or situation the image depicts</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Colors</strong> — Dominant colors and overall color mood</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Composition</strong> — Framing, lighting, and visual structure notes</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Tags</strong> — Ready-to-use hashtags and keywords for sharing</li>
        </ul>
      </section>

      <ToolFAQ toolName="AI Image Analyzer" faqs={IMAGE_ANALYZER_FAQS} />

      <AdBlock />

      <ToolSchema
        toolName="AI Image Analyzer"
        toolDescription="Free AI-powered image analysis tool. Upload any image and instantly get objects, text, mood, colors, composition, and more."
        faqs={IMAGE_ANALYZER_FAQS}
      />

      <RelatedTools currentToolName="AI Image Analyzer" currentCategory="Unique & Viral Tools" />
    </>
  );
}
