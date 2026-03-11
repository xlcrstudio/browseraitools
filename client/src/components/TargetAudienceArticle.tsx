import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function TargetAudienceArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Define Your Target Audience: Complete Guide
        </h2>

        <ArticleSection title="Why Target Audience Research Matters">
          <p>Marketing to everyone is marketing to no one. Companies that deeply understand their target audience achieve 2-5x higher conversion rates compared to those using broad, untargeted messaging. Target audience research is the foundation of every successful marketing campaign, product launch, and business strategy.</p>
          <p>A well-defined target audience lets you craft messaging that resonates, choose channels that reach the right people, and allocate budget to tactics that actually convert. Without it, you are spending money on reaching people who will never buy from you.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The most successful brands do not try to appeal to everyone. They become the obvious choice for a specific group of people with specific needs.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Demographics vs Psychographics">
          <h4 className="font-bold text-slate-800 mt-4">Demographics (Who They Are)</h4>
          <p>Demographics describe observable, measurable characteristics: age, gender, income, education level, location, family status, and occupation. They answer "who" your customer is in factual terms. Demographics are useful for targeting on advertising platforms and estimating market size.</p>
          <h4 className="font-bold text-slate-800 mt-4">Psychographics (Why They Buy)</h4>
          <p>Psychographics go deeper into motivations: values, beliefs, interests, lifestyle, personality traits, and attitudes. They answer "why" your customer makes decisions. Psychographic data is what turns a demographic profile into a compelling marketing message. Two people with identical demographics can have completely different buying behaviors based on their psychographic profile.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Example:</strong> Two 35-year-old women earning $80k/year. One values convenience and buys meal delivery kits. The other values health and shops at farmers markets. Same demographics, completely different personas.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Building Effective Customer Personas">
          <p>A customer persona is a semi-fictional representation of your ideal customer based on research and data. Effective personas go beyond basic demographics to include goals, challenges, buying behavior, and preferred communication channels.</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Name and backstory:</strong> Give your persona a name and brief narrative. This makes them feel real and helps your team reference them consistently.</li>
            <li><strong className="text-slate-800">Goals and motivations:</strong> What is this person trying to achieve? What does success look like for them? Goals drive purchasing decisions.</li>
            <li><strong className="text-slate-800">Pain points:</strong> What frustrates them? What problems keep them up at night? Pain points create urgency and willingness to pay.</li>
            <li><strong className="text-slate-800">Buying behavior:</strong> How do they research products? Who influences their decisions? What triggers a purchase? What objections do they have?</li>
            <li><strong className="text-slate-800">Channel preferences:</strong> Where do they spend time online? What content do they consume? When are they most receptive to marketing?</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Market Segmentation Strategies">
          <h4 className="font-bold text-slate-800 mt-4">Geographic Segmentation</h4>
          <p>Segment by location, climate, urban vs rural, or regional preferences. Essential for local businesses and products with geographic relevance.</p>
          <h4 className="font-bold text-slate-800 mt-4">Behavioral Segmentation</h4>
          <p>Segment by purchase history, usage patterns, brand loyalty, and engagement level. Behavioral data is often the strongest predictor of future purchases.</p>
          <h4 className="font-bold text-slate-800 mt-4">Needs-Based Segmentation</h4>
          <p>Segment by the specific problem your product solves. Different customers may use the same product for different reasons, and your messaging should reflect that.</p>
          <h4 className="font-bold text-slate-800 mt-4">Value-Based Segmentation</h4>
          <p>Segment by customer lifetime value. Focus your highest-touch marketing on the segments that generate the most revenue and have the highest retention.</p>
        </ArticleSection>

        <ArticleSection title="Common Target Audience Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Too broad:</strong> "Everyone aged 18-65" is not a target audience. Narrow down until your messaging can be specific and resonant.</li>
            <li><strong className="text-slate-800">Assuming instead of researching:</strong> Do not project your own preferences onto your audience. Talk to real customers and look at real data.</li>
            <li><strong className="text-slate-800">Ignoring psychographics:</strong> Demographics alone cannot explain buying behavior. Two people with identical demographics can have completely different needs.</li>
            <li><strong className="text-slate-800">Static personas:</strong> Your audience evolves. Review and update personas quarterly based on new customer data and market changes.</li>
            <li><strong className="text-slate-800">Too many personas:</strong> Start with 3 primary personas. More than 5 creates confusion and dilutes your messaging focus.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Interview 10-15 existing customers before creating personas. Real conversations reveal insights that no amount of desk research can match.</p>
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
