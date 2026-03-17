import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SimplifierArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Simplify Complex Sentences: A Complete Guide
        </h2>

        <ArticleSection title="Why Sentence Simplification Matters">
          <p>Complex sentences create barriers to understanding. Research shows that readers spend 40% more time processing unnecessarily complex text, and comprehension drops significantly when sentences exceed 25 words or use uncommon vocabulary.</p>
          <p>Simplified writing is not about dumbing down content. It is about making ideas accessible to everyone, including non-native speakers, students encountering new subjects, and professionals who need to quickly grasp information outside their expertise.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The average American reads at an 8th-grade level. Government agencies and health organizations are required to write at or below this level for public communications.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Understanding Simplification Levels">
          <h4 className="font-bold text-slate-800 mt-4">Slightly Simpler</h4>
          <p>Replaces uncommon words with common alternatives while keeping the sentence structure intact. Best for academic or professional contexts where some formality is appropriate. Example: "utilize" becomes "use," but technical terms may remain.</p>
          <h4 className="font-bold text-slate-800 mt-4">Moderately Simpler</h4>
          <p>Both vocabulary and sentence structure are adjusted. Long sentences may be split, passive voice becomes active, and jargon is replaced with everyday words. This level works well for general audiences and most writing situations.</p>
          <h4 className="font-bold text-slate-800 mt-4">ELI5 (Explain Like I'm 5)</h4>
          <p>Reduces everything to the most basic language possible. Uses short sentences, common words, and often adds analogies or comparisons to familiar concepts. Ideal for explaining complex topics to children or complete beginners.</p>
        </ArticleSection>

        <ArticleSection title="Common Patterns in Complex Writing">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Nominalizations:</strong> Turning verbs into nouns makes sentences longer and harder to follow. "The implementation of the strategy" is simpler as "implementing the strategy" or "using the strategy."</li>
            <li><strong className="text-slate-800">Passive voice:</strong> "The report was written by the team" is clearer as "The team wrote the report." Active voice puts the actor first.</li>
            <li><strong className="text-slate-800">Excessive qualifiers:</strong> Words like "very," "extremely," "particularly," and "significantly" often add length without meaning.</li>
            <li><strong className="text-slate-800">Jargon and technical terms:</strong> Every field has specialized vocabulary. When writing for a general audience, replace jargon with plain language equivalents.</li>
            <li><strong className="text-slate-800">Long prepositional chains:</strong> "The analysis of the impact of the policy on the economy" can be simplified to "How the policy affects the economy."</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Benefits for ESL Learners">
          <p>Sentence simplification is one of the most effective learning tools for English as a Second Language students. By seeing complex sentences alongside their simplified versions, learners can:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Build vocabulary:</strong> Learn the relationship between formal and informal word choices.</li>
            <li><strong className="text-slate-800">Understand grammar:</strong> See how sentence structures can be rearranged for clarity.</li>
            <li><strong className="text-slate-800">Develop reading skills:</strong> Practice comprehension with texts at their level while seeing the original for reference.</li>
            <li><strong className="text-slate-800">Improve writing:</strong> Learn which word choices and structures make writing clearer.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Use the vocabulary learning feature to save unfamiliar words. Reviewing these words regularly is one of the fastest ways to expand your English vocabulary.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="When to Use Each Simplification Level">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Slightly Simpler:</strong> Professional emails, academic papers for a broader audience, business documents, journalism.</li>
            <li><strong className="text-slate-800">Moderately Simpler:</strong> Blog posts, marketing copy, user guides, training materials, public communications.</li>
            <li><strong className="text-slate-800">ELI5:</strong> Teaching complex concepts to beginners, children's explanations, accessibility content, quick summaries of technical topics.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `simp-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
