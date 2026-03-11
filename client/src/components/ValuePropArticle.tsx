import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ValuePropArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write a Value Proposition That Converts: Complete Guide
        </h2>

        <ArticleSection title="What Is a Value Proposition?">
          <p>A value proposition is a clear statement that explains how your product solves a problem, delivers benefits, and why customers should choose you over competitors. It is the single most important piece of copy on your website and in your marketing materials.</p>
          <p>A strong value proposition answers three questions in seconds: What do you offer? Who is it for? Why should they care? If a visitor cannot understand your value proposition within 5 seconds, you are losing customers.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Your value proposition is not a slogan or tagline. It is a specific, testable promise of value that sets clear expectations for what customers will experience.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Value Proposition Frameworks">
          <h4 className="font-bold text-slate-800 mt-4">Jobs-to-be-Done</h4>
          <p>"When [situation], I want [motivation], so I can [outcome]." This framework focuses on what your customer is trying to accomplish in a specific context. It shifts thinking from product features to customer progress.</p>
          <h4 className="font-bold text-slate-800 mt-4">Feature-Benefit</h4>
          <p>"We provide [feature] to help [audience] achieve [benefit]." This straightforward framework connects what you build to the outcome customers care about. Works best for product-led companies with clear functional benefits.</p>
          <h4 className="font-bold text-slate-800 mt-4">Problem-Solution-Outcome</h4>
          <p>"[Audience] struggles with [problem]. We solve it with [solution], so they can [outcome]." This framework leads with pain, which creates urgency and emotional connection before presenting the solution.</p>
          <h4 className="font-bold text-slate-800 mt-4">Before-After</h4>
          <p>"From [painful before] to [desired after]." This framework paints a transformation story. It works especially well for services, courses, and lifestyle products where the change is the value.</p>
          <h4 className="font-bold text-slate-800 mt-4">Position-Differentiation</h4>
          <p>"We are the only [category] that [unique claim]." This framework emphasizes what makes you different from alternatives. Best used when entering a crowded market where differentiation is your primary advantage.</p>
        </ArticleSection>

        <ArticleSection title="Clarity Score: What Makes a Good Value Proposition">
          <p>A high-clarity value proposition scores well on seven dimensions:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Specificity:</strong> Uses concrete numbers and outcomes rather than vague promises. "Save 10 hours per week" beats "save time."</li>
            <li><strong className="text-slate-800">Audience clarity:</strong> Clearly identifies who the product is for. The reader should immediately know if they are the target customer.</li>
            <li><strong className="text-slate-800">Benefit focus:</strong> Leads with outcomes the customer cares about, not features or technology.</li>
            <li><strong className="text-slate-800">Differentiation:</strong> Explains why you are different from or better than alternatives, including doing nothing.</li>
            <li><strong className="text-slate-800">Simplicity:</strong> Uses plain language anyone can understand. No jargon, no buzzwords, no marketing fluff.</li>
            <li><strong className="text-slate-800">Memorability:</strong> Is concise enough to remember and repeat. If your team cannot recite it, it is too complicated.</li>
            <li><strong className="text-slate-800">Credibility:</strong> Makes claims that are believable and, ideally, provable. Extraordinary claims need extraordinary evidence.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Where to Use Your Value Proposition">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Website hero section:</strong> The first thing visitors see. Use the one-liner or detailed format.</li>
            <li><strong className="text-slate-800">Social media bios:</strong> Use the tagline format for Twitter, LinkedIn, and Instagram profiles.</li>
            <li><strong className="text-slate-800">Pitch decks:</strong> Use the detailed format on your opening slide or problem-solution slide.</li>
            <li><strong className="text-slate-800">Email signatures:</strong> Use the tagline or one-liner in professional email signatures.</li>
            <li><strong className="text-slate-800">Ad copy:</strong> Use different formats as starting points for advertising headlines and body copy.</li>
            <li><strong className="text-slate-800">Sales conversations:</strong> Use the problem-solution-outcome format to structure discovery calls.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Common Value Proposition Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Too vague:</strong> "We make things better" tells customers nothing. Be specific about what, for whom, and how much better.</li>
            <li><strong className="text-slate-800">Feature-focused:</strong> "Built with AI and machine learning" describes technology, not value. Translate features into outcomes.</li>
            <li><strong className="text-slate-800">No differentiation:</strong> If your value proposition could apply to any competitor, it is not doing its job.</li>
            <li><strong className="text-slate-800">Too long:</strong> If you need a paragraph to explain your value, you have not found the core message yet.</li>
            <li><strong className="text-slate-800">Internal language:</strong> Using company jargon or industry terms that customers do not understand or care about.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Test your value proposition by showing it to someone unfamiliar with your product. Ask them: "What does this company do? Who is it for? Why should you choose them?" If they cannot answer all three, revise.</p>
          </div>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left group" data-testid={`button-article-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} aria-expanded={open}>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-4 text-slate-600 text-[15px] leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
