import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ShortenerArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write Concise Sentences: A Complete Guide
        </h2>

        <ArticleSection title="Why Concise Writing Matters">
          <p>Concise writing communicates ideas more effectively. Research shows that readers lose attention after 20-25 words per sentence. Shorter sentences are easier to understand, more persuasive, and more memorable.</p>
          <p>In professional contexts, wordiness signals unclear thinking. Executives, editors, and readers all prefer direct communication. Cutting unnecessary words demonstrates command of your subject and respect for your reader's time.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Most first-draft sentences can be shortened by 30-50% without losing meaning. The words you remove are rarely missed.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Common Wordiness Patterns">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Wordy phrases:</strong> Replace "due to the fact that" with "because," "in order to" with "to," "at this point in time" with "now," and "in the event that" with "if."</li>
            <li><strong className="text-slate-800">Redundancies:</strong> Eliminate pairs where one word already covers the meaning: "past history" (history), "future plans" (plans), "basic fundamentals" (fundamentals), "end result" (result).</li>
            <li><strong className="text-slate-800">Unnecessary qualifiers:</strong> Remove words like "very," "really," "basically," "actually," "literally," and "honestly" that add no meaning.</li>
            <li><strong className="text-slate-800">Passive voice inflation:</strong> "The report was written by the team" becomes "The team wrote the report," saving 2 words and adding directness.</li>
            <li><strong className="text-slate-800">Nominalizations:</strong> Turn verb-based nouns back into verbs: "made an improvement to" becomes "improved," "conducted an investigation into" becomes "investigated."</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="The Three Shortening Levels">
          <h4 className="font-bold text-slate-800 mt-4">Slightly Shorter (20-30% reduction)</h4>
          <p>Removes obvious wordiness while preserving the original sentence structure. Best when you need to tighten writing without changing the voice or style. Ideal for editing emails, reports, and professional documents.</p>
          <h4 className="font-bold text-slate-800 mt-4">Concise (40-60% reduction)</h4>
          <p>Significant restructuring for maximum clarity. Rephrases for brevity while maintaining all essential meaning. Best for content that needs to be scannable and direct, like web copy, presentations, and summaries.</p>
          <h4 className="font-bold text-slate-800 mt-4">Ultra Concise (60-80% reduction)</h4>
          <p>Strips down to the absolute essential words. Maximum impact with minimum words. Best for headlines, subject lines, bullet points, and social media where every character counts.</p>
        </ArticleSection>

        <ArticleSection title="Special Format Outputs">
          <h4 className="font-bold text-slate-800 mt-4">Tweet-Length (280 characters)</h4>
          <p>Social media platforms enforce strict character limits. A tweet-length version ensures your message fits Twitter/X while remaining complete and impactful. The tool counts characters precisely so you never exceed the limit.</p>
          <h4 className="font-bold text-slate-800 mt-4">Headline Version (10 words max)</h4>
          <p>Headlines need to capture attention instantly. The headline version distills your sentence to its most essential elements, perfect for article titles, email subject lines, presentation slides, and ad copy.</p>
        </ArticleSection>

        <ArticleSection title="When Not to Shorten">
          <p>Not every sentence benefits from shortening. Some contexts require more words:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Legal and technical writing:</strong> Precision may require specific wording. Removing qualifiers or conditions can change meaning in contracts, specifications, or regulatory documents.</li>
            <li><strong className="text-slate-800">Creative writing:</strong> Rhythm, voice, and style sometimes depend on longer sentence structures. A character's meandering speech pattern is intentional, not wordy.</li>
            <li><strong className="text-slate-800">Emotional impact:</strong> Sometimes the buildup matters. "I waited for three years, through two deployments and countless sleepless nights, to hear those words" hits differently shortened.</li>
            <li><strong className="text-slate-800">Nuanced arguments:</strong> Complex ideas with multiple qualifications may need the extra words to be accurate. Oversimplification can misrepresent your position.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `shr-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
