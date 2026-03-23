import { useEffect } from "react";
import { BookOpen } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { TextSummarizer } from "@/components/TextSummarizer";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What is the AI Text Summarizer?",
    answer: "The AI Text Summarizer is a free, browser-based tool that condenses long text into clear, accurate summaries. It supports six summary types — Quick Summary, Key Points, Detailed, Executive, TL;DR, and By Section — and runs entirely in your browser using WebLLM. No data is ever sent to any server.",
  },
  {
    question: "What types of text can I summarize?",
    answer: "You can summarize articles, research papers, blog posts, reports, emails, meeting notes, transcripts, legal documents, books, and any other long-form text. Paste up to 40,000 characters at a time.",
  },
  {
    question: "What summary types are available?",
    answer: "Six types: Quick Summary (3-5 sentence overview), Key Points (scannable bullet list of 5-10 points), Detailed (1-3 comprehensive paragraphs), Executive (professional 100-150 word brief), TL;DR (one powerful sentence), and By Section (section-by-section breakdown for long structured documents).",
  },
  {
    question: "Is my text kept private?",
    answer: "Yes. The AI model runs 100% in your browser using WebLLM. Your text never leaves your device, is never uploaded to any server, and is never stored. Everything is processed locally using your GPU via WebGPU.",
  },
  {
    question: "What does the Focus Area option do?",
    answer: "The Focus Area field lets you tell the AI what to emphasize when summarizing. For example, entering 'financial data' or 'methodology' or 'risks' will cause the AI to prioritize those aspects in its summary.",
  },
  {
    question: "How accurate are the summaries?",
    answer: "The AI is trained to extract information only from the source text without adding any new claims. However, as with any AI tool, summaries should be reviewed for critical or legal use cases. The tool is designed for informational summarization, not as a substitute for professional advice.",
  },
  {
    question: "Does this work offline?",
    answer: "Yes, after the first visit the AI model is cached in your browser. On subsequent visits the model loads from cache and works without an internet connection. The first load requires a download of approximately 1-2 GB.",
  },
  {
    question: "What browsers are supported?",
    answer: "Any browser with WebGPU support: Google Chrome 113+, Microsoft Edge 113+, and Safari 18+. For the best experience, use the latest version of Chrome or Edge on a desktop device with a dedicated GPU.",
  },
];

export default function TextSummarizerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Text Summarizer — Summarize Any Text Privately | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI text summarizer that runs 100% in your browser. Paste any article, report, or document and get instant summaries — Quick, Key Points, Detailed, Executive, TL;DR, or By Section. Private and unlimited.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Text Summarizer — Private, Instant, Unlimited | Browser AI Tools",
      "og:description": "Summarize any text in seconds. Choose from 6 summary types. 100% private — your text never leaves your browser. Free and unlimited.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-text-summarizer",
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
            "name": "AI Text Summarizer",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI text summarizer. Paste any text and get instant summaries — runs 100% in your browser, private and unlimited.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Text Summarizer" icon={BookOpen} />

      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Text{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Summarizer
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Condense any article, report, or document into a clear summary. Choose your format — from a one-sentence TL;DR to a full executive brief. Runs privately in your browser.
        </p>
      </section>

      <AdBlock slot="text-summarizer-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <TextSummarizer />
      </div>

      <AdBlock slot="text-summarizer-mid" format="horizontal" className="mb-10" />

      {/* Article */}
      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Summarize Any Text in Seconds — Privately</h2>
        <p>
          The AI Text Summarizer uses WebLLM to run an advanced language model directly in your browser. Paste up to 40,000 characters of text and receive a structured, accurate summary in your chosen format — without your content ever leaving your device.
        </p>
        <p>
          Unlike cloud summarizers that send your documents to external servers, this tool processes everything locally using your GPU. Your articles, reports, and confidential documents stay 100% private.
        </p>

        <h2>Six Summary Formats for Every Need</h2>
        <ul>
          <li><strong>Quick Summary</strong> — A 3–5 sentence paragraph capturing the essential message. Perfect for news articles, blog posts, and emails when you need to quickly grasp the main point.</li>
          <li><strong>Key Points</strong> — A scannable bullet list of 5–10 main ideas. Ideal for reports, research papers, and meeting notes where you need to review all major points at a glance.</li>
          <li><strong>Detailed Summary</strong> — 1–3 comprehensive paragraphs (200–400 words) with full context, supporting arguments, and conclusions. Great for research and complex documents.</li>
          <li><strong>Executive Summary</strong> — A professional 100–150 word brief focused on the bottom line, key findings, and actionable insights. Designed for decision-makers reviewing business reports and proposals.</li>
          <li><strong>TL;DR</strong> — One powerful sentence that captures the absolute essence of the text. Perfect for social sharing or when you need the gist in seconds.</li>
          <li><strong>By Section</strong> — A section-by-section breakdown that follows the original document structure. Ideal for books, technical manuals, and long structured documents.</li>
        </ul>

        <h2>What You Can Summarize</h2>
        <p>The tool handles any long-form text:</p>
        <ul>
          <li><strong>News &amp; Articles</strong> — Get the key facts and conclusions without reading the full piece</li>
          <li><strong>Research Papers</strong> — Extract methodology, findings, and implications</li>
          <li><strong>Business Reports</strong> — Pull out metrics, recommendations, and next steps</li>
          <li><strong>Legal Documents</strong> — Identify key terms, obligations, and conditions (always verify with counsel)</li>
          <li><strong>Meeting Transcripts</strong> — Surface decisions, action items, and key discussion points</li>
          <li><strong>Books &amp; Long Articles</strong> — Get a section-by-section breakdown of the full content</li>
        </ul>

        <h2>How It Works</h2>
        <ol>
          <li><strong>Paste your text</strong> — up to 40,000 characters from any source</li>
          <li><strong>Choose your summary type</strong> — pick the format that fits your needs</li>
          <li><strong>Optional: set a focus area</strong> — tell the AI what to emphasize</li>
          <li><strong>Click Summarize</strong> — the AI generates your summary in real time</li>
          <li><strong>Copy or download</strong> — save the result as plain text</li>
        </ol>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="text-summarizer-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Text Summarizer"
        toolDescription="Free AI text summarizer. Paste any text and get instant summaries — Quick, Key Points, Detailed, Executive, TL;DR, or By Section. Runs 100% in your browser, private and unlimited."
        faqs={FAQS}
      />
    </>
  );
}
