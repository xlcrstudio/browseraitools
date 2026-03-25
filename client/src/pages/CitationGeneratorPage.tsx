import { useEffect } from "react";
import { Quote } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { CitationGenerator } from "@/components/CitationGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "Which citation styles does this tool support?",
    answer: "Six styles: APA 7th Edition (most common in social sciences, education, and psychology), MLA 9th Edition (humanities and literature), Chicago 17th Edition (history, arts, and publishing), Harvard (widely used in UK and Australian universities), IEEE (engineering, computer science, and electronics), and Vancouver (medicine and life sciences). You can generate all six at once or select only the ones you need.",
  },
  {
    question: "What source types are supported?",
    answer: "14 source types: Website/Webpage, Book, Journal Article, Book Chapter, Newspaper Article, Magazine Article, YouTube Video, Podcast, Report/Government Document, Thesis/Dissertation, Blog Post, Conference Paper, Film/Movie, and Social Media Post. Each type has its own set of relevant fields to fill in.",
  },
  {
    question: "What is the Bibliography Builder?",
    answer: "As you generate citations, you can click 'Add to Bibliography' (or 'Add All') to collect them in a running list. The bibliography panel lets you switch between citation styles, see all your sources numbered in order, remove individual entries, and export the full bibliography as a .txt file ready to paste into your paper.",
  },
  {
    question: "How accurate are the generated citations?",
    answer: "The AI follows official style guides for each format. For maximum accuracy, fill in all available fields — especially author names, publication year, and title. Always review generated citations against your institution's specific style guide requirements, as some fields may have minor variations between editions or institutional preferences.",
  },
  {
    question: "Do I need to enter a URL or DOI to generate a citation?",
    answer: "Only if required by the source type. For websites and online articles, a URL is needed. For journal articles, a DOI improves accuracy significantly. For books, the ISBN or publisher details are more important. The tool works from whatever information you can provide — just fill in as many fields as you have.",
  },
  {
    question: "Is my source information kept private?",
    answer: "Yes — completely. The AI model runs in your browser using WebLLM. The source details you enter are never uploaded to a server, never logged, and never stored anywhere outside your device. This makes it suitable for citing confidential research, proprietary reports, or any documents you don't want to share.",
  },
  {
    question: "What is the difference between APA 7th and APA 6th?",
    answer: "APA 7th Edition (2020) introduced several changes: up to 20 authors are now listed before truncating (was 7), DOIs are formatted as URLs (https://doi.org/…), running heads are removed for student papers, and the publisher's location is no longer required for books. This tool uses APA 7th Edition, which is current as of 2024.",
  },
  {
    question: "Can I export my bibliography?",
    answer: "Yes — click 'Export Bibliography' in the Bibliography panel to download a .txt file containing all your citations in the currently selected style, numbered and formatted correctly. You can then paste this directly into your document or reference manager.",
  },
];

export default function CitationGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Citation Generator — APA, MLA, Chicago, Harvard | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI citation generator for APA 7th, MLA 9th, Chicago, Harvard, IEEE, and Vancouver. 14 source types including websites, books, journals, YouTube, and more. 100% private, no login.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Citation Generator — APA, MLA, Chicago, Harvard, IEEE, Vancouver",
      "og:description": "Generate perfectly formatted academic citations instantly. 14 source types, 6 citation styles, bibliography builder with export. 100% private — runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-citation-generator",
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
            "name": "AI Citation Generator",
            "applicationCategory": "EducationApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI citation generator for APA, MLA, Chicago, Harvard, IEEE, and Vancouver. 14 source types, bibliography builder. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Citation Generator" icon={Quote} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Citation{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Generate perfectly formatted citations for any source in APA, MLA, Chicago, Harvard, IEEE, and Vancouver. Build your bibliography as you go and export it instantly.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "APA 7th Edition",
            "MLA 9th Edition",
            "Chicago 17th",
            "Harvard",
            "IEEE",
            "Vancouver",
            "14 Source Types",
            "Bibliography Export",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="citation-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <CitationGenerator />
      </div>

      <AdBlock slot="citation-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>The Free Citation Generator That Actually Gets It Right</h2>
        <p>
          Most free citation generators produce outdated or incorrectly formatted citations, require you to create an account, or have paywalls for the formats you actually need. This tool uses an AI model that runs entirely in your browser to generate citations that follow the current official guidelines for each style — no account, no paywall, no data uploaded anywhere.
        </p>

        <h2>Six Citation Styles</h2>
        <ul>
          <li><strong>APA 7th Edition</strong> — American Psychological Association, current edition. Standard for social sciences, psychology, education, and nursing.</li>
          <li><strong>MLA 9th Edition</strong> — Modern Language Association, current edition. Standard for humanities, literature, and language arts.</li>
          <li><strong>Chicago 17th Edition</strong> — The Chicago Manual of Style. Used in history, arts, and publishing. Supports both Author-Date and Notes-Bibliography formats.</li>
          <li><strong>Harvard</strong> — Author-date format widely used in UK and Australian universities across multiple disciplines.</li>
          <li><strong>IEEE</strong> — Institute of Electrical and Electronics Engineers. Used in engineering, computer science, and electronics.</li>
          <li><strong>Vancouver</strong> — Numbered reference list system used in medicine, pharmacology, and life sciences.</li>
        </ul>

        <h2>14 Source Types</h2>
        <p>
          Each source type has a custom set of fields tailored to what that format actually requires — so you only see what's relevant. Supported types include: Website/Webpage, Book, Journal Article, Book Chapter, Newspaper, Magazine, YouTube Video, Podcast, Government Report, Thesis/Dissertation, Blog Post, Conference Paper, Film/Movie, and Social Media Post.
        </p>

        <h2>Bibliography Builder</h2>
        <p>
          As you generate citations for each source, click "Add to Bibliography" to collect them in a running list. Switch between citation styles in the bibliography view, see all entries numbered in the correct order, and export the complete bibliography as a .txt file when you're done. Everything is stored locally in your browser session.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="citation-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Citation Generator"
        toolDescription="Free AI citation generator for APA 7th, MLA 9th, Chicago, Harvard, IEEE, and Vancouver. 14 source types, bibliography builder with export. 100% private, no login required."
        faqs={FAQS}
      />
    </>
  );
}
