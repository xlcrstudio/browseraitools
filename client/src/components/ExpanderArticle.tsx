import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ExpanderArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Expand Sentences Effectively: A Writer's Guide
        </h2>

        <ArticleSection title="Why Expand Sentences">
          <p>Short sentences convey ideas quickly, but they often lack the context, evidence, and nuance that make writing persuasive and informative. Expanding sentences is a core writing skill used in academic essays, business reports, blog posts, and creative writing.</p>
          <p>The goal is not simply to make text longer. Effective expansion adds value through specific details, concrete examples, relevant context, and supporting evidence that helps readers understand and engage with your ideas.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The best expanded sentences answer the questions a reader would naturally ask: How? Why? When? What does this mean in practice? What are the implications?</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Expansion Techniques">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Add context:</strong> Explain the background or circumstances that make your statement relevant. "Sales increased" becomes "Sales increased 23% in Q3 following the launch of our new marketing campaign."</li>
            <li><strong className="text-slate-800">Include examples:</strong> Concrete examples make abstract ideas tangible. "AI helps businesses" becomes "AI helps businesses by automating customer service through chatbots, predicting inventory needs, and personalizing marketing campaigns."</li>
            <li><strong className="text-slate-800">Provide evidence:</strong> Statistics, research findings, and expert quotes add credibility. "Exercise is beneficial" becomes "Regular exercise reduces the risk of heart disease by up to 35%, according to the American Heart Association."</li>
            <li><strong className="text-slate-800">Explain the mechanism:</strong> Tell readers how something works. "Coffee keeps you awake" becomes "Coffee keeps you awake by blocking adenosine receptors in the brain, preventing the buildup of sleep-promoting signals."</li>
            <li><strong className="text-slate-800">Add qualifications:</strong> Nuance makes writing more accurate. "Social media is harmful" becomes "Excessive social media use, particularly among teenagers, has been associated with increased rates of anxiety and depression, though moderate use can support social connection."</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Choosing the Right Expansion Level">
          <h4 className="font-bold text-slate-800 mt-4">Slightly Longer (2-3x)</h4>
          <p>Adds one or two supporting details without changing the sentence structure dramatically. Best for: email writing, social media captions, product descriptions, and any context where brevity still matters.</p>
          <h4 className="font-bold text-slate-800 mt-4">Paragraph Expansion (4-6x)</h4>
          <p>Transforms a sentence into a full paragraph with context, examples, and explanation. Best for: blog posts, essays, reports, and content writing where thorough coverage is expected.</p>
          <h4 className="font-bold text-slate-800 mt-4">Detailed Explanation (8-12x)</h4>
          <p>Creates comprehensive coverage with multiple angles, statistics, expert perspectives, and thorough analysis. Best for: research papers, detailed guides, technical documentation, and educational content.</p>
        </ArticleSection>

        <ArticleSection title="Common Expansion Mistakes to Avoid">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Padding with filler:</strong> Adding "very," "really," "basically," and other empty words makes text longer without adding value. Every word should earn its place.</li>
            <li><strong className="text-slate-800">Redundancy:</strong> Repeating the same idea in different words inflates word count but frustrates readers. "The large, big, sizeable building" uses three words to say one thing.</li>
            <li><strong className="text-slate-800">Losing focus:</strong> Expansion should deepen the original idea, not wander into tangential topics. Stay connected to your core message.</li>
            <li><strong className="text-slate-800">Over-qualifying:</strong> Too many hedging phrases ("it could be argued that," "in some cases perhaps") weaken your writing rather than adding nuance.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Best Practices for Academic and Professional Writing">
          <p>In academic and professional contexts, sentence expansion follows specific conventions:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Cite sources:</strong> When adding statistics or claims, reference where the information comes from.</li>
            <li><strong className="text-slate-800">Use field-appropriate language:</strong> Expand with terminology your audience expects and understands.</li>
            <li><strong className="text-slate-800">Balance detail with readability:</strong> Academic writing should be thorough but not unnecessarily complex. Aim for clarity even when being comprehensive.</li>
            <li><strong className="text-slate-800">Structure logically:</strong> When expanding into multiple sentences, follow a logical progression: claim, evidence, explanation, implication.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `exp-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
