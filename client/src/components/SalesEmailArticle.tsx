import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SalesEmailArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Sales Email Guide: Templates, Tips & Best Practices
        </h2>

        <ArticleSection title="What Makes a Great Sales Email?">
          <p>A great sales email is one that gets opened, read, and responded to. It focuses on the recipient's needs rather than your product, provides genuine value, and includes a clear, low-barrier call to action.</p>
          <p>The best cold emails feel like they were written specifically for the person receiving them. They reference something relevant about the recipient's company, role, or industry challenge, and position your solution as a natural fit.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The average cold email response rate is 1-5%. Top-performing sales emails achieve 15-25% response rates by focusing on personalization, value-first messaging, and specific CTAs.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Sales Email Structure">
          <p>Every effective sales email follows a proven structure that guides the reader from curiosity to action:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. Subject Line</h4>
          <p>Your subject line determines whether your email gets opened. Keep it under 50 characters, personalize it with the recipient's name or company, and avoid spam trigger words like "free," "guaranteed," or "act now."</p>
          <h4 className="font-bold text-slate-800 mt-4">2. Opening Line</h4>
          <p>Skip the generic introductions. Lead with a company-specific observation, mutual connection, or relevant trigger event. Show the recipient you did your research.</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Value Proposition</h4>
          <p>Connect their pain point to your solution in 1-2 sentences. Focus on outcomes and results, not features. Use social proof when possible.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. Call to Action</h4>
          <p>End with a single, specific, low-barrier ask. "Would you be open to a 15-minute call this week?" works better than "Let me know if you're interested."</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Professional Close</h4>
          <p>Keep your signature clean. Include your name, title, company, and one contact method. Avoid long signature blocks with quotes or multiple links.</p>
        </ArticleSection>

        <ArticleSection title="Subject Line Best Practices">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Keep it short:</strong> Subject lines under 50 characters have the highest open rates. Mobile devices truncate longer subject lines.</li>
            <li><strong className="text-slate-800">Personalize:</strong> Including the recipient's name or company name can increase open rates by 20-30%.</li>
            <li><strong className="text-slate-800">Create curiosity:</strong> Ask a question or hint at a benefit without giving everything away.</li>
            <li><strong className="text-slate-800">Avoid spam triggers:</strong> Words like "free," "urgent," "limited time," and ALL CAPS can send your email to spam.</li>
            <li><strong className="text-slate-800">Be specific:</strong> "Idea for reducing churn at (Company)" outperforms "Great opportunity" every time.</li>
            <li><strong className="text-slate-800">Test variations:</strong> A/B test different subject line styles to find what resonates with your audience.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Common Sales Email Mistakes">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Making it about you:</strong> Don't lead with "We are the leading provider of..." Focus on the recipient's needs and challenges.</li>
            <li><strong className="text-slate-800">Writing too long:</strong> Ideal cold emails are 50-125 words. Respect the recipient's time.</li>
            <li><strong className="text-slate-800">No clear CTA:</strong> Every email should have exactly one clear next step. Multiple CTAs create decision paralysis.</li>
            <li><strong className="text-slate-800">Generic personalization:</strong> Just inserting a name isn't enough. Reference specific company news, achievements, or challenges.</li>
            <li><strong className="text-slate-800">Sending without research:</strong> Take 2-3 minutes to research each prospect. Quality outreach beats mass blasting.</li>
            <li><strong className="text-slate-800">Ignoring follow-ups:</strong> 80% of sales require 5+ follow-ups. Most salespeople stop after 1-2 attempts.</li>
            <li><strong className="text-slate-800">Using attachments:</strong> Attachments trigger spam filters and reduce deliverability. Link to resources instead.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Follow-Up Email Strategy">
          <p>Follow-up emails are where most deals are won. A structured follow-up sequence dramatically increases response rates:</p>
          <h4 className="font-bold text-slate-800 mt-4">Follow-Up Timing</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Follow-up 1:</strong> 2-3 days after initial email. Add new value or a different angle.</li>
            <li><strong>Follow-up 2:</strong> 4-5 days later. Share a relevant case study or resource.</li>
            <li><strong>Follow-up 3:</strong> 7 days later. Try a different format (shorter, question-based).</li>
            <li><strong>Follow-up 4:</strong> 14 days later. "Breakup" email with final value offer.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> Each follow-up should add new value. Never just "checking in" or "following up." Provide a new insight, case study, or relevant piece of content with every touch.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Spam Avoidance Tips">
          <p>Getting past spam filters is critical for email deliverability. Here are proven strategies:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Avoid spam trigger words: "free," "guarantee," "no obligation," "act now," "limited time"</li>
            <li>Don't use ALL CAPS or excessive exclamation marks</li>
            <li>Keep your text-to-link ratio high (more text, fewer links)</li>
            <li>Warm up new email domains gradually before high-volume sending</li>
            <li>Authenticate your domain with SPF, DKIM, and DMARC records</li>
            <li>Maintain a clean email list and remove bounced addresses immediately</li>
            <li>Avoid image-heavy emails; stick to plain text or minimal formatting</li>
            <li>Include an unsubscribe option for compliance</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Sales Email Templates by Objective">
          <h4 className="font-bold text-slate-800 mt-2">Book a Meeting</h4>
          <p>Focus on a specific pain point, provide a brief solution hint, and ask for a short meeting (15-20 minutes). Keep the barrier low.</p>
          <h4 className="font-bold text-slate-800 mt-4">Schedule a Demo</h4>
          <p>Lead with a result you've achieved for a similar company. Mention a specific feature that addresses their challenge and offer a personalized demo.</p>
          <h4 className="font-bold text-slate-800 mt-4">Direct Sale</h4>
          <p>Best for lower-priced products. Include social proof, a clear value proposition, and a link to purchase or start a trial.</p>
          <h4 className="font-bold text-slate-800 mt-4">Partnership Outreach</h4>
          <p>Emphasize mutual benefit, shared audience overlap, and specific collaboration ideas. Partnership emails should feel collaborative, not salesy.</p>
        </ArticleSection>

        <div className="mt-10 bg-gradient-primary rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">Ready to Write Emails That Get Responses?</h3>
          <p className="text-purple-100 text-sm mb-4">Use the free AI Sales Email Generator above to create personalized outreach emails in seconds.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-purple-700 bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
            data-testid="button-scroll-to-tool"
          >
            Generate My Sales Emails &uarr;
          </button>
        </div>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 py-4">
      <button
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
