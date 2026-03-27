import { useEffect } from "react";
import { CheckCheck } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { GrammarChecker } from "@/components/GrammarChecker";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What does the AI Grammar Checker fix?",
    answer: "It checks and corrects grammar errors (subject-verb agreement, tense, pronouns), spelling mistakes, punctuation issues (commas, apostrophes, quotation marks), and commonly confused words (their/there/they're, affect/effect, its/it's). In Detailed mode it also provides style suggestions for clarity and word choice.",
  },
  {
    question: "What are the three checking modes?",
    answer: "Standard shows the corrected text plus numbered error explanations and a summary. Detailed adds comprehensive style suggestions, tone feedback, and word choice improvements. Quick Fix returns only the corrected text with no explanations — ideal when you just want the fixed version fast.",
  },
  {
    question: "Is my text kept private?",
    answer: "Yes. The AI model runs entirely in your browser using WebLLM. Your text is never uploaded to any server, never stored, and never shared with anyone. Everything is processed locally on your device using your GPU.",
  },
  {
    question: "Does it support different types of English?",
    answer: "Yes — US English (default), UK English, Canadian English, and Australian English. Each variant has different spelling conventions (e.g., -ize vs -ise) and punctuation rules that the AI applies accordingly.",
  },
  {
    question: "Does it work for all types of writing?",
    answer: "Yes. It handles emails, essays, social media posts, business documents, academic papers, creative writing, and more. Set the Formality level (Casual, Professional, Academic) to get context-appropriate corrections — for example, it won't flag intentional fragments in casual writing the same way it would in an academic essay.",
  },
  {
    question: "Will it change my writing style?",
    answer: "No. The tool only fixes errors — it never rewrites or paraphrases your content. Your voice, tone, and intent are preserved. The only changes made are corrections to actual errors.",
  },
  {
    question: "What's the Before/After comparison view?",
    answer: "After checking, the tool shows your original text alongside the corrected version in a side-by-side comparison panel. You can copy the corrected text directly from there with one click.",
  },
  {
    question: "What browsers are supported?",
    answer: "Any browser with WebGPU support: Google Chrome 113+, Microsoft Edge 113+, and Safari 18+. Use the latest version of Chrome or Edge on a desktop with a dedicated GPU for the best experience.",
  },
];

export default function GrammarCheckerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Grammar Checker — Fix Grammar, Spelling & Punctuation Privately | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI grammar checker that runs 100% in your browser. Fix grammar, spelling, and punctuation errors with explanations. Before/after comparison. Private — your text never leaves your device.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Grammar Checker — Private, Instant, Unlimited | Browser AI Tools",
      "og:description": "Fix grammar, spelling, and punctuation errors instantly. Get clear explanations for every correction. 100% private — your text never leaves your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-grammar-checker",
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
            "name": "AI Grammar Checker",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI grammar checker. Fix grammar, spelling, and punctuation errors with explanations. Runs 100% in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Grammar Checker" icon={CheckCheck} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Grammar{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Checker
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any text and get every grammar, spelling, and punctuation error corrected with a clear explanation. See the before and after comparison instantly. Runs privately in your browser.
        </p>
      </section>

      <AdBlock slot="grammar-checker-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <GrammarChecker />
      </div>

      <AdBlock slot="grammar-checker-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Grammar Checking That Teaches, Not Just Corrects</h2>
        <p>
          The AI Grammar Checker doesn't just silently fix your text — it explains every error so you understand what was wrong and why the correction is right. Over time, you'll write more confidently because you've learned the rules, not just received a fixed version.
        </p>
        <p>
          Everything runs in your browser using WebLLM. Your emails, documents, and personal writing never leave your device, making this the ideal grammar checker for sensitive or confidential text.
        </p>

        <h2>What It Checks</h2>
        <ul>
          <li><strong>Grammar errors</strong> — Subject-verb agreement, verb tense consistency, pronoun cases (I/me, who/whom), dangling modifiers, sentence fragments, run-on sentences</li>
          <li><strong>Punctuation</strong> — Commas, apostrophes, quotation marks, semicolons, colons, hyphens and dashes, missing periods</li>
          <li><strong>Spelling</strong> — Misspelled words, commonly confused words (their/there/they're, affect/effect, your/you're), homophones, capitalization</li>
          <li><strong>Style</strong> (Detailed mode) — Passive voice, wordiness, redundancy, weak word choices, unclear phrasing</li>
        </ul>

        <h2>Three Modes for Different Needs</h2>
        <ul>
          <li><strong>Standard</strong> — The default. Shows every error with a numbered explanation and a summary of error counts. Great for learning and for important writing.</li>
          <li><strong>Detailed</strong> — Everything in Standard plus style suggestions, tone feedback, and word choice improvements. Ideal for essays, reports, and professional documents.</li>
          <li><strong>Quick Fix</strong> — Returns only the corrected text with no explanations. Fastest option when you just need a clean version immediately.</li>
        </ul>

        <h2>Before &amp; After Comparison</h2>
        <p>
          After checking your text, the tool shows your original alongside the corrected version in a side-by-side panel. Errors are easy to spot at a glance, and you can copy the corrected text with one click without scrolling through the full analysis.
        </p>

        <h2>Supports Four English Variants</h2>
        <p>
          The checker respects the English variant you write in. UK English uses "-ise" spellings (realise, organise) while US English uses "-ize". Canadian and Australian English have their own conventions too. Select your variant under Language Options so corrections are always appropriate for your audience.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="grammar-checker-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Grammar Checker"
        toolDescription="Free AI grammar checker. Fix grammar, spelling, and punctuation errors with clear explanations. Before/after comparison. Runs 100% in your browser — private and unlimited."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="AI Grammar Checker" />
    </>
  );
}
