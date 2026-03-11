import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ParagraphRewriterArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Rewrite Paragraphs Effectively: Complete Guide
        </h2>

        <ArticleSection title="Why Rewriting Matters">
          <p>Good writing rarely comes out perfect on the first draft. Rewriting is where clarity, impact, and precision are born. Professional writers spend more time rewriting than writing because the revision process is where rough ideas become polished communication.</p>
          <p>Rewriting is not just about fixing errors. It is about finding the best way to express your ideas so readers understand them immediately. A well-rewritten paragraph can transform confusing content into something clear, engaging, and memorable.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The best writers are actually the best rewriters. Ernest Hemingway rewrote the ending of A Farewell to Arms 47 times. The difference between average and excellent writing is almost always in the revision.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Understanding Rewrite Styles">
          <h4 className="font-bold text-slate-800 mt-4">Formal Style</h4>
          <p>Uses professional language, complete sentences, and sophisticated vocabulary. Ideal for business communications, official documents, and proposals. Avoids contractions, slang, and casual expressions.</p>
          <h4 className="font-bold text-slate-800 mt-4">Casual Style</h4>
          <p>Conversational and friendly, using everyday language that feels natural. Perfect for blog posts, social media content, and personal communications. Uses contractions, shorter sentences, and relatable phrasing.</p>
          <h4 className="font-bold text-slate-800 mt-4">Academic Style</h4>
          <p>Scholarly and precise, with formal structure and evidence-based language. Best for essays, research papers, and academic submissions. Emphasizes technical accuracy and objective tone.</p>
          <h4 className="font-bold text-slate-800 mt-4">Creative Style</h4>
          <p>Engaging and vivid, with varied sentence structures and compelling flow. Great for marketing copy, storytelling, and content that needs to captivate readers. Prioritizes personality and engagement.</p>
          <h4 className="font-bold text-slate-800 mt-4">Professional Style</h4>
          <p>Clear and direct with business-appropriate language. The go-to choice for emails, reports, and workplace communications. Balances formality with accessibility and uses active voice.</p>
        </ArticleSection>

        <ArticleSection title="Choosing the Right Rewrite Strength">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Light:</strong> Makes minor improvements while keeping most of your original phrasing. Fixes awkward wording, improves flow, and corrects small issues. About 70% of the original words remain. Use this when your paragraph is mostly good but needs polishing.</li>
            <li><strong className="text-slate-800">Moderate:</strong> Significant rephrasing with new sentence structures and better word choices. About 40-50% of the original words remain. This is the sweet spot for most rewriting needs, giving you noticeably improved text while maintaining your core message.</li>
            <li><strong className="text-slate-800">Complete:</strong> A total rewrite where the meaning is preserved but expressed in entirely new language. Only 10-20% of the original words may remain. Use this when you want a fresh perspective on expressing your ideas or when the original text needs fundamental restructuring.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Tips for Better Paragraph Rewriting">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Start with your purpose:</strong> Before rewriting, ask yourself what the paragraph needs to achieve. Every sentence should serve that goal.</li>
            <li><strong className="text-slate-800">Consider your audience:</strong> A paragraph for executives reads differently than one for students. Match your language to who will read it.</li>
            <li><strong className="text-slate-800">Use active voice:</strong> Active voice creates clearer, more direct sentences. Instead of "The report was written by Sarah," write "Sarah wrote the report."</li>
            <li><strong className="text-slate-800">Cut unnecessary words:</strong> If a word does not add meaning, remove it. "In order to" becomes "to." "Due to the fact that" becomes "because."</li>
            <li><strong className="text-slate-800">Read it aloud:</strong> If a sentence sounds awkward when spoken, it will sound awkward when read. Your ear catches what your eye misses.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Compare all three versions the tool generates. Often, combining elements from different versions produces the best result. Take the opening from Version 1, the structure from Version 2, and the closing from Version 3.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Common Writing Problems Solved by Rewriting">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Wordiness:</strong> Paragraphs bloated with unnecessary words lose their impact. Rewriting trims the fat and sharpens your message.</li>
            <li><strong className="text-slate-800">Passive voice overuse:</strong> Passive constructions make writing feel weak and indirect. Rewriting shifts to active voice for stronger sentences.</li>
            <li><strong className="text-slate-800">Tone mismatch:</strong> Writing that is too formal for a blog or too casual for a proposal undermines your message. Rewriting adjusts tone to match context.</li>
            <li><strong className="text-slate-800">Poor flow:</strong> Disjointed sentences make paragraphs hard to follow. Rewriting creates logical transitions and smooth reading experiences.</li>
            <li><strong className="text-slate-800">Repetition:</strong> Saying the same thing multiple ways weakens your argument. Rewriting consolidates ideas for maximum impact.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `pr-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
