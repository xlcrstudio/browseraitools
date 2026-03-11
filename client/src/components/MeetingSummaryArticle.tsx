import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function MeetingSummaryArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write Effective Meeting Summaries: Complete Guide
        </h2>

        <ArticleSection title="Why Meeting Summaries Matter">
          <p>Meeting summaries transform raw discussion into actionable documentation. Without a clear summary, decisions get forgotten, action items slip through the cracks, and teams waste time rehashing the same topics. A well-structured meeting summary keeps everyone aligned and accountable.</p>
          <p>Research shows that people forget roughly 50% of new information within an hour of hearing it, and 90% within a week. A meeting summary captures institutional knowledge and creates a reference point that prevents this information loss.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The most effective meeting summaries focus on decisions and action items, not on recounting who said what. Your summary should answer: "What did we decide, who is doing what, and by when?"</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Anatomy of a Great Meeting Summary">
          <p>A professional meeting summary includes these essential components:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Executive overview:</strong> A 2-5 sentence paragraph that captures the meeting's purpose, main topics, and primary outcomes. Someone who missed the meeting should understand the big picture from this alone.</li>
            <li><strong className="text-slate-800">Key discussion points:</strong> The major topics covered, with enough context to understand what was discussed and why it matters. Include different perspectives when relevant.</li>
            <li><strong className="text-slate-800">Decisions made:</strong> Every decision, who made it, the rationale, and any conditions or dependencies. These are the most legally and operationally important items.</li>
            <li><strong className="text-slate-800">Action items:</strong> Every task with a clear owner, deadline, and priority level. Use action verbs and be specific about deliverables.</li>
            <li><strong className="text-slate-800">Deadlines and milestones:</strong> A chronological view of all time-sensitive items for easy calendar reference.</li>
            <li><strong className="text-slate-800">Blockers and concerns:</strong> Any risks, open questions, or issues that could prevent progress.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Meeting Types and How to Summarize Them">
          <h4 className="font-bold text-slate-800 mt-4">Team Meetings and Standups</h4>
          <p>Focus on status updates, blockers, and coordination. Keep the summary brief with emphasis on what changed since the last meeting, what needs attention, and who is blocked. Action items are critical here.</p>
          <h4 className="font-bold text-slate-800 mt-4">Client Meetings</h4>
          <p>Require a more polished, professional tone. Emphasize commitments made, requirements gathered, and next steps. These summaries often serve as informal contracts, so precision matters.</p>
          <h4 className="font-bold text-slate-800 mt-4">Strategy and Planning Meetings</h4>
          <p>Focus heavily on decisions and their rationale. Capture different perspectives, the options considered, and why the chosen direction was selected. These summaries become important reference documents.</p>
          <h4 className="font-bold text-slate-800 mt-4">One-on-One Meetings</h4>
          <p>More personal and development-focused. Track feedback, goals, career development items, and personal action items. Keep these private and confidential.</p>
          <h4 className="font-bold text-slate-800 mt-4">All-Hands and Town Halls</h4>
          <p>Capture key announcements, company direction, and Q&A highlights. These summaries should be shareable with anyone who missed the meeting and capture the overall message.</p>
        </ArticleSection>

        <ArticleSection title="Action Item Best Practices">
          <p>Action items are the most important output of any meeting summary. To make them effective:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Start with a verb:</strong> "Research," "Draft," "Schedule," "Review." This makes it immediately clear what needs to happen.</li>
            <li><strong className="text-slate-800">Assign one owner:</strong> Shared ownership means no ownership. Even if multiple people contribute, one person should be accountable.</li>
            <li><strong className="text-slate-800">Set specific deadlines:</strong> "By Friday" is better than "soon." "By Friday, October 4" is better still.</li>
            <li><strong className="text-slate-800">Define done:</strong> What does completion look like? "Present 3 options with cost analysis" is clearer than "look into options."</li>
            <li><strong className="text-slate-800">Note dependencies:</strong> If a task depends on something else finishing first, say so explicitly.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Send the meeting summary within 24 hours while the discussion is fresh. The longer you wait, the more details you will forget and the less useful the summary becomes.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Common Meeting Summary Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Transcript instead of summary:</strong> A summary is not a word-for-word record. Distill the discussion into key points and outcomes.</li>
            <li><strong className="text-slate-800">Missing action items:</strong> If you discussed something that needs to happen, it should appear as an action item with an owner and deadline.</li>
            <li><strong className="text-slate-800">Vague language:</strong> "Discussed marketing" tells you nothing. "Decided to allocate $50k to Q4 digital marketing with a 70/30 paid/organic split" tells you everything.</li>
            <li><strong className="text-slate-800">No ownership:</strong> Every decision and action item needs a name attached. "The team will..." is not accountability.</li>
            <li><strong className="text-slate-800">Delayed distribution:</strong> A meeting summary sent a week later has lost most of its value. Aim for same-day or next morning.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = `ms-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
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
