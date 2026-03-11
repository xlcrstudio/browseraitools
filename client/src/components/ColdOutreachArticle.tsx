import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ColdOutreachArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write Cold Outreach Messages That Get Responses: 2026 Guide
        </h2>

        <ArticleSection title="Why Cold Outreach Still Works">
          <p>Despite the flood of automated messages, personalized cold outreach remains one of the most effective ways to build professional relationships. The key difference is authenticity. Generic templates get ignored, but genuine, well-researched messages still get responses at high rates.</p>
          <p>Research shows that personalized outreach messages have a 3-5x higher response rate than templated ones. When you reference specific content, mention mutual connections, or demonstrate genuine knowledge of someone's work, you immediately stand out from the noise.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The most successful cold outreach messages lead with value, not asks. Show what you can offer before requesting anything.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="The Anatomy of a Great Outreach Message">
          <h4 className="font-bold text-slate-800 mt-4">1. Personalized Opening</h4>
          <p>Reference something specific about the recipient: a piece of content they created, a project they launched, or a mutual connection. This signals that your message is not a mass-sent template.</p>
          <h4 className="font-bold text-slate-800 mt-4">2. Brief Context About You</h4>
          <p>Keep this to one sentence. Establish your credibility without making the message about you. Your role, your company, or your relevant experience in one concise line.</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Mutual Value Proposition</h4>
          <p>Explain what makes this connection relevant for both of you. What can you offer them? Why would connecting benefit both parties? Focus on collaboration, not extraction.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. Low-Barrier Ask</h4>
          <p>Your ask should be easy to say yes to. A 15-minute call is better than "let's meet." A specific question is better than "pick your brain." Make it effortless for them to respond.</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Professional Close</h4>
          <p>End warmly but professionally. "No worries if the timing is not right" reduces pressure and actually increases response rates.</p>
        </ArticleSection>

        <ArticleSection title="LinkedIn vs Email Outreach">
          <h4 className="font-bold text-slate-800 mt-4">LinkedIn Connection Requests</h4>
          <p>Limited to 300 characters, connection requests need to be laser-focused. Reference one specific thing, state your interest in connecting, and keep it concise. Acceptance rates of 60-70% are common with good personalization.</p>
          <h4 className="font-bold text-slate-800 mt-4">LinkedIn Messages</h4>
          <p>More room to elaborate (up to 2000 characters). Best for second-touch after a connection is accepted. Include a clear value proposition and a specific, time-bound ask.</p>
          <h4 className="font-bold text-slate-800 mt-4">Email Outreach</h4>
          <p>Email allows for the most flexibility. You can include subject lines, formatting, and longer context. Best for formal partnership proposals, interview requests, and detailed collaboration ideas.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> For maximum effectiveness, send a LinkedIn connection request first with a brief note, then follow up with a detailed email or LinkedIn message after they accept.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Follow-Up Strategy">
          <p>Most professionals are busy, not uninterested. A well-timed follow-up can increase your overall response rate by 20-30%. Here is the recommended sequence:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Initial message:</strong> Day 0. Your best, most personalized outreach.</li>
            <li><strong className="text-slate-800">Follow-up 1:</strong> Day 5-7. Brief, friendly bump. Reference original message. Add a new angle or value point.</li>
            <li><strong className="text-slate-800">Follow-up 2:</strong> Day 12-14. Final touch. Graceful close with an open door. "No worries if timing is not right."</li>
            <li><strong className="text-slate-800">After 3 touches:</strong> Stop. Do not be pushy. Move on and try again in a few months if appropriate.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Common Cold Outreach Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Generic templates:</strong> If it could be sent to anyone, it will be ignored by everyone.</li>
            <li><strong className="text-slate-800">All about you:</strong> The message should focus on mutual benefit, not your resume or pitch deck.</li>
            <li><strong className="text-slate-800">Asking for too much:</strong> Do not ask for a 1-hour meeting, a job, or an investment in your first message.</li>
            <li><strong className="text-slate-800">Too long:</strong> Aim for 5-7 sentences. Respect their time. If they need to scroll, it is too long.</li>
            <li><strong className="text-slate-800">Being pushy:</strong> "Just following up for the fifth time" is not networking. It is harassment.</li>
            <li><strong className="text-slate-800">No clear ask:</strong> If the recipient does not know what you want, they will not respond.</li>
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
        aria-expanded={open}
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
