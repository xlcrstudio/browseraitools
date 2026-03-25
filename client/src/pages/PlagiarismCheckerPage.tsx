import { useEffect } from "react";
import { ScanSearch } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { PlagiarismChecker } from "@/components/PlagiarismChecker";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "Does this check my text against the internet?",
    answer: "No — this is a private, in-browser analysis tool. It checks your text for internal repetition, overused phrases, and AI-like writing patterns within the text itself. It does not compare your text against web sources, academic databases, or any external content. For web-source comparison, you would need a service like Turnitin or Grammarly.",
  },
  {
    question: "What does it actually check?",
    answer: "Three things: (1) Internal repetition — phrases or sentence structures that repeat more than expected, (2) AI-like writing patterns — generic transitional phrases, predictable sentence structures, and hedging language common in AI-generated text, and (3) Originality score — an overall assessment of how varied, natural, and original the writing reads.",
  },
  {
    question: "What do the sensitivity levels do?",
    answer: "Low sensitivity flags only very obvious repetitions (same phrase 4+ times) and strong AI patterns — good for casual content. Medium (default) flags phrases repeating 3+ times and moderate patterns — good for blog posts and essays. Strict flags any phrase repeating 2+ times and any AI-like structure — ideal for academic writing and formal submissions.",
  },
  {
    question: "What is the originality score?",
    answer: "The originality score (0–100%) reflects how varied and natural the writing is based on internal analysis. Scores of 85–100 indicate highly original, naturally varied writing. 70–84 is good with minor repetition. 50–69 shows noticeable patterns or repetition. Below 50 suggests heavy repetition or formulaic writing that would benefit from substantial rewriting.",
  },
  {
    question: "What are AI-like patterns?",
    answer: "AI-generated text often shows predictable traits: generic transitional phrases ('Furthermore', 'It is worth noting'), overly hedged language ('It is important to consider'), perfectly parallel sentence structures across paragraphs, and a lack of personal voice or specific detail. The AI pattern detection toggle identifies these traits, which is useful if you want to make AI-assisted writing sound more human.",
  },
  {
    question: "Is my text private?",
    answer: "Yes — completely private. The AI model runs entirely in your browser using WebGPU. Your text is never uploaded to a server, never stored, and never sent to any third party.",
  },
  {
    question: "Can I upload files?",
    answer: "Yes — drag and drop or click to upload a .txt file. For PDF or Word documents, copy and paste the text directly into the text box.",
  },
];

export default function PlagiarismCheckerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Plagiarism Checker (Private) — Originality & AI Pattern Detection | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free private AI plagiarism checker. Check originality, detect repeated phrases and AI-like patterns. Your text never leaves your browser — 100% private.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free AI Plagiarism Checker (Private) — Your Text Never Leaves Your Browser",
      "og:description": "Check text for repetition and AI-like patterns instantly. Originality score, highlighted issues, sensitivity slider, and rewrite suggestions. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-plagiarism-checker",
    };

    for (const [name, content] of Object.entries(metas)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogs)) {
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
            "name": "AI Plagiarism Checker (Private)",
            "applicationCategory": "EducationApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free private AI plagiarism checker. Detect repetition and AI-like patterns. Your text never leaves your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Plagiarism Checker" icon={ScanSearch} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Plagiarism{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Checker
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Check originality instantly — detect repeated phrases and AI-like writing patterns with your text never leaving your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Originality Score",
            "Repeated Phrases",
            "AI Pattern Detection",
            "Sensitivity Slider",
            "Rewrite Suggestions",
            "File Upload",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="plagiarism-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <PlagiarismChecker />
      </div>

      <AdBlock slot="plagiarism-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Private Plagiarism Checking — How It Works</h2>
        <p>
          Most plagiarism checkers upload your entire essay or article to a server. This one doesn't. The AI model runs entirely inside your browser — your writing is analyzed locally and never transmitted anywhere.
        </p>
        <p>
          The tool checks for three things: internal repetition (the same phrases used too many times within your own text), AI-like writing patterns (generic transitions, formulaic structure, hedging language), and overall originality — how varied and natural the writing sounds compared to human authorship.
        </p>

        <h2>When to Use Each Sensitivity Level</h2>
        <ul>
          <li><strong>Low:</strong> Blog posts, casual articles, and marketing copy where some repeated phrases are intentional for SEO or style</li>
          <li><strong>Medium (default):</strong> Most essays, reports, and professional writing</li>
          <li><strong>Strict:</strong> Academic papers, thesis submissions, and any writing where repetition and AI patterns need to be eliminated</li>
        </ul>

        <h2>What Are AI Writing Patterns?</h2>
        <p>
          AI-generated text tends to share distinctive traits regardless of the topic. Common giveaways include:
        </p>
        <ul>
          <li>Generic transitional phrases — "Furthermore," "It is worth noting that," "In conclusion"</li>
          <li>Overly hedged language — "It is important to consider," "One might argue"</li>
          <li>Perfectly balanced paragraph structures with exactly the same sentence rhythm</li>
          <li>Absence of specific examples, personal experience, or unique insights</li>
          <li>Predictable topic-expansion-conclusion structure within every paragraph</li>
        </ul>

        <h2>Important Limitations</h2>
        <p>
          This tool does <strong>not</strong> check your text against the internet, Turnitin's database, academic journals, or any external source. It is an internal analysis tool — useful for checking your own writing for repetition and AI patterns, but not a replacement for web-source plagiarism detection services.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="plagiarism-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Plagiarism Checker (Private)"
        toolDescription="Free private AI plagiarism checker. Detect internal repetition and AI-like writing patterns. Get an originality score with highlighted issues and rewrite suggestions. Your text never leaves your browser."
        faqs={FAQS}
      />
    </>
  );
}
