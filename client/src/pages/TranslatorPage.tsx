import { useEffect } from "react";
import { Languages } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { Translator } from "@/components/Translator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "How many languages does the AI Translator support?",
    answer: "The translator supports over 80 languages, including English, Spanish, French, German, Italian, Portuguese, Russian, Chinese (Simplified and Traditional), Japanese, Korean, Arabic, Hindi, and dozens more across Europe, Asia, Africa, and the Middle East.",
  },
  {
    question: "Is my text kept private when I translate?",
    answer: "Yes — completely. The AI model runs entirely inside your browser using WebLLM. Your text is never sent to any server and never stored anywhere. This makes it ideal for translating sensitive, confidential, or personal documents.",
  },
  {
    question: "What are the five translation modes?",
    answer: "Standard produces accurate, natural-sounding output suitable for most uses. Formal uses professional language and respectful forms of address. Casual is conversational with informal tone and natural colloquialisms. Literal stays close to word-for-word (good for language learners). Creative adapts idioms and cultural references so the translation resonates with the target audience.",
  },
  {
    question: "What does Auto-detect do?",
    answer: "When Auto-detect is selected as the source language, the AI identifies the language of your text automatically and states it at the top of the output. You can then swap that detected language into the source selector if you want to translate back.",
  },
  {
    question: "Can I swap the source and target languages?",
    answer: "Yes. The swap button (double-arrow icon between the language selectors) exchanges the source and target languages. When you swap, the translated text is automatically moved into the input field so you can re-translate in the opposite direction instantly.",
  },
  {
    question: "What is the context field for?",
    answer: "The optional context field tells the AI what kind of text you are translating — for example 'business email', 'product description', 'legal document', or 'social media post'. This helps the model choose the most appropriate vocabulary and tone for the content type.",
  },
  {
    question: "Does it handle idioms and cultural references?",
    answer: "Yes. In Standard and Creative modes the translator adapts idioms to natural equivalents in the target language rather than translating word-for-word. For example, the English 'it's raining cats and dogs' becomes 'está lloviendo a cántaros' in Spanish — the locally understood equivalent expression.",
  },
  {
    question: "What browsers are supported?",
    answer: "Any browser with WebGPU support: Google Chrome 113+, Microsoft Edge 113+, and Safari 18+. Use the latest version of Chrome or Edge on a desktop or laptop with a dedicated GPU for the fastest experience.",
  },
];

export default function TranslatorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Translator — Translate 80+ Languages Privately in Your Browser | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI translator supporting 80+ languages. Five translation modes: Standard, Formal, Casual, Literal, Creative. 100% private — your text never leaves your browser. No API key needed.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Translator — 80+ Languages, Private & Unlimited | Browser AI Tools",
      "og:description": "Translate between 80+ languages with five modes (Standard, Formal, Casual, Literal, Creative). Runs entirely in your browser — your text stays on your device.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-translator",
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
            "name": "AI Translator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI translator supporting 80+ languages. Five translation modes. Runs 100% in your browser — private and unlimited.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Translator" icon={Languages} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Translator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Translate between 80+ languages with five modes for every situation — from formal documents to casual messages. Handles idioms naturally. Runs privately in your browser with no word limits.
        </p>
      </section>

      <AdBlock slot="translator-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <Translator />
      </div>

      <AdBlock slot="translator-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Translation That Understands Context, Not Just Words</h2>
        <p>
          Most translators convert words. The AI Translator converts meaning. It understands idioms, adapts cultural references, preserves tone, and selects the right level of formality for your content — whether you're translating a legal document, a product listing, or a message to a friend.
        </p>
        <p>
          Because everything runs in your browser using WebLLM, your text never touches a server. That makes it the safest option for translating confidential business documents, personal correspondence, medical records, or anything else you wouldn't want stored in the cloud.
        </p>

        <h2>Five Translation Modes</h2>
        <ul>
          <li><strong>Standard</strong> — Accurate and natural-sounding, as if the text were originally written in the target language. Best for general use.</li>
          <li><strong>Formal</strong> — Professional vocabulary and respectful forms of address (usted, Sie, vous, etc.). Ideal for business emails, official documents, and academic writing.</li>
          <li><strong>Casual</strong> — Conversational tone with natural colloquialisms and informal pronouns. Best for text messages, social media, and friendly correspondence.</li>
          <li><strong>Literal</strong> — Stays close to the original word-for-word structure. Useful for language learners who want to understand how the source language works.</li>
          <li><strong>Creative</strong> — Adapts idioms and cultural references to equivalents that resonate with the target audience. Best for marketing, slogans, and creative content.</li>
        </ul>

        <h2>80+ Supported Languages</h2>
        <p>
          Covers all major European, Asian, Middle Eastern, and African languages: English, Spanish, French, German, Italian, Portuguese, Russian, Chinese (Simplified and Traditional), Japanese, Korean, Arabic, Hindi, Bengali, Dutch, Polish, Swedish, Turkish, Hebrew, Persian, Swahili, and many more. Use the search box in the language selector to find any language instantly.
        </p>

        <h2>Idiomatic &amp; Cultural Translation</h2>
        <p>
          Idioms rarely translate literally. In Standard and Creative modes, the AI replaces source-language idioms with natural equivalents in the target language — not word-for-word substitutions that would confuse native readers. When a concept has no equivalent, the AI notes the original term and explains it in context.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="translator-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Translator"
        toolDescription="Free AI translator supporting 80+ languages with five translation modes. Handles idioms and cultural context. Runs 100% in your browser — private, unlimited, no signup."
        faqs={FAQS}
      />
    </>
  );
}
