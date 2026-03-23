import { useEffect } from "react";
import { Shuffle } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ParaphrasingTool } from "@/components/ParaphrasingTool";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What is a paraphrasing tool and what does it do?",
    answer: "A paraphrasing tool rewrites text using different words and sentence structures while keeping the original meaning intact. It replaces vocabulary with synonyms, restructures sentences, and adapts the tone — producing a new version of your content that conveys the same ideas in a fresh way.",
  },
  {
    question: "What are the six paraphrasing modes?",
    answer: "Standard rewrites with synonym swaps and restructured sentences at a similar complexity level, targeting 60–80% word change. Fluency focuses on natural, smooth-reading output. Creative aims for 80–95% variation with restructured paragraphs. Formal elevates to professional or academic register. Simple uses plain language and short sentences for broad accessibility. Academic uses scholarly tone appropriate for research papers and essays.",
  },
  {
    question: "Is my text kept private?",
    answer: "Yes — completely. The AI model runs entirely in your browser using WebLLM. Your text never leaves your device, is never sent to a server, and is never stored anywhere. This makes it safe for confidential documents, academic work, or personal writing.",
  },
  {
    question: "What does the word change percentage mean?",
    answer: "After paraphrasing, the tool calculates the percentage of vocabulary that differs between your original and the paraphrased version using a Jaccard distance comparison. A higher percentage means more extensive rewriting. Creative mode typically produces the highest change percentage (80–95%), while Fluency focuses more on smoothing than replacing every word.",
  },
  {
    question: "Can I generate multiple versions of the same text?",
    answer: "Yes. After paraphrasing, click the refresh icon next to the Copy button to generate a new version of the same text using the same mode. Because the AI has some creative variation built in, each version will be different.",
  },
  {
    question: "Does it work for all types of content?",
    answer: "Yes — emails, essays, articles, social media posts, academic paragraphs, business documents, and more. For academic content, use Academic mode to produce scholarly language. For marketing copy, Creative mode produces the most varied output. For readability improvements, Fluency mode is best.",
  },
  {
    question: "Will it change the meaning of my text?",
    answer: "No. Preserving meaning is the primary constraint. The tool changes wording, structure, and style — but not facts, intent, or the information conveyed. Proper nouns, technical terms, numbers, dates, and quoted material are preserved exactly.",
  },
  {
    question: "What browsers are supported?",
    answer: "Any browser with WebGPU support: Google Chrome 113+, Microsoft Edge 113+, and Safari 18+. Use the latest version of Chrome or Edge on a desktop or laptop with a dedicated GPU for the best experience.",
  },
];

export default function ParaphrasingToolPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Paraphrasing Tool — Rewrite Text in 6 Modes Privately | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI paraphrasing tool with 6 modes: Standard, Fluency, Creative, Formal, Simple, Academic. Rewrites text while preserving meaning. 100% private — your text never leaves your browser.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Paraphrasing Tool — 6 Modes, Private & Unlimited | Browser AI Tools",
      "og:description": "Rewrite any text in 6 paraphrasing modes. Fluency, Creative, Formal, Simple, Academic, Standard. Word change stats. Runs entirely in your browser — your content stays on your device.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-paraphrasing-tool",
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
            "name": "AI Paraphrasing Tool",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI paraphrasing tool with 6 modes. Rewrites text while preserving meaning. Runs 100% in your browser — private and unlimited.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Paraphrasing Tool" icon={Shuffle} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Paraphrasing Tool
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Rewrite any text in six different modes — Standard, Fluency, Creative, Formal, Simple, or Academic. Preserves your meaning while completely transforming the wording. Runs privately in your browser.
        </p>
      </section>

      <AdBlock slot="paraphrasing-tool-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <ParaphrasingTool />
      </div>

      <AdBlock slot="paraphrasing-tool-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>The Paraphrasing Tool That Understands Your Intent</h2>
        <p>
          Most paraphrasing tools swap words with synonyms and call it done. This tool rewrites the way a skilled writer would — restructuring sentences, changing perspective, adapting tone, and producing output that reads naturally in the chosen style. The meaning stays identical. The words don't.
        </p>
        <p>
          Because everything runs in your browser using WebLLM, your text never leaves your device. That means no account required, no usage limits, and no risk of your content appearing in training data or being stored on a server.
        </p>

        <h2>Six Modes for Every Situation</h2>
        <ul>
          <li><strong>Standard</strong> — The all-purpose mode. Swaps vocabulary, restructures sentences, and changes 60–80% of words while keeping the same tone and complexity as the original.</li>
          <li><strong>Fluency</strong> — Rewrites for natural flow and readability. Fixes awkward phrasing, removes redundancy, and makes the text sound like a native speaker wrote it. Best for editing your own drafts.</li>
          <li><strong>Creative</strong> — Maximum rewriting. Aims for 80–95% different wording, restructured paragraphs, and alternative explanations. Best when you need something truly different from the source.</li>
          <li><strong>Formal</strong> — Elevates the register to professional or academic level. Removes contractions, casual language, and colloquialisms. Replaces informal words with sophisticated vocabulary. Best for business documents or professional emails.</li>
          <li><strong>Simple</strong> — Plain language, short sentences, and common words. Breaks down complex ideas into accessible content targeting a middle-school reading level. Best for broad audiences or quick summaries.</li>
          <li><strong>Academic</strong> — Scholarly tone with complex sentence structures, formal transitions, and precise vocabulary. Appropriate for research papers, literature reviews, and academic essays.</li>
        </ul>

        <h2>Word Change Percentage</h2>
        <p>
          After each paraphrase, the tool calculates and displays the percentage of vocabulary that changed — giving you a concrete measure of how different the output is from your input. Creative mode typically scores 80–95%. Standard lands at 60–80%. Fluency focuses more on smoothing than replacing every word, so the percentage may be lower.
        </p>

        <h2>Generate Multiple Versions</h2>
        <p>
          Not happy with the first result? Hit the refresh icon next to Copy to generate a different version of the same text using the same mode. Each run introduces variation — useful when you want several alternatives to choose from.
        </p>

        <h2>What Gets Preserved</h2>
        <p>
          Proper nouns (names of people, places, companies), technical terms and industry jargon, specific numbers, dates and statistics, quoted material, and acronyms are all preserved exactly as in the original. Only the surrounding language changes.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="paraphrasing-tool-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Paraphrasing Tool"
        toolDescription="Free AI paraphrasing tool with 6 modes: Standard, Fluency, Creative, Formal, Simple, Academic. Rewrites text while preserving meaning. Private, unlimited, no signup required."
        faqs={FAQS}
      />
    </>
  );
}
