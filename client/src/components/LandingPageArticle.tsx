import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function LandingPageArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write Landing Page Copy That Converts: Complete Guide
        </h2>

        <ArticleSection title="Why Landing Page Copy Matters">
          <p>Your landing page has one job: convert visitors into customers, subscribers, or leads. Studies show that companies with 10-15 landing pages see 55% more conversions than those with fewer than 10. The difference between a page that converts at 2% and one that converts at 10% almost always comes down to copy.</p>
          <p>Great landing page copy does not just describe your product. It connects your solution to your visitor's pain point, builds trust through social proof, and guides them toward a clear next step with zero friction.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Visitors decide whether to stay or leave within 5 seconds. Your hero headline and subheadline are the most critical elements on the entire page.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Essential Landing Page Sections">
          <h4 className="font-bold text-slate-800 mt-4">1. Hero Section</h4>
          <p>Your hero section includes the headline, subheadline, and primary CTA. The headline should communicate your main benefit in under 10 words. The subheadline expands on the promise and adds credibility. Your CTA button should use action-oriented language like "Start Free Trial" not "Submit."</p>
          <h4 className="font-bold text-slate-800 mt-4">2. Features Section</h4>
          <p>List 5-7 key features, but frame each one as a benefit. Instead of "AI-powered automation," write "Save 10 hours per week with intelligent automation." Each feature should answer the visitor's question: "What does this do for me?"</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Benefits Section</h4>
          <p>Use a before/after format to show transformation. "Before: Spending hours on manual data entry. After: AI handles it while you focus on growth." This makes the value concrete and relatable.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. Social Proof</h4>
          <p>Include user counts, ratings, testimonials, and logos of featured publications or clients. Social proof reduces risk perception and builds trust. Even early-stage products can use beta user feedback or advisory quotes.</p>
          <h4 className="font-bold text-slate-800 mt-4">5. FAQ Section</h4>
          <p>Address the 8-10 most common objections disguised as questions. Pricing concerns, setup complexity, support availability, and cancellation policies are the top friction points for most products.</p>
          <h4 className="font-bold text-slate-800 mt-4">6. Final CTA</h4>
          <p>Restate your core benefit, remind visitors of social proof, add risk reversal (guarantee, free trial), and present a clear, prominent call to action. This is your last chance to convert.</p>
        </ArticleSection>

        <ArticleSection title="Copywriting Frameworks That Work">
          <h4 className="font-bold text-slate-800 mt-4">PAS (Problem-Agitate-Solution)</h4>
          <p>Identify the problem, agitate the pain, then present your product as the solution. This framework works because it validates the visitor's struggle before offering relief.</p>
          <h4 className="font-bold text-slate-800 mt-4">AIDA (Attention-Interest-Desire-Action)</h4>
          <p>Grab attention with a bold headline, build interest with features, create desire with benefits and social proof, then drive action with a clear CTA.</p>
          <h4 className="font-bold text-slate-800 mt-4">BAB (Before-After-Bridge)</h4>
          <p>Show the visitor's current state, paint a picture of their desired state, then bridge the gap with your product as the path from before to after.</p>
        </ArticleSection>

        <ArticleSection title="Landing Page Types">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">SaaS/Software:</strong> Focus on features, integrations, and ROI. Emphasize time and money saved. Free trial CTAs work best.</li>
            <li><strong className="text-slate-800">E-commerce:</strong> Focus on product quality, benefits, and guarantees. Use high-quality imagery descriptions and customer reviews.</li>
            <li><strong className="text-slate-800">Online Course:</strong> Focus on transformation and outcomes. Curriculum overview, instructor credibility, and student results are key.</li>
            <li><strong className="text-slate-800">Service/Agency:</strong> Focus on expertise, process, and results. Case studies and client testimonials drive conversions.</li>
            <li><strong className="text-slate-800">Mobile App:</strong> Focus on features, screenshots, and download numbers. App store ratings add credibility.</li>
            <li><strong className="text-slate-800">Lead Generation:</strong> Focus on value exchange. Offer something valuable (ebook, consultation, trial) in exchange for contact information.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Common Landing Page Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Too many CTAs:</strong> One primary action per page. Multiple competing CTAs confuse visitors and reduce conversions.</li>
            <li><strong className="text-slate-800">Feature dumping:</strong> List benefits, not features. Visitors buy outcomes, not technology.</li>
            <li><strong className="text-slate-800">No social proof:</strong> Without evidence of others' success, visitors have to take your word for it. They will not.</li>
            <li><strong className="text-slate-800">Weak headlines:</strong> Vague or clever headlines that do not communicate value lose visitors immediately.</li>
            <li><strong className="text-slate-800">Too much text:</strong> Keep paragraphs short, use bullet points, and make the page scannable. Mobile visitors will not read walls of text.</li>
            <li><strong className="text-slate-800">No risk reversal:</strong> Guarantees, free trials, and "cancel anytime" dramatically reduce purchase anxiety.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Test your headline first. It has the single biggest impact on conversion rate. A/B test at least 3 variations before optimizing other sections.</p>
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
