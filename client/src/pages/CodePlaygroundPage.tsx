import { PlaygroundHero } from "@/components/PlaygroundHero";
import { CodePlayground } from "@/components/CodePlayground";
import { PlaygroundArticle } from "@/components/PlaygroundArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import RelatedTools from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";
import { codePlaygroundFAQs } from "@/lib/faqs-data";
import { Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CodePlaygroundPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Private AI Code Playground - Generate, Run & Fix Code in Browser | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Private AI code playground. Generate, run, and fix JavaScript, HTML, and Python code entirely in your browser. Monaco Editor, instant execution, one-click error fixing. 100% private and free.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free Private AI Code Playground - Run Code in Browser | Browser AI Tools",
      "og:description": "Generate, run, and fix code with AI entirely in your browser. JavaScript, HTML, and Python support. Monaco Editor. 100% private, no data leaves your device.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-code-playground",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", "name": "Private AI Code Playground", "applicationCategory": "DeveloperApplication", "offers": { "@type": "Offer", "price": "0" }, "description": "Private AI code playground. Generate, run, and fix code in your browser with Monaco Editor. JavaScript, HTML, and Python. 100% private." }) }} />

      <ToolPageHeader toolName="Private AI Code Playground" icon={Terminal} />

      <div className="pb-12">
        <PlaygroundHero />
        <AdBlock slot="playground-top" format="horizontal" className="mb-8" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <CodePlayground />
        </motion.div>
      </div>

      <AdBlock slot="playground-mid" format="horizontal" className="mb-10" />
      <PlaygroundArticle />
      <ToolFAQ toolName="Private AI Code Playground" faqs={codePlaygroundFAQs} />
      <AdBlock slot="playground-bottom" format="horizontal" className="mt-10" />
      <ToolSchema faqs={codePlaygroundFAQs} toolName="Private AI Code Playground" toolDescription="Private AI code playground. Generate, run, and fix JavaScript, HTML, and Python code entirely in your browser. 100% private and free." category="DeveloperApplication" />
      <RelatedTools currentToolName="Private AI Code Playground" currentCategory="DeveloperApplication" />
      <ShareResultButtons toolName="Private AI Code Playground" />
    </>
  );
}
