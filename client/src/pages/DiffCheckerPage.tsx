import { useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { DiffChecker } from "@/components/DiffChecker";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { SimilarTools } from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What comparison modes are available?",
    answer: "Three modes: Line (compares text line by line — best for code, config files, and documents), Word (compares individual words — best for prose and content edits), and Character (compares character by character — best for detecting precise typos and small formatting changes).",
  },
  {
    question: "What is the difference between Split and Unified view?",
    answer: "Split view shows the original on the left and the modified text on the right in two aligned columns, making it easy to see how each line changed. Unified view shows a single column with removed lines marked with − and added lines marked with +, similar to the output of git diff.",
  },
  {
    question: "What does word-level highlighting inside line diffs mean?",
    answer: "When a line is modified (deleted in original, added in modified), the tool automatically runs a word-level diff within that line pair. Individual words that were removed are highlighted in red with strikethrough, and words that were added are highlighted in green — so you can see exactly which words changed without losing line context.",
  },
  {
    question: "What do 'Ignore case' and 'Ignore whitespace' do?",
    answer: "Ignore case treats uppercase and lowercase letters as identical — so 'Hello' and 'hello' count as the same. Ignore whitespace collapses all whitespace runs into single spaces and trims leading/trailing whitespace before comparing — so indentation and extra spaces are not counted as differences.",
  },
  {
    question: "What does Similarity % mean?",
    answer: "Similarity is a rough measure of how much of the text is unchanged relative to the total content. 100% means the texts are identical. 0% means nothing matches at all. It's useful for quickly gauging how different two versions are.",
  },
  {
    question: "Is there a size limit?",
    answer: "The LCS algorithm used internally has complexity proportional to the product of the two inputs' lengths. For inputs larger than roughly 700 lines or 1000 words each, the tool automatically falls back to a simple delete-all/add-all view to prevent the browser from hanging. For typical code files and documents this limit is never reached.",
  },
  {
    question: "Is my text private?",
    answer: "Completely. All comparison runs in your browser in JavaScript. Nothing is sent to a server — your text never leaves your device.",
  },
];

export default function DiffCheckerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Diff Checker — Compare Text, Code & Documents Side by Side | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free diff checker to compare two texts side by side. Line, word, and character diff with split and unified views. Highlights added and removed content instantly.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Diff Checker — Compare Text & Code Side by Side",
      "og:description": "Compare two texts with line, word, or character diff. Split and unified views, word-level highlighting within lines, ignore case and whitespace options. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/diff-checker",
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
            "name": "Diff Checker",
            "applicationCategory": "DeveloperApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free diff checker to compare two texts side by side. Line, word, and character diff modes with split and unified views.",
          }),
        }}
      />

      <ToolPageHeader toolName="Diff Checker" icon={ArrowLeftRight} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Text{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Diff Checker
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Compare two texts side by side. Spot every addition, deletion, and change with line, word, and character-level diff highlighting.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Line Diff",
            "Word Diff",
            "Char Diff",
            "Split View",
            "Unified View",
            "Ignore Case",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="diff-checker-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <DiffChecker />
      </div>

      <AdBlock slot="diff-checker-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>How the Diff Checker Works</h2>
        <p>
          The tool uses a Longest Common Subsequence (LCS) algorithm — the same core technique used by <code>git diff</code>, Unix <code>diff</code>, and most version control systems. It finds the longest sequence of tokens that appear in both texts in the same order, then marks everything else as either added or removed.
        </p>

        <h2>Three Comparison Modes</h2>

        <h3>Line Mode</h3>
        <p>
          Splits both texts on newlines and compares them line by line. This is the standard mode for comparing code, configuration files, and structured documents. When a line exists in the original but not the modified text it appears in red; when it exists only in the modified text it appears in green. When a line is modified (present in both but changed), both versions are shown with word-level highlighting inside the line pair.
        </p>

        <h3>Word Mode</h3>
        <p>
          Tokenises both texts into individual words and whitespace, then finds the LCS. The result is an inline view where removed words appear with red strikethrough and added words appear in green — useful for comparing essays, articles, and prose where line structure is less important than word choice.
        </p>

        <h3>Character Mode</h3>
        <p>
          The most granular mode — every single character is treated as a separate token. Useful for spotting typos, extra spaces, punctuation changes, and precise differences in short strings.
        </p>

        <h2>Split vs Unified View</h2>
        <p>
          <strong>Split view</strong> is the most intuitive for reading: original on the left, modified on the right, with aligned rows. Empty rows appear on the side that has no content for that position. <strong>Unified view</strong> is more compact and familiar to developers — it resembles <code>git diff</code> output with +/− prefixes and line numbers on both sides.
        </p>

        <h2>Use Cases</h2>
        <ul>
          <li><strong>Code review</strong> — compare two versions of a function, file, or configuration</li>
          <li><strong>Document editing</strong> — see what changed between drafts of a contract, article, or email</li>
          <li><strong>Data comparison</strong> — compare CSV rows, JSON values, or SQL queries</li>
          <li><strong>Proofreading</strong> — spot unintentional wording changes in revised copy</li>
          <li><strong>Translation</strong> — verify that translated text covers all source content</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <SimilarTools slugs={["/regex-tester", "/json-validator", "/markdown-converter", "/password-generator", "/lorem-ipsum-generator", "/color-palette-generator"]} />

      <AdBlock slot="diff-checker-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Diff Checker"
        toolDescription="Free diff checker to compare two texts side by side. Line, word, and character diff with split and unified views, word-level highlighting within modified lines, ignore case and whitespace options. 100% private."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="Diff Checker" />
    </>
  );
}
