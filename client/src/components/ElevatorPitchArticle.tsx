import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ElevatorPitchArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Craft the Perfect Elevator Pitch: Complete Guide
        </h2>

        <ArticleSection title="What Is an Elevator Pitch?">
          <p>An elevator pitch is a brief, persuasive speech that sparks interest in what you or your business does. It should be concise enough to deliver during a short elevator ride, typically 30 to 60 seconds.</p>
          <p>The best elevator pitches are not rehearsed monologues. They are natural, conversational, and tailored to the person you are speaking with. A pitch to an investor sounds very different from one to a potential customer.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Research shows that listeners form their first impression within 7 seconds. Your opening line is the most important part of your entire pitch.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Elevator Pitch Structure">
          <p>Every effective elevator pitch follows a proven framework that guides the listener from curiosity to action:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. The Hook</h4>
          <p>Start with something that grabs attention. A surprising statistic, a relatable problem, or a bold vision. "You know how..." is a classic opener because it creates instant connection.</p>
          <h4 className="font-bold text-slate-800 mt-4">2. The Problem</h4>
          <p>Clearly articulate the pain point your audience cares about. Be specific. "Entrepreneurs waste 15 hours a week on repetitive tasks" is stronger than "People waste time."</p>
          <h4 className="font-bold text-slate-800 mt-4">3. The Solution</h4>
          <p>Explain what you do in simple, jargon-free language. Focus on the outcome, not the technology. "We automate your workflows" beats "We use AI-powered RPA systems."</p>
          <h4 className="font-bold text-slate-800 mt-4">4. The Proof</h4>
          <p>Include a specific number, testimonial, or achievement that builds credibility. "500 teams already save 10+ hours per week" is concrete and believable.</p>
          <h4 className="font-bold text-slate-800 mt-4">5. The Ask</h4>
          <p>End with a clear, specific next step. "Can I send you a demo?" is better than "Let me know if you are interested."</p>
        </ArticleSection>

        <ArticleSection title="Pitching to Different Audiences">
          <h4 className="font-bold text-slate-800 mt-4">Investors</h4>
          <p>Lead with market size, traction, and ROI potential. Investors want to know the opportunity is big, you have proof it works, and there is a clear path to returns.</p>
          <h4 className="font-bold text-slate-800 mt-4">Customers</h4>
          <p>Focus on the pain point and the transformation. Customers care about what your product does for them, not your business model or team size.</p>
          <h4 className="font-bold text-slate-800 mt-4">Partners</h4>
          <p>Emphasize mutual value and collaboration opportunities. Show how working together creates a win-win scenario.</p>
          <h4 className="font-bold text-slate-800 mt-4">Networking</h4>
          <p>Keep it memorable and conversational. At networking events, the goal is to be remembered and start a conversation, not close a deal.</p>
        </ArticleSection>

        <ArticleSection title="Common Pitch Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Too long:</strong> If your pitch is over 60 seconds, cut it. Every word must earn its place.</li>
            <li><strong className="text-slate-800">Too much jargon:</strong> If your grandmother cannot understand it, simplify it.</li>
            <li><strong className="text-slate-800">No specific ask:</strong> Always end with a clear next step. Vague endings waste the opportunity.</li>
            <li><strong className="text-slate-800">Feature dumping:</strong> List benefits, not features. People buy outcomes, not technology.</li>
            <li><strong className="text-slate-800">No proof:</strong> Claims without evidence feel empty. Include at least one specific number or result.</li>
            <li><strong className="text-slate-800">Not practicing:</strong> A great pitch written down but delivered poorly is still a bad pitch. Practice out loud.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Practice Tips">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Time yourself:</strong> Use a timer and aim for under 30 seconds for quick versions, under 60 for detailed ones.</li>
            <li><strong className="text-slate-800">Record yourself:</strong> Listen back to identify filler words, pacing issues, and unclear sections.</li>
            <li><strong className="text-slate-800">Adapt on the fly:</strong> Have multiple versions ready for different audiences and time constraints.</li>
            <li><strong className="text-slate-800">Prepare for questions:</strong> Anticipate the 3-5 most likely follow-up questions and have concise answers ready.</li>
            <li><strong className="text-slate-800">Get feedback:</strong> Practice with friends or colleagues who will give honest feedback.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> The best pitches feel like conversations, not presentations. Practice until it sounds natural, not rehearsed.</p>
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
