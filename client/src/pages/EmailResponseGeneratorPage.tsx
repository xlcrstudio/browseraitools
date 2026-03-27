import { useEffect } from "react";
import { Mail } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { EmailResponseGenerator } from "@/components/EmailResponseGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What is the AI Email Response Generator?",
    answer: "The AI Email Response Generator is a free, browser-based tool that writes professional email replies. Paste the email you received, choose your response type and tone, and the AI generates a complete, ready-to-send reply — including greeting, body, and sign-off. It runs entirely in your browser using WebLLM.",
  },
  {
    question: "What response types does it support?",
    answer: "Seven types: Standard Reply (complete 1-2 paragraph response), Quick Reply (brief 2-4 sentence acknowledgment), Detailed Reply (thorough 3-5 paragraph response), Polite Decline (graceful rejection), Follow-Up (checking in after no response), Thank You (expressing genuine gratitude), and Apology (addressing mistakes or delays).",
  },
  {
    question: "What tone options are available?",
    answer: "Five tones: Professional (default business tone), Formal (traditional and reserved, for executives or official matters), Friendly (warm but professional, for established relationships), Casual (relaxed and conversational, for close colleagues), and Match Their Tone (the AI mirrors the sender's formality level to build rapport).",
  },
  {
    question: "Is my email content private?",
    answer: "Yes. The AI runs entirely in your browser using WebLLM. Your emails are never uploaded to any server, never stored, and never shared. Everything is processed locally on your device using your GPU.",
  },
  {
    question: "What do the 'More Options' fields do?",
    answer: "They help the AI personalize the reply. Sender's Name is used in the greeting. Your Name appears in the sign-off. Relationship context (boss, client, colleague, etc.) adjusts the tone appropriately. Key Points lets you specify exactly what you want included in the response.",
  },
  {
    question: "Should I send the AI reply without editing?",
    answer: "The AI generates a strong draft, but always review before sending. Check for accuracy, add personal touches, and make sure dates, names, and facts are correct. The tool produces an excellent starting point that saves you time writing from scratch.",
  },
  {
    question: "Can it handle long email threads?",
    answer: "Yes. Paste the most recent message or the full thread — the AI focuses on what needs a response while acknowledging prior context. For best results with long threads, paste only the most recent email and summarize earlier context in the Key Points field.",
  },
  {
    question: "What browsers are supported?",
    answer: "Any browser with WebGPU support: Google Chrome 113+, Microsoft Edge 113+, and Safari 18+. Use the latest version of Chrome or Edge on a desktop with a dedicated GPU for the best experience.",
  },
];

export default function EmailResponseGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Email Response Generator — Write Professional Replies Instantly | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI email response generator that runs 100% in your browser. Paste any email and get a professional reply instantly — 7 response types, 5 tones, fully private. No data sent to servers.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Email Response Generator — Private, Instant | Browser AI Tools",
      "og:description": "Write professional email replies in seconds. Choose from 7 response types and 5 tones. 100% private — your emails never leave your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-email-response-generator",
    };

    for (const [name, content] of Object.entries(metaUpdates)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogUpdates)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Email Response Generator",
            "applicationCategory": "ProductivityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI email response generator. Paste any email and get a professional reply instantly. 7 response types, 5 tones. Runs 100% in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Email Response Generator" icon={Mail} />

      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Email{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Response Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any email and get a professional reply written instantly. Choose your response style and tone — from a quick acknowledgment to a detailed multi-paragraph response. Private and free.
        </p>
      </section>

      <AdBlock slot="email-response-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <EmailResponseGenerator />
      </div>

      <AdBlock slot="email-response-mid" format="horizontal" className="mb-10" />

      {/* Article */}
      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Write Better Email Replies in Seconds</h2>
        <p>
          The AI Email Response Generator uses WebLLM to run a language model directly in your browser. Paste the email you received, choose how you want to respond, and get a polished, ready-to-use reply — without your email content ever touching a server.
        </p>
        <p>
          Whether you need a quick acknowledgment, a detailed proposal response, a graceful decline, or a sincere apology, the AI generates a complete email with the right greeting, body, and sign-off for your situation.
        </p>

        <h2>Seven Response Types for Every Situation</h2>
        <ul>
          <li><strong>Standard Reply</strong> — A complete 1–2 paragraph response covering everything in the email. The right choice for most day-to-day business correspondence.</li>
          <li><strong>Quick Reply</strong> — 2–4 sentences that get straight to the point. Perfect for confirmations, acknowledgments, and simple yes/no answers.</li>
          <li><strong>Detailed Reply</strong> — 3–5 paragraphs addressing every point raised, with bullet points for multiple items and clear next steps. For complex questions and proposals.</li>
          <li><strong>Polite Decline</strong> — A gracious rejection that acknowledges the opportunity, gives a brief reason, and wishes them well. Say no without burning bridges.</li>
          <li><strong>Follow-Up</strong> — A gentle nudge when you haven't received a response. Acknowledges their busy schedule while politely requesting a reply.</li>
          <li><strong>Thank You</strong> — A warm, sincere expression of gratitude that's specific about what you're thanking them for and why it mattered.</li>
          <li><strong>Apology</strong> — A solution-focused apology that acknowledges the issue, explains briefly without making excuses, and outlines concrete steps to resolve it.</li>
        </ul>

        <h2>Five Tone Options</h2>
        <ul>
          <li><strong>Professional</strong> — The default for most business emails. Courteous, complete sentences, appropriate formality.</li>
          <li><strong>Formal</strong> — Traditional and reserved, for executives, legal matters, or first contact with important contacts. No contractions, respectful address.</li>
          <li><strong>Friendly</strong> — Warm and personable while staying professional. Great for established relationships, creative fields, and collaborative teams.</li>
          <li><strong>Casual</strong> — Relaxed and conversational for close colleagues and quick internal coordination.</li>
          <li><strong>Match Their Tone</strong> — The AI mirrors the sender's formality level to build rapport through linguistic synchrony.</li>
        </ul>

        <h2>Tips for Best Results</h2>
        <ol>
          <li>Paste the full email including any greeting and sign-off — the AI uses it for context</li>
          <li>Use the sender's name and your name fields so the greeting and sign-off feel personal</li>
          <li>Set the relationship context (boss, client, colleague) to fine-tune the appropriate level of formality</li>
          <li>Use Key Points to specify any specific information you need included — like your availability, prices, or decisions</li>
          <li>Always review before sending — add personal details, verify any facts or dates, and adjust anything that doesn't feel right</li>
        </ol>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="email-response-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Email Response Generator"
        toolDescription="Free AI email response generator. Paste any email and get a professional reply instantly — 7 response types, 5 tones. Runs 100% in your browser, private and unlimited."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="AI Email Response Generator" />
    </>
  );
}
