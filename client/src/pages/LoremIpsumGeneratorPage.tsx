import { useEffect } from "react";
import { FileText } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { LoremIpsumGenerator } from "@/components/LoremIpsumGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What is Lorem Ipsum?",
    answer: "Lorem Ipsum is the standard placeholder text used by designers and developers since the 1500s. It originates from a scrambled passage of Cicero's 'de Finibus Bonorum et Malorum' and is used because it approximates the visual texture of readable text without distracting readers with real content.",
  },
  {
    question: "What is the difference between Lorem Ipsum and Realistic mode?",
    answer: "Lorem Ipsum generates traditional Latin placeholder text that looks authentic but is nonsense. Realistic mode generates coherent English sentences drawn from a themed sentence bank — tech, business, food, travel, fashion, healthcare, or finance. Realistic text is more useful for client presentations where stakeholders might fixate on Latin text and mistake it for final copy.",
  },
  {
    question: "What output formats are available?",
    answer: "Four formats: Plain Text (clean paragraphs separated by blank lines), HTML (wrapped in <p> and <h2> tags, ready to paste into markup), Markdown (proper ## headings and paragraph spacing for documentation or CMS), and JSON (a structured object with a 'paragraphs' array and word count, useful for seeding databases or APIs).",
  },
  {
    question: "What does 'Include headings' do?",
    answer: "When enabled, each paragraph is preceded by a contextually relevant heading drawn from a theme-specific heading pool. In HTML output these become <h2> tags; in Markdown they become ## headings; in Plain Text they appear in uppercase above each paragraph. Headings are not available in JSON format.",
  },
  {
    question: "Can I specify exact word or sentence counts?",
    answer: "Yes — switch the unit selector from Paragraphs to Words or Sentences and enter the target number. Word count converts to an approximate number of paragraphs (roughly 80 words each). Sentence count converts similarly (roughly 4 sentences per paragraph). The output is an approximation because sentence length is randomly varied for naturalness.",
  },
  {
    question: "Is the generated text random every time?",
    answer: "Yes — every time you click Generate the seed changes, producing a different arrangement of words and sentences. The Lorem Ipsum mode shuffles the traditional word corpus; Realistic mode shuffles the sentence pool for each theme. Clicking Generate repeatedly never produces the same output twice.",
  },
  {
    question: "Is any text sent to a server?",
    answer: "No. All generation happens entirely in your browser using JavaScript. No text is sent to or stored on any server.",
  },
];

export default function LoremIpsumGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Lorem Ipsum Generator — Placeholder Text with Themes & Multiple Formats | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free Lorem Ipsum generator. Classic Latin placeholder text or themed realistic English — tech, business, food, travel, and more. Output in Plain Text, HTML, Markdown, or JSON.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Lorem Ipsum Generator — Classic & Themed Placeholder Text",
      "og:description": "Generate Lorem Ipsum or realistic placeholder text in 8 themes. Output as Plain Text, HTML, Markdown, or JSON. Paragraphs, sentences, or word count. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/lorem-ipsum-generator",
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
            "name": "Lorem Ipsum Generator",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free Lorem Ipsum generator with classic Latin and themed realistic placeholder text. Multiple output formats including HTML, Markdown, and JSON.",
          }),
        }}
      />

      <ToolPageHeader toolName="Lorem Ipsum Generator" icon={FileText} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Lorem Ipsum{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Generate classic Lorem Ipsum or realistic themed placeholder text. Control length, format, and structure — output as Plain Text, HTML, Markdown, or JSON.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Classic Lorem Ipsum",
            "8 Realistic Themes",
            "HTML / Markdown / JSON",
            "Headings Support",
            "Word & Sentence Count",
            "Instant Generation",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="lorem-ipsum-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <LoremIpsumGenerator />
      </div>

      <AdBlock slot="lorem-ipsum-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Classic Lorem Ipsum vs Realistic Text</h2>
        <p>
          Classic Lorem Ipsum is the design industry standard for a reason — its Latin appearance is visually neutral. Readers recognize it immediately as placeholder content and don't try to read it, letting reviewers focus on layout, typography, and spacing rather than copy. It's ideal for wireframes, design system documentation, and internal prototypes.
        </p>
        <p>
          Realistic themed text is more appropriate for client-facing presentations where stakeholders might be thrown off by Latin, or when you need placeholder content that resembles the actual tone and vocabulary of the final copy. A tech product demo populated with cloud architecture sentences reads very differently from one filled with Latin — and that difference helps clients visualize the finished product.
        </p>

        <h2>Output Formats Explained</h2>

        <h3>Plain Text</h3>
        <p>The simplest format — paragraphs separated by blank lines. Paste it anywhere: Figma text layers, Notion pages, email templates, Word documents, or any plain text field.</p>

        <h3>HTML</h3>
        <p>Each paragraph is wrapped in <code>&lt;p&gt;</code> tags. When headings are enabled, they become <code>&lt;h2&gt;</code> elements. Ready to paste directly into an HTML file, a CMS rich-text editor, or a React component.</p>

        <h3>Markdown</h3>
        <p>Paragraphs are separated by blank lines with optional <code>##</code> headings. Ideal for documentation sites (Docusaurus, MkDocs, GitBook), README files, Ghost blog posts, or any Markdown-aware editor.</p>

        <h3>JSON</h3>
        <p>Outputs a structured object with a <code>paragraphs</code> array and a <code>word_count</code> field. Useful for seeding development databases, populating API fixtures, or generating test data for content management systems.</p>

        <h2>Available Themes</h2>
        <ul>
          <li><strong>General</strong> — professional all-purpose business language suitable for any industry</li>
          <li><strong>Technology</strong> — cloud infrastructure, APIs, microservices, security, observability</li>
          <li><strong>Business</strong> — strategy, market analysis, change management, KPIs, stakeholders</li>
          <li><strong>Food</strong> — farm-to-table, seasonal ingredients, culinary technique, menu descriptions</li>
          <li><strong>Travel</strong> — itineraries, destinations, cultural experiences, local guides, sustainability</li>
          <li><strong>Fashion</strong> — collections, materials, sustainable practices, silhouettes, craft</li>
          <li><strong>Healthcare</strong> — patient care, clinical teams, preventive health, telehealth, research</li>
          <li><strong>Finance</strong> — investment planning, portfolio strategy, tax efficiency, fiduciary advice</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="lorem-ipsum-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Lorem Ipsum Generator"
        toolDescription="Free Lorem Ipsum generator with classic Latin placeholder text and 8 realistic themed alternatives. Control length in paragraphs, sentences, or words. Output as Plain Text, HTML, Markdown, or JSON with optional headings support."
        faqs={FAQS}
      />
    </>
  );
}
