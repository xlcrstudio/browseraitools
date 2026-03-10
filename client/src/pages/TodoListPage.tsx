import { TodoListHero } from "@/components/TodoListHero";
import { TodoListGenerator } from "@/components/TodoListGenerator";
import { TodoListArticle } from "@/components/TodoListArticle";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ToolFAQ } from "@/components/ToolFAQ";
import { AdBlock } from "@/components/AdBlock";
import FAQSchema from "@/components/FAQSchema";
import { todoListFAQs } from "@/lib/faqs-data";
import { ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TodoListPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI To-Do List Generator - Turn Goals Into Action Plans | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "AI-powered to-do list generator. Break any goal into actionable tasks with priorities, time estimates, and step-by-step instructions. 100% private and free - runs in your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI To-Do List Generator - Goal to Tasks | Browser AI Tools",
      "og:description": "Turn any goal into a structured action plan with priorities, time estimates, and progress tracking. 100% private, runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-todo-list-generator",
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
            "name": "AI To-Do List Generator",
            "applicationCategory": "ProductivityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "AI-powered to-do list generator that turns any goal into actionable tasks with priorities, time estimates, difficulty ratings, and progress tracking. 100% private, runs locally in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI To-Do List Generator" icon={ListChecks} />

      <div className="pb-12">
        <TodoListHero />
        <AdBlock slot="todo-top" format="horizontal" className="mb-8" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TodoListGenerator />
        </motion.div>
      </div>

      <AdBlock slot="todo-mid" format="horizontal" className="mb-10" />

      <TodoListArticle />

      <ToolFAQ toolName="AI To-Do List Generator" faqs={todoListFAQs} />

      <AdBlock slot="todo-bottom" format="horizontal" className="mt-10" />
    
      <FAQSchema faqs={todoListFAQs} />
    </>
  );
}
