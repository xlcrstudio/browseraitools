import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AdCopyArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write High-Converting Ad Copy: Complete Guide
        </h2>

        <ArticleSection title="What Makes Great Ad Copy?">
          <p>Great ad copy grabs attention in a split second, communicates a clear benefit, and compels the reader to take action. In a world of endless scrolling, your ad has less than 3 seconds to make an impression.</p>
          <p>The best-performing ads share common traits: they lead with benefits (not features), speak directly to a specific audience, include social proof or specific numbers, and end with a clear, low-barrier call to action.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Ads with specific numbers in headlines get 36% more clicks. "Save 10 Hours/Week" outperforms "Save Time" every time.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Ad Copy Structure">
          <p>Every effective ad follows a proven three-part structure that guides viewers from attention to action:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. Headline</h4>
          <p>Your headline is the hook. Keep it to 5-10 words, focus on one clear benefit or curiosity gap, and include numbers when possible. On Facebook, headlines under 40 characters perform best. For Google Ads, match the search intent directly.</p>
          <h4 className="font-bold text-slate-800 mt-4">2. Primary Text (Body Copy)</h4>
          <p>Expand on the headline's promise. Lead with the benefit, address a pain point, and provide proof. Keep it scannable with short sentences. For social platforms, 125 characters is the sweet spot before the "See More" truncation.</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Call-to-Action (CTA)</h4>
          <p>Use action verbs that convey value: "Start Free Trial," "Get 50% Off," "Download Now." Avoid weak CTAs like "Learn More" or "Click Here." The best CTAs create urgency and reduce friction.</p>
        </ArticleSection>

        <ArticleSection title="Platform-Specific Best Practices">
          <h4 className="font-bold text-slate-800 mt-4">Facebook & Instagram</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Stop the scroll:</strong> Your first line must hook attention immediately. Ask a question, make a bold claim, or call out your audience directly.</li>
            <li><strong className="text-slate-800">Mobile-first:</strong> 94% of Facebook ad revenue comes from mobile. Keep sentences short and punchy.</li>
            <li><strong className="text-slate-800">Social proof:</strong> Numbers, testimonials, and user counts dramatically increase click-through rates.</li>
          </ul>
          <h4 className="font-bold text-slate-800 mt-4">Google Search Ads</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Match search intent:</strong> Your headline should mirror what the user searched for. Include the main keyword naturally.</li>
            <li><strong className="text-slate-800">Headline limits:</strong> 30 characters per headline. Make every character count.</li>
            <li><strong className="text-slate-800">Specific offers:</strong> "Get 40% Off Today" beats "Great Prices Available" every time.</li>
          </ul>
          <h4 className="font-bold text-slate-800 mt-4">LinkedIn</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Professional tone:</strong> B2B audiences respond to data, case studies, and ROI-focused messaging.</li>
            <li><strong className="text-slate-800">Thought leadership:</strong> Position your brand as an authority with insight-driven copy.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="A/B Testing Your Ad Copy">
          <p>Never run just one ad. Create multiple variations and test them against each other to find what resonates with your audience.</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Test one variable at a time:</strong> Change only the headline, or only the CTA, so you know what made the difference.</li>
            <li><strong className="text-slate-800">Run for enough data:</strong> Give each variation at least 1,000 impressions before drawing conclusions.</li>
            <li><strong className="text-slate-800">Test angles, not tweaks:</strong> "Social proof vs. urgency" is a better test than "Get vs. Try."</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Social proof headlines typically outperform benefit-focused headlines by 15-25% for retargeting campaigns, while benefit headlines win for cold traffic.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Common Ad Copy Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Too much text:</strong> Ads are not blog posts. Trim ruthlessly until every word earns its place.</li>
            <li><strong className="text-slate-800">Features over benefits:</strong> "AI-powered analytics" means nothing. "See exactly where you're losing customers" sells.</li>
            <li><strong className="text-slate-800">Weak CTAs:</strong> "Learn More" is the most common CTA and the least effective. Be specific about what happens next.</li>
            <li><strong className="text-slate-800">No social proof:</strong> If thousands of people use your product, say so. Numbers build instant credibility.</li>
            <li><strong className="text-slate-800">Generic messaging:</strong> "The best solution for your needs" could be any product. Be specific about who you help and how.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left group"
        data-testid={`button-article-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-slate-600 text-[15px] leading-relaxed space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
