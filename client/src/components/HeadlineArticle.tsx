import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function HeadlineArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write Headlines That Get Clicks: The Complete Guide
        </h2>

        <ArticleSection title="Why Headlines Matter">
          <p>Your headline is the most important piece of content you write. Research shows that 80% of people read headlines, but only 20% click through to read the full article. A compelling headline can mean the difference between content that gets ignored and content that goes viral.</p>
          <p>The best headlines combine emotional triggers, curiosity gaps, and clear value propositions. They promise specific benefits and create an irresistible urge to click. Whether you're writing blog posts, social media content, or email subject lines, mastering headline writing is essential.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Headlines with numbers get 36% more clicks. Headlines with brackets get 38% more clicks. Combining both can dramatically increase your click-through rate.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="The 6 Headline Styles That Work">
          <h4 className="font-bold text-slate-800 mt-4">1. Clickbait Headlines</h4>
          <p>Attention-grabbing headlines that create urgency and curiosity. Use sparingly and always deliver on the promise. Example: "You Won't Believe What Happened When I Tried This Money-Saving Trick"</p>
          <h4 className="font-bold text-slate-800 mt-4">2. SEO-Optimized Headlines</h4>
          <p>Keyword-rich headlines designed for search engine visibility. Keep under 60 characters for full display in search results. Include the target keyword near the beginning. Example: "Money Saving Tips: 15 Proven Strategies for 2026"</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Professional Headlines</h4>
          <p>Credible, authoritative headlines suited for B2B content, industry publications, and corporate communications. Example: "Strategic Financial Planning: A Framework for Sustainable Savings"</p>
          <h4 className="font-bold text-slate-800 mt-4">4. List-Style Headlines</h4>
          <p>Numbered headlines that promise specific, scannable content. Numbers like 7, 10, and 21 perform best. Odd numbers often outperform even numbers. Example: "7 Proven Money-Saving Habits That Actually Work"</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Curiosity Gap Headlines</h4>
          <p>Create an information gap that compels readers to click. The key is hinting at valuable information without revealing it. Example: "The One Money Habit That Changed Everything for Me"</p>
          <h4 className="font-bold text-slate-800 mt-4">6. Question Headlines</h4>
          <p>Engage readers by asking questions they want answered. The best question headlines address pain points and imply a solution exists. Example: "Are You Making These Common Money Mistakes?"</p>
        </ArticleSection>

        <ArticleSection title="Click Score: What Makes Headlines Perform">
          <p>A headline's click potential depends on several measurable factors:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Emotional impact:</strong> Headlines that trigger emotions (curiosity, fear, excitement, urgency) consistently outperform neutral headlines by 2-3x.</li>
            <li><strong className="text-slate-800">Specificity:</strong> Specific numbers, timeframes, and outcomes create credibility. "Save $500/month" beats "Save money" every time.</li>
            <li><strong className="text-slate-800">Length optimization:</strong> 6-13 words is the sweet spot. Too short lacks detail; too long gets truncated in search results and social feeds.</li>
            <li><strong className="text-slate-800">Power words:</strong> Words like "proven," "secret," "ultimate," "essential," and "surprising" trigger psychological responses that drive clicks.</li>
            <li><strong className="text-slate-800">Clarity of benefit:</strong> Readers should instantly understand what they'll gain by clicking. Vague headlines get ignored.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Platform-Specific Headline Strategies">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Blog Posts:</strong> Focus on SEO keywords, keep under 60 characters, and include the year for evergreen content. List formats perform consistently well.</li>
            <li><strong className="text-slate-800">Social Media:</strong> Prioritize curiosity and emotional triggers. Shorter headlines work better. Questions and bold claims drive engagement.</li>
            <li><strong className="text-slate-800">YouTube:</strong> Front-load the hook. Include brackets for format clarity [Tutorial], [2026]. Capitalize key words. Keep under 70 characters.</li>
            <li><strong className="text-slate-800">Email Subject Lines:</strong> Personalization increases open rates 26%. Keep under 50 characters. Create urgency without being spammy.</li>
            <li><strong className="text-slate-800">Ad Copy:</strong> Focus on the unique value proposition. Include a clear call to action. Test multiple variations and measure CTR.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="A/B Testing Your Headlines">
          <p>The best headline writers don't guess, they test. A/B testing lets you compare two headline variations and measure which performs better with real audiences.</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Test one variable at a time:</strong> Change the style, the number, or the emotional trigger, but not all at once. This isolates what's actually driving the difference.</li>
            <li><strong className="text-slate-800">Run tests long enough:</strong> You need statistical significance. For blog headlines, aim for at least 1,000 views per variation before declaring a winner.</li>
            <li><strong className="text-slate-800">Measure the right metric:</strong> CTR for search/email, engagement rate for social, view duration for YouTube. Different platforms require different success metrics.</li>
            <li><strong className="text-slate-800">Document your winners:</strong> Build a swipe file of your best-performing headlines. Over time, patterns emerge that make future headline writing faster and more effective.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `hdl-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
