import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function MessageAnalyzerArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Free AI Message Analyzer -- Understand Any Text, Email, or DM Privately
        </h2>

        <ArticleSection title="Why Message Analysis Matters">
          <p>Every day we receive texts, emails, and DMs that leave us second-guessing. Was that message passive-aggressive? Is this recruiter genuinely interested? Is that "deal" actually a scam? Understanding the true meaning behind messages is a skill -- and AI can help you decode them instantly.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Communication Gap</h4>
          <p>Studies show that up to 50% of emotional tone is lost in text-based communication. Without vocal cues, facial expressions, or body language, messages are easily misinterpreted. A short reply might mean someone is busy -- or upset. An overly friendly email might be genuine -- or manipulative.</p>
          <h4 className="font-bold text-slate-800 mt-4">How AI Bridges the Gap</h4>
          <p>Our Message Analyzer uses a local AI model to examine word choice, sentence structure, punctuation patterns, and contextual clues to surface the likely tone, intent, and hidden meaning behind any message. And because it runs entirely in your browser, your private conversations stay private.</p>
        </ArticleSection>

        <ArticleSection title="Understanding Message Tone">
          <p>Tone is the emotional quality behind words. The same sentence can carry warmth, sarcasm, frustration, or indifference depending on subtle cues.</p>
          <h4 className="font-bold text-slate-800 mt-4">What the AI Looks For</h4>
          <p>The tone analysis examines punctuation usage (exclamation marks, ellipses, periods), word choice intensity, sentence length, capitalization patterns, and the presence of softening or hardening language. It identifies the primary emotional tone and explains the specific indicators that led to that conclusion.</p>
          <h4 className="font-bold text-slate-800 mt-4">Common Tones Detected</h4>
          <p>The analyzer can identify tones such as warm and friendly, cold and distant, passive-aggressive, enthusiastic, anxious, professional, casual, sarcastic, urgent, dismissive, and more. Each detection comes with an explanation of what specific language patterns triggered the classification.</p>
        </ArticleSection>

        <ArticleSection title="Decoding Hidden Meaning and Intent">
          <p>What someone says and what they actually mean are often two different things. Intent analysis goes beyond surface-level reading to uncover motivations and subtext.</p>
          <h4 className="font-bold text-slate-800 mt-4">Surface vs. Actual Meaning</h4>
          <p>The AI separates the literal content of a message from its likely intended meaning. For example, "I'm fine" might surface-read as contentment, but contextual analysis might reveal frustration or emotional withdrawal. "Let's circle back on this" in a work email often means the idea is being shelved.</p>
          <h4 className="font-bold text-slate-800 mt-4">Motivation Analysis</h4>
          <p>Beyond what the message means, the tool examines why it was likely sent. Is the sender seeking validation, setting boundaries, avoiding conflict, building rapport, or testing your reaction? Understanding motivation helps you craft a more effective response.</p>
        </ArticleSection>

        <ArticleSection title="Red Flags in Communication">
          <p>Recognizing manipulative or harmful communication patterns is crucial for protecting yourself in personal and professional relationships.</p>
          <h4 className="font-bold text-slate-800 mt-4">Manipulation Tactics</h4>
          <p>The red flags checker looks for gaslighting language ("you're overreacting"), guilt-tripping ("after everything I've done"), love-bombing (excessive flattery early on), negging (backhanded compliments), and emotional blackmail. These patterns can be subtle and hard to spot when you are emotionally involved.</p>
          <h4 className="font-bold text-slate-800 mt-4">Positive Signs Too</h4>
          <p>Not everything is a red flag. The analyzer also highlights positive communication patterns: respectful boundary-setting, genuine interest signals, healthy conflict resolution language, empathetic responses, and consistent messaging. A balanced view helps you make better relationship decisions.</p>
        </ArticleSection>

        <ArticleSection title="Professional Email Analysis">
          <p>Workplace communication has its own set of unwritten rules. A seemingly polite email can carry undertones of frustration, urgency, or passive-aggression that are easy to miss.</p>
          <h4 className="font-bold text-slate-800 mt-4">Reading Between the Lines at Work</h4>
          <p>Phrases like "as per my last email," "just to clarify," and "going forward" often signal frustration or a desire to establish dominance. The professional analysis mode rates overall professionalism, detects passive-aggressive undertones, and recommends appropriate response strategies.</p>
          <h4 className="font-bold text-slate-800 mt-4">Response Recommendations</h4>
          <p>For work messages, the tool provides specific guidance on how to respond: match the formality level, address underlying concerns, and maintain professionalism while standing your ground when needed. This is especially useful for navigating difficult conversations with managers or clients.</p>
        </ArticleSection>

        <ArticleSection title="Dating Message Interpretation">
          <p>Dating communication is one of the most anxiety-inducing areas of modern life. Every text can feel loaded with meaning -- or lack thereof.</p>
          <h4 className="font-bold text-slate-800 mt-4">Interest Level Signals</h4>
          <p>The relationship insights mode evaluates enthusiasm level, initiative (are they asking questions back?), response effort, consistency with previous messages, and future-planning language. These signals help you gauge genuine interest versus polite engagement.</p>
          <h4 className="font-bold text-slate-800 mt-4">What Short Replies Really Mean</h4>
          <p>A one-word reply is not always a bad sign. Context matters: time of day, the nature of the previous message, and the overall conversation pattern. The AI considers these factors rather than making snap judgments based on message length alone.</p>
        </ArticleSection>

        <ArticleSection title="Scam Detection Guide">
          <p>Online scams are becoming increasingly sophisticated. From phishing emails to romance scams, knowing the warning signs can protect you from financial and emotional harm.</p>
          <h4 className="font-bold text-slate-800 mt-4">Common Scam Indicators</h4>
          <p>The scam detection mode checks for urgency pressure ("act now"), authority impersonation, too-good-to-be-true offers, requests for personal information or money, suspicious links or attachments, grammatical patterns common in scam messages, and emotional manipulation designed to bypass rational thinking.</p>
          <h4 className="font-bold text-slate-800 mt-4">Risk Assessment</h4>
          <p>Each message receives a risk level rating (low, moderate, high) with specific indicators explained. The tool also provides recommended actions: whether to ignore, verify through official channels, report, or block the sender.</p>
        </ArticleSection>

        <ArticleSection title="Reply Strategies">
          <p>Knowing what a message means is only half the battle. Crafting the right response is equally important.</p>
          <h4 className="font-bold text-slate-800 mt-4">Three Response Approaches</h4>
          <p>For every message, the analyzer generates three reply suggestions with different tones: a direct and assertive option, a warm and diplomatic option, and a casual or deflecting option. Each comes with an explanation of why that approach works for the given situation.</p>
          <h4 className="font-bold text-slate-800 mt-4">Adapting Your Communication</h4>
          <p>The best response depends on your goals. Want to de-escalate? Choose the diplomatic option. Need to set boundaries? Go direct. Want to keep things light? Use the casual approach. The tool helps you see your options clearly so you can communicate with confidence.</p>
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
        <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            <div className="pt-4 text-slate-600 leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
