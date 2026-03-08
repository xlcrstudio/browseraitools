import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ToneConverterArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Adjust Your Writing Tone: Complete Communication Guide
        </h2>

        <ArticleSection title="Why Tone Matters in Written Communication">
          <p>Tone is the emotional quality of your writing -- the difference between "We need to talk" and "I'd love to catch up when you have a moment." The words you choose, your sentence structure, and your level of formality all shape how your message is received.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Impact of Wrong Tone</h4>
          <p>A message with the wrong tone can damage relationships, create misunderstandings, or undermine your professionalism. Research shows that over 50% of workplace conflicts stem from miscommunication, and tone is often the primary culprit. An email meant to be direct can read as rude; a message meant to be friendly can seem unprofessional.</p>
          <h4 className="font-bold text-slate-800 mt-4">Tone vs. Content</h4>
          <p>Your tone is separate from your content. You can deliver the same information -- a project delay, a meeting cancellation, constructive feedback -- in dramatically different ways depending on your tone. The content stays the same, but the emotional impact and relationship effect changes entirely.</p>
        </ArticleSection>

        <ArticleSection title="Understanding the Tone Spectrum">
          <p>Written communication exists on several tonal spectrums:</p>
          <h4 className="font-bold text-slate-800 mt-4">Formality Spectrum</h4>
          <p>From highly formal (legal documents, executive correspondence) to extremely casual (text messages, social media). Most professional communication falls somewhere in the middle. Understanding where your message should land on this spectrum is essential for effective communication.</p>
          <h4 className="font-bold text-slate-800 mt-4">Warmth Spectrum</h4>
          <p>From cold and detached to warm and personal. Customer service typically requires warmth, while policy documents need objectivity. The warmth of your tone signals how much you value the personal relationship versus the transactional one.</p>
          <h4 className="font-bold text-slate-800 mt-4">Directness Spectrum</h4>
          <p>From indirect and diplomatic to blunt and straightforward. Cultural context matters here -- some cultures value directness while others prefer more nuanced communication. In professional settings, finding the right balance between clarity and diplomacy is crucial.</p>
          <h4 className="font-bold text-slate-800 mt-4">Confidence Spectrum</h4>
          <p>From tentative and hedging to confident and assertive. Leaders often need to communicate with confidence, while team members giving feedback might benefit from a more tentative approach that invites dialogue.</p>
        </ArticleSection>

        <ArticleSection title="When to Use Each Tone">
          <p>Choosing the right tone depends on context, relationship, and purpose:</p>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Professional:</strong> Use for standard business communication -- emails to colleagues, reports, project updates. Clear, respectful, and efficient. This is the safest default for most workplace communication.</li>
            <li><strong className="text-slate-800">Casual:</strong> Use with people you know well -- close colleagues, friends, informal team chats. Relaxed and conversational. Be careful not to use this tone with new contacts or senior leadership.</li>
            <li><strong className="text-slate-800">Friendly:</strong> Use for customer service, networking, onboarding, and relationship-building. Warm and approachable. This tone helps build rapport without being unprofessional.</li>
            <li><strong className="text-slate-800">Formal:</strong> Use for legal documents, executive communication, official announcements, academic writing. Traditional and precise. Reserve this for situations where formality is expected or required.</li>
            <li><strong className="text-slate-800">Persuasive:</strong> Use for proposals, sales communication, requests for approval, advocacy. Compelling and benefit-focused. Be careful that persuasion doesn't become manipulation.</li>
            <li><strong className="text-slate-800">Empathetic:</strong> Use for apologies, delivering bad news, sensitive feedback, support situations. Understanding and compassionate. Essential when the recipient may be upset or vulnerable.</li>
            <li><strong className="text-slate-800">Confident:</strong> Use for leadership communication, expert opinions, decision announcements. Assertive and clear. Remove hedging words and be definitive in your statements.</li>
            <li><strong className="text-slate-800">Direct:</strong> Use for urgent messages, clear instructions, time-sensitive communication. No fluff, just facts. Best when clarity and speed are priorities over relationship-building.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Common Tone Mistakes in Professional Writing">
          <p>Even experienced writers make tone mistakes. Here are the most common ones:</p>
          <h4 className="font-bold text-slate-800 mt-4">Being Too Casual with Authority Figures</h4>
          <p>Using casual language with executives, clients, or new contacts can undermine your credibility. When in doubt, err on the side of slightly more formal -- it's easier to become more casual over time than to recover from being perceived as unprofessional.</p>
          <h4 className="font-bold text-slate-800 mt-4">Sounding Aggressive When Being Direct</h4>
          <p>There's a fine line between direct and aggressive. "Send this by Friday" reads differently than "Could you please have this completed by Friday?" Adding courtesy markers (please, thank you, I appreciate) softens directness without sacrificing clarity.</p>
          <h4 className="font-bold text-slate-800 mt-4">Over-Apologizing</h4>
          <p>Excessive apologizing can undermine your authority and make you seem less competent. One sincere apology is more effective than three hedging ones. After apologizing, move to the solution rather than dwelling on the mistake.</p>
          <h4 className="font-bold text-slate-800 mt-4">Passive-Aggressive Tone</h4>
          <p>"As I mentioned in my previous email" or "Per my last message" can come across as condescending. If someone missed information, simply restate it without drawing attention to their oversight.</p>
        </ArticleSection>

        <ArticleSection title="Tone Conversion Techniques">
          <p>Converting between tones involves several key techniques:</p>
          <h4 className="font-bold text-slate-800 mt-4">Vocabulary Swaps</h4>
          <p>Replace words with equivalents at different formality levels. "Get" becomes "obtain" (formal) or "grab" (casual). "Problem" becomes "challenge" (professional) or "issue" (neutral). Building a mental library of equivalent terms at different registers is one of the most effective ways to shift tone.</p>
          <h4 className="font-bold text-slate-800 mt-4">Sentence Structure Changes</h4>
          <p>Formal writing uses longer, more complex sentences with subordinate clauses. Casual writing uses shorter, punchier sentences. Professional writing balances both -- clear enough to scan quickly but complete enough to avoid ambiguity.</p>
          <h4 className="font-bold text-slate-800 mt-4">Contraction Usage</h4>
          <p>Contractions (don't, won't, I'm) instantly make writing more casual. Removing them (do not, will not, I am) immediately raises the formality level. This is one of the quickest ways to adjust tone.</p>
          <h4 className="font-bold text-slate-800 mt-4">Courtesy Markers</h4>
          <p>Adding "please," "thank you," "I appreciate," and "at your convenience" softens direct requests. Removing them creates a more efficient, direct tone. The right amount depends on your relationship and the situation.</p>
        </ArticleSection>

        <ArticleSection title="Tone in Email Communication">
          <p>Email is where tone mistakes are most common and most consequential:</p>
          <h4 className="font-bold text-slate-800 mt-4">Subject Lines Set Tone</h4>
          <p>Your subject line is the first tone signal. "URGENT: Project Deadline" reads very differently than "Quick question about the project timeline." Choose subject lines that match the tone of your message and the urgency of the situation.</p>
          <h4 className="font-bold text-slate-800 mt-4">Greetings and Closings</h4>
          <p>"Dear Mr. Smith" vs. "Hi John" vs. "Hey!" -- your greeting immediately establishes the formality level. Match your closing to your greeting: "Best regards" with "Dear," "Thanks" with "Hi," "Cheers" with "Hey." Mismatched greetings and closings create tonal confusion.</p>
          <h4 className="font-bold text-slate-800 mt-4">Reading Tone Before Sending</h4>
          <p>Always re-read your email from the recipient's perspective before sending. Ask yourself: "How would I feel receiving this?" If there's any chance it could be misread, adjust the tone. When in doubt, add a warm opening line before getting to business.</p>
        </ArticleSection>

        <ArticleSection title="Cultural Considerations in Tone">
          <p>Tone expectations vary significantly across cultures:</p>
          <p>Some cultures value directness and efficiency in business communication, while others consider indirect, relationship-building language essential. What reads as professional in one culture may seem cold or rude in another.</p>
          <p>When communicating across cultures, default to slightly more formal and warm. Use clear, simple language that translates well. Avoid idioms, slang, and humor that may not translate. Pay attention to how your counterparts communicate and mirror their tone level.</p>
          <p>International business communication often benefits from a professional tone with warm touches -- clear enough to avoid misunderstanding but personal enough to build rapport. This "professional-friendly" middle ground works across most cultural contexts.</p>
        </ArticleSection>

        <ArticleSection title="Building Tone Awareness">
          <p>Improving your tone awareness is a skill that develops over time:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Read widely:</strong> Notice how different writers and publications use tone. Business publications, casual blogs, academic papers, and customer service responses all use distinct tonal approaches.</li>
            <li><strong className="text-slate-800">Get feedback:</strong> Ask trusted colleagues how your emails and messages come across. You might be surprised by the gap between your intended tone and perceived tone.</li>
            <li><strong className="text-slate-800">Practice converting:</strong> Take a message and rewrite it in three different tones. This exercise builds your ability to shift between registers quickly and naturally.</li>
            <li><strong className="text-slate-800">Study responses:</strong> When someone responds unusually to your message, consider whether your tone might have been misread. These moments are valuable learning opportunities.</li>
            <li><strong className="text-slate-800">Use tools:</strong> AI tone converters can help you see how the same message reads in different tones, building your intuition for tonal shifts over time.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
        data-testid={`button-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-slate-600 leading-relaxed space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
