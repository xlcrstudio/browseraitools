import { useEffect } from "react";
import { Braces } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { JsonValidator } from "@/components/JsonValidator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { SimilarTools } from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What does the JSON validator check for?",
    answer: "It validates full JSON syntax using the browser's native JSON.parse — the same parser used in every JavaScript runtime. It catches missing commas, unquoted keys, trailing commas, mismatched brackets, illegal characters, and any other syntax error. The error panel shows the exact location and a plain-English hint for each issue.",
  },
  {
    question: "What does Auto-Fix do?",
    answer: "Auto-Fix attempts to repair the most common JSON mistakes automatically: removes JavaScript comments (// and /* */), replaces single quotes with double quotes, adds double quotes around unquoted keys, removes trailing commas, and replaces undefined and NaN with null. It shows you a preview of every change it makes before applying them.",
  },
  {
    question: "What is the difference between Format and Minify?",
    answer: "Format (beautify) rewrites the JSON with 2-space indentation and line breaks — ideal for reading and editing. Minify removes all whitespace and line breaks to produce the smallest possible string — ideal for APIs and storage. Both produce exactly the same data, just different representations.",
  },
  {
    question: "What is the Tree View?",
    answer: "The Tree View is an interactive, collapsible explorer for your JSON structure. Every object and array can be expanded or collapsed individually. Values are color-coded by type: purple for keys, green for strings, blue for numbers, orange for booleans, and grey for null.",
  },
  {
    question: "What do the stats (Depth, Nodes) mean?",
    answer: "Depth is the maximum nesting level — how many objects/arrays are nested inside each other. A flat object has depth 1; an object with one nested object has depth 2, and so on. Nodes is the total count of all values in the JSON tree, including nested values.",
  },
  {
    question: "Is there a size limit on the JSON I can paste?",
    answer: "No enforced limit — the tool runs entirely in your browser. Very large JSON files (many megabytes) may slow down the tree view renderer, but formatting and validation will still work instantly.",
  },
  {
    question: "Is my JSON data private?",
    answer: "Yes — all processing happens in your browser using JavaScript. Nothing is sent to any server. Your JSON never leaves your device.",
  },
];

export default function JsonValidatorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free JSON Validator & Formatter — Validate, Beautify, Minify, Fix JSON | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free JSON validator, formatter, and beautifier. Validate syntax, auto-fix errors, format with 2-space indent, minify, and explore with an interactive tree view.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free JSON Validator & Formatter — Validate, Format, Minify, Auto-Fix",
      "og:description": "Validate JSON syntax, auto-fix common errors, format or minify instantly, and explore structure with an interactive tree view. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/json-validator",
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
            "name": "JSON Validator & Formatter",
            "applicationCategory": "DeveloperApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free JSON validator, formatter, and beautifier. Validate syntax, auto-fix errors, format or minify, and explore with an interactive tree view.",
          }),
        }}
      />

      <ToolPageHeader toolName="JSON Validator" icon={Braces} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          JSON Validator{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            & Formatter
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Validate JSON syntax, auto-fix common errors, format or minify in one click, and explore your data with an interactive tree view.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Live Validation",
            "Auto-Fix Errors",
            "Format & Minify",
            "Tree Explorer",
            "Size Stats",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="json-validator-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <JsonValidator />
      </div>

      <AdBlock slot="json-validator-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>How the JSON Validator Works</h2>
        <p>
          Paste any JSON into the textarea and validation happens instantly as you type. The tool uses the browser's native <code>JSON.parse()</code> — the same parser every JavaScript engine uses — so the result is always authoritative. A green badge means valid; a red badge means invalid, with an error panel showing the exact line, column, and a plain-English fix suggestion.
        </p>

        <h2>Auto-Fix: What It Repairs</h2>
        <p>The Auto-Fix button handles the most common reasons JSON is invalid:</p>
        <ul>
          <li><strong>Trailing commas</strong> — JSON (unlike JavaScript) does not allow a comma after the last item in an object or array. Auto-Fix removes them.</li>
          <li><strong>Unquoted keys</strong> — JavaScript objects allow <code>{'{ name: "John" }'}</code> but JSON requires <code>{'{ "name": "John" }'}</code>. Auto-Fix adds the missing quotes.</li>
          <li><strong>Single quotes</strong> — JSON requires double quotes for both keys and string values. Auto-Fix replaces <code>'value'</code> with <code>"value"</code>.</li>
          <li><strong>JavaScript comments</strong> — JSON does not support <code>// line comments</code> or <code>{'/* block comments */'}</code>. Auto-Fix strips them.</li>
          <li><strong>undefined and NaN</strong> — These are JavaScript values, not JSON. Auto-Fix replaces them with <code>null</code>.</li>
        </ul>

        <h2>Format vs. Minify</h2>
        <p>
          Both produce semantically identical data. <strong>Format</strong> adds 2-space indentation and line breaks to make JSON human-readable — use this when editing config files, debugging API responses, or reviewing data. <strong>Minify</strong> strips all whitespace to produce the most compact string — use this in production APIs, localStorage, or anywhere bytes matter.
        </p>

        <h2>Common JSON Errors Explained</h2>

        <h3>Trailing Comma</h3>
        <p>The most common mistake, especially when copying from JavaScript code. Remove the comma after the last property in any object or array.</p>

        <h3>Single Quotes</h3>
        <p>JavaScript accepts single quotes in object literals, but the JSON specification only allows double quotes. Always use <code>"double quotes"</code> in JSON.</p>

        <h3>Unquoted Keys</h3>
        <p>In JavaScript you can write <code>{'{ name: "John" }'}</code>, but JSON requires keys to be quoted strings: <code>{'{ "name": "John" }'}</code>.</p>

        <h3>Missing Comma Between Properties</h3>
        <p>Every property except the last must be followed by a comma. This is easy to miss when adding or removing properties from an existing JSON object.</p>

        <h3>Unescaped Characters</h3>
        <p>Backslashes in strings must be doubled (<code>\\</code>), and actual newline characters must be written as <code>\n</code>. Raw line breaks inside a JSON string are not permitted.</p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <SimilarTools slugs={["/diff-checker", "/regex-tester", "/markdown-converter", "/password-generator", "/lorem-ipsum-generator", "/color-palette-generator"]} />

      <AdBlock slot="json-validator-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="JSON Validator & Formatter"
        toolDescription="Free JSON validator, formatter, and beautifier. Validate syntax, auto-fix errors (trailing commas, unquoted keys, single quotes, comments), format or minify, and explore with an interactive tree view. 100% private."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="JSON Validator" />
    </>
  );
}
