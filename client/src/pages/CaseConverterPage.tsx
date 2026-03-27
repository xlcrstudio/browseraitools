import { useEffect } from "react";
import { Type } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { CaseConverter } from "@/components/CaseConverter";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What case formats does this tool support?",
    answer: "15 formats in two groups. Text formats: UPPERCASE, lowercase, Title Case, Sentence case, Capitalize First Letter, aLtErNaTiNg cAsE, and InVeRsE CaSe. Code formats: camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, SCREAMING-KEBAB-CASE, Train-Case, and dot.case.",
  },
  {
    question: "Are URLs and emails preserved during conversion?",
    answer: "Yes. URLs (starting with http:// or https://) and email addresses are automatically detected and preserved unchanged during conversion. All other text around them is converted normally.",
  },
  {
    question: "How does camelCase splitting work for input like 'helloWorld'?",
    answer: "The tool automatically detects word boundaries in camelCase and PascalCase input. 'helloWorld' is split into 'hello' and 'World' before applying any conversion, so you can convert between all programming cases without manually adding spaces first.",
  },
  {
    question: "What is the difference between Title Case and Sentence case?",
    answer: "Title Case capitalizes the first letter of most words — articles (a, an, the), short prepositions (in, on, at), and conjunctions (and, but, or) in the middle of a phrase stay lowercase. Sentence case only capitalizes the first letter of each sentence and proper nouns, leaving everything else lowercase.",
  },
  {
    question: "When should I use each programming case?",
    answer: "camelCase is standard for variables and functions in JavaScript, Java, and C#. PascalCase is used for class names and React components. snake_case is preferred in Python and Ruby. SCREAMING_SNAKE_CASE is for constants. kebab-case is used in CSS, HTML attributes, and URL slugs. dot.case appears in package names, config keys, and Java package identifiers.",
  },
  {
    question: "Is there a character limit?",
    answer: "No hard limit — you can convert as much text as you like. The tool runs entirely in your browser with no server involved, so performance depends only on your device.",
  },
  {
    question: "Is my text stored or sent anywhere?",
    answer: "No. All conversions happen instantly in your browser using JavaScript. Nothing is sent to a server and nothing is stored. The text is gone the moment you close the tab.",
  },
];

export default function CaseConverterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Case Converter — UPPERCASE, camelCase, snake_case & 15 More | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free online case converter. Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase and 8 more formats instantly.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Case Converter — 15 Text & Code Formats Instantly",
      "og:description": "Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and 9 more formats. Instant, private, no signup.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/case-converter",
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
            "name": "Case Converter",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free online case converter. Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase and 12 more formats instantly.",
          }),
        }}
      />

      <ToolPageHeader toolName="Case Converter" icon={Type} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Text Case{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Converter
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Convert text between 15 formats instantly — UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase and more.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "15 Formats",
            "Instant Live Preview",
            "All Formats at Once",
            "URL Preservation",
            "camelCase Splitting",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="case-converter-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <CaseConverter />
      </div>

      <AdBlock slot="case-converter-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>All 15 Case Formats Explained</h2>

        <h3>Text Formats</h3>
        <ul>
          <li><strong>UPPERCASE</strong> — All letters capitalized. Used for headings, emphasis, acronyms, and constants.</li>
          <li><strong>lowercase</strong> — All letters lowercase. Used for email addresses, URLs, and informal text.</li>
          <li><strong>Title Case</strong> — First letter of major words capitalized; articles, conjunctions, and short prepositions stay lowercase. Standard for article titles, book titles, and headlines.</li>
          <li><strong>Sentence case</strong> — Only the first letter of each sentence capitalized. Standard for body text, emails, and social posts.</li>
          <li><strong>Capitalize First</strong> — Only the very first letter of the entire text capitalized.</li>
          <li><strong>aLtErNaTiNg cAsE</strong> — Letters alternate between lowercase and uppercase. Often called "spongebob case" — used for sarcastic or humorous emphasis online.</li>
          <li><strong>InVeRsE CaSe</strong> — Uppercase letters become lowercase and vice versa. Useful for quickly flipping text that was accidentally typed with Caps Lock on.</li>
        </ul>

        <h3>Code Formats</h3>
        <ul>
          <li><strong>camelCase</strong> — First word lowercase, subsequent words capitalized, no spaces. Standard for variables and function names in JavaScript, Java, C#, and Swift.</li>
          <li><strong>PascalCase</strong> — Every word starts with a capital letter, no spaces. Used for class names, React components, and TypeScript interfaces.</li>
          <li><strong>snake_case</strong> — All lowercase with underscores between words. Standard in Python, Ruby, and PostgreSQL column names.</li>
          <li><strong>SCREAMING_SNAKE_CASE</strong> — All uppercase with underscores. Used for constants and environment variables in most languages.</li>
          <li><strong>kebab-case</strong> — All lowercase with hyphens. Used in CSS class names, HTML attributes, URL slugs, and npm package names.</li>
          <li><strong>SCREAMING-KEBAB-CASE</strong> — All uppercase with hyphens. Used in HTTP headers like Content-Type.</li>
          <li><strong>Train-Case</strong> — Title-cased words separated by hyphens. Also used in HTTP headers.</li>
          <li><strong>dot.case</strong> — All lowercase with dots. Used in package names (com.example.app), config keys, and Java package identifiers.</li>
        </ul>

        <h2>Smart Word Boundary Detection</h2>
        <p>
          The converter automatically detects word boundaries in existing camelCase, PascalCase, snake_case, and kebab-case input. This means you can paste code like <code>getUserAuthToken</code> or <code>user_auth_token</code> and convert directly to any other format without adding spaces first.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="case-converter-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Case Converter"
        toolDescription="Free online case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, SCREAMING-KEBAB-CASE, Train-Case, dot.case and more. Instant, private, no signup."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="Case Converter" />
    </>
  );
}
