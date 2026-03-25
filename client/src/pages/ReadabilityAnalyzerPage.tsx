import { useEffect } from "react";
import { Gauge } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ReadabilityAnalyzer } from "@/components/ReadabilityAnalyzer";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What readability scores does this tool calculate?",
    answer: "Four scores: Flesch Reading Ease (0–100, higher = easier), Flesch-Kincaid Grade Level (US school grade equivalent), Gunning Fog Index (years of education needed to understand the text), and SMOG Grade (Simple Measure of Gobbledygook — another grade-level estimate). The displayed Grade Level is the average of Flesch-Kincaid and Gunning Fog for a more balanced result.",
  },
  {
    question: "What is a good readability score?",
    answer: "It depends on your audience. For general web content: aim for Grade 6–8 (Flesch Reading Ease 60–80). For news articles: Grade 8–10. For academic or professional writing: Grade 10–14 is acceptable. For legal or technical documents: Grade 14+ is common but not ideal for non-expert readers. Most popular books are written at Grade 6–8.",
  },
  {
    question: "How does the passive voice detection work?",
    answer: "The tool scans each sentence for passive voice patterns — phrases like 'was completed by', 'is being reviewed', 'had been submitted', and similar constructions using forms of 'to be' followed by a past participle. It flags the sentence and counts how many contain passive voice. Sentences flagged in blue in the highlighted view contain passive voice.",
  },
  {
    question: "What counts as a 'complex word'?",
    answer: "Any word with 3 or more syllables that is not a proper noun (a name or place). Examples: 'understanding' (4 syllables), 'approximately' (5 syllables), 'communication' (5 syllables). These words increase the Gunning Fog and SMOG scores. Replacing them with shorter synonyms — 'roughly' instead of 'approximately', 'talk' instead of 'communicate' — improves readability.",
  },
  {
    question: "What is a 'long sentence'?",
    answer: "Any sentence containing more than 25 words. Long sentences are harder to parse because readers must hold more information in working memory before reaching the main verb or conclusion. The guideline for clear writing is an average of 15–20 words per sentence, with variation — mixing short punchy sentences with longer ones creates a readable rhythm.",
  },
  {
    question: "What does the highlighted text view show?",
    answer: "Sentences highlighted in amber have more than 25 words (too long). Sentences highlighted in blue contain passive voice. Sentences highlighted in red have both issues simultaneously. Sentences with no highlight are well-structured. You can toggle highlights on and off to compare.",
  },
  {
    question: "How does the AI suggestions feature work?",
    answer: "After running the basic analysis, you can click 'Get AI Suggestions' to load the AI model and get 3 specific rewrites. The AI identifies your most problematic sentences, explains the issue with each, and provides a cleaner rewritten version. This goes beyond the scores to give you actual improvements you can copy directly into your document.",
  },
  {
    question: "Is my text private?",
    answer: "Yes — completely. All readability calculations happen instantly in your browser with no network requests at all. If you use the AI suggestions feature, the AI model also runs locally in your browser. Your text is never uploaded, never stored, and never processed on a server.",
  },
];

export default function ReadabilityAnalyzerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Readability Analyzer — Flesch, Grade Level, Passive Voice | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI readability analyzer. Instant Flesch reading ease, Kincaid grade level, passive voice detection, and complex word count. AI rewrites for problem sentences. 100% private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Readability Analyzer — Flesch Score, Grade Level & AI Rewrites",
      "og:description": "Analyze any text for readability instantly. Grade level, Flesch score, passive voice, long sentences, complex words. AI suggestions for the worst sentences. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-readability-analyzer",
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
            "name": "AI Readability Analyzer",
            "applicationCategory": "EducationApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI readability analyzer. Flesch score, grade level, passive voice, long sentences, complex words. AI rewrites. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Readability Analyzer" icon={Gauge} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Readability{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Analyzer
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any text and instantly see its grade level, reading ease score, passive voice count, and complex words — then get AI rewrites for your most problematic sentences.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Flesch Reading Ease",
            "Kincaid Grade Level",
            "Gunning Fog",
            "Passive Voice Detection",
            "Highlighted Problem Sentences",
            "AI Rewrites",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="readability-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <ReadabilityAnalyzer />
      </div>

      <AdBlock slot="readability-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Instant Readability Analysis — No AI Needed for the Scores</h2>
        <p>
          Unlike tools that route your text through a server or require an AI model to calculate basic readability scores, this analyzer computes everything instantly in your browser using established mathematical formulas. Click Analyze and results appear immediately — no loading spinner, no API call, no wait.
        </p>
        <p>
          The AI model is optional and only loads when you click "Get AI Suggestions." It then provides targeted rewrites for your most problematic sentences — something no formula-based tool can do.
        </p>

        <h2>Four Readability Formulas</h2>
        <ul>
          <li><strong>Flesch Reading Ease</strong> — Scores text from 0 to 100. Above 70 is easy for most readers. Below 30 is extremely difficult. The formula considers average sentence length and average syllables per word.</li>
          <li><strong>Flesch-Kincaid Grade Level</strong> — Converts the Flesch formula into a US school grade level. Grade 8 means the text is readable by an 8th grader.</li>
          <li><strong>Gunning Fog Index</strong> — Estimates years of formal education needed to understand the text on a first reading. Emphasizes the role of complex (3+ syllable) words.</li>
          <li><strong>SMOG Grade</strong> — Simple Measure of Gobbledygook. Another grade-level estimate focused on polysyllabic words. More conservative than Flesch-Kincaid for technical text.</li>
        </ul>

        <h2>What the Highlighted Text Shows</h2>
        <p>
          The highlighted view color-codes every sentence by its issues: amber for sentences over 25 words, blue for sentences with passive voice, and red for sentences with both problems. Clean sentences have no highlight. This gives you an immediate visual map of where your text gets dense and difficult.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="readability-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Readability Analyzer"
        toolDescription="Free AI readability analyzer with instant Flesch score, Kincaid grade level, Gunning Fog, passive voice detection, and highlighted problem sentences. AI rewrites for hard sentences. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
