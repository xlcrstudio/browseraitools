import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function BulletPointsArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Create Effective Bullet Points: Complete Guide
        </h2>

        <ArticleSection title="Why Bullet Points Matter">
          <p>Bullet points transform dense text into scannable content that readers can absorb quickly. Studies show that people scan web pages in an F-pattern, and bullet lists are one of the most effective ways to capture attention during this scanning behavior.</p>
          <p>Well-crafted bullet points increase readability by up to 47% compared to continuous paragraphs. They help readers find specific information faster, remember key points better, and take action on what they have read.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The most effective bullet lists contain 5 to 9 items. Fewer than 5 may not justify a list format, and more than 9 starts to lose the scannability advantage.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Choosing the Right Bullet Style">
          <h4 className="font-bold text-slate-800 mt-4">Key Points</h4>
          <p>Best for extracting the main takeaways from a piece of text. This style identifies the most important ideas and presents them in order of significance. Ideal for meeting notes, article summaries, and executive briefings.</p>
          <h4 className="font-bold text-slate-800 mt-4">Step-by-Step</h4>
          <p>Perfect for processes, tutorials, and instructions. Each bullet represents a sequential action that builds on the previous one. Uses numbered format for clear progression.</p>
          <h4 className="font-bold text-slate-800 mt-4">Pros and Cons</h4>
          <p>Splits content into balanced positive and negative points for objective analysis. Great for product reviews, decision-making, and comparative analysis. Presents both sides clearly.</p>
          <h4 className="font-bold text-slate-800 mt-4">Summary Bullets</h4>
          <p>Provides a comprehensive overview of all key information in the text. Captures every important detail without prioritizing. Useful for study notes, content briefs, and documentation.</p>
        </ArticleSection>

        <ArticleSection title="Writing Better Bullet Points">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Start with action verbs:</strong> "Increase revenue," "Reduce costs," and "Improve efficiency" are more impactful than "Revenue increases" or "Cost reductions."</li>
            <li><strong className="text-slate-800">Keep them parallel:</strong> Each bullet should follow the same grammatical structure. If the first starts with a verb, all should start with verbs.</li>
            <li><strong className="text-slate-800">Be concise:</strong> Each bullet should be one line or two at most. If you need more detail, use nested sub-points.</li>
            <li><strong className="text-slate-800">Limit your list:</strong> Aim for 5 to 9 main bullets. Break longer lists into categories with sub-headings.</li>
            <li><strong className="text-slate-800">Use consistent punctuation:</strong> Either end every bullet with a period or none of them. Mixing is distracting.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="When to Use Nested Sub-Points">
          <p>Nested bullets add a second level of detail beneath main points. They are useful when:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Complex topics:</strong> When a main point needs 2-3 supporting details or examples to be fully understood.</li>
            <li><strong className="text-slate-800">Categorized information:</strong> When you have broad categories (main bullets) with specific items underneath.</li>
            <li><strong className="text-slate-800">Process steps:</strong> When each step has sub-steps or important notes that clarify the main action.</li>
            <li><strong className="text-slate-800">Presentations:</strong> When you want to reveal details progressively, using main points as talking points and sub-points as supporting evidence.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Never go deeper than two levels of nesting. Three or more levels create visual complexity that defeats the purpose of using bullet points in the first place.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Exporting and Formatting Bullet Lists">
          <p>Different platforms require different formatting. Here is how to adapt your bullet lists:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Markdown:</strong> Uses dashes or asterisks with indentation for sub-points. Perfect for GitHub, documentation, and note-taking apps like Obsidian.</li>
            <li><strong className="text-slate-800">HTML:</strong> Proper ul/li nesting for web content. Maintains semantic structure and accessibility.</li>
            <li><strong className="text-slate-800">Plain text:</strong> Uses bullet characters and spacing. Works everywhere including emails and chat messages.</li>
            <li><strong className="text-slate-800">Presentations:</strong> Keep to one idea per bullet, use larger fonts, and limit each slide to 5-6 bullets maximum.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `bp-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="border-b border-slate-200 py-4">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left group" data-testid={`button-article-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} aria-expanded={open} aria-controls={panelId}>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div id={panelId} className="pt-4 text-slate-600 text-[15px] leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
